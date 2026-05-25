<template>
  <router-link to="/" class="flex items-center gap-2.5">
    <span
      v-if="isExpanded || isHovered || isMobileOpen"
      class="text-theme-sm font-semibold text-gray-800 dark:text-white/90 whitespace-nowrap lg:block hidden"
    >
      Admin Dashboard
    </span>
  </router-link>
</template>

<script setup>
import { useSidebar } from '@/composables/useSidebar'
const { isExpanded, isHovered, isMobileOpen } = useSidebar()
</script>