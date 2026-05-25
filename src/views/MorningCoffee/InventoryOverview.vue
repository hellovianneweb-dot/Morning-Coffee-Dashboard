<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="'Inventory Overview'" />

    <!-- ── Summary Cards ───────────────────────────────────────────── -->
    <div class="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-3">
      <div class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5">
        <p class="text-theme-xs text-gray-500 dark:text-gray-400 mb-1">Total Items Tracked</p>
        <p class="text-title-sm font-bold text-gray-800 dark:text-white/90">{{ inventory.length }}</p>
      </div>
      <div class="rounded-xl border border-warning-200 bg-warning-50 dark:border-warning-500/30 dark:bg-warning-500/10 p-5">
        <p class="text-theme-xs text-warning-700 dark:text-warning-400 mb-1">Low Stock</p>
        <p class="text-title-sm font-bold text-warning-700 dark:text-warning-400">{{ lowCount }}</p>
      </div>
      <div class="rounded-xl border border-error-200 bg-error-50 dark:border-error-500/30 dark:bg-error-500/10 p-5">
        <p class="text-theme-xs text-error-700 dark:text-error-400 mb-1">Critical Stock</p>
        <p class="text-title-sm font-bold text-error-700 dark:text-error-400">{{ criticalCount }}</p>
      </div>
    </div>

    <!-- ── Add Item Form ───────────────────────────────────────────── -->
    <div class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5 mb-6">
      <h3 class="text-theme-sm font-semibold text-gray-800 dark:text-white/90 mb-4">
        {{ editingId ? 'Edit Item' : 'Add New Item' }}
      </h3>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <div>
          <label class="block text-theme-xs text-gray-500 dark:text-gray-400 mb-1">Item Name</label>
          <input v-model="form.name" type="text" placeholder="e.g. Tapioca Pearls"
            class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2 text-theme-sm text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
        </div>
        <div>
          <label class="block text-theme-xs text-gray-500 dark:text-gray-400 mb-1">Category</label>
          <select v-model="form.category"
            class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-theme-sm text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500">
            <option value="">Select</option>
            <option>Cups</option>
            <option>Ingredients</option>
            <option>Packaging</option>
          </select>
        </div>
        <div>
          <label class="block text-theme-xs text-gray-500 dark:text-gray-400 mb-1">Quantity</label>
          <input v-model.number="form.quantity" type="number" min="0" placeholder="0"
            class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2 text-theme-sm text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
        </div>
        <div>
          <label class="block text-theme-xs text-gray-500 dark:text-gray-400 mb-1">Unit</label>
          <input v-model="form.unit" type="text" placeholder="packs / kg / liters"
            class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2 text-theme-sm text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
        </div>
        <div>
          <label class="block text-theme-xs text-gray-500 dark:text-gray-400 mb-1">Restock Threshold</label>
          <input v-model.number="form.threshold" type="number" min="0" placeholder="0"
            class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2 text-theme-sm text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
        </div>
      </div>
      <div class="mt-4 flex gap-2">
        <button @click="saveItem"
          class="rounded-lg bg-brand-500 px-4 py-2 text-theme-sm font-medium text-white hover:bg-brand-600 transition-colors">
          {{ editingId ? 'Update Item' : 'Add Item' }}
        </button>
        <button v-if="editingId" @click="cancelEdit"
          class="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-theme-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
          Cancel
        </button>
      </div>
    </div>

    <!-- ── Inventory Table ─────────────────────────────────────────── -->
    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div class="max-w-full overflow-x-auto custom-scrollbar">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th v-for="col in columns" :key="col" class="px-5 py-3 text-left sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ col }}</p>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="inventory.length === 0">
              <td :colspan="columns.length" class="px-5 py-8 text-center text-theme-sm text-gray-400">No items found.</td>
            </tr>
            <tr v-for="item in inventory" :key="item.id"
              class="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
              <td class="px-5 py-4 sm:px-6">
                <span class="text-theme-sm font-medium text-gray-500 dark:text-gray-400">#{{ item.id }}</span>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <span class="text-theme-sm font-medium text-gray-800 dark:text-white/90">{{ item.name }}</span>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <span class="text-theme-sm text-gray-500 dark:text-gray-400">{{ item.category }}</span>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <span class="text-theme-sm font-medium text-gray-800 dark:text-white/90">{{ item.quantity }}</span>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <span class="text-theme-sm text-gray-500 dark:text-gray-400">{{ item.unit }}</span>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <span :class="[
                  'rounded-full px-2 py-0.5 text-theme-xs font-medium',
                  getStatus(item) === 'OK'
                    ? 'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-500'
                    : getStatus(item) === 'Low'
                    ? 'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400'
                    : 'bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-500'
                ]">{{ getStatus(item) }}</span>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <div class="flex gap-2">
                  <button @click="editItem(item)"
                    class="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-theme-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    Edit
                  </button>
                  <button @click="deleteItem(item.id)"
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

const editingId = ref(null)
const form = ref({ name: '', category: '', quantity: 0, unit: '', threshold: 0 })
const columns = ['Item ID', 'Item Name', 'Category', 'Qty', 'Unit', 'Status', 'Actions']

const inventory = ref([
  { id: 1, name: 'Tapioca Pearls', category: 'Ingredients', quantity: 8, unit: 'packs', threshold: 10 },
  { id: 2, name: 'Matcha Powder', category: 'Ingredients', quantity: 3, unit: 'kg', threshold: 5 },
  { id: 3, name: 'Whole Milk', category: 'Ingredients', quantity: 15, unit: 'liters', threshold: 10 },
  { id: 4, name: '16oz Cups', category: 'Cups', quantity: 2, unit: 'packs', threshold: 5 },
  { id: 5, name: 'Plastic Lids', category: 'Packaging', quantity: 50, unit: 'pcs', threshold: 20 },
  { id: 6, name: 'Brown Sugar Syrup', category: 'Ingredients', quantity: 1, unit: 'liters', threshold: 3 },
  { id: 7, name: 'Kraft Paper Bags', category: 'Packaging', quantity: 30, unit: 'pcs', threshold: 20 },
])

let nextId = 8

const getStatus = (item) => {
  if (item.quantity === 0 || item.quantity < item.threshold * 0.4) return 'Critical'
  if (item.quantity < item.threshold) return 'Low'
  return 'OK'
}

const lowCount = computed(() => inventory.value.filter(i => getStatus(i) === 'Low').length)
const criticalCount = computed(() => inventory.value.filter(i => getStatus(i) === 'Critical').length)

function saveItem() {
  if (!form.value.name || !form.value.category) return
  if (editingId.value) {
    const idx = inventory.value.findIndex(i => i.id === editingId.value)
    if (idx !== -1) inventory.value[idx] = { ...form.value, id: editingId.value }
    editingId.value = null
  } else {
    inventory.value.push({ ...form.value, id: nextId++ })
  }
  form.value = { name: '', category: '', quantity: 0, unit: '', threshold: 0 }
}

function editItem(item) {
  editingId.value = item.id
  form.value = { name: item.name, category: item.category, quantity: item.quantity, unit: item.unit, threshold: item.threshold }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function cancelEdit() {
  editingId.value = null
  form.value = { name: '', category: '', quantity: 0, unit: '', threshold: 0 }
}

function deleteItem(id) {
  inventory.value = inventory.value.filter(i => i.id !== id)
}
</script>