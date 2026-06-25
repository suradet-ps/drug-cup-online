<template>
    <div class="print-container" v-if="processedData.length > 0">
        <div class="page">
            <div class="header">
                <h2 class="bold">ใบสรุปยอดรวมการเบิกเวชภัณฑ์</h2>
                <div class="sub-header">
                    <span
                        >รอบการเบิก: <u>{{ periodInfo?.name }}</u></span
                    >
                    <span
                        >วันที่พิมพ์: <u>{{ formatDate(new Date()) }}</u></span
                    >
                </div>
            </div>

            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>ลำดับ</th>
                            <th>รายการ</th>
                            <th class="center">หน่วยนับ</th>
                            <th class="center">ยอดรวมทั้งหมด</th>
                            <th
                                v-for="pcu in pcuList"
                                :key="pcu.id"
                                class="center pcu-header"
                            >
                                {{ pcu.name }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(item, index) in processedData"
                            :key="item.item_id"
                        >
                            <td class="center">{{ index + 1 }}</td>
                            <td>{{ item.item_name }}</td>
                            <td class="center">{{ item.unit_pack }}</td>
                            <td class="center bold total-col">
                                {{ item.total_quantity }}
                            </td>
                            <td
                                v-for="pcu in pcuList"
                                :key="pcu.id"
                                class="center"
                            >
                                {{ item.pcu_breakdown[pcu.id] || "-" }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div v-else class="loading">กำลังเตรียมข้อมูลสำหรับพิมพ์...</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '@/supabaseClient';
import type { Pcu, RequisitionPeriod } from '@/types/models';

type ProcessedItem = {
  item_id: number;
  item_name: string;
  unit_pack: string;
  total_quantity: number;
  pcu_breakdown: Record<number, number>;
  category_order: number | null;
  item_order: number | null;
};

const route = useRoute();
const processedData = ref<ProcessedItem[]>([]);
const periodInfo = ref<Pick<RequisitionPeriod, 'name'> | null>(null);
const pcuList = ref<Pcu[]>([]);
const loading = ref<boolean>(true);

// FIX: the column may be `integer` or `uuid` depending on the production
// schema. Accept both shapes so the print page works whichever the project
// happens to be running against, and reject anything else up-front so a
// malformed value never reaches PostgREST as a literal "NaN" or empty string.
const ID_INTEGER_RE = /^\d+$/;
const ID_UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function parseId(raw: unknown): number | string | null {
  if (typeof raw !== 'string' || raw.length === 0) return null;
  if (ID_INTEGER_RE.test(raw)) return Number.parseInt(raw, 10);
  if (ID_UUID_RE.test(raw)) return raw;
  return null;
}

const rawPeriodId = route.query.periodId;
const periodId = parseId(rawPeriodId);

onMounted(async () => {
  if (periodId === null) {
    document.body.innerHTML = `ไม่พบ ID ของรอบเบิกที่ถูกต้อง (ได้รับ: ${String(rawPeriodId) || 'ว่าง'})`;
    return;
  }

  try {
    const { data: periodData } = await supabase
      .from('requisition_periods_drugcupsabot')
      .select('name')
      .eq('id', periodId)
      .single();
    periodInfo.value = periodData;

    const { data: pcusData } = await supabase
      .from('pcus_drugcupsabot')
      .select('id, name')
      .order('name');
    pcuList.value = (pcusData ?? []) as unknown as Pcu[];

    // FIX: query จาก parent table (requisitions_drugcupsabot) แทน child table
    // เพื่อหลีกเลี่ยง PostgREST foreign-table filter ที่อาจทำงานไม่สมบูรณ์
    // ทำให้บาง PCU ถูก filter ออกจากผลลัพธ์ (เคยเกิดใน production)
    const { data, error } = await supabase
      .from('requisitions_drugcupsabot')
      .select(
        `
        id, pcu_id,
        requisition_items_drugcupsabot (
          id, approved_quantity,
          items_drugcupsabot (id, name, unit_pack, category_order, item_order)
        )
      `,
      )
      .in('status', ['approved', 'fulfilled'])
      .eq('period_id', periodId);

    if (error) throw error;

    type PrintRequisition = {
      id: number;
      pcu_id: number;
      requisition_items_drugcupsabot: Array<{
        id: number;
        approved_quantity: number | null;
        items_drugcupsabot:
          | {
              id: number;
              name: string;
              unit_pack: string;
              category_order: number | null;
              item_order: number | null;
            }
          | Array<{
              id: number;
              name: string;
              unit_pack: string;
              category_order: number | null;
              item_order: number | null;
            }>;
      }>;
    };

    const summary: Record<number, ProcessedItem> = {};

    for (const req of (data ?? []) as unknown as PrintRequisition[]) {
      const pcuId = req.pcu_id;

      for (const reqItem of req.requisition_items_drugcupsabot ?? []) {
        // FIX: Supabase types FK joins as arrays even for many-to-one
        const itemJoin = Array.isArray(reqItem.items_drugcupsabot)
          ? reqItem.items_drugcupsabot[0]
          : reqItem.items_drugcupsabot;
        if (!itemJoin) {
          console.warn('Skipping orphaned requisition item during print process:', reqItem);
          continue;
        }

        const itemId = itemJoin.id;
        const itemName = itemJoin.name;
        const unitPack = itemJoin.unit_pack;
        const categoryOrder = itemJoin.category_order;
        const itemOrder = itemJoin.item_order;
        const qty = reqItem.approved_quantity || 0;

        if (!summary[itemId]) {
          summary[itemId] = {
            item_id: itemId,
            item_name: itemName,
            unit_pack: unitPack,
            total_quantity: 0,
            pcu_breakdown: {},
            category_order: categoryOrder,
            item_order: itemOrder,
          };
        }

        summary[itemId].total_quantity += qty;
        summary[itemId].pcu_breakdown[pcuId] = (summary[itemId].pcu_breakdown[pcuId] || 0) + qty;
      }
    }

    processedData.value = Object.values(summary).sort((a, b) => {
      const categoryDiff = (a.category_order || 9999) - (b.category_order || 9999);
      if (categoryDiff !== 0) return categoryDiff;

      const itemDiff = (a.item_order || 9999) - (b.item_order || 9999);
      if (itemDiff !== 0) return itemDiff;

      return a.item_name.localeCompare(b.item_name, 'th');
    });

    setTimeout(() => {
      window.print();
    }, 500);
  } catch (err) {
    console.error('Error processing requisitions for print:', err);
    // FIX: Supabase may reject with a plain {message,...} object (not an Error
    // instance) on network failures. `String(plainObject)` would yield
    // "[object Object]". Fall back to `err.message` for object-shaped errors
    // and JSON.stringify for anything else so the user sees the real reason.
    document.body.innerHTML = `เกิดข้อผิดพลาด: ${formatUnknownError(err)}`;
  } finally {
    loading.value = false;
  }
});

function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatUnknownError(err: unknown): string {
  if (err === null) return 'null';
  if (err === undefined) return 'undefined';
  if (typeof err === 'string') return err;
  if (err instanceof Error) return err.message;
  if (typeof err === 'object') {
    const obj = err as { message?: unknown; code?: unknown; details?: unknown };
    if (typeof obj.message === 'string' && obj.message.length > 0) {
      return obj.message;
    }
    try {
      return JSON.stringify(err);
    } catch {
      return '[unserializable error]';
    }
  }
  return String(err);
}
</script>

<style>
@media print {
    @page {
        size: landscape;
        margin: 8mm;
    }
    body {
        margin: 0;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }
}
</style>

<style scoped>
body {
    background-color: #fff;
    margin: 0;
    padding: 0;
}
.print-container {
    font-family: "Sarabun", sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: #000;
}
.page {
    background: white;
    width: 100%;
    padding: 8mm;
    margin: 0 auto;
    box-sizing: border-box;
}

/* Header */
.header {
    margin-bottom: 16px;
    text-align: center;
}
.header .bold {
    font-size: 20px;
    font-weight: bold;
}
.sub-header {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    font-size: 15px;
}
u {
    text-decoration: none;
    border-bottom: 1px dotted #000;
}

/* Table */
.table-wrapper {
    width: 100%;
    overflow: visible;
}
table {
    width: 100%;
    border-collapse: collapse;
    table-layout: auto;
}
th,
td {
    border: 1px solid #000;
    padding: 5px 6px;
    text-align: left;
    vertical-align: top;
}
thead th {
    text-align: center;
    font-weight: bold;
    border-bottom: 2px solid #000;
}
tbody td {
    border: 1px solid #000;
}
td.center,
th.center {
    text-align: center;
}
th:first-child,
td:first-child {
    width: 40px;
}
th:nth-child(2),
td:nth-child(2) {
    min-width: 140px;
}
th:nth-child(3),
td:nth-child(3),
th:nth-child(4),
td:nth-child(4) {
    width: 60px;
    white-space: nowrap;
}
.total-col {
    background-color: #f2f2f2;
}
.pcu-header {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    white-space: nowrap;
    min-width: 34px;
    width: 34px;
    padding: 8px 4px;
}

/* Print-specific styles */
@media print {
    body,
    .page {
        margin: 0;
        box-shadow: none;
    }
    .print-container {
        font-size: 9pt;
    }
    .page {
        padding: 6mm 10mm;
    }
    thead {
        display: table-header-group;
    }
    tr {
        page-break-inside: avoid;
    }
}
</style>
