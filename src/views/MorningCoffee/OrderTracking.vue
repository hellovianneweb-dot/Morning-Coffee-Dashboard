<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="'Order Tracking'" />

    <!-- ── Daily Cup Counter ───────────────────────────────────────── -->
    <div class="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-3">
      <div class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5">
        <p class="text-theme-xs text-gray-500 dark:text-gray-400 mb-1">Total Cups Today</p>
        <p class="text-title-sm font-bold text-gray-800 dark:text-white/90">{{ totalCupsToday }}</p>
      </div>
      <div class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5">
        <p class="text-theme-xs text-gray-500 dark:text-gray-400 mb-1">Total Orders Today</p>
        <p class="text-title-sm font-bold text-gray-800 dark:text-white/90">{{ filteredOrders.length }}</p>
      </div>
      <div class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5">
        <p class="text-theme-xs text-gray-500 dark:text-gray-400 mb-1">Total Revenue Today</p>
        <p class="text-title-sm font-bold text-gray-800 dark:text-white/90">₱{{ totalRevenueToday.toFixed(2) }}</p>
      </div>
    </div>

    <!-- ── Add Order Form ──────────────────────────────────────────── -->
    <div class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5 mb-6">
      <h3 class="text-theme-sm font-semibold text-gray-800 dark:text-white/90 mb-4">Add New Order</h3>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div>
          <label class="block text-theme-xs text-gray-500 dark:text-gray-400 mb-1">Drink Name</label>
          <input v-model="form.drinkName" type="text" placeholder="e.g. Matcha Latte"
            class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2 text-theme-sm text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
        </div>
        <div>
          <label class="block text-theme-xs text-gray-500 dark:text-gray-400 mb-1">Size</label>
          <select v-model="form.size"
            class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-theme-sm text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500">
            <option value="">Select</option>
            <option>Small</option>
            <option>Medium</option>
            <option>Large</option>
          </select>
        </div>
        <div>
          <label class="block text-theme-xs text-gray-500 dark:text-gray-400 mb-1">Temperature</label>
          <select v-model="form.temperature"
            class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-theme-sm text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500">
            <option value="">Select</option>
            <option>Hot</option>
            <option>Cold</option>
          </select>
        </div>
        <div>
          <label class="block text-theme-xs text-gray-500 dark:text-gray-400 mb-1">Add-ons</label>
          <input v-model="form.addOns" type="text" placeholder="e.g. Pearl"
            class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2 text-theme-sm text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
        </div>
        <div>
          <label class="block text-theme-xs text-gray-500 dark:text-gray-400 mb-1">Qty</label>
          <input v-model.number="form.quantity" type="number" min="1" placeholder="1"
            class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2 text-theme-sm text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
        </div>
        <div>
          <label class="block text-theme-xs text-gray-500 dark:text-gray-400 mb-1">Price (₱)</label>
          <input v-model.number="form.price" type="number" min="0" step="0.01" placeholder="0.00"
            class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2 text-theme-sm text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
        </div>
      </div>
      <div class="mt-4 flex gap-2">
        <button @click="saveOrder"
          class="rounded-lg bg-brand-500 px-4 py-2 text-theme-sm font-medium text-white hover:bg-brand-600 transition-colors">
          {{ editingId ? 'Update Order' : 'Add Order' }}
        </button>
        <button v-if="editingId" @click="cancelEdit"
          class="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-theme-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
          Cancel
        </button>
      </div>
    </div>

    <!-- ── Filters ─────────────────────────────────────────────────── -->
    <div class="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
      <input v-model="searchQuery" type="text" placeholder="Search orders..."
        class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-theme-sm text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 w-full sm:w-64" />
      <input v-model="filterDate" type="date"
        class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-theme-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
    </div>

    <!-- ── Orders Table ────────────────────────────────────────────── -->
    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div class="max-w-full overflow-x-auto custom-scrollbar">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th v-for="col in columns" :key="col"
                class="px-5 py-3 text-left sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ col }}</p>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="filteredOrders.length === 0">
              <td :colspan="columns.length" class="px-5 py-8 text-center text-theme-sm text-gray-400 dark:text-gray-500">
                No orders found.
              </td>
            </tr>
            <tr v-for="order in filteredOrders" :key="order.id"
              class="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
              <td class="px-5 py-4 sm:px-6">
                <span class="text-theme-sm font-medium text-gray-500 dark:text-gray-400">#{{ order.id }}</span>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <span class="text-theme-sm font-medium text-gray-800 dark:text-white/90">{{ order.drinkName }}</span>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <span class="text-theme-sm text-gray-500 dark:text-gray-400">{{ order.size }}</span>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <span :class="[
                  'rounded-full px-2 py-0.5 text-theme-xs font-medium',
                  order.temperature === 'Hot'
                    ? 'bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400'
                    : 'bg-blue-light-50 text-blue-light-700 dark:bg-blue-light-500/15 dark:text-blue-light-400'
                ]">{{ order.temperature }}</span>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <span class="text-theme-sm text-gray-500 dark:text-gray-400">{{ order.addOns || '—' }}</span>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <span class="text-theme-sm text-gray-500 dark:text-gray-400">{{ order.quantity }}</span>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <span class="text-theme-sm font-medium text-gray-800 dark:text-white/90">₱{{ order.price.toFixed(2) }}</span>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <span class="text-theme-sm text-gray-500 dark:text-gray-400">{{ order.dateTime }}</span>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <div class="flex gap-2">
                  <button @click="editOrder(order)"
                    class="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-theme-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    Edit
                  </button>
                  <button @click="deleteOrder(order.id)"
                    class="rounded-lg border border-error-200 dark:border-error-500/30 px-3 py-1.5 text-theme-xs font-medium text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'

const searchQuery = ref('')
const filterDate = ref('')
const editingId = ref(null)

const form = ref({ drinkName: '', size: '', temperature: '', addOns: '', quantity: 1, price: 0 })

const columns = ['Order ID', 'Drink', 'Size', 'Temp', 'Add-ons', 'Qty', 'Price', 'Date & Time', 'Actions']

const orders = ref([
  { id: 1, drinkName: 'Matcha Latte', size: 'Medium', temperature: 'Hot', addOns: 'Pearl', quantity: 1, price: 95, dateTime: '2025-05-25 08:12' },
  { id: 2, drinkName: 'Taro Milk Tea', size: 'Large', temperature: 'Cold', addOns: 'Pearl, Pudding', quantity: 2, price: 120, dateTime: '2025-05-25 08:45' },
  { id: 3, drinkName: 'Americano', size: 'Small', temperature: 'Hot', addOns: '', quantity: 1, price: 75, dateTime: '2025-05-25 09:10' },
  { id: 4, drinkName: 'Brown Sugar Milk Tea', size: 'Large', temperature: 'Cold', addOns: 'Pearl', quantity: 3, price: 130, dateTime: '2025-05-25 09:33' },
  { id: 5, drinkName: 'Jasmine Green Tea', size: 'Medium', temperature: 'Cold', addOns: '', quantity: 1, price: 80, dateTime: '2025-05-25 10:05' },
])

let nextId = 6

const filteredOrders = computed(() => {
  return orders.value.filter(o => {
    const matchSearch = !searchQuery.value ||
      o.drinkName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      String(o.id).includes(searchQuery.value)
    const matchDate = !filterDate.value || o.dateTime.startsWith(filterDate.value)
    return matchSearch && matchDate
  })
})

const totalCupsToday = computed(() =>
  filteredOrders.value.reduce((sum, o) => sum + o.quantity, 0)
)
const totalRevenueToday = computed(() =>
  filteredOrders.value.reduce((sum, o) => sum + o.price, 0)
)

function saveOrder() {
  if (!form.value.drinkName || !form.value.size || !form.value.temperature) return
  if (editingId.value) {
    const idx = orders.value.findIndex(o => o.id === editingId.value)
    if (idx !== -1) orders.value[idx] = { ...form.value, id: editingId.value, dateTime: orders.value[idx].dateTime }
    editingId.value = null
  } else {
    const now = new Date()
    const dateTime = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
    orders.value.push({ ...form.value, id: nextId++, dateTime })
  }
  form.value = { drinkName: '', size: '', temperature: '', addOns: '', quantity: 1, price: 0 }
}

function editOrder(order) {
  editingId.value = order.id
  form.value = { drinkName: order.drinkName, size: order.size, temperature: order.temperature, addOns: order.addOns, quantity: order.quantity, price: order.price }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function cancelEdit() {
  editingId.value = null
  form.value = { drinkName: '', size: '', temperature: '', addOns: '', quantity: 1, price: 0 }
}

function deleteOrder(id) {
  orders.value = orders.value.filter(o => o.id !== id)
}
</script>