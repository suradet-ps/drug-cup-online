<template>
    <div class="login-wrapper">
        <div class="card login-container">
            <div class="login-header">
                <i class="fas fa-hospital-user"></i>
                <h1>เข้าสู่ระบบ</h1>
                <p>ระบบเบิกยาออนไลน์ โรงพยาบาลสระโบสถ์</p>
            </div>
            <form @submit.prevent="handleLogin">
                <div class="form-group">
                    <label for="email">อีเมล</label>
                    <input
                        type="email"
                        id="email"
                        v-model="email"
                        required
                        placeholder="name@example.com"
                    />
                </div>
                <div class="form-group">
                    <label for="password">รหัสผ่าน</label>
                    <input
                        type="password"
                        id="password"
                        v-model="password"
                        required
                        placeholder="********"
                    />
                </div>
                <p v-if="errorMessage" class="error-message">
                    {{ errorMessage }}
                </p>
                <button
                    type="submit"
                    class="btn btn-primary btn-submit"
                    :disabled="loading"
                >
                    <i class="fas fa-sign-in-alt"></i>
                    <span>{{
                        loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"
                    }}</span>
                </button>
                <div class="register-link">
                    ยังไม่มีบัญชี?
                    <router-link to="/register">ลงทะเบียนที่นี่</router-link>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "vue-router";

const email = ref<string>("");
const password = ref<string>("");
const loading = ref<boolean>(false);
const errorMessage = ref<string>("");
const authStore = useAuthStore();
const router = useRouter();

async function handleLogin(): Promise<void> {
    loading.value = true;
    errorMessage.value = "";
    try {
        await authStore.login(email.value, password.value);
        router.push("/");
    } catch (error) {
        // FIX: error is unknown in strict TS, narrow to Error before reading .message
        errorMessage.value =
            error instanceof Error ? error.message : String(error);
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
/* White canvas auth page — DESIGN.md §contact-form-card on white canvas */
.login-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    background-color: var(--color-canvas);
}

/* Contact-form-card: rounded white panel, thin border, flat (no shadow) */
.login-container {
    width: 100%;
    max-width: 400px;
    padding: var(--space-10) var(--space-10);
    border: 1px solid var(--color-card-border);
    border-radius: var(--radius-sm);
    animation: fade-in var(--duration-slow) var(--easing-standard);
}

@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(-8px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.login-header {
    text-align: center;
    margin-bottom: var(--space-8);
}

/* Icon as a small system marker */
.login-header .fa-hospital-user {
    font-size: 2rem;
    color: var(--color-near-black);
    margin-bottom: var(--space-4);
    display: block;
}

/* Section heading scale — Unica77/Inter (body face) per DESIGN.md */
.login-header h1 {
    font-family: var(--font-body);
    font-size: var(--text-card-heading);
    font-weight: var(--weight-normal);
    letter-spacing: var(--tracking-card-heading);
    color: var(--color-ink);
    border: none;
    padding: 0;
    margin-bottom: var(--space-2);
}

.login-header p {
    font-size: var(--text-caption);
    color: var(--color-muted-slate);
    margin-bottom: 0;
}

/* Form group label */
.form-group label {
    color: var(--color-ink);
}

/* Primary pill button */
.btn-submit {
    width: 100%;
    margin-top: var(--space-4);
    padding: var(--space-3) var(--space-6);
    font-size: var(--text-button);
    justify-content: center;
}

.btn-submit span {
    display: inline;
}

/* Error state */
.error-message {
    color: var(--color-error);
    font-size: var(--text-caption);
    margin-top: var(--space-3);
    padding: var(--space-3) var(--space-4);
    background-color: #fff5f5;
    border: 1px solid rgba(179, 0, 0, 0.2);
    border-radius: var(--radius-xs);
}

/* Register link */
.register-link {
    margin-top: var(--space-6);
    font-size: var(--text-caption);
    color: var(--color-muted-slate);
    text-align: center;
}

.register-link a {
    color: var(--color-action-blue);
    font-weight: var(--weight-normal);
}

@media (max-width: 480px) {
    .login-container {
        padding: var(--space-8) var(--space-6);
        margin: 0 var(--space-4);
        max-width: calc(100% - var(--space-8));
    }
}
</style>
