<template>
    <div class="header-view" :style="{height: height}">
        <div class="header-left flex-c-l">
            <!--<el-button class="no-drag" size="mini" type="text" @click="back">-->
                <!--<i class="btn el-icon-arrow-left"></i>-->
            <!--</el-button>-->
            <!--<el-button class="no-drag" size="mini" type="text" @click="advance">-->
                <!--<i class="btn el-icon-arrow-right"></i>-->
            <!--</el-button>-->
            <!--<el-button class="no-drag hover-color" size="mini" type="text" @click="refresh">-->
                <!--<i class="btn el-icon-refresh"></i>-->
            <!--</el-button>-->

            <div class="search no-drag">
                <el-select v-model="defaultID" placeholder="请选择设备" @change="((val)=>{deviceChange(val)})">
                    <el-option
                            v-for="item in devices"
                            :key="item.id"
                            :label="item.value"
                            :value="item.id">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="header-right clearfix">
            <div class="time left">{{getDateTime}}</div>
            <el-button @click="maximize" class="no-drag hover-color" size="mini" type="text" v-if="!isFullScreen">
                <i class="btn el-icon-full-screen"></i>
            </el-button>
            <el-button @click="minimize" class="no-drag btn" size="mini" type="text">
                <i class="btn el-icon-minus"></i>
            </el-button>
            <el-button @click="close" class="no-drag hover-color" size="mini" type="text">
                <i class="btn el-icon-close"></i>
            </el-button>
        </div>
    </div>
</template>

<script>
    import { getDevices } from "../../api";
    import { deepCopy } from "../../../main/util/util";
    const {BrowserWindow} = require('electron')
    export default {
        props: {
            height: {
                type: String,
                default: '40px'
            }
        },
        data(){
            return{
                isFullScreen:false,
                value:'',
                weekArr:['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
                options:[
                    {
                        value: '1',
                        label: '设备1'
                    },
                    {
                        value: '2',
                        label: '设备2'
                    }
                ],
                devices:[],
                defaultDevice:{},
                defaultID:0,
            }
        },
        computed:{
          getDateTime(){
              const date = new Date();
              let years = date.getFullYear() < 10 ? '0'+date.getFullYear():date.getFullYear();
              let months = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1):date.getMonth()+1;
              let days = date.getDate() < 10 ? '0'+date.getDate():date.getDate();
              let weeks = this.weekArr[date.getDay()];
              return years + '-' + months + '-'  + days + '  ' + weeks;
          }
        },
        mounted() {
            console.log('0')

            getDevices({pageNum:0,offset:100}).then(res =>{
                console.log(res);
                this.devices = res.devices;
                for(var i in this.devices){
                    this.devices[i].value = this.devices[i].model+'-'+ this.devices[i].sequence;
                }
                this.defaultDevice = this.devices[0];
                this.defaultID = this.devices[0].id
                this.$store.dispatch('SET_CUR_DEVICE',this.devices[0].id)

            })
        },
        methods: {
            deviceChange(id){
                console.log(id);
                for(var i in this.devices){
                    if(this.devices[i].id==id){
                        this.defaultDevice = this.devices[i];
                        this.$store.dispatch('SET_CUR_DEVICE', this.devices[i].id);
                        break;
                    }
                }
            },
            close() {
                this.$confirm('此操作将退出QCS, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$electron.ipcRenderer.send('close')
                }).catch(() => {

                })
            },
            minimize() {
                if (this.isFullScreen){
                    this.$electron.ipcRenderer.send('unmaximize')
                    this.isFullScreen=false;
                }else{
                    this.$electron.ipcRenderer.send('minimize')

                }
            },
            maximize(){
                this.isFullScreen = true;
                this.$electron.ipcRenderer.send('maximize')
            },
            back() {
                if (this.$route.name !== 'music') {
                    this.$router.go(-1)
                }
            },
            advance() {
                this.$router.go(1)
            },
            refresh() {
                this.$bus.$emit('page-refresh', this.$route.name)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .header-view {
        display: flex;
        align-items: center;
        justify-content: space-between;
        /deep/ .header-left {
            height: 100%;
            width: 16%;
            margin-left: 3%;
            .btn {
                font-size: 17px;
                color: #999;
            }
            .btn:hover {
                color: #31c27c;
            }
            .el-icon-refresh {
                color: #333;
            }
            .search {
                width: 100%;
                height: 100%;
                /deep/ .el-select{
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .el-input{
                        height: 50%;
                        .el-input__inner {
                            height: 100%;
                            background: rgba(255, 255, 255, 0.08);
                            border-radius: 4px;
                            border: 1px solid rgba(255, 255, 255, 0.1);
                            font-size: 14px;
                        }
                        .el-input__icon {
                            line-height: 28px;
                        }
                    }

                }

            }
        }
        .header-right {
            display: flex;
            align-items: center;
            .time{
                height: 50px;
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #FFFFFF;
                line-height: 50px;
                margin-right: 20px;
            }
            .btn {
                font-size: 14px;
                color: #FFFFFF;
            }
            /*.btn:hover {*/
                /*color: #31c27c;*/
            /*}*/
        }

    }

</style>
