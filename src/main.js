import Vue from 'vue'
import VueI18n from 'vue-i18n'
import router from './router'

import App from './App.vue'

import en_US from './locales/en-US'
import zh_CN from './locales/zh-CN'

import $ from 'jquery'
global.jQuery = global.$ = $;

import 'bootstrap'
import GlobalConst from './globalconst'

Vue.config.productionTip = false

Vue.use(VueI18n)
Vue.use(GlobalConst);

const messages = {
  'en-US': en_US,
  'zh-CN': zh_CN
}

const i18n = new VueI18n({
  locale: 'zh-CN',
  messages
})


new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
