import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'login',
      component:()=>import('../views/Login.vue'),
      beforeEnter:function(to,from,next){
        if(sessionStorage.getItem("token")){
          next("/home")
        }else{
          next()
        }
      }
    },
    {
      path: '/home',
      name: 'home',
      component:()=>import('../views/Home.vue'),
      beforeEnter:function(to,from,next){
        if(sessionStorage.getItem("token")){
          next()
        }else{
          next("/")
        }
      },
      redirect:"/about",
      children:[
        {
          path: '/about',
          name: 'about',
          component: () => import('../views/About.vue')
        },
        {
          path: '/users',
          name: 'users',
          component: () => import('../components/User.vue')
        },
        {
          path: '/roles',
          name: 'roles',
          component: () => import('../components/Roles.vue')
        },
        {
          path: '/rights',
          name: 'rights',
          component: () => import('../components/rights.vue')
        },
        {
          path: '/goods',
          name: 'goods',
          component: () => import('../components/Goods.vue')
        },
        // 商品列表添加页
        {
          path: '/goodsadd',
          name: 'goodsAdd',
          component: () => import('../components/GoodsAdd.vue')
        },
        {
          path: '/params',
          name: 'params',
          component: () => import('../components/Params.vue')
        },
        {
          path: '/orders',
          name: 'orders',
          component: () => import('../components/Orders.vue')
        },
        {
          path: '/reports',
          name: 'reports',
          component: () => import('../components/Reports.vue')
        },
        {
          path: '/categories',
          name: 'categories',
          component: () => import('../components/Categories.vue')
        }
      ]
    }
   
  ]
})

