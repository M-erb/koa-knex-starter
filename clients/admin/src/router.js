import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layout/AppLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_ADMIN_BASE_PATH || '/'),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '/',
          name: 'dashboard',
          component: () => import('@/views/Dashboard.vue')
        },
        {
          path: '/analytics',
          name: 'analytics',
          component: () => import('@/views/pages/Analytics.vue')
        },
        {
          path: '/forms',
          name: 'forms',
          component: () => import('@/views/pages/Forms.vue')
        }
      ]
    },

    {
      path: '/auth/login',
      name: 'login',
      component: () => import('@/views/pages/auth/Login.vue')
    }, {
      path: '/auth/access',
      name: 'accessDenied',
      component: () => import('@/views/pages/auth/Access.vue')
    }, {
      path: '/auth/error',
      name: 'error',
      component: () => import('@/views/pages/auth/Error.vue')
    },

    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/pages/NotFound.vue')
    }
  ]
})

// TODO: add authenticated cache
const isAuthenticated = true

router.beforeEach(async to => {
  // make sure the user is authenticated
  // Avoid an infinite redirect
  if (!isAuthenticated && to.name !== 'login') return { name: 'login' }
})

export default router
