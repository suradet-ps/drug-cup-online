<template>
    <div class="container">
        <h2><i class="fas fa-calculator"></i> สรุปประมวลผลใบเบิก</h2>

        <div class="card report-options no-print">
            <div class="form-group">
                <label>1. เลือกรอบเบิกเพื่อประมวลผล</label>
                <select v-model="selectedPeriod" @change="processRequisitions">
                    <option :value="null" disabled>
                        -- กรุณาเลือกรอบเบิก --
                    </option>
                    <option
                        v-for="period in periods"
                        :key="period.id"
                        :value="period.id"
                    >
                        {{ period.name }}
                    </option>
                </select>
            </div>
            <div class="form-group">
                <label>2. กรองข้อมูลตาม รพ.สต.</label>
                <select v-model="selectedPcu" :disabled="!processedData.length">
                    <option value="all">ดูทั้งหมด</option>
                    <option
                        v-for="pcu in pcuList"
                        :key="pcu.id"
                        :value="pcu.id"
                    >
                        {{ pcu.name }}
                    </option>
                </select>
            </div>
        </div>

        <div v-if="loading" class="loading">กำลังประมวลผล...</div>
        <div v-if="error" class="error">{{ error }}</div>

        <div v-if="processedData.length > 0" class="card">
            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>รายการ</th>
                            <th
                                class="text-center"
                                v-if="selectedPcu === 'all'"
                            >
                                ยอดรวม (ทุก รพ.สต.)
                            </th>
                            <th class="text-center" v-else>
                                ยอดเบิก ({{ getPcuName(selectedPcu) }})
                            </th>
                            <th
                                class="text-center"
                                v-if="selectedPcu === 'all'"
                                v-for="pcu in pcuList"
                                :key="pcu.id"
                            >
                                {{ pcu.name }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in processedData" :key="item.item_id">
                            <td>{{ item.item_name }}</td>
                            <td class="text-center bold">
                                {{ getDisplayQuantity(item) }}
                            </td>
                            <td
                                class="text-center"
                                v-if="selectedPcu === 'all'"
                                v-for="pcu in pcuList"
                                :key="pcu.id"
                            >
                                {{ item.pcu_breakdown[pcu.id] || 0 }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="print-actions no-print">
                <button @click="printSummary" class="btn btn-primary">
                    <i class="fas fa-print"></i> พิมพ์ใบสรุปยอดรวม
                </button>
            </div>
        </div>

        <div
            v-else-if="!loading && selectedPeriod"
            class="card no-data-message text-center"
        >
            <i class="fas fa-info-circle"></i>
            <p>ไม่พบข้อมูลใบเบิกที่อนุมัติแล้วในรอบนี้</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/supabaseClient";
import type { Pcu, RequisitionPeriod } from "@/types/models";

type ProcessedItem = {
    item_id: number;
    item_name: string;
    total_quantity: number;
    pcu_breakdown: Record<number, number>;
    category_order: number | null;
    item_order: number | null;
};

const router = useRouter();
const loading = ref<boolean>(false);
const error = ref<string | null>(null);
const periods = ref<RequisitionPeriod[]>([]);
const pcuList = ref<Pcu[]>([]);
const selectedPeriod = ref<number | null>(null);
const selectedPcu = ref<number | "all">("all");
const processedData = ref<ProcessedItem[]>([]);

onMounted(async () => {
    try {
        const { data: periodsData } = await supabase
            .from("requisition_periods_drugcupsabot")
            .select("id, name")
            .order("start_date", { ascending: false });
        periods.value = (periodsData ?? []) as unknown as RequisitionPeriod[];
        const { data: pcusData } = await supabase
            .from("pcus_drugcupsabot")
            .select("id, name")
            .order("name");
        pcuList.value = (pcusData ?? []) as unknown as Pcu[];
    } catch (err) {
        error.value = "ไม่สามารถโหลดข้อมูลเริ่มต้นได้";
        console.error(err);
    }
});

async function processRequisitions(): Promise<void> {
    if (!selectedPeriod.value) return;
    loading.value = true;
    error.value = null;
    processedData.value = [];

    try {
        const { data, error: fetchError } = await supabase
            .from("requisition_items_drugcupsabot")
            .select(
                `
        approved_quantity,
        items_drugcupsabot (id, name, category_order, item_order),
        requisitions_drugcupsabot (pcu_id, status, period_id)
      `,
            )
            .in("requisitions_drugcupsabot.status", ["approved", "fulfilled"])
            .eq("requisitions_drugcupsabot.period_id", selectedPeriod.value);

        if (fetchError) throw fetchError;

        const summary: Record<number, ProcessedItem> = data.reduce(
            (acc, current) => {
                // FIX: Supabase types FK joins as arrays even for many-to-one
                const req = (
                    current as unknown as {
                        requisitions_drugcupsabot:
                            | { pcu_id: number; status: string; period_id: number }
                            | Array<{ pcu_id: number; status: string; period_id: number }>;
                        items_drugcupsabot:
                            | {
                                  id: number;
                                  name: string;
                                  category_order: number | null;
                                  item_order: number | null;
                              }
                            | Array<{
                                  id: number;
                                  name: string;
                                  category_order: number | null;
                                  item_order: number | null;
                              }>;
                        approved_quantity: number | null;
                    }
                );
                const reqJoin = Array.isArray(req.requisitions_drugcupsabot)
                    ? req.requisitions_drugcupsabot[0]
                    : req.requisitions_drugcupsabot;
                const itemJoin = Array.isArray(req.items_drugcupsabot)
                    ? req.items_drugcupsabot[0]
                    : req.items_drugcupsabot;

                if (!reqJoin || !itemJoin) {
                    console.warn("Skipping orphaned requisition item:", current);
                    return acc;
                }

                const itemId = itemJoin.id;
                const itemName = itemJoin.name;
                const categoryOrder = itemJoin.category_order;
                const itemOrder = itemJoin.item_order;
                const pcuId = reqJoin.pcu_id;
                const qty = req.approved_quantity || 0;

                if (!acc[itemId]) {
                    acc[itemId] = {
                        item_id: itemId,
                        item_name: itemName,
                        total_quantity: 0,
                        pcu_breakdown: {},
                        category_order: categoryOrder,
                        item_order: itemOrder,
                    };
                }

                acc[itemId].total_quantity += qty;
                acc[itemId].pcu_breakdown[pcuId] =
                    (acc[itemId].pcu_breakdown[pcuId] || 0) + qty;

                return acc;
            },
            {} as Record<number, ProcessedItem>,
        );

        processedData.value = Object.values(summary).sort((a, b) => {
            const categoryDiff =
                (a.category_order || 9999) - (b.category_order || 9999);
            if (categoryDiff !== 0) return categoryDiff;

            const itemDiff = (a.item_order || 9999) - (b.item_order || 9999);
            if (itemDiff !== 0) return itemDiff;

            return a.item_name.localeCompare(b.item_name, "th");
        });
    } catch (err) {
        console.error("Error processing requisitions:", err);
        error.value = "เกิดข้อผิดพลาดในการประมวลผลข้อมูลใบเบิก";
    } finally {
        loading.value = false;
    }
}

function getPcuName(pcuId: number): string {
    return pcuList.value.find((p) => p.id === pcuId)?.name || "N/A";
}

function getDisplayQuantity(item: ProcessedItem): number {
    if (selectedPcu.value === "all") {
        return item.total_quantity;
    }
    return item.pcu_breakdown[selectedPcu.value] || 0;
}

function printSummary(): void {
    if (!selectedPeriod.value) {
        alert("กรุณาเลือกรอบเบิกก่อนพิมพ์");
        return;
    }
    const routeData = router.resolve({
        name: "PrintRequisitionSummary",
        query: { periodId: selectedPeriod.value },
    });
    window.open(routeData.href, "_blank");
}
</script>

<style scoped>
h2 i {
    margin-right: 0.75rem;
    color: var(--color-near-black);
}
.report-options {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-6);
    margin-bottom: var(--space-8);
}
.form-group {
    flex: 1 1 300px;
}
.text-center {
    text-align: center;
}
.bold {
    font-weight: 600;
}
.print-actions {
    margin-top: var(--space-6);
    padding-top: var(--space-6);
    border-top: 1px solid var(--color-hairline);
    text-align: right;
}
.no-data-message i {
    font-size: 2.5rem;
    color: var(--info-color);
    margin-bottom: var(--space-4);
}
.no-data-message p {
    font-size: 1.1rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
}
</style>
