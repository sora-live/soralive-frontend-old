import Vue from 'vue'
import Router from 'vue-router'

import HomePage from './components/home.vue'
import ListPage from './components/list.vue'
import LoginPage from './components/login.vue'
import RegPage from './components/reg.vue'
import UserPage from './components/user.vue'
import LivePage from './components/live.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {path: '/', name: "home", component: HomePage},
    {path: '/list', name: "list", component: ListPage},
    {path: '/login', name: "login", component: LoginPage},
    {path: '/reg', name: "reg", component: RegPage},
    {path: '/user', name: "user", component: UserPage},
    {path: '/live/:uid', name: "live", component: LivePage},
  ]
})
