<!-- src/layouts/AdminLayout.vue -->
<template>
    <div class="admin-layout">
        <AppSidebar :isOpen="isSidebarOpen" />

        <div
            v-if="isSidebarOpen"
            class="sidebar-overlay"
            @click="toggleSidebar"
        ></div>

        <div class="main-content">
            <header class="top-header no-print">
                <button
                    class="hamburger-menu"
                    @click="toggleSidebar"
                    aria-label="Toggle Sidebar"
                >
                    <i class="fas fa-bars"></i>
                </button>

                <div class="user-info">
                    <i class="fas fa-user-circle"></i>
                    <div class="user-details">
                        <span class="username">{{
                            auth.profile?.username
                        }}</span>
                        <span class="role">Admin</span>
                    </div>
                    <button
                        @click="handleLogout"
                        class="btn-logout"
                        title="ออกจากระบบ"
                    >
                        <i class="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            </header>
            <main>
                <router-view />
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AppSidebar from '@/components/AppSidebar.vue';
import { useAuthStore } from '@/store/auth';

const auth = useAuthStore();
const router = useRouter();

const isSidebarOpen = ref(false);
function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
}

async function handleLogout(): Promise<void> {
  await auth.logout();
  router.push('/login');
}
</script>

<style scoped>
.admin-layout {
    display: flex;
}

.main-content {
    flex-grow: 1;
    margin-left: 260px;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: var(--color-canvas);
    transition: margin-left var(--duration-slow) var(--easing-standard);
}

/* Top header — white canvas, thin border, right-aligned user zone */
.top-header {
    background-color: var(--color-canvas);
    border-bottom: 1px solid var(--color-hairline);
    padding: 0 var(--space-6);
    height: 56px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: var(--space-4);
}

main {
    flex-grow: 1;
    background-color: var(--color-canvas);
}

/* User info (right zone) */
.user-info {
    display: flex;
    align-items: center;
    gap: var(--space-3);
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

/* Hamburger for mobile */
.hamburger-menu {
    display: none;
    margin-right: auto;
    font-size: 0.9rem;
    background: none;
    border: 1px solid var(--color-hairline);
    color: var(--color-ink);
    cursor: pointer;
    padding: var(--space-2);
    border-radius: var(--radius-sm);
    width: 34px;
    height: 34px;
    align-items: center;
    justify-content: center;
}

/* Dark overlay when sidebar is open on mobile */
.sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 1050;
    display: none;
}

@media (max-width: 992px) {
    .main-content {
        margin-left: 0;
    }
    .hamburger-menu {
        display: flex;
    }
    .sidebar-overlay {
        display: block;
    }
}
</style>
