import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'
import http from './axios'
import Toast from 'vue-toastification'
import moment from 'moment'

Vue.config.silent = true
Vue.prototype.moment = moment
Vue.use(http)
import 'vue-toastification/dist/index.css'

Vue.use(Toast, {
  position: 'top-right',
  timeout: 9000,
  closeOnClick: true,
  pauseOnFocusLoss: false,
  pauseOnHover: false,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: 'button',
  icon: true,
  rtl: false,
})

require('./store/subscriber')
Vue.use(require('vue-moment'))

// axios.defaults.baseURL = 'http://10.10.0.38:8083'
// axios.defaults.headers.common['Authorization'] =
//   'Bearer' + localStorage.getItem('token')

Vue.config.productionTip = false
store.dispatch('auth/attempt', localStorage.getItem('token')).then(() => {
  new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
  }).$mount('#app')
})
