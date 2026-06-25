<!-- src/components/Sidebar.vue -->
<template>
    <aside class="sidebar no-print" :class="{ 'is-open': isOpen }">
        <div class="sidebar-header">
            <i class="fas fa-pills logo"></i>
            <div class="header-text">
                <span class="title">ระบบเบิกยาออนไลน์</span>
                <span class="subtitle">โรงพยาบาลสระโบสถ์</span>
            </div>
        </div>

        <nav class="sidebar-nav">
            <router-link to="/admin/dashboard">
                <i class="fas fa-tachometer-alt"></i>
                <span>แดชบอร์ด</span>
            </router-link>
            <router-link to="/admin/item-management">
                <i class="fas fa-dolly-flatbed"></i>
                <span>จัดการยา</span>
            </router-link>
            <router-link to="/admin/requisition-summary">
                <i class="fas fa-calculator"></i>
                <span>สรุปผลเบิก</span>
            </router-link>
            <router-link to="/admin/reports">
                <i class="fas fa-print"></i>
                <span>พิมพ์รายงานใบเบิก</span>
            </router-link>
            <router-link to="/admin/memo-generator">
                <i class="fas fa-file-signature"></i>
                <span>พิมพ์บันทึกข้อความ</span>
            </router-link>
            <router-link to="/admin/accounting-report">
                <i class="fas fa-file-invoice-dollar"></i>
                <span>รายงานบัญชี</span>
            </router-link>
            <router-link to="/admin/user-management">
                <i class="fas fa-user-check"></i>
                <span>อนุมัติผู้ใช้งาน</span>
            </router-link>
            <router-link to="/admin/settings">
                <i class="fas fa-cog"></i>
                <span>ตั้งค่าระบบ</span>
            </router-link>
        </nav>
    </aside>
</template>

<script setup lang="ts">
defineProps<{ isOpen: boolean }>();
</script>

<style scoped>
/* Gradient sidebar — DESIGN.md ยงgradient-sidebar */
.sidebar {
    width: 260px;
    background: var(--gradient-sidebar);
    border-right: none;
    display: flex;
    flex-direction: column;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    transition: transform var(--duration-slow) var(--easing-standard);
    z-index: 1100;
}

.sidebar-header {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-6);
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.sidebar-header .logo {
    font-size: 1.5rem;
    color: #5b7ec4;
    opacity: 0.9;
}

.header-text {
    display: flex;
    flex-direction: column;
    line-height: 1.3;
    overflow: hidden;
}

.header-text .title {
    font-family: var(--font-display);
    font-size: var(--text-body);
    font-weight: var(--weight-semibold);
    color: var(--color-ink);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.header-text .subtitle {
    font-size: var(--text-micro);
    font-weight: var(--weight-normal);
    color: var(--color-muted-slate);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.sidebar-nav {
    padding: var(--space-4) var(--space-3);
    flex-grow: 1;
    overflow-y: auto;
}

.sidebar-nav a {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-2-5) var(--space-4);
    border-radius: var(--radius-sm);
    color: var(--color-muted-slate);
    font-size: var(--text-caption);
    font-weight: var(--weight-normal);
    text-decoration: none;
    margin-bottom: var(--space-px);
    transition:
        background-color var(--duration-base) var(--easing-standard),
        color            var(--duration-base) var(--easing-standard);
}

.sidebar-nav a i {
    width: 18px;
    text-align: center;
    font-size: 0.95rem;
    flex-shrink: 0;
}

.sidebar-nav a:hover {
    background-color: rgba(91, 126, 196, 0.12);
    color: var(--color-ink);
    text-decoration: none;
}

.sidebar-nav a.router-link-exact-active {
    background-color: rgba(91, 126, 196, 0.18);
    color: #5b7ec4;
    font-weight: var(--weight-semibold);
}

.sidebar-nav a.router-link-exact-active i {
    color: #5b7ec4;
}

@media (max-width: 992px) {
    .sidebar {
        transform: translateX(-100%);
        box-shadow: var(--shadow-overlay);
    }
    .sidebar.is-open {
        transform: translateX(0);
    }
}
</style>
