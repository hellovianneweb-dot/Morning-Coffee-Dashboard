<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="'Report Summary'" />

    <!-- ── Date Filter + Batch Update ─────────────────────────────── -->
    <div class="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-3">
        <label class="text-theme-sm font-medium text-gray-700 dark:text-gray-300">View Date:</label>
        <input v-model="reportDate" type="date"
          class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-theme-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
      </div>
      <button @click="runBatchRestock"
        class="rounded-lg bg-success-500 px-4 py-2 text-theme-sm font-medium text-white hover:bg-success-600 transition-colors self-start sm:self-auto">
        Batch Restock (Routine Supply Run)
      </button>
    </div>

    <div v-if="batchMessage" class="mb-4 rounded-lg border border-success-200 bg-success-50 dark:border-success-500/30 dark:bg-success-500/10 px-4 py-3">
      <p class="text-theme-sm text-success-700 dark:text-success-400">{{ batchMessage }}</p>
    </div>

    <!-- ── Daily Sales Summary ─────────────────────────────────────── -->
    <div class="mb-6">
      <h3 class="text-theme-sm font-semibold text-gray-800 dark:text-white/90 mb-3">Daily Sales Summary</h3>
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Total Cups Sold" :value="String(dailyStats.totalCups)" />
        <StatCard label="Total Revenue" :value="'₱' + dailyStats.totalRevenue.toFixed(2)" />
        <StatCard label="Total Orders" :value="String(dailyStats.totalOrders)" />
        <StatCard label="Discounted (Sr/PWD)" :value="String(dailyStats.discountedCount)" />
        <StatCard label="Total Discounted" :value="'₱' + dailyStats.totalDiscount.toFixed(2)" />
      </div>
    </div>

    <!-- ── Order Summary ───────────────────────────────────────────── -->
    <div class="mb-6">
      <h3 class="text-theme-sm font-semibold text-gray-800 dark:text-white/90 mb-3">Order Summary</h3>
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Most Ordered Drink" :value="orderSummary.topDrink" />
        <StatCard label="Most Popular Size" :value="orderSummary.topSize" />
        <StatCard label="Most Popular Temp" :value="orderSummary.topTemp" />
        <StatCard label="Most Popular Add-on" :value="orderSummary.topAddOn" />
      </div>
    </div>

    <!-- ── Inventory Report ────────────────────────────────────────── -->
    <div class="mb-6">
      <h3 class="text-theme-sm font-semibold text-gray-800 dark:text-white/90 mb-3">Inventory Report</h3>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-4">
        <StatCard label="Total Items Tracked" :value="String(inventoryReport.total)" />
        <StatCard label="Low Stock Items" :value="String(inventoryReport.lowCount)" variant="warning" />
        <StatCard label="Critical Items" :value="String(inventoryReport.criticalCount)" variant="error" />
      </div>
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="max-w-full overflow-x-auto custom-scrollbar">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th v-for="col in ['Item', 'Category', 'Qty', 'Unit', 'Status']" :key="col" class="px-5 py-3 text-left sm:px-6">
                  <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ col }}</p>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="alertItems.length === 0">
                <td colspan="5" class="px-5 py-6 text-center text-theme-sm text-gray-400">All items are sufficiently stocked.</td>
              </tr>
              <tr v-for="item in alertItems" :key="item.id"
                class="border-t border-gray-100 dark:border-gray-800">
                <td class="px-5 py-4 sm:px-6">
                  <span class="text-theme-sm font-medium text-gray-800 dark:text-white/90">{{ item.name }}</span>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <span class="text-theme-sm text-gray-500 dark:text-gray-400">{{ item.category }}</span>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <span class="text-theme-sm text-gray-500 dark:text-gray-400">{{ item.quantity }}</span>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <span class="text-theme-sm text-gray-500 dark:text-gray-400">{{ item.unit }}</span>
                </td>
                <td class="px-5 py-4 sm:px-6">
                  <span :class="[
                    'rounded-full px-2 py-0.5 text-theme-xs font-medium',
                    item.status === 'Low'
                      ? 'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400'
                      : 'bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-500'
                  ]">{{ item.status }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ── Weekly Summary ─────────────────────────────────────────── -->
    <div class="mb-6">
      <h3 class="text-theme-sm font-semibold text-gray-800 dark:text-white/90 mb-3">Weekly Summary</h3>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Cups This Week" :value="String(weeklyStats.cups)" />
        <StatCard label="Total Revenue This Week" :value="'₱' + weeklyStats.revenue.toFixed(2)" />
        <StatCard label="Most Ordered (Week)" :value="weeklyStats.topDrink" />
      </div>
    </div>

    <!-- Read-only notice -->
    <p class="text-theme-xs text-gray-400 dark:text-gray-500 text-center mt-2">
      This screen is read-only. Data is pulled from Orders and Inventory.
    </p>
  </AdminLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'

// ── Inline StatCard sub-component ─────────────────────────────────────────
const StatCard = {
  props: { label: String, value: String, variant: { type: String, default: 'default' } },
  template: `
    <div :class="[
      'rounded-xl border p-5',
      variant === 'warning' ? 'border-warning-200 bg-warning-50 dark:border-warning-500/30 dark:bg-warning-500/10' :
      variant === 'error'   ? 'border-error-200 bg-error-50 dark:border-error-500/30 dark:bg-error-500/10' :
      'border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]'
    ]">
      <p :class="['text-theme-xs mb-1',
        variant === 'warning' ? 'text-warning-700 dark:text-warning-400' :
        variant === 'error'   ? 'text-error-700 dark:text-error-400' :
        'text-gray-500 dark:text-gray-400'
      ]">{{ label }}</p>
      <p :class="['text-title-sm font-bold',
        variant === 'warning' ? 'text-warning-700 dark:text-warning-400' :
        variant === 'error'   ? 'text-error-700 dark:text-error-400' :
        'text-gray-800 dark:text-white/90'
      ]">{{ value }}</p>
    </div>
  `
}

// ── Mock data (same shape as what will come from Laravel) ──────────────────
const reportDate = ref('2025-05-25')
const batchMessage = ref('')

// Mock daily orders
const mockOrders = [
  { drinkName: 'Matcha Latte', size: 'Medium', temperature: 'Hot', addOns: 'Pearl', quantity: 1, price: 95, date: '2025-05-25', discounted: false },
  { drinkName: 'Taro Milk Tea', size: 'Large', temperature: 'Cold', addOns: 'Pearl', quantity: 2, price: 120, date: '2025-05-25', discounted: true },
  { drinkName: 'Americano', size: 'Small', temperature: 'Hot', addOns: '', quantity: 1, price: 75, date: '2025-05-25', discounted: false },
  { drinkName: 'Brown Sugar Milk Tea', size: 'Large', temperature: 'Cold', addOns: 'Pearl', quantity: 3, price: 130, date: '2025-05-25', discounted: false },
  { drinkName: 'Matcha Latte', size: 'Large', temperature: 'Hot', addOns: 'Pearl', quantity: 2, price: 110, date: '2025-05-25', discounted: true },
  { drinkName: 'Jasmine Green Tea', size: 'Medium', temperature: 'Cold', addOns: '', quantity: 1, price: 80, date: '2025-05-24', discounted: false },
  { drinkName: 'Matcha Latte', size: 'Medium', temperature: 'Hot', addOns: '', quantity: 3, price: 95, date: '2025-05-24', discounted: false },
  { drinkName: 'Taro Milk Tea', size: 'Small', temperature: 'Cold', addOns: 'Pudding', quantity: 1, price: 90, date: '2025-05-23', discounted: false },
]

// Mock inventory
const mockInventory = ref([
  { id: 1, name: 'Tapioca Pearls', category: 'Ingredients', quantity: 8, unit: 'packs', threshold: 10 },
  { id: 2, name: 'Matcha Powder', category: 'Ingredients', quantity: 3, unit: 'kg', threshold: 5 },
  { id: 3, name: 'Whole Milk', category: 'Ingredients', quantity: 15, unit: 'liters', threshold: 10 },
  { id: 4, name: '16oz Cups', category: 'Cups', quantity: 2, unit: 'packs', threshold: 5 },
  { id: 5, name: 'Plastic Lids', category: 'Packaging', quantity: 50, unit: 'pcs', threshold: 20 },
  { id: 6, name: 'Brown Sugar Syrup', category: 'Ingredients', quantity: 1, unit: 'liters', threshold: 3 },
])

const getStatus = (item) => {
  if (item.quantity === 0 || item.quantity < item.threshold * 0.4) return 'Critical'
  if (item.quantity < item.threshold) return 'Low'
  return 'OK'
}

// ── Computed: daily stats ──────────────────────────────────────────────────
const todayOrders = computed(() => mockOrders.filter(o => o.date === reportDate.value))

const dailyStats = computed(() => ({
  totalCups: todayOrders.value.reduce((s, o) => s + o.quantity, 0),
  totalRevenue: todayOrders.value.reduce((s, o) => s + o.price, 0),
  totalOrders: todayOrders.value.length,
  discountedCount: todayOrders.value.filter(o => o.discounted).length,
  totalDiscount: todayOrders.value.filter(o => o.discounted).reduce((s, o) => s + o.price * 0.2, 0),
}))

// ── Computed: order summary ────────────────────────────────────────────────
const orderSummary = computed(() => {
  const orders = todayOrders.value
  if (!orders.length) return { topDrink: '—', topSize: '—', topTemp: '—', topAddOn: '—' }
  const count = (arr, key) => {
    const tally = {}
    arr.forEach(o => { tally[o[key]] = (tally[o[key]] || 0) + o.quantity })
    return Object.entries(tally).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'
  }
  const topAddOnRaw = orders.flatMap(o => o.addOns ? o.addOns.split(',').map(a => a.trim()) : [])
  const addOnTally = {}
  topAddOnRaw.forEach(a => { addOnTally[a] = (addOnTally[a] || 0) + 1 })
  const topAddOn = Object.entries(addOnTally).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'
  return { topDrink: count(orders, 'drinkName'), topSize: count(orders, 'size'), topTemp: count(orders, 'temperature'), topAddOn }
})

// ── Computed: inventory report ─────────────────────────────────────────────
const alertItems = computed(() =>
  mockInventory.value
    .map(i => ({ ...i, status: getStatus(i) }))
    .filter(i => i.status !== 'OK')
)

const inventoryReport = computed(() => ({
  total: mockInventory.value.length,
  lowCount: mockInventory.value.filter(i => getStatus(i) === 'Low').length,
  criticalCount: mockInventory.value.filter(i => getStatus(i) === 'Critical').length,
}))

// ── Computed: weekly summary ───────────────────────────────────────────────
const weeklyStats = computed(() => {
  const tally = {}
  mockOrders.forEach(o => { tally[o.drinkName] = (tally[o.drinkName] || 0) + o.quantity })
  const topDrink = Object.entries(tally).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'
  return {
    cups: mockOrders.reduce((s, o) => s + o.quantity, 0),
    revenue: mockOrders.reduce((s, o) => s + o.price, 0),
    topDrink,
  }
})

// ── Batch restock ──────────────────────────────────────────────────────────
function runBatchRestock() {
  let restocked = 0
  mockInventory.value = mockInventory.value.map(item => {
    if (getStatus(item) !== 'OK') {
      restocked++
      return { ...item, quantity: item.threshold * 2 }
    }
    return item
  })
  batchMessage.value = restocked > 0
    ? `Batch restock complete — ${restocked} item(s) restocked to 2× their threshold.`
    : 'All items are already sufficiently stocked.'
  setTimeout(() => { batchMessage.value = '' }, 5000)
}
</script>