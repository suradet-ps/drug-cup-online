<template>
    <div>
        <AppNavbar />
        <main>
            <router-view />
        </main>
    </div>
</template>

<script setup lang="ts">
import AppNavbar from '@/components/AppNavbar.vue';
</script>
