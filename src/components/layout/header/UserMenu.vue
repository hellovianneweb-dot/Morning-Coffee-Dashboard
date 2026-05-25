<template>
  <div class="flex items-center gap-3">
    <!-- Coffee cup icon -->
    <span class="flex items-center justify-center w-9 h-9 rounded-full bg-brand-50 dark:bg-brand-500/10 flex-shrink-0">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        class="text-brand-500 dark:text-brand-400">
        <path d="M17 8h1a4 4 0 1 1 0 8h-1"/>
        <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
        <line x1="6" x2="6" y1="2" y2="4"/>
        <line x1="10" x2="10" y1="2" y2="4"/>
        <line x1="14" x2="14" y1="2" y2="4"/>
      </svg>
    </span>

    <!-- Greeting text -->
    <div class="hidden sm:block">
      <p class="text-theme-xs text-gray-400 dark:text-gray-500 leading-none mb-0.5">
        {{ greeting }},
      </p>
      <p class="text-theme-sm font-semibold text-gray-800 dark:text-white/90 leading-none">
        Morning Coffee & Tea ☕
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Magandang umaga'
  if (hour < 18) return 'Magandang hapon'
  return 'Magandang gabi'
})
</script>