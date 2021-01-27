<template>
    <div class="wrap">
        <AsideMenu/>
    </div>
</template>
<script>

import AsideMenu from './asidemenu'
export default {
    components: {
        AsideMenu,
    }
}
</script>
<style lang="scss" scoped>
    .wrap{
        flex: 1;
        display: flex;flex-direction: column;
    }
</style>
