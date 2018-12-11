import Vue from 'vue'
import Router from 'vue-router'

import HomePage from './components/home.vue'
import SubstitutionPage from './components/substitution.vue'
import LoginPage from './components/login.vue'
import RegPage from './components/reg.vue'
import UserPage from './components/user.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {path: '/', name: "home", component: HomePage},
    {path: '/substitution', name: "substitution", component: SubstitutionPage},
    {path: '/login', name: "login", component: LoginPage},
    {path: '/reg', name: "reg", component: RegPage},
    {path: '/user', name: "user", component: UserPage}
  ]
})
