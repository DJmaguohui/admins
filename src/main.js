import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//引入axios
import axios from '@/http/index'
Vue.prototype.$axios = axios
//引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
//引入字体和样式
import '@/assets/css/global.css'
import '@/assets/fonts/iconfont.css'
Vue.config.productionTip = false
//过滤器
Vue.filter("fool",
  function (str) {
    var Datas = new Date(str)
    var year = Datas.getFullYear();
    var yue = (Datas.getMonth() + 1 + '').padStart(2, '0');
    var ri = (Datas.getDate() + '').padStart(2, '0');
    var shi = (Datas.getHours() + '').padStart(2, '0');
    var fen = (Datas.getMinutes() + '').padStart(2, '0');
    var miao = (Datas.getSeconds() + '').padStart(2, '0')
    return `${year}-${yue}-${ri} ${shi}:${fen}:${miao}`
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
