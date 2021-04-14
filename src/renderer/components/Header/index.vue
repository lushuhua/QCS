<template>
    <div class="header-view" :style="{height: height}">
        <div class="no-drag" style="flex: auto">
            <el-select class="left" v-model="defaultID" placeholder="请选择设备" @change="deviceChange">
                <el-option
                        v-for="item in devices"
                        :key="item.id"
                        :label="item.model+'-'+item.sequence"
                        :value="item.id">
                </el-option>
            </el-select>
        </div>
        <div>
            <el-button class="no-drag header-view-btn" @click="addHospital()">设置医院信息</el-button>
            <span style="margin: 0 30px;font-size: 17px;position: relative;top: -1px;">{{getDateTime}}</span>
            <el-button @click="maximize" class="no-drag hover-color" size="medium" type="text">
                <i class="btn  btn-sys" :class="{'el-icon-full-screen':!isFullScreen,'el-icon-copy-document':isFullScreen}"></i>
            </el-button>
            <el-button @click="minimize" class="no-drag btn" size="medium" type="text">
                <i class="btn el-icon-minus btn-sys" ></i>
            </el-button>
            <el-button @click="close" class="no-drag hover-color" size="medium" type="text">
                <i class="btn el-icon-close btn-sys"></i>
            </el-button>
        </div>
        <el-dialog
                title="设置医院信息"
                :visible.sync="dialogHospital"
                width="600px"
                center
        >
            <div class="hospital">
                <div class="hospital-item" style="width: 100%;">
                    <el-upload
                            class="upload-demo"
                            action=""
                            accept="image/jpg,image/jpeg,image/png"
                            :show-file-list="false"
                            :http-request="onHttpRequest">
                        <i class="el-icon-plus upload-icon" v-if="!hospitalInfo.avatar"></i>
                        <el-image :src="hospitalInfo.avatar" class="hospital-image" v-else>
                            <div slot="error" class="image-slot">
                                <i class="el-icon-plus upload-icon"></i>
                            </div>
                        </el-image>
                        <!--<img :src="hospitalInfo.avatar" width="117" height="117" v-else>-->
                        <span style="color: rgba(255, 255, 255, 0.5);padding-left: 30px">请上传医院logo，仅支持jpg、jpeg、png等格式</span>
                    </el-upload>
                </div>
                <div class="input-label-container" style="width: 100%;margin-top: 20px;border-radius: 0 4px 4px 0">
                    <el-input v-model="hospitalInfo.name" placeholder="请输入医院名称"></el-input>
                    <span style="width: 100px;color: rgba(255, 255, 255, 0.8);font-size: 15px">医院名称</span>
                </div>
                <!--<div class="hospital-item hospital-item-input">-->
                    <!--<input class="item-content" v-model="hospitalInfo.name" placeholder="请输入医院名称" type="text">-->
                    <!--<div style="flex: none; width: 115px;text-align: center">医院名称</div>-->
                <!--</div>-->
            </div>
            <div slot="footer">
                <div class="confirm-btn">
                    <el-button class="header-view-btn" style="min-width: 104px"  @click="dialogHospital=false">取消</el-button>
                    <el-button type="primary"  style="min-width: 104px;color: #ffffff;" @click="onclickHos()">保存</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { getDevices,editHospital,getHospitals,fileUpload } from "../../api";
    import { deepCopy } from "../../../main/util/util";
    import {mapState} from 'vuex'
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
                // devices:[],
                defaultDevice:{},
                defaultID:0,
                dialogHospital: false,
                hospitalInfo: {name: '',avatar: ''},
            }
        },
        created(){
            getDevices({pageNum:0,offset:100}).then(res =>{
                console.log('getDevices');
                this.$store.commit('SET_DEVICES',res.devices)
                if (res.devices && res.devices.length>0){
                    this.$store.commit('SET_DEVICE',res.devices[0])
                    this.defaultDevice = res.devices[0];
                    this.defaultID = res.devices[0].id
                }
            })
        },
        watch: {
            currentDeviceID: function (val) {
                console.log(val);
                this.defaultID = this.currentDeviceID
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
          },
          ...mapState({
              devices: state=> state.user.devices,
              currentDeviceID: state=> state.user.currentDeviceID,
          })
        },
        mounted() {
            console.log('0')
        },
        methods: {
            deviceChange(id){
                console.log(id);
                this.$store.commit('SET_DEVICE', this.devices.find(val=>val.id===id));
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
                this.$electron.ipcRenderer.send('minimize')
            },
            maximize(){
                if (this.isFullScreen){
                    this.$electron.ipcRenderer.send('unmaximize')
                }else{
                    this.$electron.ipcRenderer.send('maximize')
                }
                this.isFullScreen = !this.isFullScreen;
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
            },
            onHttpRequest(file){
                console.log(file)
                fileUpload(file).then(res=>{
                    console.log(res)
                    this.hospitalInfo.avatar = res
                })
            },
            getHospitalInfo(){
                getHospitals().then(res=>{
                    console.log(res)
                    if (res.hospital){
                        this.hospitalInfo = res.hospital
                    }
                })
            },
            addHospital(){
                this.dialogHospital = true
                this.getHospitalInfo()
            },
            onclickHos(){
                console.log('onclickHos',this.$electron)
                editHospital(this.hospitalInfo).then(res=>{
                    this.$message.success('保存成功')
                    this.dialogHospital = false
                    // this.getHospitalInfo()
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    .header-view {
        display: flex;
        align-items: center;
        justify-content: space-between;
        &-btn{
            background: rgba(255, 255, 255, 0.08);
            border-radius: 4px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
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
                /*/deep/ .el-select{*/
                    /*height: 100%;*/
                    /*display: flex;*/
                    /*justify-content: center;*/
                    /*align-items: center;*/
                    /*.el-input{*/
                        /*height: 50%;*/
                        /*.el-input__inner {*/
                            /*height: 100%;*/
                            /*background: rgba(255, 255, 255, 0.08);*/
                            /*border-radius: 4px;*/
                            /*border: 1px solid rgba(255, 255, 255, 0.1);*/
                            /*font-size: 14px;*/
                        /*}*/
                        /*.el-input__icon {*/
                            /*line-height: 28px;*/
                        /*}*/
                    /*}*/

                /*}*/

            }
        }
        .btn-sys{
            font-size: 22px;
            color: #ffffff;
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

        /deep/ .el-select{
            input{
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
        }
        /deep/ .el-dialog{
            &__header{
                height: 60px;
                padding: 0!important;
                line-height: 60px;
                background: rgba(255, 255, 255, 0.15);
                border-radius: 4px 4px 0px 0px;
                font-size: 16px;
            }
            &__title{
                font-size: 16px;
            }
        }
        .hospital-image{
            width: 117px;height: 117px;vertical-align: middle;
            display: inline-flex;align-items: center;justify-content: center;
            background: rgba(255, 255, 255, 0.08);
            border-radius: 4px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
    }

</style>
