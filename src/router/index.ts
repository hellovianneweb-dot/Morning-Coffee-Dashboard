import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'OrderTracking',
    component: () => import('../views/MorningCoffee/OrderTracking.vue'),
    meta: { title: 'Order Tracking' },
  },

  {
    path: '/inventory',
    name: 'InventoryOverview',
    component: () => import('../views/MorningCoffee/InventoryOverview.vue'),
    meta: { title: 'Inventory Overview' },
  },

  {
    path: '/suppliers',
    name: 'SupplierList',
    component: () => import('../views/MorningCoffee/SupplierList.vue'),
    meta: { title: 'Supplier List' },
  },

  {
    path: '/reports',
    name: 'ReportSummary',
    component: () => import('../views/MorningCoffee/ReportSummary.vue'),
    meta: { title: 'Report Summary' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },

  routes,
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | Morning Coffee & Tea Admin`
  next()
})

export default router