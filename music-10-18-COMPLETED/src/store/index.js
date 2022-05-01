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
    toggleAuth(state){
      state.userLoggedIn = !state.userLoggedIn;
    }
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
        // gender:payload.gender,
        country:payload.country,
      });

      await userCred.user.updateProfile({
        displayName: payload.name,
      })

      //set 是添加或者修改表单中已有或者没有的数据。
      // 如果要使用set function 我们要首先添加一个doc() function

      //commit a mutation
      commit("toggleAuth");

    }
  },
});
