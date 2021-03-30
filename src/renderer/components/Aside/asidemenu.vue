<template>
    <div class="aside-menu scroll-page">
        <div style="text-align: center;margin: 50px 0;">
            <img src="../../assets/images/logo.png" width="120" height="50" alt="">
        </div>
        <div class="menu-lists">
            <div class="menu-list-content">
                <div class="menu-list-item" :class="{active:menu =='project'}" @click="toNext('project')">项目总览</div>
            </div>
            <div class="menu-list-content">
                <div class="menu-list-item" :class="{active:menu =='report'}" @click="toNext('report')">报表</div>
            </div>
            <div class="menu-list-content">
                <div class="menu-list-item" :class="{active:menu =='test'}" @click="toNext('test')">检测</div>
            </div>
            <div class="menu-list-content">
                <div class="menu-list-item" :class="{active:menu =='setting'}" @click="toNext('setting')">设置</div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapState ,mapActions,mapMutations} from 'vuex';
    export default {
        props:{
           // menu:{
           //     type:String,
           //     default:'project'
           // }
        },
        data() {
            return {
               menu:'project',
            }
        },
        computed: mapState({

        }),
        watch:{
        },
        beforeCreate(){
        },
        created(){

        },
        beforeMount(){
        },
        mounted(){
        },
        methods:{
            ...mapActions({

            }),

            toNext(pageName){
                this.menu = pageName;
                console.log(pageName)
                this.$router.push({name: pageName});
            },

        },
        beforeUpdate(){
        },
        beforeDestroy(){

        },
    }
</script>

<style lang="scss"  scoped>
.scroll-page {
    overflow: hidden;
    /deep/ .el-scrollbar__wrap {
     overflow-x: hidden;
      }
}

.aside-menu{
    flex: 1;
    overflow: hidden;
    .menu-lists{
        /*margin-top: 80%;*/
        border-top: 1px solid rgba(255,255,255,0.08);
        .menu-list-content{
            border-bottom: 1px solid rgba(255,255,255,0.08);
            /*height: 75px;*/
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 8% 0;
            .menu-list-item{
                width: 85%;
                /*height: 45px;*/
                font-size: 1.2vw;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #FFFFFF;
                /*line-height: 45px;*/
                text-align: center;
                padding: 5% 0;
            }
            .active{
                background: #2CCEAD;
                border-radius: 4px;
                border: 1px solid rgba(255, 255, 255, 0.15);
            }
        }
    }

}
</style>
