import { createStore } from 'vuex';
import { auth, usersCollection } from '@/includes/firebase';
import { Howl } from 'howler';

export default createStore({
  state: {
    authModalShow: false,
    userLoggedIn: false,
    currentSong: {},
    sound: {},
  },
  mutations: {
    toggleAuthModal: (state) => {
      state.authModalShow = !state.authModalShow;
    },
    toggleAuth(state) {
      state.userLoggedIn = !state.userLoggedIn;
    },
    // 数据库的音乐数据会是payload
    // 被存进state中的currentSong当中
    newSong(state, payload){
      state.currentSong = payload;
      // 在new Howl中
      // 歌曲的url被识别，同时需要标注html5的文件属性，否则会读取失败
      // 定义播放设备不能在mutation中，只能在action中
      // mutation只能用来改变state中的数据。
      state.sound = new Howl({
        src: [payload.url],
        html5: true,
      });
    }
  },
  getters: {
    // authModalShow: (state) => state.authModalShow,
    playingP: (state) => {
      if (state.sound.playing){
        return state.sound.playing();
      }

      return false;
    }
  },
  actions: {
    async register({ commit }, payload) {
      const userCred = await auth.createUserWithEmailAndPassword(
        payload.email, payload.password,
      );

      await usersCollection.doc(userCred.user.uid).set({
        name: payload.name,
        email: payload.email,
        age: payload.age,
        country: payload.country,
      });

      await userCred.user.updateProfile({
        displayName: payload.name,
      });

      commit('toggleAuth');
    },
    async login({ commit }, payload) {
      await auth.signInWithEmailAndPassword(payload.email, payload.password);

      commit('toggleAuth');
    },
    init_login({ commit }) {
      const user = auth.currentUser;

      if (user) {
        commit('toggleAuth');
      }
    },
    async signout({ commit }) {
      await auth.signOut();

      commit('toggleAuth');

      // if (payload.route.meta.requiresAuth) {
      //   payload.router.push({ name: 'home' });
      // }
    },

    async newSong({ commit, state }, payload){
      commit('newSong', payload);
      
      // 这里的state 需要destructure才能访问。
      state.sound.play();

    },

    async toggleAudio( { state } ){
      if(!state.sound.playing){
        return;
      }

      if(state.sound.playing()){
        state.sound.pause();
      }else{
        state.sound.play();
      }

    }
  },
});
