<template>
    <div class="container">
        <div class="header-actions">
            <router-link to="/pcu/dashboard" class="back-link"
                >&larr; กลับไปหน้าหลัก</router-link
            >
        </div>

        <div v-if="canPrintOrExport" class="action-toolbar">
            <button
                type="button"
                class="btn btn-secondary"
                :disabled="exporting"
                @click="exportToExcel"
            >
                <i class="fas fa-file-excel"></i>
                {{ exporting ? 'กำลังส่งออก...' : 'ส่งออก Excel' }}
            </button>
            <router-link
                :to="{
                    name: 'PcuPrintRequisition',
                    query: { id: requisitionId },
                }"
                class="btn btn-primary"
                target="_blank"
            >
                <i class="fas fa-print"></i> พิมพ์ใบเบิก
            </router-link>
        </div>

        <div v-if="loading" class="loading">กำลังโหลดข้อมูลใบเบิก...</div>
        <div v-if="error" class="error">{{ error }}</div>

        <div v-if="!loading && requisition" class="requisition-details">
            <h2>รายละเอียดใบเบิก</h2>

            <div class="summary-grid">
                <div>
                    <strong>รอบเบิก:</strong>
                    <p>
                        {{ requisition.requisition_periods_drugcupsabot.name }}
                    </p>
                </div>
                <div>
                    <strong>สถานะ:</strong>
                    <p>
                        <span :class="['status-badge', requisition.status]">{{
                            requisition.status
                        }}</span>
                    </p>
                </div>
                <div>
                    <strong>วันที่ส่ง:</strong>
                    <p>{{ formatDate(requisition.submitted_at) }}</p>
                </div>
                <div>
                    <strong>วันที่สร้าง:</strong>
                    <p>{{ formatDate(requisition.created_at) }}</p>
                </div>
            </div>

            <h3>รายการที่เบิก</h3>
            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>ลำดับ</th>
                            <th>รายการเวชภัณฑ์</th>
                            <th class="text-center">จำนวนที่ขอเบิก</th>
                            <th class="text-center">จำนวนที่ได้รับอนุมัติ</th>
                            <th class="text-right">ราคาต่อหน่วย</th>
                            <th class="text-right">มูลค่าที่อนุมัติ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(
                                reqItem, index
                            ) in requisition.requisition_items_drugcupsabot"
                            :key="reqItem.id"
                        >
                            <td>{{ index + 1 }}</td>
                            <td>{{ reqItem.items_drugcupsabot.name }}</td>
                            <td class="text-center">{{ reqItem.quantity }}</td>
                            <td class="text-center bold status-approved">
                                {{ reqItem.approved_quantity ?? "-" }}
                            </td>
                            <td class="text-right">
                                {{ formatCurrency(reqItem.price_at_request) }}
                            </td>
                            <td class="text-right">
                                {{
                                    formatCurrency(
                                        (reqItem.approved_quantity ??
                                            reqItem.quantity) *
                                            reqItem.price_at_request,
                                    )
                                }}
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="5" class="text-right bold">
                                มูลค่ารวมทั้งหมดที่อนุมัติ
                            </td>
                            <td class="text-right bold">
                                {{ formatCurrency(grandTotal) }}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '@/supabaseClient';
import type { RequisitionStatus, RequisitionWithJoins } from '@/types/models';

const props = defineProps<{ requisitionId: string }>();

const route = useRoute();
const loading = ref<boolean>(true);
const error = ref<string | null>(null);
const exporting = ref<boolean>(false);
const requisition = ref<RequisitionWithJoins | null>(null);

const PRINTABLE_STATUSES: RequisitionStatus[] = ['approved', 'fulfilled'];

const canPrintOrExport = computed<boolean>(() => {
  return (
    !!requisition.value &&
    PRINTABLE_STATUSES.includes(requisition.value.status as RequisitionStatus)
  );
});

onMounted(async () => {
  try {
    const { data, error: fetchError } = await supabase
      .from('requisitions_drugcupsabot')
      .select(
        `
        *,
        requisition_periods_drugcupsabot ( name ),
        requisition_items_drugcupsabot (
          *,
          items_drugcupsabot ( name, unit_pack )
        )
      `,
      )
      .eq('id', props.requisitionId)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        throw new Error('ไม่พบข้อมูลใบเบิก หรือคุณไม่มีสิทธิ์เข้าถึง');
      }
      throw fetchError;
    }
    // FIX: Supabase types FK joins as arrays even for many-to-one
    requisition.value = data as unknown as RequisitionWithJoins;
  } catch (err) {
    // FIX: error is unknown in strict TS, narrow to Error before reading .message
    error.value = `ไม่สามารถโหลดข้อมูลใบเบิกได้: ${err instanceof Error ? err.message : String(err)}`;
    console.error(err);
  } finally {
    loading.value = false;
  }
});

const grandTotal = computed<number>(() => {
  if (!requisition.value?.requisition_items_drugcupsabot) return 0;

  return requisition.value.requisition_items_drugcupsabot.reduce((sum, item) => {
    const quantityToUse = item.approved_quantity ?? item.quantity;
    const itemTotal = Number(quantityToUse) * Number(item.price_at_request);
    return sum + itemTotal;
  }, 0);
});

function formatDate(dateString: string | null): string {
  if (!dateString) return 'ยังไม่ได้ส่ง';
  return new Date(dateString).toLocaleString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '0.00';
  return Number(value).toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

async function exportToExcel(): Promise<void> {
  if (!requisition.value || exporting.value) return;
  exporting.value = true;

  try {
    // Dynamic import: xlsx (SheetJS) is ~400 kB and only needed when the
    // user clicks "ส่งออก Excel". Loading it on demand keeps the
    // initial bundle under the Vite chunk-size warning limit.
    const { utils, writeFile } = await import('xlsx');

    const pcuName = requisition.value.pcus_drugcupsabot?.name ?? 'ไม่ระบุ';
    const periodName = requisition.value.requisition_periods_drugcupsabot?.name ?? 'ไม่ระบุ';

    const dataForExport = requisition.value.requisition_items_drugcupsabot.map((item, index) => {
      const qty = item.approved_quantity ?? item.quantity;
      return {
        ลำดับ: index + 1,
        รายการ: item.items_drugcupsabot.name,
        หน่วยนับ: item.items_drugcupsabot.unit_pack,
        จำนวนที่ขอเบิก: item.quantity,
        จำนวนที่ได้รับอนุมัติ: item.approved_quantity ?? item.quantity,
        ราคาต่อหน่วย: item.price_at_request,
        มูลค่ารวม: qty * item.price_at_request,
      };
    });

    const worksheet = utils.json_to_sheet(dataForExport);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'ใบเบิก');
    writeFile(workbook, `ใบเบิก_${pcuName}_${periodName}.xlsx`);
  } catch (err) {
    console.error('Error exporting to Excel:', err);
    // FIX: error is unknown in strict TS, narrow to Error before reading .message
    alert(`เกิดข้อผิดพลาดในการส่งออก Excel: ${err instanceof Error ? err.message : String(err)}`);
  } finally {
    exporting.value = false;
  }
}
</script>

<style scoped>
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1.5rem;
}

.header-actions {
    margin-bottom: 1.5rem;
}

.back-link {
    color: var(--color-near-black);
    text-decoration: none;
    font-weight: bold;
    font-size: 1rem;
}

.back-link:hover {
    text-decoration: underline;
}

.action-toolbar {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
}

.action-toolbar .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
}

.requisition-details h2 {
    margin-bottom: 1.5rem;
    border-bottom: 2px solid var(--color-near-black);
    padding-bottom: 0.5rem;
}

.summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    background-color: var(--bg-color);
    padding: 1.5rem;
    border-radius: var(--border-radius);
    margin-bottom: 2rem;
    border: 1px solid var(--color-hairline);
}

.summary-grid strong {
    display: block;
    color: var(--text-muted);
    margin-bottom: 0.25rem;
    font-size: 0.9rem;
}

.summary-grid p {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
}

.table-wrapper {
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 0.8rem;
    border: 1px solid var(--color-hairline);
    text-align: left;
    vertical-align: middle;
}

thead {
    background-color: transparent;
    font-weight: 600;
}

.text-right {
    text-align: right;
}
.text-center {
    text-align: center;
}
.bold {
    font-weight: bold;
}

.status-approved {
    color: #2e7d32;
    font-weight: bold;
}

tfoot {
    background-color: var(--bg-color);
    font-weight: bold;
}
</style>
