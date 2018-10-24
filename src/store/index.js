import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: '',
    headImg: require('../../static/img/favicon.png'),
    token: null,
    friends: []
  },
  mutations: {
    LOGIN_IN (state, data) {
      localStorage.token = data.token
      state.username = data.username
      state.token = data.token
      state.friends = data.friends
    },
    LOGIN_OUT (state) {
      localStorage.removeItem('token')
      state.username = ''
      state.token = ''
      state.friends = []
    },
    updateFriends (state, data) {
      state.friends = data
    }
  }
})
