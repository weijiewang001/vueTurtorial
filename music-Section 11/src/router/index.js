import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import About from '@/views/About.vue';
import Manage from '@/views/Manage.vue';
import store from '@/store';

const routes = [
  {
    name: 'home',
    path: '/', // example.com/
    component: Home,
  },
  {
    name:'about',
    path: '/about',
    component: About,
  },
  {
    name:'manage',
    // alias: '/manage',
    path: '/manage-music',
    meta: {
      requiresAuth: true,
    },
    component: Manage,
    beforeEnter:(to,from,next) => {
      console.log('Manage Route Guard');
      next();
    }
  },
  {
    path: '/manage',
    redirect: { name:'manage'},
  },
  {
    path: '/:catchAll(.*)*',
    redirect: {name:'home'},
  }
  
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkExactActiveClass: 'text-yellow-500',
});

// global guard
router.beforeEach((to, from, next) => {
  // to.matched代表将要导向的组件
  // matched是一个array包含了记录，与用户将要访问的路径相符。
  // console.log(!to.matched.some(record => record.meta.requiresAuth));
  // some function 是一个js的数组功能
  // loop an array and perform a test on each item.
  // if any test pass, it will return true.
  // So we can test any of them has the meta field.

  //如果requireAuth是false，这里的if是true
  // 那么这里的路由不需要验证登录，可以直接跳转到下一个路由
  // 如果if是false，需要验证用户登录，才能跳转到下一个路由。
  if(!to.matched.some(record => record.meta.requiresAuth)){
    next();
    return;
  }
  if(store.state.userLoggedIn){
    next();
  }else{
    next({name: 'home' });
  }




  // console.log(to, from);

  next();
})

export default router;
