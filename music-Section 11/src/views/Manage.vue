<template>
    <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <app-upload ref="upload" />
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <composition-item v-for="song in songs" :key="song.docID"/>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


<script>
// import store from '@/store';
import AppUpload from "@/components/Upload.vue";
import CompositionItem from '@/components/CompositionItem.vue';
import { songsCollection, auth } from '@/includes/firebase';

export default {
  name: 'manage',
  components:{
    AppUpload,
    CompositionItem,
  },
  data(){
    return{
      songs: [],
    }
  },
  beforeRouteLeave(to, from, next){
    this.$refs.upload.cancelUploads();
    next();
  },
  async created(){
    // 创造一个异步created访问数据库
    const snapshot = await songsCollection.where('uid', '==', auth.currentUser.uid)
      .get();
    //get function 会返回一个snapshot
    snapshot.forEach((document) => {
      // 写一个docID的key进入这个object
      const song = {
        ...document.data(),
        docID: document.id,
      };
      this.songs.push(song);
    })
  },
  // beforeRouteEnter(to, from, next){
  //   // console.log('beforeRouteEnter Guard');
  //   // $store 是一个global对象，由vuex创造，这个让我们能够访问state

  //   // 检测state中存储的值是true还是false（是否是登录状态）
  //   // 是的话，加载这个组件
  //   if(store.state.userLoggedIn){
  //     next();
  //   }
  //   else{
  //     //如果不是登录状态
  //     //那么跳转到name是home的组件
  //     next({ name: 'home' });
  //   }
  //   //还有一种是直接返回一个空值，那么用户就会看到一个空的页面。
  //   //在这种情况，其实重定向比空白页面更好。


  // }
}
</script>

