<template>
    <div class="print-container landscape" v-if="processedData.length > 0">
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

const periodId = route.query.periodId as string | undefined;

onMounted(async () => {
  if (!periodId) {
    document.body.innerHTML = 'ไม่พบ ID ของรอบเบิก';
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

    const { data, error } = await supabase
      .from('requisition_items_drugcupsabot')
      .select(
        `
        approved_quantity,
        items_drugcupsabot (id, name, unit_pack, category_order, item_order),
        requisitions_drugcupsabot (pcu_id, status, period_id)
      `,
      )
      .in('requisitions_drugcupsabot.status', ['approved', 'fulfilled'])
      .eq('requisitions_drugcupsabot.period_id', periodId);

    if (error) throw error;

    const summary: Record<number, ProcessedItem> = data.reduce(
      (acc, current) => {
        // FIX: Supabase types FK joins as arrays even for many-to-one
        const cur = current as unknown as {
          requisitions_drugcupsabot:
            | { pcu_id: number; status: string; period_id: number }
            | Array<{ pcu_id: number; status: string; period_id: number }>;
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
          approved_quantity: number | null;
        };
        const reqJoin = Array.isArray(cur.requisitions_drugcupsabot)
          ? cur.requisitions_drugcupsabot[0]
          : cur.requisitions_drugcupsabot;
        const itemJoin = Array.isArray(cur.items_drugcupsabot)
          ? cur.items_drugcupsabot[0]
          : cur.items_drugcupsabot;

        if (!reqJoin || !itemJoin) {
          console.warn('Skipping orphaned requisition item during print process:', current);
          return acc;
        }

        const itemId = itemJoin.id;
        const itemName = itemJoin.name;
        const unitPack = itemJoin.unit_pack;
        const categoryOrder = itemJoin.category_order;
        const itemOrder = itemJoin.item_order;
        const pcuId = reqJoin.pcu_id;
        const qty = cur.approved_quantity || 0;

        if (!acc[itemId]) {
          acc[itemId] = {
            item_id: itemId,
            item_name: itemName,
            unit_pack: unitPack,
            total_quantity: 0,
            pcu_breakdown: {},
            category_order: categoryOrder,
            item_order: itemOrder,
          };
        }

        acc[itemId].total_quantity += qty;
        acc[itemId].pcu_breakdown[pcuId] = (acc[itemId].pcu_breakdown[pcuId] || 0) + qty;

        return acc;
      },
      {} as Record<number, ProcessedItem>,
    );

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
    // FIX: error is unknown in strict TS, narrow to Error before reading .message
    document.body.innerHTML = `เกิดข้อผิดพลาด: ${err instanceof Error ? err.message : String(err)}`;
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
</script>

<style>
@page {
    size: A4 landscape;
    margin: 10mm;
}
@media print {
    body {
        margin: 0;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }
}
</style>

<style scoped>
body {
    background-color: #eee;
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
    padding: 10mm;
    margin: 0 auto;
    box-sizing: border-box;
}

/* Header */
.header {
    margin-bottom: 20px;
    text-align: center;
}
.header .bold {
    font-size: 22px;
    font-weight: bold;
}
.sub-header {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    font-size: 16px;
}
u {
    text-decoration: none;
    border-bottom: 1px dotted #000;
}

/* Table */
table {
    width: 100%;
    border-collapse: collapse;
    border: 2px solid #000;
}
th,
td {
    border: 1px solid #000;
    padding: 6px;
    text-align: left;
    vertical-align: top;
}
th {
    text-align: center;
    font-weight: bold;
}
td.center,
th.center {
    text-align: center;
}
.total-col {
    background-color: #f2f2f2;
}
.pcu-header {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    white-space: nowrap;
    min-width: 36px;
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
        padding: 8mm 12mm;
    }
    thead {
        display: table-header-group;
    }
    tr {
        page-break-inside: avoid;
    }
}
</style>
