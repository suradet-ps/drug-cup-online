<template>
    <div class="home-wrapper">
        <div class="card home-card">
            <h2>ยินดีต้อนรับสู่<br />ระบบเบิกยาออนไลน์</h2>
            <p class="welcome-text">คุณ {{ auth.profile?.username }}</p>

            <div v-if="!auth.isAdmin" class="action-box">
                <p>คุณเข้าสู่ระบบในฐานะผู้ใช้งาน รพ.สต.</p>
                <button @click="goTo('/pcu/dashboard')" class="btn btn-primary">
                    <i class="fas fa-clinic-medical"></i>
                    ไปยังหน้าแดชบอร์ด รพ.สต.
                </button>
            </div>

            <div v-if="auth.isAdmin" class="action-box">
                <p>คุณเข้าสู่ระบบในฐานะผู้ดูแลระบบ (Admin)</p>
                <button
                    @click="goTo('/admin/dashboard')"
                    class="btn btn-primary"
                >
                    <i class="fas fa-user-shield"></i>
                    ไปยังหน้าแดชบอร์ดผู้ดูแลระบบ
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/store/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

function goTo(path: string): void {
    router.push(path);
}
</script>

<style scoped>
/* White canvas home — DESIGN.md §whitespace philosophy, section-heading scale */
.home-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 56px);
    background-color: var(--color-canvas);
    padding: var(--space-10) var(--space-4);
}

/* Card with thin border — DESIGN.md §Bordered elevation */
.home-card {
    max-width: 480px;
    width: 100%;
    text-align: center;
    padding: var(--space-10);
    border: 1px solid var(--color-card-border);
    border-radius: var(--radius-sm);
}

/* Section heading scale — Unica77/Inter (body face) per DESIGN.md */
.home-card h2 {
    font-family: var(--font-body);
    font-size: var(--text-section-heading);
    font-weight: var(--weight-normal);
    letter-spacing: var(--tracking-section-heading);
    line-height: var(--leading-snug);
    color: var(--color-ink);
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: var(--space-2);
}

/* Caption / muted welcome text */
.welcome-text {
    font-size: var(--text-body-lg);
    color: var(--color-muted-slate);
    margin-bottom: var(--space-8);
}

/* Action area with thin top rule */
.action-box {
    border-top: 1px solid var(--color-hairline);
    padding-top: var(--space-6);
    margin-top: var(--space-6);
}

.action-box p {
    font-size: var(--text-caption);
    color: var(--color-muted-slate);
    margin-bottom: var(--space-4);
}

/* Pill button full-width */
.action-box .btn,
button {
    width: 100%;
    padding: var(--space-3) var(--space-6);
    justify-content: center;
    margin-top: 0;
}

button span {
    display: inline;
}
</style>
