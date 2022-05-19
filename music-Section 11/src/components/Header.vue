<template>
  <!-- Header -->
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link class="text-white font-bold uppercase text-2xl mr-4" 
        to="/">
        Music
      </router-link>

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li>
            <router-link class="px-2 text-white" to="/about">About</router-link>
          </li>

          <!-- 检查如果store里面是登录状态了，隐藏按钮 -->
          <li v-if="!userLoggedIn">
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal">
              Login / Register
            </a>
          </li>
          <template v-else>
            <li>
              <router-link class="px-2 text-white" to="/manage">Manage</router-link>
            </li>
            <li>
              <a class="px-2 text-white" @click.prevent="signout" href="#">Logout</a>
            </li>
          </template>
          
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex';

export default {
  name: 'Header',
  computed:{
    ...mapState(['userLoggedIn']),
  },
  methods: {
    ...mapMutations(['toggleAuthModal']),


    //1. 定义一个signout功能来使用store中action的signout功能
    // signout(){
    //   this.$store.dispatch('signout');
    // }
    
    // 2.使用mapactions
    // mapactions跟别的功能用起来一样，更方便。
    ...mapActions(['signout']), //这个语句的功能和dispatch的功能一样，因此拥有这个可以注销掉dispatch
    
    // toggleAuthModal() {
    //   this.$store.commit('toggleAuthModal');
    // },
  },
};
</script>
