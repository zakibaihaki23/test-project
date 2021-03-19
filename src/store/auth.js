import axios from 'axios'
export default {
  namespaced: true,
  state: {
    token: null,
    user: null,
  },
  getters: {
    authenticated(state) {
      return state.token && state.user
    },
    user(state) {
      return state.user
    },
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_USER(state, user) {
      state.user = user
    },
  },
  actions: {
    async signIn({ dispatch }, credentials) {
      let response = await axios.post(
        'http://10.10.0.38:8083/v1/auth',
        credentials
      )

      const user = response.data.data.user
      // localStorage.setItem('user', user)
      // console.log(user)
      dispatch('user', user)

      return dispatch('attempt', response.data.data.token)
    },
    async user({ commit }, user) {
      commit('SET_USER', user)
    },
    async attempt({ commit, state }, token) {
      if (token) {
        commit('SET_TOKEN', token)
      }
      if (!state.token) {
        return
      }
    },
    signOut({ commit }) {
      return axios.post('auth/signIn').then(() => {
        commit('SET_TOKEN', null)
      })
    },
  },
}
