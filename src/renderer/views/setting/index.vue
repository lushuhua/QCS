<template>
    <div class="setting-page page-qcs">
        <div class="setting-tab clearfix page-qcs-body">
            <div class="setting-tab-left left">
                <div class="setting-type clearfix">
                    <div class="setting-type-item left" :class="{active:typeName=='accelerate'}" @click="changeType('accelerate',0)">加速器配置</div>
                    <div class="setting-type-item left" :class="{active:typeName=='project'}" @click="changeType('project',1)">项目配置</div>
                    <div class="setting-type-item right" :class="{active:typeName=='DICOM'}" @click="changeType('DICOM',2)">DICOM输出配置</div>
                </div>
                <div class="setting-upload" v-if="showTypeIndex==0">
                    <el-button type="primary" class="active" @click="addAccelerate()">添加</el-button>
                    <el-button type="primary" class="active" @click="addAccelerate(currentDeviceInfo)">编辑</el-button>
                    <el-button type="primary" class="active" @click="onDelDevice()">删除</el-button>
                </div>
                <div class="setting-upload" v-if="showTypeIndex==2">
                    <el-button type="primary" class="active" @click="addDICOM()">添加</el-button>
                </div>
                <div class="setting-tab-content">
                    <div v-if="showTypeIndex==0">
                        <el-table :data="devicesData" border :row-style="getStyle" :span-method="objectSpanMethod">
                            <el-table-column prop="name"></el-table-column>
                            <el-table-column label="能量档" prop="power" width="220">
                                <template slot-scope="scope">
                                    <div style="display: flex;align-items: center">
                                        <div class="input-label-container" style="display: inline-flex;margin-right: 5px">
                                            <el-input v-model="scope.row.x" type="number" @change="onblur"></el-input>
                                            <span>{{scope.row.name===lineXInit.name?'MV':'MeV'}}</span>
                                        </div>
                                        <el-checkbox v-if="scope.row.name===lineXInit.name" style="flex: none;" v-model="scope.row.checked">FFF模式</el-checkbox>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="百分深度剂量" width="150" prop="deep">
                                <template slot-scope="scope">
                                    <div class="input-label-container">
                                        <el-input v-model="scope.row.deep" type="number" @change="onblur"></el-input>
                                        <span>%</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" prop="todo">
                                <template slot-scope="scope">
                                    <el-button type="text" v-if="devicesData.filter(value => value.name===scope.row.name).length>1" @click="onclickDeviceDel(scope)">删除</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" prop="add">
                                <template slot-scope="scope">
                                    <el-button icon="el-icon-plus" @click="onclickDevice(scope.row)">添加</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!--<table class="table" border="0" cellspacing="0">-->
                            <!--<tr v-for="(v,index) in devicesData" :key="index">-->
                                <!--<td :rowspan="v.rowspan">{{v.name}}</td>-->
                                <!--<td :rowspan="v.rowspan">-->
                                    <!--<div style="display: flex;align-items: center">-->
                                        <!--<div class="input-label-container" style="display: inline-flex;margin-right: 5px">-->
                                            <!--<el-input v-model="v.x" type="number" @blur="onblur"></el-input>-->
                                            <!--<span>MV</span>-->
                                        <!--</div>-->
                                        <!--<el-checkbox v-if="v.name===lineXInit.name" style="flex: none;" v-model="v.checked">FFF模式</el-checkbox>-->
                                    <!--</div>-->
                                <!--</td>-->
                                <!--<td :rowspan="v.rowspan">-->
                                    <!--<div class="input-label-container">-->
                                        <!--<el-input v-model="v.deep" type="number" @blur="onblur"></el-input>-->
                                        <!--<span>%</span>-->
                                    <!--</div>-->
                                <!--</td>-->
                                <!--<td :rowspan="v.rowspan">-->
                                    <!--<el-button type="text" v-if="devicesData.filter(value => value.name===v.name).length>1" @click="onclickDeviceDel(v,index)">删除</el-button>-->
                                <!--</td>-->
                                <!--<td :rowspan="v.rowspan">-->
                                    <!--<el-button icon="el-icon-plus" @click="onclickDevice(v)">添加</el-button>-->
                                <!--</td>-->
                            <!--</tr>-->
                        <!--</table>-->
                    </div>
                    <!--<table class="table" border="0" cellspacing="0" v-if="showTypeIndex==0">-->
                        <!--<thead class="tab-header">-->
                        <!--<tr>-->
                            <!--<th>加速器型号</th>-->
                            <!--<th>加速器序号</th>-->
                            <!--<th>x射线能量档</th>-->
                            <!--<th>电子射线能量档</th>-->
                            <!--<th>x射线百分深度计量</th>-->
                            <!--<th>电子射线百分深度计量</th>-->
                            <!--<th>电子线线光筒</th>-->
                            <!--<th>多叶光栅对数</th>-->
                            <!--<th>操作</th>-->
                        <!--</tr>-->
                        <!--</thead>-->
                        <!--<tbody class="tab-lists">-->
                        <!--<tr v-for="(device,index) in devices" :key="index">-->
                            <!--<td>{{device.model}}</td>-->
                            <!--<td>{{device.sequence}}</td>-->
                            <!--<td>-->
                                <!--<div v-for="(v,index) in device.powerX" :key="index">{{v.x}}{{v.checked?' FFF模式':''}}</div>-->
                            <!--</td>-->
                            <!--<td>-->
                                <!--<div v-for="(v,index) in device.powerE" :key="index">{{v.x}}</div>-->
                            <!--</td>-->
                            <!--<td>{{device.x_volume_percent}}</td>-->
                            <!--<td>{{device.e_volume_percent}}</td>-->
                            <!--<td>{{device.e_light_size}}</td>-->
                            <!--<td>{{device.multileaf_collimator_size}}</td>-->
                            <!--<td class="">-->
                                <!--<div class="handle">-->
                                    <!--<div class="handle-item" @click="addAccelerate(device)">修改</div>-->
                                    <!--<div class="handle-item" @click="showDelete(device)">删除</div>-->
                                <!--</div>-->
                            <!--</td>-->
                        <!--</tr>-->
                        <!--</tbody>-->
                    <!--</table>-->
                    <table class="table" border="0" style="margin-top: 20px" cellspacing="0" v-if="showTypeIndex==1">
                        <thead class="tab-header">
                        <tr>
                            <th>项目号</th>
                            <th>项目名称</th>
                            <th>阈值</th>
                            <th>检测周期</th>
                            <!--<th>辐射类型</th>-->
                            <!--<th>能量档</th>-->
                            <th>检测类型</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody class="tab-lists">
                        <tr v-for="(project,index) in projects" :key="index">
                            <td>{{project.projectNo}}</td>
                            <td style="max-width: 300px">{{project.name}}{{project.subName?('('+project.subName+')'):''}}</td>
                            <td>{{project.threshold}}</td>
                            <td>{{project.period}}</td>
                            <!--<td>{{project.radioType}}</td>-->
                            <!--<td><div v-for="(v,index) in device.powerX" :key="index">{{v.x}}{{v.checked?' FFF模式':''}}</div></td>-->
                            <td>{{project.detectType}}</td>
                            <td class="">
                                <div class="handle">
                                    <div class="handle-item" @click="showProjectChange(project)">修改</div>
                                    <div class="handle-item" @click="showDelete(project)">删除</div>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <table class="table" border="0" cellspacing="0" v-if="showTypeIndex==2">
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
                    <!--<div class="pagination clearfix" v-show="showTypeIndex==0">-->
                        <!--<el-pagination-->
                                <!--:background="true"-->
                                <!--layout="total, prev, pager, next,jumper"-->
                                <!--:page-size="10"-->
                                <!--:total="deviceInfo.count"-->
                                <!--prev-text="上一页"-->
                                <!--next-text="下一页"-->
                                <!--class="right"-->
                                <!--@current-change="handleCurrentChange"-->
                                <!--:current-page="deviceInfo.pageNum"-->
                        <!--&gt;-->
                        <!--</el-pagination>-->

                    <!--</div>-->
                    <div class="pagination clearfix" v-show="showTypeIndex==1">
                        <el-pagination
                                :background="true"
                                layout="total, prev, pager, next,jumper"
                                :page-size="10"
                                :total="projectInfo.count"
                                prev-text="上一页"
                                next-text="下一页"
                                class="right"
                                @current-change="handleCurrentChange"
                                :current-page="projectInfo.pageNum"
                        >
                        </el-pagination>

                    </div>
                    <div class="pagination clearfix" v-show="showTypeIndex==2">
                        <el-pagination
                                :background="true"
                                layout="total, prev, pager, next,jumper"
                                :page-size="10"
                                :total="dicomsInfo.count"
                                prev-text="上一页"
                                next-text="下一页"
                                class="right"
                                @current-change="handleCurrentChange"
                                :current-page="dicomsInfo.pageNum"
                        >
                        </el-pagination>

                    </div>

                </div>
                <el-dialog
                        title="添加加速器"
                        :visible.sync="showAccelerate"
                        width="610px"
                        center
                >
                    <div class="project-change-lists">
                        <div class="project-change-lists-item required">
                            <input type="text" class="item-content" placeholder="请输入" v-model="device.model">
                            <div class="item-name">加速器型号</div>
                        </div>
                        <div class="project-change-lists-item required">
                            <input type="number" min="0" class="item-content" placeholder="请输入" v-model="device.sequence">
                            <div class="item-name">加速器序号</div>
                        </div>
                    </div>
                    <!--<div class="project-change-lists">-->

                        <!--<div class="project-change-lists-item project-change-x-line required" :class="{'project-change-line': !device.powerX || device.powerX.length==0}">-->
                            <!--<div class="content">-->
                                <!--<input type="number" class="item-content" min="0" placeholder="请输入" style="width: 30%;" v-model="curX">-->
                                <!--<div class="item-name-short">x线/MV</div>-->
                            <!--</div>-->
                            <!--&lt;!&ndash;<div class="item-name-short">&ndash;&gt;-->
                                <!--&lt;!&ndash;<input type="checkbox" placeholder="请输入" v-model="device.xFFF">FFF模式&ndash;&gt;-->
                            <!--&lt;!&ndash;</div>&ndash;&gt;-->
                            <!--&lt;!&ndash;<input type="checkbox" placeholder="请输入" v-model="device.xFFF">FFF模式&ndash;&gt;-->
                            <!--<div class="project-change-checkbox">-->
                                <!--<el-checkbox v-model="curCheckedX">FFF模式</el-checkbox>-->
                            <!--</div>-->
                        <!--</div>-->
                        <!--<div class="project-change-lists-item project-change-x-line" :class="{'project-change-line': index === device.powerX.length-1}" v-for="(v,index) in device.powerX" :key="index">-->
                            <!--<div class="content">-->
                                <!--<input type="text" class="item-content" placeholder="请输入" style="width: 30%;" v-model="v.x" readonly>-->
                                <!--<div class="item-name-short">x线/MV</div>-->
                                <!--<img src="../../assets/images/del.png" class="content-del" @click="onPowerClickDel(index)">-->
                            <!--</div>-->
                            <!--<div class="project-change-checkbox">-->
                                <!--<el-checkbox v-model="v.checked" readonly>FFF模式</el-checkbox>-->
                            <!--</div>-->
                        <!--</div>-->
                        <!--<div class="project-change-lists-item project-change-power-add" @click="onPowerClickX">-->
                            <!--&lt;!&ndash;<div class="item-content left">&ndash;&gt;-->
                                <!--&lt;!&ndash;能量档：<span v-for="(x,index) in xArr" :key="index">{{x}},</span>&ndash;&gt;-->
                            <!--&lt;!&ndash;</div>&ndash;&gt;-->
                            <!--&lt;!&ndash;<div class="item-name left" @click="addEnergyX()">&ndash;&gt;-->
                                <!--&lt;!&ndash;添加&ndash;&gt;-->
                            <!--&lt;!&ndash;</div>&ndash;&gt;-->
                            <!--<img src="../../assets/images/add.png" width="18" style="margin-right: 5px;vertical-align: middle">添加x线能量档-->
                        <!--</div>-->
                    <!--</div>-->
                    <!--<div class="project-change-lists">-->
                        <!--<div class="project-change-lists-item project-change-e" :class="{'project-change-line': !device.powerE || device.powerE.length==0}">-->
                            <!--<input type="number" min="0" class="item-content" placeholder="请输入" v-model="curE">-->
                            <!--<div class="item-name left">电子线/MeV</div>-->
                        <!--</div>-->
                        <!--<div class="project-change-lists-item project-change-e" :class="{'project-change-line': index === device.powerE.length-1}" v-for="(v,index) in device.powerE" :key="index">-->
                            <!--<input type="number" min="0" class="item-content" placeholder="请输入" v-model="v.x" readonly>-->
                            <!--<div class="item-name left">电子线/MeV</div>-->
                            <!--<img src="../../assets/images/del.png" class="content-del" @click="onPowerClickDelE(index)">-->
                        <!--</div>-->
                        <!--<div class="project-change-lists-item project-change-power-add" @click="onPowerClickE">-->
                            <!--&lt;!&ndash;<div class="item-content">&ndash;&gt;-->
                                <!--&lt;!&ndash;能量档：<span v-for="(x,index) in eArr" :key="index">{{x}},</span>&ndash;&gt;-->
                            <!--&lt;!&ndash;</div>&ndash;&gt;-->

                            <!--&lt;!&ndash;<div class="item-name" @click="addEnergyE()">&ndash;&gt;-->
                                <!--&lt;!&ndash;添加&ndash;&gt;-->
                            <!--&lt;!&ndash;</div>&ndash;&gt;-->
                            <!--<img src="../../assets/images/add.png" width="18" style="margin-right: 5px;vertical-align: middle">添加电子线能量档-->
                        <!--</div>-->
                    <!--</div>-->
                    <!--<div class="project-change-lists">-->
                        <!--<div class="project-change-lists-item required">-->
                            <!--<input type="number" class="item-content" min="0" placeholder="请输入" style="width: 20%;" v-model="device.x_volume_percent">-->
                            <!--<div class="item-name">x线深度百分剂量/%</div>-->
                        <!--</div>-->
                        <!--<div class="project-change-lists-item">-->
                            <!--<input type="number" class="item-content" min="0" placeholder="请输入" style="width: 20%;" v-model="device.e_volume_percent">-->
                            <!--<div class="item-name">电子线深度百分剂量/%</div>-->
                        <!--</div>-->
                    <!--</div>-->
                    <div class="project-change-lists">
                        <div class="project-change-lists-item required">
                            <input type="number" class="item-content" min="0" placeholder="请输入" style="width: 20%;" v-model="device.e_light_size">
                            <div class="item-name">电子限光筒/cm cone</div>
                        </div>
                        <div class="project-change-lists-item">
                            <div class="item-content project-change-radio-group" style="width: 63%;">
                                <!--<input type="text" placeholder="请输入" v-model="device.multileaf_collimator_size">-->
                                <el-radio-group v-model="device.multileaf_collimator_size">
                                    <el-radio :label="40">40</el-radio>
                                    <el-radio :label="60">60</el-radio>
                                    <el-radio :label="80">80</el-radio>
                                </el-radio-group>
                            </div>
                            <div class="item-name" style="font-size: 14px">多叶光栅(对)</div>
                        </div>
                    </div>
                    <div slot="footer">
                        <div class="confirm-btn">
                            <el-button type="primary" class="" style="margin-right: 45px" @click="cancel">取消</el-button>
                            <el-button type="primary" class="active" @click="saveDevice">保存</el-button>
                        </div>
                    </div>
                </el-dialog>
                <el-dialog
                        title="删除"
                        :visible.sync="isShowDelete"
                        width="30%"
                        center
                >
                    <div class="delete-item clearfix">
                      确定删除吗？删除后无法恢复
                    </div>
                    <div slot="footer">
                        <div class="delete-btn">
                            <el-button @click="isShowDelete=false">取消</el-button>
                            <el-button type="primary" @click="delConfirm()">确定删除</el-button>
                        </div>
                    </div>
                </el-dialog>
                <el-dialog
                        title="修改项目配置"
                        :visible.sync="isShowProjectChange"
                        width="610px"
                        center
                >
                    <div class="project-change-lists">
                         <div class="project-change-lists-item">
                             <!--<input class="item-content" type="text" v-model="project.period">-->
                             <el-select v-model="project.period" placeholder="请选择检测周期" >
                                 <el-option value="一天"></el-option>
                                 <el-option value="一周"></el-option>
                                 <el-option value="一个月"></el-option>
                                 <el-option value="三个月"></el-option>
                                 <el-option value="六个月"></el-option>
                                 <el-option value="一年"></el-option>
                             </el-select>
                             <div class="item-name" style="width: 80px;flex: none;height: 100%;border-left: 1px solid rgba(255,255,255,0.08);line-height: 45px">检测周期</div>
                         </div>
                        <div class="project-change-lists-item">
                            <input type="text" class="item-content" style="width: 50px;" v-model="project.thresholdValue">
                            
                            <!-- <el-select v-model="project.testUnit" placeholder="单位" >
                                <el-option value="mm"></el-option>
                                <el-option value="%"></el-option>
                                <el-option value="°"></el-option>
                            </el-select> -->
                            <div class="item-name" style="width: 40px;flex: none;height: 100%;border-left: 1px solid rgba(255,255,255,0.08);line-height: 45px">阈值</div>
                        </div>
                    </div>
                    <div slot="footer">
                        <div class="confirm-btn">
                            <el-button type="primary" class="" style="margin-right: 45px" @click="cancel">取消</el-button>
                            <el-button type="primary" class="active" @click="updateProject">保存</el-button>
                        </div>
                    </div>
                </el-dialog>
                <el-dialog
                        title="添加DICOM输出配置"
                        :visible.sync="isShowDICOM"
                        width="610px"
                        center
                >
                    <div class="project-change-lists">
                        <div class="project-change-lists-item">
                            <input type="text" class="item-content" style="width: 60%" placeholder="请输入" v-model="diCom.customer">
                            <div class="item-name ">客户端</div>
                        </div>
                        <div class="project-change-lists-item ">
                            <input type="text" class="item-content" style="width: 60%" placeholder="请输入" v-model="diCom.aeTitle">
                            <div class="item-name">AE Title</div>
                        </div>
                    </div>
                    <div class="project-change-lists">
                        <div class="project-change-lists-item">
                            <input class="item-content" type="text" style="width: 60%" placeholder="请输入" v-model="diCom.ip">
                            <div class="item-name">IP地址</div>
                        </div>
                        <div class="project-change-lists-item">
                            <input type="text" class="item-content" style="width: 60%" placeholder="请输入" v-model="diCom.port">
                            <div class="item-name">端口号</div>
                        </div>
                    </div>
                    <div slot="footer">
                        <div class="confirm-btn">
                            <el-button type="primary" class="" style="margin-right: 45px" @click="cancel()">取消</el-button>
                            <el-button type="primary" class="active" @click="saveDicom()">发送</el-button>
                        </div>
                    </div>

                    
                </el-dialog>
            </div>
        </div>
    </div>
</template>
<script>
    import { mapState } from 'vuex';
    import { addDicom,getDicoms,delDicom,addDevice,getDevices,delDevice,getProjects,updateProject,delDeviceProject } from "../../api";
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
                    x_volume_percent: undefined,
                    e_volume_percent: undefined,
                    e_light_size: undefined,
                    multileaf_collimator_size: undefined,
                    default_dir:'',
                    powerX: [], //当前x的能量档
                    powerE: []  //当前y的能量档
                },
                currentProject: null,
                curX: undefined,//能量档
                curE: undefined,//能量档
                dicoms:[],
                totalCount:0,
                currentPage:0,
                devices:[],
                projects:[],
                project:{
                    period: null,
                    testUnit: null,
                    thresholdValue: null
                },
                curCheckedX: false,
                deviceInfo: {
                    pageNum: 1,
                    offset: 100,
                    count: 0
                },
                dicomsInfo: {
                    pageNum: 1,
                    offset: 10,
                    count: 0
                },
                projectInfo: {
                    pageNum: 1,
                    offset: 10,
                    count: 0
                },
                dialogHospital: false,
                lineXInit: {name: 'X线',rowspan:1,x: undefined,deep: undefined,checked:false},
                lineEleInit: {name: '电子线',rowspan:1,x: undefined,deep: undefined},
            }
        },
        mounted() {
             console.log('0')
        },
        computed: mapState({
            currentDeviceID: state => state.user.currentDeviceID,
            currentDeviceInfo: state => state.user.currentDeviceInfo,
        }),
        beforeCreate(){
            console.log('beforeCreate')
        },
        created(){
            console.log('setting created')
            this.initDeviceData()
        },
        beforeMount(){
            console.log('beforeMount')
        },
        watch: {
            currentDeviceID: function (val) {
                console.log(val);
                // this.getProjectsData()
                if (this.$route.name === 'setting'){
                    this.changeType(this.typeName,this.showTypeIndex)
                    this.initDeviceData()
                }
            }
        },
        methods: {
            initDeviceData(){
                console.log('initDeviceData')
                let deviceInfo = this.currentDeviceInfo,data=[]
                if (deviceInfo.x_energy_level || deviceInfo.e_energy_level){
                    if (deviceInfo.x_energy_level){
                        JSON.parse(deviceInfo.x_energy_level).forEach(val=>{
                            data.push({name: this.lineXInit.name,rowspan:0,x: val.x,deep: val.deep,checked: val.checked})
                        })
                    }
                    if (deviceInfo.e_energy_level){
                        JSON.parse(deviceInfo.e_energy_level).forEach(val=>{
                            data.push({name: this.lineEleInit.name,rowspan:0,x: val.x,deep: val.deep})
                        })
                    }
                    this.devicesData = this.deviceDataTransfer(data)
                }else {
                    this.devicesData = [this.lineXInit,this.lineEleInit]
                }
                this.$forceUpdate()
            },
            getProjectsData(state){
                if (state) this.projectInfo.pageNum = 1
                getProjects({deviceID:this.currentDeviceID,pageNum: this.projectInfo.pageNum-1,offset: this.projectInfo.offset,orderBy: 'projectID&asc'}).then(res =>{
                    console.log(res);
                    if (res.devices){
                        res.devices.forEach(val=>{
                            val.powerX = JSON.parse(val.energy)
                            // val.powerE = val.e_energy_level?JSON.parse(val.e_energy_level):[]
                        })
                    }
                    this.projects = res.projects;
                    console.log(this.projects,'88888888888888888888888')
                    this.projectInfo.count = res.count;
                })
            },
            getDicomsData(state){
                if (state) this.dicomsInfo.pageNum = 1
                getDicoms({deviceID:this.currentDeviceID,pageNum: this.dicomsInfo.pageNum-1,offset: this.dicomsInfo.offset}).then(res =>{
                    console.log(res);
                    this.dicoms = res.dicoms;
                    this.dicomsInfo.count = res.count;
                })
            },
            getDevicesData(state,type){
                if (state) this.deviceInfo.pageNum = 1
                getDevices({pageNum: this.deviceInfo.pageNum-1,offset: this.deviceInfo.offset}).then(res =>{
                    console.log(res);
                    if (res.devices){
                        // res.devices.forEach(val=>{
                            // val.powerX = JSON.parse(val.x_energy_level)
                            // val.powerE = val.e_energy_level?JSON.parse(val.e_energy_level):[]
                        // })
                    }
                    this.devices = res.devices;
                    this.deviceInfo.count = res.count;
                    this.$store.commit('SET_DEVICES',res.devices)
                    if (!type){
                        this.$store.commit('SET_DEVICE',res.devices&&res.devices.length>0?res.devices[0]:null)
                    }
                })
            },
            onPowerClickX(){
                this.device.powerX = this.device.powerX?this.device.powerX:[]
                if (this.curCheckedX) {  /// FFF模式只能有一个
                    let index = this.device.powerX.findIndex(val=>val.checked)
                    if (index != -1){
                        this.$message.error('FFF模式只能有一个')
                        return
                    }
                }
                if (!this.curX){
                    this.$message.error('请填写X线')
                    return
                }
                this.device.powerX.push({x: this.curX,checked: this.curCheckedX})
                console.log(this.device.powerX)
                this.curX = undefined
                this.curCheckedX = false
                this.$forceUpdate()
            },
            onPowerClickDel(index){
                this.device.powerX.splice(index,1)
                this.$forceUpdate()
            },
            onPowerClickE(){
                this.device.powerE = this.device.powerE?this.device.powerE:[]
                if (!this.curE){
                    this.$message.error('请填写电子线')
                    return
                }
                this.device.powerE.push({x: this.curE})
                console.log(this.device.powerE)
                this.curE = undefined
                this.$forceUpdate()
            },
            onPowerClickDelE(index){
                this.device.powerE.splice(index,1)
                this.$forceUpdate()
            },
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
                console.log(`当前页: ${val}`);
                switch (this.showTypeIndex) {
                    case 0:
                        this.deviceInfo.pageNum = val
                        break;
                    case 1:
                        this.projectInfo.pageNum = val
                        break;
                    case 2:
                        this.dicomsInfo.pageNum = val
                        break;
                }
                this.changeType(this.typeName,this.showTypeIndex)
            },
            saveDicom(){
              console.log(this.diCom);
                this.diCom.deviceID = this.currentDeviceID
                addDicom(this.diCom).then(res =>{
                    console.log(res);
                    this.isShowDICOM = false;
                    this.getDicomsData(1)
                })
            },
            saveDevice(){
                if (!this.device.model){
                    this.$message.error('请填写加速器型号')
                    return
                }
                if (!this.device.sequence){
                    this.$message.error('请填写加速器序号')
                    return
                }
                // if (!this.device.powerX || this.device.powerX.length===0){
                //     this.$message.error('请填写X线能量档')
                //     return
                // }
                // if (!this.device.x_volume_percent){
                //     this.$message.error('请填写x线深度百分剂量')
                //     return
                // }
                if (!this.device.e_light_size){
                    this.$message.error('请填写电子限光筒')
                    return
                }
                this.device.x_energy_level = JSON.stringify([{x: 0,deep: 0,checked: false}]);
                this.device.e_energy_level = JSON.stringify([{x: 0,deep: 0}]);
                console.log(this.device);
                // this.device.x_energy_level = JSON.stringify(this.device.powerX);
                // if(this.device.powerE && this.device.powerE.length>0) this.device.e_energy_level = JSON.stringify(this.device.powerE);
                // console.log(this.device);
                // return
                addDevice(this.device).then(res =>{
                    console.log(res);
                    this.showAccelerate = false;
                    this.getDevicesData(1)
                })
            },

            onblur(){
                let x_energy_level = [],e_energy_level=[]
                this.devicesData.forEach(val=>{
                    console.log(val)
                    if (val.x == null) {
                        return;
                    } 
                    if (val.name === this.lineXInit.name){
                        x_energy_level.push({x: val.x,deep: val.deep,checked: val.checked})
                    } else {
                        e_energy_level.push({x: val.x,deep: val.deep})

                    }
                })
                let obj = {
                    id: this.currentDeviceID,
                    x_energy_level: JSON.stringify(x_energy_level),
                    e_energy_level: JSON.stringify(e_energy_level),
                }
                console.log('onblur',obj)
                addDevice(obj).then(res =>{
                    this.getDevicesData(1,1)
                })
            },

            updateProject(){
                console.log(this.project);
                if (!this.project.thresholdValue){
                    this.$message.error('请填写阈值')
                    return
                }
                if (!this.project.testUnit){
                    this.$message.error('请选择阈值单位')
                    return
                }
                console.log('aaaaa',this.project.testUnit)
                this.project.threshold = '≤'+ this.project.thresholdValue + this.project.testUnit;
                updateProject(this.project).then(res =>{
                    console.log(res)
                    this.isShowProjectChange = false;
                    this.getProjectsData()
                })
            },
            cancel(){
                this.showAccelerate = false;
                this.isShowDICOM = false;
                this.isShowProjectChange =false;
            },
            changeType(typeName,index){
               this.typeName = typeName;
               this.showTypeIndex = index;
                switch (index) {
                    case 0:
                        this.initDeviceData()
                        // this.getDevicesData()
                        break;
                    case 1:
                        this.getProjectsData()
                        break;
                    case 2:
                        this.getDicomsData()
                        break;
                }
            },
            addAccelerate(device){
                if(device) {
                    this.device = JSON.parse(JSON.stringify(device));
                } else this.device = {}
                this.showAccelerate=true;
            },
            onDelDevice(){
                this.$confirm('确认要删除该加速器吗？','提示',{type:'warning'}).then(()=>{
                    delDevice({id: this.currentDeviceID}).then(res=>{
                        this.getDevicesData(1)
                    })
                })
            },
            addDICOM(diCom){
               if(diCom) this.diCom = JSON.parse(JSON.stringify(diCom))
               else this.diCom = {}
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
                console.log('delConfirm',this.showTypeIndex)
                switch (this.showTypeIndex) {
                    case 0:
                        delDevice(this.device).then(res =>{
                            console.log(res);
                            this.isShowDelete = false;
                            this.getDevicesData(1)
                        })
                        break
                    case 1:
                        delDeviceProject({id: this.currentProject.id}).then(res=>{
                            this.isShowDelete = false
                            this.getProjectsData()
                        })
                        break
                    case 2:
                        delDicom(this.diCom).then(res =>{
                            console.log(res);
                            this.isShowDelete = false;
                            this.getDicomsData(1)
                        })
                        break
                }
            },
            showDelete(obj){
                console.log(obj)
                this.isShowDelete=true;
                switch (this.showTypeIndex) {
                    case 0:
                        this.device=obj;
                        break
                    case 1:
                        this.currentProject=obj;
                        break
                    case 2:
                        this.diCom=obj;
                        break
                }

            },
            showProjectChange(project){
                if(project) {
                    console.log(this.project,'ppppppppppppppppppppppp');
                    console.log(project,'9999999999999999');
                    // this.project.testUnit = project.testUnit; 
                    this.project.testUnit=project.testUnit
                    console.log(project.testUnit,'llllll',this.project.testUnit)
                    this.project.period = project.period; 
                    this.project.threshold = project.threshold;
                    console.log('%c [ project.threshold ]', 'font-size:13px; background:pink; color:#bf2c9f;', project.threshold)
                    console.log('%c [ this.project.threshold ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.project.threshold)
                    this.project.dpID = project.dpID
                    this.project.id = project.id
                    if (this.project.threshold){
                        this.project.thresholdValue = this.project.threshold.replace(/mm|%|°/,'').substr(1)
                        let index = this.project.threshold.indexOf('mm')
                        if (index>-1){
                            this.project.testUnit = 'mm' 
                        } else {
                            this.project.testUnit = this.project.threshold.substr(-1)
                        }
                    }
                }
                else {
                    console.log('error')
                };
                this.isShowProjectChange=true;
            },
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                let rowAndSpan = {
                    rowspan: 1,
                    colspan: 1
                }
                if (columnIndex === 0 || columnIndex === 4){
                    rowAndSpan.rowspan = row.rowspan
                }
                return rowAndSpan
            },
            getStyle(val){
                if (val.row.name === this.lineEleInit.name){
                    return {background: '#2C2C2C'}
                }
            },
            deviceDataTransfer(data){
                let lineX = [],lineEle = []
                data.forEach(val=>{
                    if (val.name === this.lineXInit.name){
                        lineX.push(val)
                    } else {
                        lineEle.push(val)
                    }
                })
                lineX[0].rowspan = lineX.length
                lineEle[0].rowspan = lineEle.length
                return [...lineX,...lineEle]
            },
            onclickDevice(row){
                if (this.devicesData.filter(val=>val.name===row.name).length>5){
                    this.$message.warning('最多添加6个')
                    return
                }
                // 判断devicesData里是否有空值
                if (this.devicesData.some(val => val.x == null || val.deep == null)) {
                    this.$message.warning('请输入完数值再添加');
                    return;
                }
                this.devicesData.push({
                    name: row.name,
                    rowspan: 0,
                })
                this.devicesData = this.deviceDataTransfer(this.devicesData)
                console.log('%c [ this.devicesData  ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.devicesData )
                this.$forceUpdate()
            },
            onclickDeviceDel(scope){
                this.devicesData.splice(scope.$index,1)
                this.devicesData = this.deviceDataTransfer(this.devicesData)
                this.onblur();  // 是不是可以啦 我康康哈
                this.$forceUpdate()
            }
        }
    }
</script>
<style lang="scss" scoped>
    .required{
        position: relative;
        &::after{
            position: absolute;
            display: block;
            content: '*';
            top: 0;
            left: -20px;
            bottom: 0;
            margin: auto;
            color: #F22335;
            width: 20px;
            font-size: 25px;
            height: 20px;
        }
    }
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
                        font-size: 18px;
                        border-bottom: 6px solid #2C2C2C;
                    }
                    .active{
                        background: #3C3C3C;
                        border-bottom: 6px solid #2CCEAD;
                        color: #2CCEAD;
                    }
                }
                .setting-upload{
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    padding: 20px 35px;
                }
                .setting-tab-content{
                    width: 100%;
                    table{
                        width: 100%;
                    }
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
                    font-size: 16px;

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
        /deep/ .el-table{
            border: none;
            &:before{
                height: 0;
            }
            &:after{
                width: 0;
            }
            td,th{
                text-align: center;
                border-right-color: rgba(255, 255, 255, 0.08);
                border-bottom-color: rgba(255, 255, 255, 0.08)!important;
            }
            &__header{
                tr{
                    th{
                        height: 77px;
                        background: rgba(255, 255, 255, 0.15);
                        color: #E5E5E5;
                        font-size: 16px;
                        font-weight: normal;
                    }
                }
            }
            &__body{
                tr{
                    td{
                        color: rgba(255, 255, 255, 0.7);
                    }
                }
                tr:hover > td{
                    background-color:unset !important;
                }
            }
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
    }
    .project-change-lists{
        /*display: flex;*/
        /*justify-content: space-around;*/
        /*align-items: center;*/
        padding: 3% 5%;
        width: 100%;
        &::after{
            display: block;
            content: '';
            clear: both;
        }
        .project-change-checkbox {
            float: left;
            margin-left: 1%;
            height: 5.5vh;
            display: flex;
            align-items: center;
        }
        .project-change-lists-item{
            float: left;
            margin-right: 10%;
            width: 40%;
            border: 1px solid #464646;
            background-color: #2C2C2C;
            font-size: 15px;
            height: 45px;
            display: flex;
            align-items: center;
            position: relative;
            .content-del{
                position: absolute;
                top: -8px;
                right: -8px;
                width: 20px;
            }
            &:nth-child(2n){
                margin-right: 0;
            }
            .item-content{
                width: 40%;
                flex: none;
                background-color: #2C2C2C;
                padding: 0 5%;
                border: 0;
                height: 100%;
                border-right: 1px solid rgba(255, 255, 255, 0.08);
            }
            .project-change-radio-group{
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 0;
                .el-radio{
                    margin-right: 8px;
                    position: relative;
                    top: 1px;
                    &:last-child{
                        margin-right: 0;
                    }
                }
            }
            .item-name{
                text-align: center;
                flex: auto;
            }
            .item-name-short{
                text-align: center;
                font-size: 15px;
                flex: auto;
            }
            /deep/ .el-select{
                height: 45px;
                .el-input{
                    height: 100%;
                    input{
                        height: 100%;
                        border: transparent;
                        background: #2C2C2C;
                    }
                }
            }
        }
        .project-change-power-add{
            border-color: rgba(44, 206, 173, 0.5);
            justify-content: center;
            cursor: pointer;
            color: #2CCEAD;
        }
        .project-change-x-line{
            border-color: transparent;
            background: transparent;
            margin-bottom: 20px;
            .content{
                height: 100%;
                width: 60%;
                display: flex;
                align-items: center;
                background-color: #2C2C2C;
                border: 1px solid #464646;
                margin-right: 3%;
                position: relative;
            }
        }
        .project-change-e{
            margin-bottom: 20px;
        }
        .project-change-line{
            margin-bottom: 0;
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
    .upload-icon{
        width: 117px;
        height: 117px;
        background: rgba(255, 255, 255, 0.08);
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        display: inline-flex;
        vertical-align: middle;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        color: #2CCEAD;
    }
</style>
