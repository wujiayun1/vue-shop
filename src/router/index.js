import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login.vue'

Vue.use(Router)

const router = new Router({
  routes:[
    {path:'/',redirect:'/login'},
    {path:'/login',component:Login},
    {path:'/home',component:()=>import('../components/home.vue')}
  ]
})
//配置路由导航守卫

router.beforeEach((to, from, next) => {
  //to表示将要访问的路劲
  //from代表从哪个路劲跳转而来
  //next是一个函数，表示放行
  if(to.path==='/login') return next();
  let tokenStr=window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()

})

export default router
