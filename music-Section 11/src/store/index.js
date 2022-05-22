import { createStore } from 'vuex';
import {auth, db, usersCollection} from '@/includes/firebase';


export default createStore({
  state: {
    authModalShow: false,
    userLoggedIn: false,
  },
  mutations: {
    toggleAuthModal: (state) => {
      state.authModalShow = !state.authModalShow;
    },

    // 存储判断用户是否登录的变量
    toggleAuth(state){
      state.userLoggedIn = !state.userLoggedIn;
    },
  },
  getters: {
    // authModalShow: (state) => state.authModalShow,
  },
  actions: {
    //在actions中定义了一个register功能
    //其中有两个参数
    //第一个是context，让我们能够访问store
    //这个参数让我们能够访问state和mutation
    //我们为了commit交付功能，解构了context参数
    //结构让事情变得更可读
    //第二个是payload， 这是被在call dispatch功能时传递的数据。
    async register({ commit }, payload){
    //在注册阶段，我们向auth发送了请求
      const userCred = await auth.createUserWithEmailAndPassword(
        payload.email, payload.password, 
      );

      //一旦request完成了，我么开始了另一个请求 
      //这次是向database
      await usersCollection.doc(userCred.user.uid).set({
        name:payload.name,
        email:payload.email,
        age:payload.age,
        gender:payload.gender,
        country:payload.country,
      });

      await userCred.user.updateProfile({
        displayName: payload.name,
      })

      //set 是添加或者修改表单中已有或者没有的数据。
      // 如果要使用set function 我们要首先添加一个doc() function

      //commit a mutation
      commit("toggleAuth");

    },

    //payload是表单的内容
    // 如果payload跟数据库里面的数据符合，那么就会返回true=>成功
    async login({commit}, payload){
      await auth.signInWithEmailAndPassword(payload.email, payload.password);

      commit('toggleAuth');

    },

    //用户登录
    //保留用户登录的唯一uio，使其保持登录状态（刷新页面也有效）
    // 在action功能中，解构commit功能。
    init_login({ commit }){
      const user = auth.currentUser; 

      if(user){
        commit('toggleAuth');
      }

    },

    async signout({commit},payload){
      await auth.signOut();

      commit('toggleAuth');
      
      // 通过payload从组件将router和route的值传进来
      if(payload.route.meta.requiresAuth){
        payload.router.push({name:'home'});
      }

    },

  },
});
