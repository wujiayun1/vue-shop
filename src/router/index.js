import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import Welcome from '../components/welcome.vue'
import Users from '../components/user/users.vue'
import Rights from '../components/power/rights.vue'
import Roles from '../components/power/roles.vue'
import Cate from '../components/goods/cate.vue'
Vue.use(Router)

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
};

const router = new Router({
  routes:[
    {path:'/',redirect:'/login'},
    {path:'/login',component:Login},
    {path:'/home',component:Home,
    redirect:'/welcome',
    children:[
      {path:'/welcome',component:Welcome},
      {path:'/users',component:Users},
      {path:'/rights',component:Rights},
      {path:'/roles',component:Roles},
      {path:'/categories',component:Cate}
      
    ]
  }
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
