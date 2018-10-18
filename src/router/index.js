import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Chat from '@/components/Chat'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/mychat'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/mychat',
      name: 'mychat',
      component: Chat
    }
  ]
})
