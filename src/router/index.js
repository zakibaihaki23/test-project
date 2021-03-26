import Vue from 'vue'
import VueRouter from 'vue-router'
import MainLayout from '../layout/index'
import EmptyLayout from '../layout/empty'
import store from '../store'
// import NotFound from '../components/NotFound'
Vue.use(VueRouter)

const routes = [
  // {
  //   name: 'Dashboard',
  //   component: MainLayout,
  //   icon: 'mdi-view-dashboard',
  //   path: '/dashboard',
  //   open: true,
  //   beforeEnter: (to, from, next) => {
  //     if (!store.getters['auth/authenticated']) {
  //       return next({
  //         name: 'Login',
  //       })
  //     }
  //     next()
  //   },
  //   children: [
  //     {
  //       name: 'Home',
  //       component: () => import('../views/Dashboard/Dashboard'),
  //       path: '',
  //     },
  //   ],
  // },
  {
    name: 'Helper',
    component: MainLayout,
    icon: 'mdi-account-group',
    subtitle: 'Components',
    path: '/helper',
    open: false,

    beforeEnter: (to, from, next) => {
      if (!store.getters['auth/authenticated']) {
        return next({
          name: 'Login',
        })
      }
      next()
    },
    children: [
      {
        name: 'Helper List',
        component: () => import('../views/Helper/Helper'),
        path: '',
      },
    ],
  },
  {
    name: 'Helper Create',
    component: MainLayout,
    subtitle: 'Components',
    path: '/helper/helper-create',
    open: false,
    beforeEnter: (to, from, next) => {
      if (!store.getters['auth/authenticated']) {
        return next({
          name: 'Login',
        })
      }
      next()
    },
    children: [
      {
        name: 'Create Helper',
        component: () => import('../views/Helper/CreateHelper'),
        path: '/helper/create-helper',
      },
      {
        name: 'Update Helper',
        component: () => import('../views/Helper/UpdateHelper'),
        path: '/helper/update-helper/:id',
      },
    ],
  },
  {
    name: 'Picking & Picking Create',
    component: MainLayout,
    subtitle: 'Components',
    path: '/picking/picking-create',
    open: false,
    beforeEnter: (to, from, next) => {
      if (!store.getters['auth/authenticated']) {
        return next({
          name: 'Login',
        })
      }
      next()
    },
    children: [
      // {
      //   name: 'Create Picking',
      //   component: () => import('../views/Picking/CreatePicking'),
      //   path: '/picking/create-picking',
      // },
      // {
      //   name: 'Update Picking',
      //   component: () => import('../views/Picking/UpdatePicking'),
      //   path: '/picking/update-picking/:id',
      // },
      {
        name: 'Create Packing',
        component: () => import('../views/Packing/CreatePacking'),
        path: '/packing/create-packing',
      },
      {
        name: 'Input Packing',
        component: () => import('../views/Packing/InputPacking'),
        path: '/packing/input-packing/',
      },
      {
        name: 'Packing Item',
        component: () => import('../views/Packing/PackingItem'),
        path: '/packing/packing-item/',
      },
    ],
  },
  {
    name: 'Auth',
    component: EmptyLayout,
    icon: 'mdi-clipboard-account-outline',
    subtitle: 'Pages',
    path: '/',
    open: false,
    beforeEnter: (to, from, next) => {
      if (store.getters['auth/authenticated']) {
        return next({
          name: 'Helper List',
        })
      }
      next()
    },
    children: [
      {
        name: 'Login',
        component: () => import('../views/Auth/Login'),
        path: '',
      },
      {
        name: 'Logout',
        component: () => import('../views/Auth/Login'),
        path: 'logout',
      },
    ],
  },
  {
    name: 'Packing',
    component: MainLayout,
    icon: 'mdi-package-variant-closed',
    path: '/packing',
    open: false,
    beforeEnter: (to, from, next) => {
      if (!store.getters['auth/authenticated']) {
        return next({
          name: 'Login',
        })
      }
      next()
    },
    children: [
      {
        name: 'Packing List',
        component: () => import('../views/Packing/Packing'),
        path: '',
      },
    ],
  },
  {
    name: 'Report',
    component: MainLayout,
    icon: 'mdi-import',
    path: '/report',
    open: true,
    beforeEnter: (to, from, next) => {
      if (!store.getters[('auth/authenticated', 'auth/user')]) {
        return next({
          name: 'Login',
        })
      }
      next()
    },
    children: [
      {
        name: 'Report Packing',
        component: () => import('../views/Report/Packing'),
        path: '/report/packing',
        meta: { hideNavigation: true },
      },
      {
        name: 'Report Picking',
        component: () => import('../views/Report/Picking'),
        path: '/report/picking',
        meta: { hideNavigation: true },
      },
      {
        name: 'Picking Item',
        component: () => import('../views/Report/PickingItem'),
        path: '/report/picking-item',
        meta: { hideNavigation: true },
      },
    ],
  },
  // {
  //   path: '*',
  //   component: NotFound,
  // },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  document.title = `${to.name} - Eden Farm`
  next()
})

export default router
