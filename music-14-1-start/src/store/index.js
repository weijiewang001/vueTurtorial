import { createStore } from 'vuex';
import { auth, usersCollection } from '@/includes/firebase';
import { Howl } from 'howler';
import helper from '../includes/helper';

export default createStore({
  state: {
    authModalShow: false,
    userLoggedIn: false,
    currentSong: {},
    sound: {},
    seek: '00:00',
    duration: '00:00',
    playerProgress: '0%',
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
    },
    updatePosition(state){
      state.seek = helper.formatTime(state.sound.seek());
      state.duration = helper.formatTime(state.sound.duration());
      state.playerProgress = `${(state.sound.seek() / state.sound.duration()) * 100}%`;
    }
  },
  getters: {
    // authModalShow: (state) => state.authModalShow,
    
    // 控制开始或者暂停按钮的状态，如果playing没有在播放，则返回false
    // 如果playing在播放，则返回true
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

    async newSong({ commit, state, dispatch }, payload){
      if(state.sound instanceof Howl){
        state.sound.unload();
      }

      commit('newSong', payload);
      
      // 这里的state 需要destructure才能访问。
      state.sound.play();

      state.sound.on('play', () => {
        requestAnimationFrame(() => {
          dispatch('progress');
        });
      });

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

    },
    progress({ commit, state, dispatch}) {
      commit('updatePosition');

      if(state.sound.playing()){
        requestAnimationFrame(()=> {
          dispatch('progress');
        })
      }
    },
    updateSeek({ state, dispatch }, payload) {
      if (!state.sound.playing) {
        return;
      }

      const { x, width } = payload.currentTarget.getBoundingClientRect();
      // Document = 2000, Timeline = 1000, Click = 500, Distance = 500
      const clickX = payload.clientX - x;
      const percentage = clickX / width;
      const seconds = state.sound.duration() * percentage;

      state.sound.seek(seconds);

      state.sound.once('seek', () => {
        dispatch('progress');
      });
    },
  },
});
