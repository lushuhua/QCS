<template>
    <div class="report-page">
        <div class="report-search">
            <div class="report-search-left">
                <div class="report-search-lists">
                    <el-date-picker
                            v-model="fromDate"
                            type="date"
                            value-format="yyyy-MM-dd hh:mm"
                            format="yyyy-MM-dd HH:mm"
                            placeholder="请选择开始日期"
                            size="mini"
                    >
                    </el-date-picker>
                </div>
                <div class="report-search-lists">
                    <el-date-picker
                            v-model="toDate"
                            type="date"
                            value-format="yyyy-MM-dd hh:mm"
                            format="yyyy-MM-dd HH:mm"
                            placeholder="请选择结束日期"
                            size="mini"
                    >
                    </el-date-picker>
                </div>
                <div class="report-search-lists">
                    <el-select v-model="period" placeholder="请选择检测周期">
                        <el-option
                                v-for="item in options"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </div>
                <div class="report-search-btn">
                    <el-button type="primary" class="active" @click="search()">查询</el-button>
                </div>
                <div class="report-search-btn">
                    <el-button type="primary" @click="reset()">重置</el-button>
                </div>
            </div>
            <div class="report-search-right">
                  <div class="report-print">
                      <el-button type="primary" class="active" @click="reportPrint()">打印报表</el-button>
                  </div>
            </div>
        </div>
        <div class="report-tab">
            <table class="table report-tab-content" border="0" cellspacing="0">
                <thead class="tab-header">
                    <tr>
                        <th>项目号</th>
                        <th>项目名称</th>
                        <th>次级项目名称</th>
                        <th>周期</th>
                        <th>检测值</th>
                        <th>阈值</th>
                        <th>检测日期</th>
                    </tr>
                </thead>
                <tbody class="tab-lists">
                <tr v-for="(project,index) in projects" :key="index">
                    <td>{{project.projectNo}}</td>
                    <td>{{project.name}}</td>
                    <td>{{project.subName?project.subName:'无'}}</td>
                    <td>{{project.period}}</td>
                    <td v-if="project.testResult.levelNum==1">
                        <span>{{project.testResult.result}}</span>
                    </td>
                    <td v-if="project.testResult.levelNum>1">
                        <div v-for="(item,key) in project.testResult" :key="key">
                            <span v-if="key!='levelNum'">
                                {{key}} {{item.result}}
                            </span>
                        </div>

                    </td>
                    <td>{{project.threshold}}</td>
                    <td>{{project.createDate}}</td>
                </tr>
                </tbody>
            </table>
            <div class="pagination clearfix">
                <el-pagination
                        :background="true"
                        layout="prev, pager, next,jumper"
                        :page-size="10"
                        :total="count"
                        prev-text="上一页"
                        next-text="下一页"
                        class="right"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                >
                </el-pagination>

            </div>
        </div>
        <el-dialog
                title="报表打印预览"
                :visible.sync="dialogVisible"
                width="40%"
                center
        >

            <div slot="footer">
                <div>

                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { mapState } from 'vuex';
    import { getProjectTests,addTestResult } from "../../api";

    export default {
        components: {
        },
        data() {
            return {
                dialogVisible:false,
                fromDate:'',
                toDate:'',
                value3:'',
                period:'请选择检测周期',
                options:['1天','1周','1月','3月','6月','1年'],
                currentPage:0,
                projects:[],
                count:0,
            }
        },
        computed: mapState({
            currentDeviceID: state => state.user.currentDeviceID,
        }),
        mounted() {
            getProjectTests({
                deviceID:this.currentDeviceID,
                fromDate:this.fromDate,
                toDate:this.toDate,
                period:this.period,
                pageNum:0,
                offset:10}).then(res =>{
                console.log(res);
                this.projects = res.projects;
                this.count = res.count;
            })
        },
        methods: {
            handleClick() {

            },
            handleClose(){

            },
            reportPrint(){
                this.dialogVisible=true
            },
            search(){

                console.log(this.fromDate,this.toDate,this.period);
                getProjectTests({
                    deviceID:this.currentDeviceID,
                    fromDate:this.fromDate,
                    toDate:this.toDate,
                    period:this.period,
                    pageNum:0,
                    offset:10}).then(res =>{
                    console.log(res);
                    this.projects = res.projects;
                    this.count = res.count;
                })
            },
            reset(){
                this.fromDate = '';
                this.toDate = '';
                this.period = '请选择检测周期';
                getProjectTests({
                    deviceID:this.currentDeviceID,
                    fromDate:this.fromDate,
                    toDate:this.toDate,
                    period:this.period,
                    pageNum:this.currentPage-1,
                    offset:10}).then(res =>{
                    console.log(res);
                    this.projects = res.projects;
                    this.count = res.count;
                })
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                console.log(`当前页: ${val}`);
                getProjectTests({
                    deviceID:this.currentDeviceID,
                    fromDate:this.fromDate,
                    toDate:this.toDate,
                    period:this.period,
                    pageNum:this.currentPage-1,
                    offset:10}).then(res =>{
                    console.log(res);
                    this.projects = res.projects;
                    this.count = res.count;
                })
            },

        }
    }
</script>
<style lang="scss" scoped>
    .report-page {
        width: 100%;
       padding:25px 26px 44px;
        .report-search{
            width: 100%;
            height: 10%;
            min-height: 80px;
            background: rgba(255,255,255,0.1);
            display: flex;
            justify-content: space-around;
            align-items: center;
            .report-search-left{
                width: 80%;
                height: 100%;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                margin-left: 3%;
                .report-search-lists{
                    width: 22%;
                    height: 40%;
                    margin-right: 1%;
                    color: #fff;
                    /deep/ .el-input{
                        height: 100%;
                        width: 100%;
                        .el-input__inner{
                            color: #FFF;
                            height: 100%;
                            background: rgba(255, 255, 255, 0.08);
                            border-radius: 4px;
                            border: 1px solid rgba(255, 255, 255, 0.1);
                        }
                    }
                    /deep/ .el-select{
                        height: 100%;
                        .el-input__inner {
                            height: 100%;
                            background: rgba(255, 255, 255, 0.08);
                            border-radius: 4px;
                            border: 1px solid rgba(255, 255, 255, 0.1);
                            font-size: 13px;
                            letter-spacing: 0px;
                        }
                        .el-input__icon {
                            line-height: 28px;
                        }
                    }

                }
                .report-search-btn{
                    width: 10%;
                    height: 40%;
                    margin-right: 1%;
                    /deep/ .el-button--primary {
                        width: 100%;
                        height: 100%;
                        text-align: center;
                        background: rgba(255, 255, 255, 0.08);
                        border-radius: 4px;
                        border: 1px solid rgba(44, 206, 173, 0.5);
                        color: #2CCEAD;
                        padding: 0;
                    }
                    .active{
                        background: #2CCEAD;
                        border-radius: 4px;
                        color: #FFFFFF;
                    }
                }
            }
            .report-search-right{
                width: 20%;
                height: 100%;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                margin-right: 3%;
                .report-print{
                    width: 80%;
                    height: 40%;
                    margin-right: 1%;
                    /deep/ .el-button--primary {
                        width: 100%;
                        height: 100%;
                        text-align: center;
                        background: rgba(255, 255, 255, 0.08);
                        border-radius: 4px;
                        border: 1px solid rgba(44, 206, 173, 0.5);
                        color: #2CCEAD;
                        padding: 0;
                    }
                    .active{
                        background: #2CCEAD;
                        border-radius: 4px;
                        color: #FFFFFF;
                    }
                }
            }

        }
        .report-tab{
            height: 84%;
            margin-top: 25px;
            background: rgba(255,255,255,0.1);
            .report-tab-content{
                width: 100%;
                .tab-header{
                    background: rgba(255,255,255,0.1);
                    color: #fff;
                    font-family: "Microsoft YaHei";
                    font-weight: 400;
                    font-size: 14px;
                }
                .tab-lists{
                    /*background: rgba(255,255,255,0.1);*/
                    color: rgba(255,255,255,0.8);
                    font-family: "Microsoft YaHei";
                    font-size: 13px;
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
                background-color: #2C2C2C;
                color: rgba(255,255,255,0.8);
                padding: 0 2%;
            }
            .el-dialog__footer{
                background-color: #2C2C2C;
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
            padding: 2% 0;
        }
        :last-child{
            border-bottom: 0;
        }
    }
</style>
