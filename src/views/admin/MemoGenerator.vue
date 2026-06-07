<template>
    <div class="container">
        <h2>
            <i class="fas fa-file-signature"></i>
            สร้างบันทึกข้อความขออนุมัติเบิกจ่าย
        </h2>
        <p class="text-muted">
            เลือกรอบเบิกเพื่อสร้างเอกสารบันทึกข้อความเสนอผู้อำนวยการ
        </p>

        <div class="card report-options no-print">
            <div class="form-group">
                <label for="report-period">1. เลือกรอบเบิก</label>
                <select
                    id="report-period"
                    v-model="selectedPeriod"
                    @change="fetchReportData"
                >
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
            <div class="form-group action-buttons-group">
                <label>&nbsp;</label>
                <button
                    @click="printMemo"
                    :disabled="!selectedPeriod || reportData.length === 0"
                    class="btn btn-primary"
                >
                    <i class="fas fa-print"></i> พิมพ์บันทึกข้อความ
                </button>
            </div>
        </div>

        <div v-if="loading" class="loading">กำลังประมวลผลข้อมูล...</div>
        <div v-if="error" class="error">{{ error }}</div>

        <div v-if="reportData.length > 0" class="card">
            <h4><i class="fas fa-eye"></i> ข้อมูลที่จะแสดงในเอกสาร</h4>
            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th class="text-center">ลำดับ</th>
                            <th>หน่วยบริการ (รพ.สต.)</th>
                            <th class="text-right">มูลค่ารวม (บาท)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(pcu, index) in reportData"
                            :key="pcu.pcu_id"
                        >
                            <td class="text-center">{{ index + 1 }}</td>
                            <td>{{ pcu.pcu_name }}</td>
                            <td class="text-right bold">
                                {{ formatCurrency(pcu.total_value) }}
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="2" class="text-right bold">
                                มูลค่ารวมทั้งสิ้น
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
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/supabaseClient";
import type {
    AccountingSummaryRow,
    RequisitionPeriod,
} from "@/types/models";

const router = useRouter();
const loading = ref<boolean>(false);
const error = ref<string | null>(null);
const periods = ref<RequisitionPeriod[]>([]);
const selectedPeriod = ref<number | null>(null);
const reportData = ref<AccountingSummaryRow[]>([]);

const grandTotal = computed<number>(() =>
    reportData.value.reduce((sum, pcu) => sum + pcu.total_value, 0),
);

onMounted(async () => {
    const { data } = await supabase
        .from("requisition_periods_drugcupsabot")
        .select("id, name")
        .order("start_date", { ascending: false });
    periods.value = (data ?? []) as unknown as RequisitionPeriod[];
});

async function fetchReportData(): Promise<void> {
    if (!selectedPeriod.value) return;
    loading.value = true;
    error.value = null;
    reportData.value = [];
    try {
        const { data, error: fetchError } = await supabase.rpc(
            "get_accounting_summary_by_period",
            {
                period_id_param: selectedPeriod.value,
            },
        );
        if (fetchError) throw fetchError;
        reportData.value = (data ?? []) as unknown as AccountingSummaryRow[];
    } catch (err) {
        // FIX: error is unknown in strict TS, narrow to Error before reading .message
        error.value =
            "เกิดข้อผิดพลาด: " +
            (err instanceof Error ? err.message : String(err));
    } finally {
        loading.value = false;
    }
}

function printMemo(): void {
    if (!selectedPeriod.value) return;
    const routeData = router.resolve({
        name: "ApprovalMemoPrint",
        query: { periodId: selectedPeriod.value },
    });
    window.open(routeData.href, "_blank");
}

function formatCurrency(value: number): string {
    return Number(value).toLocaleString("th-TH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}
</script>

<style scoped>
h2 i,
h4 i {
    margin-right: 0.75rem;
    color: var(--color-near-black);
}
.report-options {
    display: flex;
    align-items: flex-end;
    gap: 1.5rem;
    margin-bottom: 2rem;
}
.form-group {
    flex-grow: 1;
}
.action-buttons-group {
    flex-grow: 0;
}
</style>
