<!-- src/components/Navbar.vue -->
<template>
    <nav class="navbar no-print">
        <div class="navbar-container">
            <router-link to="/" class="navbar-brand">
                <i class="fas fa-pills"></i>

                <span class="brand-text">ระบบเบิกยาออนไลน์</span>
                <span class="brand-subtext"> โรงพยาบาลสระโบสถ์</span>
            </router-link>

            <button
                class="hamburger-menu"
                @click="toggleMenu"
                aria-label="Toggle navigation"
            >
                <i class="fas fa-bars"></i>
            </button>

            <div
                class="nav-links"
                v-if="auth.isLoggedIn"
                :class="{ 'is-open': isMenuOpen }"
            >
                <router-link to="/pcu/dashboard" @click="closeMenu">
                    <i class="fas fa-tachometer-alt"></i> หน้าหลัก รพ.สต.
                </router-link>

                <div class="user-info">
                    <i class="fas fa-user-circle"></i>
                    <div class="user-details">
                        <span class="username">{{
                            auth.profile?.username
                        }}</span>
                        <span class="role">{{ auth.userPcuName }}</span>
                    </div>
                    <button
                        @click="handleLogout"
                        class="btn-logout"
                        title="ออกจากระบบ"
                    >
                        <i class="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const auth = useAuthStore();
const router = useRouter();
const isMenuOpen = ref(false);

function toggleMenu(): void {
  isMenuOpen.value = !isMenuOpen.value;
}

function closeMenu(): void {
  isMenuOpen.value = false;
}

async function handleLogout(): Promise<void> {
  await auth.logout();
  closeMenu();
  router.push('/login');
}
</script>

<style scoped>
/* White canvas navbar — DESIGN.md §Global nav (logo left, menu center, user right) */
.navbar {
    background-color: var(--color-canvas);
    border-bottom: 1px solid var(--color-hairline);
    padding: 0 var(--space-6);
    height: 56px;
    position: sticky;
    top: 0;
    z-index: 1000;
}

.navbar-container {
    max-width: 1200px;
    margin: 0 auto;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
}

/* Brand — logo left zone */
.navbar-brand {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-family: var(--font-display);
    font-size: var(--text-body);
    font-weight: var(--weight-normal);
    color: var(--color-ink);
    text-decoration: none;
    z-index: 10;
}

.navbar-brand i {
    color: var(--color-near-black);
    font-size: 1.1rem;
}

.navbar-brand:hover {
    text-decoration: none;
    color: var(--color-near-black);
}

.brand-text {
    color: var(--color-ink);
}

.brand-subtext {
    color: var(--color-muted-slate);
    font-size: var(--text-caption);
}

/* Nav links — right zone */
.nav-links {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    transition:
        transform var(--duration-slow) var(--easing-standard),
        opacity   var(--duration-slow) var(--easing-standard);
}

.nav-links a {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    color: var(--color-muted-slate);
    text-decoration: none;
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-sm);
    font-size: var(--text-caption);
    font-weight: var(--weight-normal);
    transition:
        background-color var(--duration-base) var(--easing-standard),
        color            var(--duration-base) var(--easing-standard);
}

.nav-links a:hover,
.nav-links a.router-link-exact-active {
    background-color: var(--color-soft-stone);
    color: var(--color-ink);
    text-decoration: none;
}

/* User info — right zone */
.user-info {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding-left: var(--space-4);
    border-left: 1px solid var(--color-hairline);
    color: var(--color-ink);
}

.user-info .fa-user-circle {
    font-size: 1.5rem;
    color: var(--color-muted-slate);
}

.user-details {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
}

.user-details .username {
    font-size: var(--text-caption);
    font-weight: var(--weight-medium);
    color: var(--color-ink);
}

.user-details .role {
    font-size: var(--text-micro);
    color: var(--color-muted-slate);
}

/* Logout button */
.btn-logout {
    background: none;
    border: 1px solid var(--color-hairline);
    cursor: pointer;
    font-size: 0.9rem;
    padding: var(--space-2);
    border-radius: var(--radius-sm);
    line-height: 1;
    transition:
        color            var(--duration-base) var(--easing-standard),
        background-color var(--duration-base) var(--easing-standard),
        border-color     var(--duration-base) var(--easing-standard);
    color: var(--color-muted-slate);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
}

.btn-logout:hover {
    color: var(--color-error);
    background-color: var(--color-pale-pink);
    border-color: rgba(194, 59, 59, 0.2);
}

/* Hamburger */
.hamburger-menu {
    display: none;
    background: none;
    border: 1px solid var(--color-hairline);
    cursor: pointer;
    font-size: 0.9rem;
    color: var(--color-ink);
    padding: var(--space-2);
    border-radius: var(--radius-sm);
    z-index: 10;
    width: 34px;
    height: 34px;
    align-items: center;
    justify-content: center;
}

/* Mobile */
@media (max-width: 820px) {
    .brand-subtext {
        display: none;
    }

    .hamburger-menu {
        display: flex;
    }

    .nav-links {
        position: absolute;
        top: calc(100% + var(--space-2));
        left: 0;
        right: 0;
        background-color: var(--color-canvas);
        border: 1px solid var(--color-hairline);
        border-radius: var(--radius-sm);
        padding: var(--space-3);
        flex-direction: column;
        align-items: stretch;
        gap: var(--space-px);
        opacity: 0;
        transform: translateY(-8px);
        pointer-events: none;
        box-shadow: var(--shadow-overlay);
    }

    .nav-links.is-open {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
    }

    .nav-links a {
        justify-content: center;
        padding: var(--space-3);
    }

    .user-info {
        flex-direction: column;
        border-left: none;
        padding-left: 0;
        padding-top: var(--space-4);
        margin-top: var(--space-2);
        border-top: 1px solid var(--color-hairline);
        width: 100%;
        gap: var(--space-3);
    }

    .user-details {
        text-align: center;
    }
}
</style>
