import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/global.css'
//导入字体图标
import './assets/fonts/iconfont.css'
//导入axios
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
//配置全局请求接口根路径
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
//配置axios拦截器
axios.interceptors.request.use(config=>{
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config
})
//在Vue实例原型对象上挂载axios
Vue.prototype.$http=axios
Vue.component('tree-table',TreeTable)

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
