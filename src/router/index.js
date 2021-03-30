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
  //   path: '/',
  //   open: false,
  //   beforeEnter: (to, from, next) => {
  //     if (store.getters['auth/authenticated']) {
  //       return next({
  //         name: 'Helper List',
  //       })
  //     }
  //     next()
  //   },
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
    name: 'Packing Page Create',
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
      {
        name: 'Create Packing Order',
        component: () => import('../views/Packing/CreatePacking'),
        path: '/packing-order/create',
      },
      {
        name: 'Packing Order Detail',
        component: () => import('../views/Packing/Detail'),
        path: '/packing-order/:id',
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
    path: '/auth',
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

        path: 'logout',
      },
    ],
  },
  {
    name: 'Packable Item',
    component: MainLayout,
    icon: 'mdi-cart-plus',
    path: '/packable-item',
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
        name: 'Packable Item List',
        component: () => import('../views/Packing/PackableItem'),
        path: '',
      },
    ],
  },
  {
    name: 'Packing Order',
    component: MainLayout,
    icon: 'mdi-package-variant-closed',
    path: '/packing-order',
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
        name: 'Packing Order List',
        component: () => import('../views/Packing/PackingOrderList'),
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
      if (!store.getters['auth/authenticated']) {
        return next({
          name: 'Login',
        })
      }
      next()
    },
    children: [
      {
        name: 'Report Packing',
        component: () => import('../views/Report/ReportPackingOrder'),
        path: '/report/packing',
        meta: { hideNavigation: true },
      },
      {
        name: '',

        path: '/report/packing-order',
        meta: { hideNavigation: true },
      },
      {
        name: '',

        path: '/report/packing-order',
        meta: { hideNavigation: true },
      },
    ],
  },
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
