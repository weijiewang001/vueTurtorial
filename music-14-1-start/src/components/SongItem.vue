<template>
    <li class="flex justify-between items-center p-3 pl-6 cursor-pointer transition
        duration-300 hover:bg-gray-50">
        <div>
        <!-- 通过router link 来路由重定向，然后通过路由动态传参数来传递id -->
        <router-link :to="{ name: 'song', params: { id: song.docID } }" class="font-bold block text-gray-600">{{song.modified_name}}</router-link>
        <span class="text-gray-500 text-sm">{{song.display_name}}</span>
        </div>

        <div class="text-gray-600 text-lg">
        <span class="comments">
            <i class="fa fa-comments text-gray-600"></i>
            {{song.comment_count}}
        </span>
        </div>
    </li>
</template>
<script>
export default {
    name: 'SongItem',
    props:['song'],
}
</script>

