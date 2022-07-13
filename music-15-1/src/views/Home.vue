<template>
  <!-- Introduction -->
  <section class="mb-8 py-20 text-white text-center relative">
    <div class="absolute inset-0 w-full h-full bg-contain introduction-bg"
      style="background-image: url(assets/img/header.png)"></div>
    <div class="container mx-auto">
      <div class="text-white main-header-content">
        <h1 class="font-bold text-5xl mb-5">Listen to Great Music!</h1>
        <p class="w-full md:w-8/12 mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Phasellus et dolor mollis, congue augue non, venenatis elit.
          Nunc justo eros, suscipit ac aliquet imperdiet, venenatis et
          sapien. Duis sed magna pulvinar, fringilla lorem eget,
          ullamcorper urna.
        </p>
      </div>
    </div>

    <img class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
      src="assets/img/introduction-music.png" />
  </section>

  <!-- Main Content -->
  <section class="container mx-auto">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <span class="card-title">Songs</span>
        <i class="fa fa-headphones-alt float-right text-green-400 text-2xl"></i>
      </div>
      <!-- Playlist -->
      <ol id="playlist">
        <app-song-item v-for="song in songs" :key="song.docID"
          :song="song"/>
        
      </ol>
      <!-- .. end Playlist -->
    </div>
  </section>
</template>


<script>
import { songsCollection } from '@/includes/firebase';
import AppSongItem from '@/components/SongItem.vue';

export default {
  name: 'Home',
  components: {
    AppSongItem
  },
  data(){
    return{
      songs: [],
      maxPerPage:3,
      pendingRequest: false,
    }
  },
  async created() {
    this.getSongs();
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount(){
    // 移除事件，防止eventlistener导致的内容泄漏。
      window.removeEventListener('scroll',this.handleScroll);
  },
  methods: {
    handleScroll(){
      // 解构需要的相关数据
      const { scrollTop, offsetHeight } = document.documentElement;
      const { innerHeight } = window;
      const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;

      if (bottomOfWindow) {
        this.getSongs();
        console.log('到达页面底部了')
      }
    },
    async getSongs(){
      //判断是否在拿请求的过程中。如果是，直接返回
      if(this.pendingRequest){
        return;
      }
      this.pendingRequest = true;

      let snapshots;
      //如果this.songs有内容，那么里面的东西不会报错
      if(this.songs.length){
        const lastDoc = await songsCollection
        .doc(this.songs[this.songs.length - 1].docID)
        .get();
        snapshots = await songsCollection
        .startAfter(lastDoc)
        .limit(this.maxPerPage)
        .get();
      }
      //否则startAfter会报错
      else{
        snapshots = await songsCollection
        .limit(this.maxPerPage)
        .get();
      }
      //循环一遍snapshots，并添加docID
      snapshots.forEach((document) => {
        this.songs.push({
          docID: document.id,
          ...document.data(),
        });
      });
      //判断拿请求状态是false；
      this.pendingRequest = false;
    }
  }
}
</script>

