<template>
    <div class="container">
        <h2>Admin Dashboard - จัดการใบเบิก</h2>

        <div v-if="loading" class="loading">กำลังโหลดข้อมูล...</div>
        <div v-if="error" class="error">{{ error }}</div>

        <div v-if="!loading && !error">
            <h3>ใบเบิกใหม่ (รอการอนุมัติ)</h3>
            <div
                v-if="submittedRequisitions.length > 0"
                class="table-container"
            >
                <table>
                    <thead>
                        <tr>
                            <th>รพ.สต.</th>
                            <th>รอบเบิก</th>
                            <th>วันที่ส่ง</th>
                            <th>สถานะ</th>
                            <th>จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="req in submittedRequisitions" :key="req.id">
                            <td>{{ req.pcus_drugcupsabot.name }}</td>
                            <td>
                                {{ req.requisition_periods_drugcupsabot.name }}
                            </td>
                            <td>{{ formatDate(req.submitted_at) }}</td>
                            <td>
                                <span :class="['status-badge', req.status]">{{
                                    req.status
                                }}</span>
                            </td>
                            <td>
                                <router-link
                                    :to="{
                                        name: 'AdminRequisitionDetail',
                                        params: { requisitionId: req.id },
                                    }"
                                    class="btn-sm btn-primary"
                                >
                                    ตรวจสอบและอนุมัติ
                                </router-link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p v-else class="no-data-message">ไม่มีใบเบิกใหม่ที่รอการอนุมัติ</p>

            <h3 class="section-divider">รายการที่อนุมัติแล้ว (รอจ่ายยา)</h3>
            <div v-if="approvedRequisitions.length > 0" class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>รพ.สต.</th>
                            <th>รอบเบิก</th>
                            <th>วันที่ส่ง</th>
                            <th>สถานะ</th>
                            <th>จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="req in approvedRequisitions" :key="req.id">
                            <td>{{ req.pcus_drugcupsabot.name }}</td>
                            <td>
                                {{ req.requisition_periods_drugcupsabot.name }}
                            </td>
                            <td>{{ formatDate(req.submitted_at) }}</td>
                            <td>
                                <span :class="['status-badge', req.status]">{{
                                    req.status
                                }}</span>
                            </td>
                            <td>
                                <router-link
                                    :to="{
                                        name: 'AdminRequisitionDetail',
                                        params: { requisitionId: req.id },
                                    }"
                                    class="btn-sm btn-success"
                                >
                                    ยืนยันการจ่าย
                                </router-link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p v-else class="no-data-message">
                ไม่มีรายการที่อนุมัติแล้วที่รอการจ่าย
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { supabase } from '@/supabaseClient';
import type { RequisitionStatus } from '@/types/models';

type DashboardRequisition = {
  id: number;
  submitted_at: string | null;
  status: RequisitionStatus;
  pcus_drugcupsabot: { name: string };
  requisition_periods_drugcupsabot: { name: string };
};

const loading = ref<boolean>(true);
const error = ref<string | null>(null);
const requisitions = ref<DashboardRequisition[]>([]);

const submittedRequisitions = computed<DashboardRequisition[]>(() => {
  return requisitions.value.filter((req) => req.status === 'submitted');
});

const approvedRequisitions = computed<DashboardRequisition[]>(() => {
  return requisitions.value.filter((req) => req.status === 'approved');
});

onMounted(async () => {
  try {
    const { data, error: fetchError } = await supabase
      .from('requisitions_drugcupsabot')
      .select(
        `
        id,
        submitted_at,
        status,
        pcus_drugcupsabot ( name ),
        requisition_periods_drugcupsabot ( name )
      `,
      )
      .in('status', ['submitted', 'approved'])
      .order('submitted_at', { ascending: true });

    if (fetchError) throw fetchError;
    // FIX: Supabase types FK joins as arrays even for many-to-one
    requisitions.value = (data ?? []) as unknown as DashboardRequisition[];
  } catch (err) {
    error.value = 'เกิดข้อผิดพลาดในการโหลดข้อมูลใบเบิก';
    console.error(err);
  } finally {
    loading.value = false;
  }
});

function formatDate(dateString: string | null): string {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('th-TH');
}
</script>

<style scoped>
/* Section heading adjustments */
h3 {
    margin-bottom: var(--space-4);
    padding-bottom: var(--space-3);
    border-bottom: 1px solid var(--color-hairline);
    font-size: var(--text-feature-heading);
    color: var(--color-ink);
    font-weight: var(--weight-normal);
}

.section-divider {
    margin-top: var(--space-14);
}

.table-container {
    overflow-x: auto;
    border: 1px solid var(--color-card-border);
    border-radius: var(--radius-sm);
}

/* Status badge overrides (supplement global) */
.status-badge.submitted {
    background-color: #fef3c7;
    color: #92400e;
    border: 1px solid #fcd34d;
}

.status-badge.approved {
    background-color: var(--color-pale-blue);
    color: var(--color-action-blue);
    border: 1px solid rgba(24, 99, 220, 0.2);
}

/* Action links as small pill buttons */
.btn-sm {
    padding: var(--space-1-5) var(--space-4);
    font-size: var(--text-micro);
    border-radius: var(--radius-pill);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    font-weight: var(--weight-medium);
    white-space: nowrap;
    transition:
        background-color var(--duration-base) var(--easing-standard),
        color            var(--duration-base) var(--easing-standard);
}

.btn-primary {
    background-color: var(--color-near-black);
    color: var(--color-canvas);
    border: none;
}
.btn-primary:hover {
    background-color: var(--color-primary-hover);
    text-decoration: none;
    color: var(--color-canvas);
}

.btn-success {
    background-color: var(--color-status-fulfilled);
    color: var(--color-canvas);
    border: none;
}
.btn-success:hover {
    background-color: var(--color-success-hover);
    text-decoration: none;
    color: var(--color-canvas);
}

/* No data placeholder */
.no-data-message {
    padding: var(--space-8) var(--space-6);
    text-align: center;
    color: var(--color-muted-slate);
    font-size: var(--text-caption);
    border: 1px dashed var(--color-hairline);
    border-radius: var(--radius-sm);
}
</style>
