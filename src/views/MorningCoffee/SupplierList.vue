<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="'Supplier List'" />

    <!-- ── Add Supplier Form ───────────────────────────────────────── -->
    <div class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5 mb-6">
      <h3 class="text-theme-sm font-semibold text-gray-800 dark:text-white/90 mb-4">
        {{ editingId ? 'Edit Supplier' : 'Add New Supplier' }}
      </h3>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div>
          <label class="block text-theme-xs text-gray-500 dark:text-gray-400 mb-1">Supplier Name</label>
          <input v-model="form.name" type="text" placeholder="Supplier name"
            class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2 text-theme-sm text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
        </div>
        <div>
          <label class="block text-theme-xs text-gray-500 dark:text-gray-400 mb-1">Item Supplied</label>
          <input v-model="form.item" type="text" placeholder="e.g. Tapioca Pearls"
            class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2 text-theme-sm text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
        </div>
        <div>
          <label class="block text-theme-xs text-gray-500 dark:text-gray-400 mb-1">Delivery Schedule</label>
          <input v-model="form.schedule" type="text" placeholder="e.g. Every 2 days"
            class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2 text-theme-sm text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
        </div>
        <div>
          <label class="block text-theme-xs text-gray-500 dark:text-gray-400 mb-1">Contact Number</label>
          <input v-model="form.contact" type="text" placeholder="09xx-xxx-xxxx"
            class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2 text-theme-sm text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
        </div>
        <div>
          <label class="block text-theme-xs text-gray-500 dark:text-gray-400 mb-1">Platform</label>
          <input v-model="form.platform" type="text" placeholder="Shopee / Pickup / etc."
            class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2 text-theme-sm text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
        </div>
        <div>
          <label class="block text-theme-xs text-gray-500 dark:text-gray-400 mb-1">Notes</label>
          <input v-model="form.notes" type="text" placeholder="Special instructions"
            class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2 text-theme-sm text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
        </div>
      </div>
      <div class="mt-4 flex gap-2">
        <button @click="saveSupplier"
          class="rounded-lg bg-brand-500 px-4 py-2 text-theme-sm font-medium text-white hover:bg-brand-600 transition-colors">
          {{ editingId ? 'Update Supplier' : 'Add Supplier' }}
        </button>
        <button v-if="editingId" @click="cancelEdit"
          class="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-theme-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
          Cancel
        </button>
      </div>
    </div>

    <!-- ── Suppliers Table ─────────────────────────────────────────── -->
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
            <tr v-if="suppliers.length === 0">
              <td :colspan="columns.length" class="px-5 py-8 text-center text-theme-sm text-gray-400">No suppliers yet.</td>
            </tr>
            <tr v-for="s in suppliers" :key="s.id"
              class="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
              <td class="px-5 py-4 sm:px-6">
                <span class="text-theme-sm font-medium text-gray-500 dark:text-gray-400">#{{ s.id }}</span>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <span class="text-theme-sm font-medium text-gray-800 dark:text-white/90">{{ s.name }}</span>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <span class="text-theme-sm text-gray-500 dark:text-gray-400">{{ s.item }}</span>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <span class="text-theme-sm text-gray-500 dark:text-gray-400">{{ s.schedule }}</span>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <span class="text-theme-sm text-gray-500 dark:text-gray-400">{{ s.contact }}</span>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <span class="rounded-full bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400 px-2 py-0.5 text-theme-xs font-medium">
                  {{ s.platform }}
                </span>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <span class="text-theme-sm text-gray-500 dark:text-gray-400">{{ s.lastDelivery || '—' }}</span>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <span class="text-theme-sm text-gray-500 dark:text-gray-400">{{ s.notes || '—' }}</span>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <div class="flex gap-2">
                  <button @click="editSupplier(s)"
                    class="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-theme-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    Edit
                  </button>
                  <button @click="deleteSupplier(s.id)"
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
import { ref } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'

const editingId = ref(null)
const columns = ['ID', 'Supplier', 'Item Supplied', 'Schedule', 'Contact', 'Platform', 'Last Delivery', 'Notes', 'Actions']

const form = ref({ name: '', item: '', schedule: '', contact: '', platform: '', notes: '' })

const suppliers = ref([
  { id: 1, name: 'Bubble Tea PH', item: 'Tapioca Pearls', schedule: 'Every 2 days', contact: '0917-123-4567', platform: 'Shopee', lastDelivery: '2025-05-23', notes: 'Message before ordering' },
  { id: 2, name: 'Matcha Masters', item: 'Matcha Powder', schedule: 'Weekly', contact: '0918-765-4321', platform: 'Pickup', lastDelivery: '2025-05-20', notes: 'Pick up at Cubao branch' },
  { id: 3, name: 'Dairy Fresh PH', item: 'Whole Milk', schedule: 'Every 3 days', contact: '0919-222-3333', platform: 'Delivery', lastDelivery: '2025-05-24', notes: '' },
  { id: 4, name: 'Pack & Go Supplies', item: 'Cups, Lids, Bags', schedule: 'Bi-weekly', contact: '0912-444-5555', platform: 'Lazada', lastDelivery: '2025-05-15', notes: 'Min order ₱500' },
])

let nextId = 5

function saveSupplier() {
  if (!form.value.name || !form.value.item) return
  if (editingId.value) {
    const idx = suppliers.value.findIndex(s => s.id === editingId.value)
    if (idx !== -1) suppliers.value[idx] = { ...suppliers.value[idx], ...form.value }
    editingId.value = null
  } else {
    suppliers.value.push({ ...form.value, id: nextId++, lastDelivery: '' })
  }
  form.value = { name: '', item: '', schedule: '', contact: '', platform: '', notes: '' }
}

function editSupplier(s) {
  editingId.value = s.id
  form.value = { name: s.name, item: s.item, schedule: s.schedule, contact: s.contact, platform: s.platform, notes: s.notes }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function cancelEdit() {
  editingId.value = null
  form.value = { name: '', item: '', schedule: '', contact: '', platform: '', notes: '' }
}

function deleteSupplier(id) {
  suppliers.value = suppliers.value.filter(s => s.id !== id)
}
</script>