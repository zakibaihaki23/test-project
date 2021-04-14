import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'
import http from './axios'
import Toast from 'vue-toastification'
// import moment from 'moment'
import './assets/main.css'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import './vee-validate'
import VueTelInputVuetify from 'vue-tel-input-vuetify/lib'
import vueXlsxTable from 'vue-xlsx-table'

Vue.use(vueXlsxTable, { rABS: false })
Vue.use(VueTelInputVuetify, {
  vuetify,
})
Vue.use(DatePicker)
Vue.config.silent = true
// Vue.prototype.moment = moment
Vue.use(http)

import 'vue-toastification/dist/index.css'

Vue.use(Toast, {
  position: 'top-right',
  timeout: 3000,
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

Vue.config.productionTip = false
store.dispatch('auth/attempt', localStorage.getItem('token')).then(() => {
  new Vue({
    router,
    store,
    vuetify,
    DatePicker,
    render: (h) => h(App),
  }).$mount('#app')
})
