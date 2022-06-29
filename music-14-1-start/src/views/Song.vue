<template>
    <div>
        <!-- 数据在路由中的传递 -->
        {{ $route.params.id }}
    </div>
</template>

<script>
export default {
    name: 'Song',
}
</script>
