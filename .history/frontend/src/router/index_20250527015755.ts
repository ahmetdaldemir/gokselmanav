import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/product/:id',
      name: 'product-detail',
      component: () => import('../views/ProductDetailView.vue')
    },
    {
      path: '/corporate',
      name: 'corporate',
      component: () => import('../views/CorporateView.vue')
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue')
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('../views/AccountView.vue')
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/OrdersView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/views/admin/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: () => import('@/views/admin/DashboardView.vue')
        },
        {
          path: 'products',
          name: 'admin-products',
          component: () => import('@/views/admin/ProductsView.vue')
        },
        {
          path: 'customers',
          name: 'admin-customers',
          component: () => import('@/views/admin/CustomersView.vue')
        },
        {
          path: 'orders',
          name: 'admin-orders',
          component: () => import('../views/OrdersView.vue')
        },
        {
          path: 'settings',
          name: 'admin-settings',
          component: () => import('@/views/admin/SettingsView.vue')
        }
      ]
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/RegisterView.vue')
    }
  ]
})

// router.beforeEach((to, from, next) => {
//   const authStore = useAuthStore()
  
//   // Initialize auth state
//   authStore.initAuth()

//   // Check if route requires authentication
//   if (to.meta.requiresAuth) {
//     if (!authStore.isAuthenticated) {
//       // Redirect to login if not authenticated
//       next({ name: 'admin-login' })
//       return
//     }

//     // Check if route requires admin role
//     if (to.meta.requiresAdmin && authStore.user?.role !== 'admin') {
//       // Redirect to home if not admin
//       next({ name: 'home' })
//       return
//     }
//   }

//   // If user is authenticated and trying to access login page
//   if (authStore.isAuthenticated && to.name === 'admin-login') {
//     // Redirect to dashboard
//     next({ name: 'admin-dashboard' })
//     return
//   }

//   next()
// })

export default router 