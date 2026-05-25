<template>
  <div class="relative" ref="dropdownRef">

    <!-- Bell button — same classes as original -->
    <button
      class="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      @click="toggleDropdown"
    >
      <!-- Animated ping dot — orange when unread alerts exist -->
      <span
        :class="{ hidden: unreadCount === 0, flex: unreadCount > 0 }"
        class="absolute right-0 top-0.5 z-1 h-2 w-2 rounded-full bg-orange-400"
      >
        <span class="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 -z-1 animate-ping"></span>
      </span>

      <!-- Original bell SVG unchanged -->
      <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd"
          d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
          fill="" />
      </svg>
    </button>

    <!-- Dropdown — same dimensions and positioning as original -->
    <div
      v-if="dropdownOpen"
      class="absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0"
    >
      <!-- Header -->
      <div class="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-800">
        <div class="flex items-center gap-2">
          <h5 class="text-lg font-semibold text-gray-800 dark:text-white/90">Notifications</h5>
          <span v-if="unreadCount > 0"
            class="flex items-center justify-center min-w-[20px] h-5 rounded-full bg-error-500 text-white px-1.5"
            style="font-size: 10px; font-weight: 600;">
            {{ unreadCount }}
          </span>
        </div>
        <div class="flex items-center gap-3">
          <button v-if="unreadCount > 0" @click="markAllRead"
            class="text-theme-xs font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400">
            Mark all read
          </button>
          <button @click="closeDropdown" class="text-gray-500 dark:text-gray-400">
            <!-- Original X SVG unchanged -->
            <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                fill="" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Notification list -->
      <ul class="flex flex-col h-auto overflow-y-auto custom-scrollbar">
        <li v-if="notifications.length === 0" class="py-10 text-center text-theme-sm text-gray-400">
          No notifications
        </li>

        <li v-for="n in notifications" :key="n.id" @click="handleItemClick(n)">
          <a :class="[
              'flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5 cursor-pointer',
              !n.read ? 'bg-brand-25 dark:bg-brand-500/5' : ''
            ]" href="#">

            <!-- Icon bubble replacing the user avatar -->
            <span :class="[
                'relative flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full',
                n.type === 'critical' ? 'bg-error-50 dark:bg-error-500/10' :
                n.type === 'low'      ? 'bg-warning-50 dark:bg-warning-500/10' :
                n.type === 'order'    ? 'bg-brand-50 dark:bg-brand-500/10' :
                                        'bg-success-50 dark:bg-success-500/10'
              ]">
              <!-- Critical / Low: warning triangle -->
              <svg v-if="n.type === 'critical' || n.type === 'low'"
                width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                :class="n.type === 'critical' ? 'text-error-500' : 'text-warning-500'">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                <path d="M12 9v4"/><path d="M12 17h.01"/>
              </svg>
              <!-- Order: coffee cup -->
              <svg v-else-if="n.type === 'order'"
                width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="text-brand-500 dark:text-brand-400">
                <path d="M17 8h1a4 4 0 1 1 0 8h-1"/>
                <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
                <line x1="6" x2="6" y1="2" y2="4"/>
                <line x1="10" x2="10" y1="2" y2="4"/>
                <line x1="14" x2="14" y1="2" y2="4"/>
              </svg>
              <!-- Restock: checkmark -->
              <svg v-else
                width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="text-success-500 dark:text-success-400">
                <path d="M20 6 9 17l-5-5"/>
              </svg>

              <!-- Unread pulse dot -->
              <span v-if="!n.read"
                class="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-[1.5px] border-white dark:border-gray-900 bg-orange-400">
              </span>
            </span>

            <span class="block">
              <span class="mb-1.5 block text-theme-sm text-gray-500 dark:text-gray-400">
                <span class="font-medium text-gray-800 dark:text-white/90">{{ n.title }}</span>
                <br/>{{ n.body }}
              </span>
              <span class="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                <span>{{ n.category }}</span>
                <span class="w-1 h-1 bg-gray-400 rounded-full"></span>
                <span>{{ n.time }}</span>
              </span>
            </span>
          </a>
        </li>
      </ul>

      <!-- Footer — same style as original -->
      <router-link
        to="/inventory"
        class="mt-3 flex justify-center rounded-lg border border-gray-300 bg-white p-3 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
        @click="closeDropdown"
      >
        View Inventory for stock details
      </router-link>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const dropdownOpen = ref(false)
const dropdownRef = ref(null)

// ─── Notifications ────────────────────────────────────────────────────────────
// Mock data — when Laravel is ready, replace with:
// onMounted(async () => { notifications.value = await axios.get('/api/notifications') })

const notifications = ref([
  {
    id: 1,
    type: 'critical',
    title: 'Critical: Brown Sugar Syrup',
    body: 'Only 1 liter left — threshold is 3L',
    category: 'Inventory',
    time: 'Just now',
    read: false,
    route: '/inventory',
  },
  {
    id: 2,
    type: 'critical',
    title: 'Critical: 16oz Cups',
    body: 'Only 2 packs left — threshold is 5 packs',
    category: 'Inventory',
    time: '5 min ago',
    read: false,
    route: '/inventory',
  },
  {
    id: 3,
    type: 'low',
    title: 'Low Stock: Tapioca Pearls',
    body: '8 packs remaining — restock threshold is 10',
    category: 'Inventory',
    time: '10 min ago',
    read: false,
    route: '/inventory',
  },
  {
    id: 4,
    type: 'low',
    title: 'Low Stock: Matcha Powder',
    body: '3 kg remaining — restock threshold is 5 kg',
    category: 'Inventory',
    time: '10 min ago',
    read: false,
    route: '/inventory',
  },
  {
    id: 5,
    type: 'order',
    title: 'New order added',
    body: 'Brown Sugar Milk Tea × 3 — ₱130.00',
    category: 'Orders',
    time: '9:33 AM',
    read: true,
    route: '/',
  },
  {
    id: 6,
    type: 'order',
    title: 'New order added',
    body: 'Taro Milk Tea × 2 — ₱120.00',
    category: 'Orders',
    time: '8:45 AM',
    read: true,
    route: '/',
  },
  {
    id: 7,
    type: 'restock',
    title: 'Batch restock completed',
    body: '4 items restocked via routine supply run',
    category: 'Inventory',
    time: 'Yesterday',
    read: true,
    route: '/inventory',
  },
])

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const markAllRead = () => {
  notifications.value = notifications.value.map(n => ({ ...n, read: true }))
}

const handleItemClick = (n) => {
  notifications.value = notifications.value.map(item =>
    item.id === n.id ? { ...item, read: true } : item
  )
  closeDropdown()
  router.push(n.route)
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown()
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>