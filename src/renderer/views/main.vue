<template>
    <div class="main-page">
        <el-container class="container" id="main">
            <el-container style="position: relative;">
                <el-aside width="13%" class="aside" max-width="280px">
                    <aside-view />
                </el-aside>
                <el-container >
                    <el-header class="header" height="8%" style="-webkit-app-region: drag">
                        <header-view height="100%" />
                    </el-header>
                    <el-main class="main">
                        <keep-alive>
                            <router-view></router-view>
                        </keep-alive>

                    </el-main>
                </el-container>
            </el-container>
            <!--<el-footer class="footer" height="70px">-->
                <!--<footer-view height="70px" />-->
            <!--</el-footer>-->
        </el-container>
    </div>
</template>
<script>
    import AsideView from '../components/Aside/'
    import HeaderView from '../components/Header/'
    import FooterView from '../components/Footer/'
    export default {
        components: {
            AsideView,
            HeaderView,
            FooterView,
        }
    }
</script>
<style lang="scss" scoped>
    .main-page{
        background: #000;
    }
    .aside {
        background: rgba(255,255,255,0.1);
    }

    .container {
        height: 100vh;
    }

    .header {
        background: rgba(255,255,255,0.1);

    }

    .main {
        padding: 0;
        margin: 0;
        overflow: hidden;
        display: flex;
        flex: 1;
        flex-shrink: 0;
    }

    .footer {
        background: #f7f7f7;
        padding: 0;
    }
    /deep/ .el-aside{
        max-width: 280px;
    }
</style>
