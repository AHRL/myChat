// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import store from './store'
import axios from 'axios'
import VueSocketio from 'vue-socket.io'
// import info from '../config/info'

Vue.config.productionTip = false

Vue.use(VueSocketio, 'http://localhost:8888/')
Vue.use(Vuex)
Vue.prototype.$axios = axios

// // 设置http拦截器
// axios.interceptors.request.use(function (config) {
//   // 在发送请求之前做些什么
//   config.url = 'http://127.0.0.1:8888/' + config.url
//   return config
// }, function (error) {
//   // 对请求错误做些什么
//   return Promise.reject(error)
// })
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
