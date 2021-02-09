<template>
    <div class="setting-page">
        <div class="setting-tab clearfix">
            <div class="setting-tab-left left">
                <div class="setting-type clearfix">
                    <div class="setting-type-item left" :class="{active:typeName=='accelerate'}" @click="changeType('accelerate',0)">加速器配置</div>
                    <div class="setting-type-item left" :class="{active:typeName=='project'}" @click="changeType('project',1)">项目配置</div>
                    <div class="setting-type-item right" :class="{active:typeName=='DICOM'}" @click="changeType('DICOM',2)">DICOM输出配置</div>
                </div>
                <div class="setting-upload" v-if="showTypeIndex==0">
                    <el-button type="primary" class="active" @click="addAccelerate()">添加</el-button>
                </div>
                <div class="setting-upload" v-if="showTypeIndex==2">
                    <el-button type="primary" class="active" @click="addDICOM()">添加</el-button>
                </div>
                <table class="table setting-tab-content" border="0" cellspacing="0" v-if="showTypeIndex==0">
                    <thead class="tab-header">
                    <tr>
                        <th>加速器型号</th>
                        <th>加速器序号</th>
                        <th>x射线能量档</th>
                        <th>电子射线能量档</th>
                        <th>x射线百分深度计量</th>
                        <th>电子射线百分深度计量</th>
                        <th>电子线线光筒</th>
                        <th>多叶光栅对数</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody class="tab-lists">
                    <tr v-for="(device,index) in devices" :key="index">
                        <td>{{device.model}}</td>
                        <td>{{device.sequence}}</td>
                        <td>{{device.x_energy_level}} {{device.xFFF==1?'FFF模式':''}}</td>
                        <td>{{device.e_energy_level}}</td>
                        <td>{{device.x_volume_percent}}</td>
                        <td>{{device.e_volume_percent}}</td>
                        <td>{{device.e_light_size}}</td>
                        <td>{{device.multileaf_collimator_size}}</td>
                        <td class="">
                            <div class="handle">
                                <div class="handle-item" @click="addAccelerate(device)">修改</div>
                                <div class="handle-item" @click="showDelete(device)">删除</div>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <table class="table setting-tab-content" border="0" cellspacing="0" v-if="showTypeIndex==1">
                    <thead class="tab-header">
                    <tr>
                        <th>项目号</th>
                        <th>项目名称</th>
                        <th>次级项目名称</th>
                        <th>阈值</th>
                        <th>检测周期</th>
                        <th>辐射类型</th>
                        <th>能量档</th>
                        <th>检测类型</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody class="tab-lists">
                    <tr v-for="(project,index) in projects" :key="index">
                        <td>{{project.projectNo}}</td>
                        <td>{{project.name}}</td>
                        <td>{{project.subName}}</td>
                        <td>{{project.threshold}}</td>
                        <td>{{project.period}}</td>
                        <td>{{project.radioType}}</td>
                        <td>{{project.energy}}</td>
                        <td>{{project.detectType}}</td>
                        <td class="">
                            <div class="handle">
                                <div class="handle-item" @click="showProjectChange(project)">修改</div>
                                <div class="handle-item" @click="showDelete()">删除</div>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <table class="table setting-tab-content" border="0" cellspacing="0" v-if="showTypeIndex==2">
                    <thead class="tab-header">
                    <tr>
                        <th>序号</th>
                        <th>客户端</th>
                        <th>AE Title</th>
                        <th>IP</th>
                        <th>端口号</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody class="tab-lists">
                    <tr v-for="(dicom,index) in dicoms" :key="index">
                        <td>{{dicom.id}}</td>
                        <td>{{dicom.customer}}</td>
                        <td>{{dicom.aeTitle}}</td>
                        <td>{{dicom.ip}}</td>
                        <td>{{dicom.port}}</td>
                        <td class="">
                            <div class="handle">
                                <div class="handle-item" @click="addDICOM(dicom)">修改</div>
                                <div class="handle-item" @click="showDelete(dicom)">删除</div>
                            </div>
                        </td>
                    </tr>

                    </tbody>
                </table>
                <div class="pagination clearfix">
                    <el-pagination
                            :background="true"
                            layout="prev, pager, next,jumper"
                            :page-size="10"
                            :total="dicomCount"
                            prev-text="上一页"
                            next-text="下一页"
                            class="right"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                    >
                    </el-pagination>

                </div>
                <el-dialog
                        title="添加加速器"
                        :visible.sync="showAccelerate"
                        width="60%"
                        :before-close="handleClose"
                        center
                >
                    <div class="project-change-lists">
                        <div class="project-change-lists-item clearfix">
                            <div class="item-content left">
                                <input type="text" placeholder="请输入" v-model="device.model">
                            </div>
                            <div class="item-name left">型号</div>
                        </div>
                        <div class="project-change-lists-item clearfix">
                            <div class="item-content left">
                                <input type="text" placeholder="请输入" v-model="device.sequence">
                            </div>
                            <div class="item-name left">序号</div>
                        </div>
                    </div>
                    <div class="project-change-lists">

                        <div class="project-change-lists-item clearfix">
                            <div class="item-content left" style="width: 30%">
                                <input type="text" placeholder="请输入" v-model="curX">
                            </div>
                            <div class="item-name-short left">x线/MV</div>
                            <div class="item-name-short left">
                                <input type="checkbox" placeholder="请输入" v-model="device.xFFF">FFF模式
                            </div>
                        </div>

                        <div class="project-change-lists-item clearfix">
                            <div class="item-content left">
                                能量档：<span v-for="(x,index) in xArr" :key="index">{{x}},</span>
                            </div>
                            <div class="item-name left" @click="addEnergyX()">
                                添加
                            </div>

                        </div>
                    </div>
                    <div class="project-change-lists">
                        <div class="project-change-lists-item clearfix">
                            <div class="item-content left">
                                <input type="text" placeholder="请输入" v-model="curE">
                            </div>
                            <div class="item-name left">电子线/MeV</div>
                        </div>
                        <div class="project-change-lists-item clearfix">
                            <div class="item-content left">
                                能量档：<span v-for="(x,index) in eArr" :key="index">{{x}},</span>
                            </div>

                            <div class="item-name left" @click="addEnergyE()">
                                添加
                            </div>

                        </div>
                    </div>
                    <div class="project-change-lists">
                        <div class="project-change-lists-item clearfix">
                            <div class="item-content left">
                                <input type="text" placeholder="请输入" v-model="device.x_volume_percent">
                            </div>
                            <div class="item-name left">x线深度百分计量/%</div>
                        </div>
                        <div class="project-change-lists-item clearfix">
                            <div class="item-content left">
                                <input type="text" placeholder="请输入" v-model="device.e_volume_percent">
                            </div>
                            <div class="item-name left">电子线深度百分计量/%</div>
                        </div>
                    </div>
                    <div class="project-change-lists">
                        <div class="project-change-lists-item clearfix">
                            <div class="item-content left">
                                <input type="text" placeholder="请输入" v-model="device.e_light_size">
                            </div>
                            <div class="item-name left">电子线光筒/cm cone</div>
                        </div>
                        <div class="project-change-lists-item clearfix">
                            <div class="item-content left">
                                <input type="text" placeholder="请输入" v-model="device.multileaf_collimator_size">
                            </div>
                            <div class="item-name left">多叶光栅</div>
                        </div>
                    </div>
                    <div slot="footer">
                        <div class="confirm-btn">
                            <el-button type="primary" class="" @click="cancel">取消</el-button>
                            <el-button type="primary" class="active" @click="saveDevice">保存</el-button>
                        </div>
                    </div>
                </el-dialog>
                <el-dialog
                        title="删除"
                        :visible.sync="isShowDelete"
                        width="30%"
                        :before-close="handleClose"
                        center
                >
                    <div class="delete-item clearfix">
                      确定删除吗？删除后无法恢复
                    </div>
                    <div slot="footer">
                        <div class="delete-btn">
                            <el-button type="primary" class="" @click="isShowDelete=false">取消</el-button>
                            <el-button type="primary" class="active" @click="delConfirm()">确定删除</el-button>
                        </div>
                    </div>
                </el-dialog>
                <el-dialog
                        title="修改项目配置"
                        :visible.sync="isShowProjectChange"
                        width="50%"
                        :before-close="handleClose"
                        center
                >
                    <div class="project-change-lists">
                         <div class="project-change-lists-item clearfix">
                             <div class="item-content left">
                                 <input type="text" v-model="project.period">
                             </div>
                             <div class="item-name left">检测周期</div>
                         </div>
                        <div class="project-change-lists-item clearfix">
                            <div class="item-content left">
                                <input type="text" v-model="project.threshold">
                            </div>
                            <div class="item-name left">阈值</div>
                        </div>
                    </div>
                    <div slot="footer">
                        <div class="confirm-btn">
                            <el-button type="primary" class="" @click="cancel">取消</el-button>
                            <el-button type="primary" class="active" @click="updateProject">保存</el-button>
                        </div>
                    </div>
                </el-dialog>
                <el-dialog
                        title="添加DICOM输出配置"
                        :visible.sync="isShowDICOM"
                        width="40%"
                        :before-close="handleClose"
                        center
                >
                    <div class="project-change-lists">
                        <div class="project-change-lists-item clearfix">
                            <div class="item-content left">
                                <input type="text" placeholder="请输入" v-model="diCom.customer">
                            </div>
                            <div class="item-name left">客户端</div>
                        </div>
                        <div class="project-change-lists-item clearfix">
                            <div class="item-content left">
                                <input type="text" placeholder="请输入" v-model="diCom.aeTitle">
                            </div>
                            <div class="item-name left">AE Title</div>
                        </div>
                    </div>
                    <div class="project-change-lists" style="border-bottom: 1px solid #464646;padding: 0 0 4% 0;">
                        <div class="project-change-lists-item clearfix">
                            <div class="item-content left">
                                <input type="text" placeholder="请输入" v-model="diCom.ip">
                            </div>
                            <div class="item-name left">IP地址</div>
                        </div>
                        <div class="project-change-lists-item clearfix">
                            <div class="item-content left">
                                <input type="text" placeholder="请输入" v-model="diCom.port">
                            </div>
                            <div class="item-name left">端口号</div>
                        </div>
                    </div>
                    <div slot="footer">
                        <div class="confirm-btn">
                            <el-button type="primary" class="" @click="cancel()">取消</el-button>
                            <el-button type="primary" class="active" @click="saveDicom()">保存</el-button>
                        </div>
                    </div>
                </el-dialog>
            </div>
        </div>
    </div>
</template>
<script>
    import { mapState } from 'vuex';
    import { addDicom,getDicoms,delDicom,addDevice,getDevices,delDevice,getProjects,updateProject } from "../../api";
    export default {
        components: {
        },
        data() {
            return {
                typeName:'accelerate',
                showTypeIndex:0,
                showAccelerate:false,
                isShowDelete:false,
                isShowProjectChange:false,
                isShowDICOM:false,
                diCom:{
                    customer:'',
                    aeTitle:'',
                    ip:'',
                    port:'',
                    id:0,
                },
                device:{
                    model:'',
                    sequence:'',
                    x_energy_level:'',
                    e_energy_level:'',
                    x_volume_percent:0,
                    e_volume_percent:0,
                    e_light_size:0,
                    multileaf_collimator_size:0,
                    default_dir:'',
                },
                xArr:[],//当前x的能量档
                eArr:[],//当前y的能量档
                curX:0,//能量档
                curE:0,//能量档
                dicoms:[],
                dicomCount:0,
                currentPage:0,
                devices:[],
                devicesCount:0,
                projects:[],
                project:{},
            }
        },
        mounted() {
             console.log('0')
            getDicoms({pageNum:0,offset:10}).then(res =>{
                console.log(res);
                this.dicoms = res.dicoms;
                this.dicomCount = res.count;
            })
            getDevices({pageNum:0,offset:10}).then(res =>{
                console.log(res);
                this.devices = res.devices;
                this.deviceount = res.count;
            })
            console.log(this.currentDeviceID)
            getProjects({deviceID:this.currentDeviceID,pageNum:0,offset:100}).then(res =>{
                console.log(res);
                this.projects = res.projects;
                this.deviceount = res.count;
            })
        },
        computed: mapState({
            currentDeviceID: state => state.user.currentDeviceID,
        }),
        beforeCreate(){
            console.log('beforeCreate')
        },
        created(){
            console.log('setting created')
            console.log(this.currentDevice)
        },
        beforeMount(){
            console.log('beforeMount')
        },
        watch: {
            currentDeviceID: function (val) {
                console.log(val);
                getProjects({deviceID:val,pageNum:0,offset:100}).then(res =>{
                    console.log(res);
                    this.projects = res.projects;
                    this.deviceount = res.count;
                })
            }
        },
        methods: {
            handleClick() {

            },
            handleClose(){
                console.log('handleClose')
            },
            handleSizeChange(val) {
                this.pageSize = val;
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                console.log(`当前页: ${val}`);
                getDicoms({pageNum:this.currentPage-1,offset:10}).then(res =>{
                    console.log(res);
                    this.dicoms = res.dicoms;
                    this.dicomCount = res.count;
                })
            },
            saveDicom(){
              console.log(this.diCom);
                addDicom(this.diCom).then(res =>{
                    console.log(res);
                    this.isShowDICOM = false;
                    getDicoms({pageNum:0,offset:10}).then(res =>{
                        console.log(res);
                        this.dicoms = res.dicoms;
                        this.dicomCount = res.count;
                    })
                })
            },
            saveDevice(){
                console.log(this.device);
                if(this.xArr.length) this.device.x_energy_level = JSON.stringify(this.xArr);
                if(this.eArr.length) this.device.e_energy_level = JSON.stringify(this.eArr);
                console.log(this.device);
                addDevice(this.device).then(res =>{
                    console.log(res);
                    this.showAccelerate = false;
                    getDevices({pageNum:0,offset:10}).then(res =>{
                        console.log(res);
                        this.devices = res.devices;
                        this.devicecount = res.count;
                    })
                })
            },
            updateProject(){
                console.log(this.project);
                updateProject(this.project).then(res =>{
                    this.isShowProjectChange = false;
//                    getProjects({deviceID:this.currentDeviceID,pageNum:0,offset:100}).then(res =>{
//                        console.log(res);
//                        this.projects = res.projects;
//                    })
                })
            },
            cancel(){
                this.xArr=[];
                this.curX = 0;
                this.curE = 0;
                this.eArr=[];
                this.showAccelerate = false;
                this.isShowDICOM = false;
                this.isShowProjectChange =false;
            },
            changeType(typeName,index){
               this.typeName = typeName;
               this.showTypeIndex = index;

            },
            addAccelerate(device){
                if(device) {
                    this.device = device;
                }
                else this.device = {
                    model:'',
                    sequence:'',
                    x_energy_level:'',
                    e_energy_level:'',
                    x_volume_percent:0,
                    e_volume_percent:0,
                    e_light_size:0,
                    multileaf_collimator_size:0,
                    default_dir:'',
                    xFFF:0,
                };
                this.showAccelerate=true;
            },
            addDICOM(diCom){
               if(diCom) this.diCom = diCom;
               else this.dicom = {
                   customer:'',
                   aeTitle:'',
                   ip:'',
                   port:'',
                   id:0,
               };
               this.isShowDICOM = true;
            },
            addEnergyX(){
                if(this.curX>0){
                    this.xArr.push(this.curX);
                }
            },
            addEnergyE(){
                if(this.curE>0){
                    this.eArr.push(this.curE);
                }
            },
            delConfirm(){
                if(this.showTypeIndex==2)
                {
                    delDicom(this.diCom).then(res =>{
                        console.log(res);
                        this.isShowDelete = false;
                        getDicoms({pageNum:0,offset:10}).then(res =>{
                            console.log(res);
                            this.dicoms = res.dicoms;
                            this.dicomCount = res.count;
                        })
                    })
                }
                else if(this.showTypeIndex==0)
                {
                    delDevice(this.device).then(res =>{
                        console.log(res);
                        this.isShowDelete = false;
                        getDevices({pageNum:0,offset:10}).then(res =>{
                            console.log(res);
                            this.devices = res.devices;
                            this.devicecount = res.count;
                        })
                    })
                }

            },
            showDelete(obj){
                this.isShowDelete=true;
                if(this.showTypeIndex==2)
                    this.diCom=obj;
                else if(this.showTypeIndex==0)
                    this.device=obj;

            },
            showProjectChange(project){
                if(project) this.project = project;
                else {
                    console.log('error')
                };
                this.isShowProjectChange=true;
            }
        }
    }
</script>
<style lang="scss" scoped>
    .setting-page {
        width: 100%;
       padding:25px 26px 44px;
        .setting-tab{
            height: 100%;
            /*margin-top: 25px;*/
            .setting-tab-left{
                width: 100%;
                height: 100%;
                background: rgba(255,255,255,0.1);
                .setting-type{
                    background: rgba(255,255,255,0.1);
                    .setting-type-item{
                        width: 33.3%;
                        background: #2C2C2C;
                        color: rgba(255,255,255,0.8);
                        text-align: center;
                        padding: 1% 0;
                        font-size: 14px;
                        border-bottom: 6px solid #2C2C2C;
                    }
                    .active{
                        background: #3C3C3C;
                        border-bottom: 6px solid #2CCEAD;
                        color: #2CCEAD;
                    }
                }
                .setting-upload{
                    height: 10%;
                    margin-right: 1%;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    /deep/ .el-button--primary {
                        width: 12%;
                        text-align: center;
                        background: rgba(255, 255, 255, 0.08);
                        border-radius: 4px;
                        border: 1px solid rgba(44, 206, 173, 0.5);
                        color: #2CCEAD;
                        padding: 0.8% 0;
                        font-size: 14px;
                    }
                    .active{
                        background: #2CCEAD;
                        border-radius: 4px;
                        color: #FFFFFF;
                    }
                }
                .setting-tab-content{
                    width: 100%;
                    .tab-header{
                        background: rgba(255,255,255,0.1);
                        color: #fff;
                        font-family: "Microsoft YaHei";
                        font-weight: 400;
                        font-size: 12px;
                    }
                    .tab-lists{
                        /*background: rgba(255,255,255,0.1);*/
                        color: rgba(255,255,255,0.8);
                        font-family: "Microsoft YaHei";
                        font-size: 11px;
                        text-align: center;
                        .watch-history{
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: #2CCEAD;
                        }

                    }
                }
                .pagination{
                    margin-top: 2%;
                    /deep/ .el-pagination{
                        .btn-prev{
                            background-color: #1C1C1C;
                            border: 1px solid #464646;
                            color: rgba(255,255,255,0.8);
                        }
                        :disabled{
                            color: rgba(255,255,255,0.8);
                        }
                        .btn-next{
                            background-color: #1C1C1C;
                            border: 1px solid #464646;
                            color: rgba(255,255,255,0.8);
                        }
                        .el-pager li{
                            background: #1C1C1C;
                            border: 1px solid #464646;
                            color: rgba(255,255,255,0.8);
                        }
                        .el-pagination.is-background .el-pager li:not(.disabled).active{
                            background-color: #3D3D3D!important;
                        }
                        .el-pagination__jump{
                            color: rgba(255,255,255,0.8);
                            .el-input__inner{
                                background-color: #1C1C1C;
                                border: 1px solid #464646;
                                color: rgba(255,255,255,0.8);
                            }
                        }
                    }


                }
            }
            .setting-tab-right{
                width: 16%;
                height: 100%;
                background: rgba(255,255,255,0.1);
                .setting-tab-right-item{
                    background: #2C2C2C;
                    padding: 6% 0;
                    text-align: center;
                    font-size: 14px;
                    border-left: 6px solid #2CCEAD;
                    color: rgba(255,255,255,0.8);
                }
                .setting-tab-right-name{
                    padding: 6% 2%;
                    text-align: center;
                    font-size: 13px;
                    color: rgba(255,255,255,0.8);
                    border-bottom: 1px solid #464646;
                }
                .setting-tab-right-content{
                    font-size: 13px;
                    color: rgba(255,255,255,0.8);
                    line-height: 15px;
                    padding: 0 10%;
                    margin-top: 10%;
                }
            }

        }
        /deep/ .el-dialog__wrapper{
            display: flex;
            justify-content: center;
            align-items: center;
        }
        /deep/ .el-dialog{
            margin-top: 0vh!important;
            margin: 0;
            .el-dialog__header{
                background: #3C3C3C;
                padding:8px 0;
                .el-dialog__title{
                    color: rgba(255,255,255,0.8);
                    font-size: 14px;

                }
                .el-dialog__headerbtn{
                    top: 12px;
                }
            }
            .el-dialog__body{
                background-color: #1C1C1C;
                color: rgba(255,255,255,0.8);
                padding: 0 2%;
            }
            .el-dialog__footer{
                background-color: #1C1C1C;
                color: rgba(255,255,255,0.8);
            }
        }
        .table-list{
            width: 100%;
            /*text-align: center;*/


        }
        .dialog-footer{

        }
    }
    .table-more{
        padding: 0;
        .table-child{
            border-bottom: 1px solid #464646;
            padding: 1.5% 0;
        }
        :last-child{
            border-bottom: 0;
        }
    }
    .confirm-btn{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        /deep/ .el-button--primary {
            width: 20%;
            height: 100%;
            text-align: center;
            background: rgba(255, 255, 255, 0.08);
            border-radius: 4px;
            border: 1px solid rgba(44, 206, 173, 0.5);
            color: #2CCEAD;
            padding: 2% 0;
        }
        .active{
            background: #2CCEAD;
            border-radius: 4px;
            color: #FFFFFF;
        }
    }
    .add-item{
        padding: 2%;
        border-bottom: 1px solid #464646;
        .add-item-lists{
            width: 46%;
            margin: 2%;
           /deep/ .el-input__inner{
               background: #2C2C2C;
               border: 0;
               font-size: 14px;
           }
        }
    }
    .delete-item{
        padding: 10% 0;
        text-align: center;
        border-bottom: 1px solid #464646;
    }
    .delete-btn{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        /deep/ .el-button--primary {
            width: 35%;
            height: 100%;
            text-align: center;
            background: rgba(255, 255, 255, 0.08);
            border-radius: 4px;
            border: 1px solid rgba(44, 206, 173, 0.5);
            color: #2CCEAD;
            padding: 2% 0;
        }
        .active{
            background: #2CCEAD;
            border-radius: 4px;
            color: #FFFFFF;
        }
    }
    .project-change-lists{
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 4% 0 4% 0;
        .project-change-lists-item{
            width: 40%;
            border: 1px solid #464646;
            background-color: #2C2C2C;
            font-size: 12px;
           .item-content{
               width: 58%;
               input{
                   width: 100%;
                   background-color: #2C2C2C;
                   padding: 6% 0;
                   border: 0;
                   color: #fff;
               }
           }
            .item-name{
                width: 35%;
                border-left: 1px solid #464646;
                margin-left: 2%;
                padding: 3% 0;
                text-align: center;
            }
            .item-name-short{
                width: 30%;
                border-left: 1px solid #464646;
                margin-left: 2%;
                padding: 3% 0;
                text-align: center;
            }
        }
    }
    .handle{
        /deep/ .el-button{
            border: 0;
            background: transparent;
            font-size: 1.06vw;
            color: #2CCEAD;
        }
        .project-lists{

            .project-lists-item{
                margin-right: 10px;
            }
        }

    }
    .el-popover{
          background: #2C2C2C !important;
    }
</style>
