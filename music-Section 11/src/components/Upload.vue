<template>
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <span class="card-title">Upload</span>
        <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
            <div
                class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed
                border-gray-400 text-gray-400 transition duration-500 hover:text-white
                hover:bg-green-400 hover:border-green-400 hover:border-solid"
                :class="{ 'bg-green-400 border-green-400 border-solid': is_dragover }"
                @drag.prevent.stop=""
                @dragstart.prevent.stop=""
                @dragend.prevent.stop="is_dragover=false;"
                @dragover.prevent.stop="is_dragover=true;"
                @dragenter.prevent.stop="is_dragover=true;"
                @dragleave.prevent.stop="is_dragover=false;"
                @drop.prevent.stop="upload($event)">
                <h5>Drop your files here</h5>
            </div>
            <input type="file" multiple @change="upload($event)" />
            <hr class="my-6" />
            <div class="mb-4" v-for="upload in uploads" :key="upload.name">
                <div class="font-bold text-sm" :class="upload.text_class">
                    <i :class="upload.icon"></i> {{ upload.name }}
                </div>
                <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
                <div class="transition-all progress-bar" :class="upload.variant" 
                :style="{ width: upload.current_progress + '%'}"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { storage, auth, songsCollection } from '@/includes/firebase';
export default {
    name:'Upload',
    data(){
        return {
            is_dragover:false,
            uploads: [],
        };
    },
    methods: {
        upload($event){
            this.is_dragover = false;
            // console.log("$event", $event)
            // const files = [...$event.dataTransfer.files];
            const files = $event.dataTransfer ? [...$event.dataTransfer.files] : [...$event.target.files];
            // console.log(files);

            files.forEach((file) => {
                if(file.type != 'audio/mpeg'){
                    return;
                }
                const storageRef = storage.ref(); // music-c2596.appspot.com
                const songsRef = storageRef.child(`songs/${file.name}`); // music-c2596.appspot.com/songs/example.mp3
                const task = songsRef.put(file);

                //保存uploadindex 索引
                //push会回传一个新增元素的索引
                const uploadIndex = this.uploads.push({
                    task, 
                    current_progress: 0,
                    name: file.name,
                    variant: 'bg-blue-400',
                    icon: 'fas fa-spinner fa-spin',
                    text_class: '',
                }) - 1;

                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                task.on('state_changed', (snapshot)=> {
                    //snapshot对象代表现在上传对象的状态
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    this.uploads[uploadIndex].current_progress = progress;
                    // 使用current_progress来响应uploads中的对象，实现实时看到上传的进度。
                    //如果不用arrow的写法，这里没有办法用this
                    //因为这里没有绑定组件的实例，所以常规不可以用this
                }, (error) => {
                    // 失败
                    this.uploads[uploadIndex].variant = 'bg-red-400';
                    this.uploads[uploadIndex].icon = 'fas fa-times';
                    this.uploads[uploadIndex].text_class = 'text-red-400';
                    console.log(error);
                    // 打印错误

                }, async () => {
                    // 由于getDownloadURL 所以需要添加异步
                    // 成功
                    const song = {
                        // 生成一个有关song的文件
                        uid: auth.currentUser.uid, //recognise the different user
                        display_name: auth.currentUser.displayName,
                        original_name: task.snapshot.ref.name,
                        modified_name: task.snapshot.ref.name,
                        genre: '',
                        comment_count: 0,
                        // 添加评论条数
                    };
                    
                    song.url = await task.snapshot.ref.getDownloadURL();
                    const songRef = await songsCollection.add(song);
                    const songSnapshot = await songRef.get();

                    this.addSong(songSnapshot);

                    // set 和 add不同在于
                    // set允许分配自定义的id给文件
                    // add会让firebase 生成一个id给你

                    // 添加await等待 回来的promise
                    this.uploads[uploadIndex].variant = 'bg-green-400';
                    this.uploads[uploadIndex].icon = 'fas fa-check';
                    this.uploads[uploadIndex].text_class = 'text-green-400';
                });
            })
        },
        cancelUploads(){
            // upload只能一个个cancel，所以需要forEach来循环
            this.uploads.forEach((upload) => {
                upload.task.cancel();
            })
        }
    },
    // beforeUnmount(){
    //     // upload只能一个个cancel，所以需要forEach来循环
    //     this.uploads.forEach((upload) => {
    //         upload.task.cancel();
    //     })
    // }
}
</script>