import axios from 'axios'
import Vue from 'vue'

const devInstance = createInstance('http://10.10.0.38:8083')

function createInstance(baseURL) {
  return axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.token}`,
    },
  })
}

export default {
  install() {
    Vue.prototype.$http = devInstance
  },
}
