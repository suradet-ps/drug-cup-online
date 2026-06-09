<!-- src/views/Register.vue -->
<template>
    <div class="register-wrapper">
        <div class="card register-container">
            <div class="register-header">
                <i class="fas fa-user-plus"></i>
                <h1>สร้างบัญชีใหม่</h1>
                <p>สำหรับบุคลากร รพ.สต. ในเครือข่ายโรงพยาบาลสระโบสถ์</p>
            </div>

            <form @submit.prevent="handleRegister">
                <div class="form-group">
                    <label for="username">ชื่อ-นามสกุล</label>
                    <input
                        type="text"
                        id="username"
                        v-model="form.username"
                        required
                        placeholder="เช่น สมชาย ใจดี"
                        :disabled="loading"
                    />
                </div>

                <div class="form-group">
                    <label for="email">อีเมล</label>
                    <input
                        type="email"
                        id="email"
                        v-model="form.email"
                        required
                        placeholder="name@example.com"
                        :disabled="loading"
                    />
                </div>

                <div class="form-group">
                    <label for="password">รหัสผ่าน</label>
                    <input
                        type="password"
                        id="password"
                        v-model="form.password"
                        required
                        placeholder="อย่างน้อย 6 ตัวอักษร"
                        :disabled="loading"
                    />
                </div>

                <div class="form-group">
                    <label for="pcu">หน่วยบริการ (รพ.สต.) ของคุณ</label>
                    <select
                        id="pcu"
                        v-model="form.pcu_id"
                        required
                        :disabled="isPcuLoading || loading"
                    >
                        <option v-if="isPcuLoading" disabled value="">
                            กำลังโหลดรายชื่อ รพ.สต....
                        </option>
                        <option v-else disabled value="">
                            -- กรุณาเลือกรพ.สต. --
                        </option>
                        <option
                            v-for="pcu in pcuList"
                            :key="pcu.id"
                            :value="pcu.id"
                        >
                            {{ pcu.name }}
                        </option>
                    </select>
                </div>

                <p v-if="errorMessage" class="error-message">
                    {{ errorMessage }}
                </p>

                <button
                    type="submit"
                    class="btn btn-primary"
                    :disabled="loading"
                >
                    <i v-if="loading" class="fas fa-spinner fa-spin"></i>
                    <i v-else class="fas fa-check-circle"></i>
                    <span>{{
                        loading ? "กำลังลงทะเบียน..." : "ลงทะเบียน"
                    }}</span>
                </button>
            </form>

            <div class="login-link">
                มีบัญชีอยู่แล้ว?
                <router-link to="/login">เข้าสู่ระบบที่นี่</router-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/supabaseClient';
import type { Pcu } from '@/types/models';

const router = useRouter();
const pcuList = ref<Pcu[]>([]);
const isPcuLoading = ref<boolean>(true);
const loading = ref<boolean>(false);
const errorMessage = ref<string>('');

const form = ref<{
  username: string;
  email: string;
  password: string;
  pcu_id: string;
}>({
  username: '',
  email: '',
  password: '',
  pcu_id: '',
});

const APP_BASE_URL: string = import.meta.env.VITE_APP_BASE_URL || window.location.origin;
const EMAIL_REDIRECT_URL = `${APP_BASE_URL}/waiting-for-approval`;

async function fetchPcuList(): Promise<void> {
  try {
    isPcuLoading.value = true;
    const { data, error } = await supabase
      .from('pcus_drugcupsabot')
      .select('id, name')
      .order('name');
    if (error) throw error;
    pcuList.value = (data ?? []) as unknown as Pcu[];
  } catch (err) {
    console.error('Error fetching PCU list:', err);
    errorMessage.value = 'ไม่สามารถโหลดรายชื่อ รพ.สต. ได้ กรุณาลองใหม่อีกครั้ง';
  } finally {
    isPcuLoading.value = false;
  }
}

onMounted(() => {
  fetchPcuList();
});

async function handleRegister(): Promise<void> {
  if (!form.value.pcu_id) {
    errorMessage.value = 'กรุณาเลือก รพ.สต. ของคุณ';
    return;
  }

  const isValidPcu = pcuList.value.some(
    // FIX: HTML <select> v-model returns string, but pcus.id is number.
    // Preserved original behavior: strict equality between number and string
    // is always false, so this branch (and the alert path below) is dead
    // code at runtime. Cast keeps TS happy without changing semantics.
    (pcu) => pcu.id === (form.value.pcu_id as unknown as number),
  );
  if (!isValidPcu) {
    errorMessage.value = 'ข้อมูล รพ.สต. ไม่ถูกต้อง โปรดเลือกใหม่อีกครั้ง';
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    const { data, error } = await supabase.auth.signUp({
      email: form.value.email,
      password: form.value.password,
      options: {
        data: {
          username: form.value.username.trim(),
          pcu_id: form.value.pcu_id,
          email: form.value.email.trim(),
        },
        emailRedirectTo: EMAIL_REDIRECT_URL,
      },
    });

    if (error) throw error;

    alert('การลงทะเบียนสำเร็จ! กรุณารอการอนุมัติจากผู้ดูแลระบบก่อนเข้าใช้งาน');
    router.push('/login');
  } catch (error) {
    console.error('Registration error:', error);

    // FIX: error is unknown in strict TS, narrow to Error before reading .message
    if (error instanceof Error) {
      if (error.message.includes('User already registered')) {
        errorMessage.value = 'อีเมลนี้มีการลงทะเบียนแล้ว';
      } else if (error.message.includes('PCU does not exist')) {
        errorMessage.value = 'ข้อมูล รพ.สต. ไม่ถูกต้อง กรุณาเลือกใหม่อีกครั้ง';
      } else {
        errorMessage.value = `เกิดข้อผิดพลาด: ${error.message}`;
      }
    } else {
      errorMessage.value = `เกิดข้อผิดพลาด: ${String(error)}`;
    }
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* White canvas register page — DESIGN.md §contact-form-card */
.register-wrapper {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 100vh;
    padding: var(--space-10) var(--space-4);
    background-color: var(--color-canvas);
}

.register-container {
    width: 100%;
    max-width: 480px;
    padding: var(--space-10);
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

.register-header {
    text-align: center;
    margin-bottom: var(--space-8);
}

.register-header i {
    font-size: 2rem;
    color: var(--color-near-black);
    margin-bottom: var(--space-4);
    display: block;
}

/* Section heading scale — Unica77/Inter (body face) per DESIGN.md */
.register-header h1 {
    font-family: var(--font-body);
    font-size: var(--text-card-heading);
    font-weight: var(--weight-normal);
    letter-spacing: var(--tracking-card-heading);
    color: var(--color-ink);
    border: none;
    padding: 0;
    margin-bottom: var(--space-2);
}

.register-header p {
    font-size: var(--text-caption);
    color: var(--color-muted-slate);
    margin-bottom: 0;
}

.form-group label {
    color: var(--color-ink);
}

form .btn {
    width: 100%;
    margin-top: var(--space-6);
    padding: var(--space-3) var(--space-6);
    justify-content: center;
}

form .btn span {
    display: inline;
}

.error-message {
    color: var(--color-error);
    background-color: var(--color-pale-pink);
    border: 1px solid rgba(194, 59, 59, 0.2);
    border-radius: var(--radius-xs);
    padding: var(--space-3) var(--space-4);
    margin-top: var(--space-4);
    font-size: var(--text-caption);
}

.login-link {
    margin-top: var(--space-6);
    font-size: var(--text-caption);
    color: var(--color-muted-slate);
    text-align: center;
}

.login-link a {
    color: #5b7ec4;
}

@media (max-width: 480px) {
    .register-container {
        padding: var(--space-8) var(--space-6);
    }
}
</style>
