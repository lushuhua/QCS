<template>
    <div class="project-page page-qcs">
        <div class="project-search page-qcs-head">
            <div class="project-search-lists">
                <el-input placeholder="请输入项目号" v-model="searchObj.projectNo" @change="getProjectsData(1)"></el-input>
            </div>
            <div class="project-search-lists">
                <el-input placeholder="请输入项目名称" v-model="searchObj.name" @change="getProjectsData(1)"></el-input>
            </div>
            <div class="project-search-lists" >
                <el-select v-model="searchObj.period" placeholder="请选择检测周期" @change="getProjectsData(1)" >
                    <el-option value="一天"></el-option>
                    <el-option value="一周"></el-option>
                    <el-option value="一个月"></el-option>
                    <el-option value="三个月"></el-option>
                    <el-option value="六个月"></el-option>
                    <el-option value="一年"></el-option>
                </el-select>
            </div>
            <div class="project-search-lists">
                <el-date-picker
                        v-model="searchObj.testDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        placeholder="检测日期"
                        size="mini"
                        style="width: 100%"
                        align="center" @change="getProjectsData(1)"
                >
                </el-date-picker>
            </div>
            <div class="project-search-lists">
                <el-date-picker
                        v-model="searchObj.validDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        placeholder="合格有效期"
                        size="mini"
                        style="width: 100%"
                        align="center" @change="getProjectsData(1)"
                >
                </el-date-picker>
            </div>
            <el-button type="primary" @click="getProjectsData(1)">查询</el-button>
            <el-button @click="reset">重置</el-button>
        </div>
        <div class=" page-qcs-body" >
            <table class="table" border="0" cellspacing="0">
                <thead>
                    <tr>
                        <th class="word-break-not">项目号<sort @sortClick="onclickSort"></sort></th>
                        <th>项目名称</th>
                        <!--<th>次级项目名称</th>-->
                        <!--<th>辐射类型</th>-->
                        <th class="word-break-not">检测值</th>
                        <th class="word-break-not">阈值</th>
                        <th class="word-break-not">检测类型</th>
                        <th class="word-break-not">检测周期</th>
                        <th>检测日期</th>
                        <th>合格有效期</th>
                        <th>过期提醒</th>
                        <th>照射野</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(project,index) in searchObj.data" :key="index">
                    <td>{{project.projectNo}}</td>
                    <td class="project-name">{{project.name}}{{project.subName?('('+project.subName+')'):''}}</td>
                    <!--<td>{{project.subName}}</td>-->
                    <!--<td>{{project.radioType}}</td>-->
                    <td>
                        <!--<div v-if="project.detectType=='影像分析'">-->
                            <!--<div v-for="(v,vIndex) in project.testResult" :key="vIndex">{{v.power}} {{v.size}}cm-{{v.value}}mm</div>-->
                        <!--</div>-->
                        <!--<div v-else>-->
                            <!--<div v-if="project.testResult" v-for="(te,teIndex) in project.testResult" :key="teIndex" class="test-result">{{te.val}}-->
                                <!--<img :class="{'test-result-min': compare(te.val,project.threshold)}" src="../../assets/images/arrow.png"></div>-->
                        <!--</div>-->
                        <test-result :project="project" :showPower="true"></test-result>
                    </td>
                    <td class="word-break-not">{{project.threshold}}</td>
                    <td class="word-break-not">{{project.detectType}}</td>
                    <td>{{project.period}}</td>
                    <td>{{project.createDate}}</td>
                    <td>{{getValid(project)}} </td>
                    <td> <div :style="{color: getOverDate(project).color}">{{getOverDate(project).name}}</div></td>
                    <td> </td>
                    <td class="">
                        <div class="handle">
                            <div class="handle-item word-break-not" @click="showHistory(project)">查看历史</div>
                        </div>
                    </td>
                </tr>


                </tbody>
            </table>
            <div class="pagination clearfix">
                <el-pagination
                        :background="true"
                        layout="total,prev, pager, next,jumper"
                        :page-size="searchObj.offset"
                        :total="searchObj.count"
                        prev-text="上一页"
                        next-text="下一页"
                        class="right"
                        @current-change="handleCurrentChange"
                        :current-page="searchObj.pageNum"
                >
                </el-pagination>

            </div>
        </div>
        <el-dialog
                :title="test.title"
                :visible.sync="test.visible"
                width="35vw"
                center
        >
            <el-main class="el-dialog-project">
                <table class="el-dialog-project-content" style="width: 100%;" border="0" cellspacing="0">
                    <thead class="tab-header">
                    <tr>
                        <th>检测日期</th>
                        <th>检测值</th>
                        <th>阈值</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr style="text-align: center" v-for="(project,index) in test.data" :key="index">
                        <td>{{project.createDate}}</td>
                        <td>
                            <test-result :project="project" :showPower="true"></test-result>
                        </td>
                        <td>{{project.threshold}}</td>
                    </tr>
                    </tbody>
                </table>
                <!--<el-table-->
                        <!--ref="multipleTable"-->
                        <!--:data="test.data"-->
                        <!--tooltip-effect="dark">-->
                    <!--<el-table-column-->
                            <!--label="检测日期"-->
                            <!--prop="createDate"></el-table-column>-->
                    <!--<el-table-column-->
                            <!--label="检测值"-->
                            <!--prop="testResult.result"></el-table-column>-->
                    <!--<el-table-column-->
                            <!--label="阈值"-->
                            <!--prop="threshold"></el-table-column>-->
                <!--</el-table>-->
            </el-main>
            <div slot="footer" class="dialog-footer">
                <div class="pagination clearfix">
                    <el-pagination
                            style="margin-top: 0"
                            :background="true"
                            layout="prev, pager, next,jumper"
                            :page-size="test.offset"
                            :total="test.count"
                            prev-text="上一页"
                            next-text="下一页"
                            class="right"
                            @current-change="handleCurrentChangeTest"
                            :current-page="test.pageNum"
                    >
                    </el-pagination>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { mapState } from 'vuex';
    import { getProjects,getProjectTests } from "../../api";
    import {calcWarningTime,parseTime} from "../../utils";
    import TestResult from '../../components/testResult'
    import Sort from '../../components/sort'

    export default {
        components: {
            TestResult,
            Sort
        },
        data() {
            return {
                topIndex:0,
                value1: [new Date(2021, 1, 10, 10, 10), new Date(2021, 3, 11, 10, 10)],
                options:['1天','1周','1月','3月','6月','1年'],
                searchObj: {
                    period: '',
                    projectNo: '',
                    name: '',
                    testDate: '',
                    validDate: '',
                    data: [],
                    pageNum: 1,
                    offset: 10,
                    count: 0,
                    orderBy: undefined
                },
                test: {
                    visible: false,
                    title: '',
                    data: [],
                    pageNum: 1,
                    offset: 10,
                    count: 0
                }
            }
        },
        computed: mapState({
            currentDeviceID: state => state.user.currentDeviceID,
            getOverDate(){
                return function (val) {
                    return calcWarningTime(val)
                }
            },
            getValid(){
                return function (val) {
                    let value = '-'
                    if (val.createDate){
                        let createDate = new Date(val.createDate).getTime(),timestamp = 0
                        switch (val.period) {
                            case '一天':
                                timestamp = 1
                                break
                            case '一周':
                                timestamp = 7
                                break
                            case '一个月':
                                timestamp = 30
                                break
                            case '三个月':
                                timestamp = 90
                                break
                            case '六个月':
                                timestamp = 180
                                break
                            case '一年':
                                timestamp = 365
                                break
                        }
                        timestamp = timestamp * 24 * 60 * 60 * 1000
                        createDate += timestamp
                        value = parseTime(createDate,'{y}-{m}-{d}')
                    }
                    return value
                }
            },
        }),
        watch: {
            currentDeviceID: function (val) {
                console.log(val);
                if (this.$route.name === 'project'){
                    this.getProjectsData(1)
                }
            },
            $route: function () {
                console.log('$route')
                if (this.$route.name === 'project'){
                    this.getProjectsData()
                }
            }
        },
        mounted() {
        },
        created(){
            // this.getProjectsData(1)
        },
        methods: {
            getProjectsData(state){
                if (state) this.searchObj.pageNum = 1
                getProjects({
                    deviceID:this.currentDeviceID,
                    period:this.searchObj.period,
                    pageNum: this.searchObj.pageNum-1,
                    offset: this.searchObj.offset,
                    projectNo: this.searchObj.projectNo,
                    name: this.searchObj.name,
                    testDate: this.searchObj.testDate,
                    validDate: this.searchObj.validDate,
                    orderBy: this.searchObj.orderBy
                }).then(res =>{
                    console.log(res);
                    this.searchObj.data = res.projects;
                    this.searchObj.count = res.count;
                })
            },
            onclickSort(val){
                let orderBy
                if (val === 'ascending'){
                    orderBy = 'projectNo&asc'
                } else if (val==='descending'){
                    orderBy = 'projectNo&desc'
                } else {

                }
                this.searchObj.orderBy = orderBy
                this.getProjectsData(1)
            },
            reset(){
                this.searchObj = {
                    pageNum: 1,
                    offset: 10,
                    data: []
                };
                this.getProjectsData(1)
            },
            handleCurrentChange(val) {
                this.searchObj.pageNum = val;
                console.log(`当前页: ${val}`);
                this.getProjectsData()
            },
            showHistory(val){
                console.log(val)
                this.test.visible = true
                this.test.title = `项目 ${val.projectNo} 检测历史记录`
                this.test.projectID = val.id
                this.getTestData()
            },
            handleCurrentChangeTest(val){
                this.test.pageNum = val;
                this.getTestData()
            },
            getTestData(state){
                if (state) this.test.pageNum = 1
                getProjectTests({
                    deviceID:this.currentDeviceID,
                    pageNum:this.test.pageNum-1,
                    offset:this.test.offset,
                    projectID: this.test.projectID
                }).then(res =>{
                    console.log(res);
                    this.test.data = res.projects;
                    this.test.count = res.count;
                })
            },

        }
    }
</script>
<style lang="scss" scoped>
    .project-page {
        width: 100%;
       padding:25px 26px 44px;

        .project-search{
            min-height: 80px;
            background: rgba(255,255,255,0.1);
            display: flex;
            align-items: center;
            .project-search-lists{
                width: 15%;
                height: 40px;
                margin-right: 1%;
                color: #fff;
                font-size: 12px;
                /deep/ .el-input{
                    height: 100%;
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
                        letter-spacing: 0px;
                    }
                    .el-input__icon {
                        line-height: 28px;
                    }
                }

            }
        }
        /deep/ .el-dialog__wrapper{
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .el-dialog-project{
            background: rgba(38, 38, 38, 1);
            &-content{
                border: 1px solid rgba(255, 255, 255, 0.08);
                tr td{
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                }
                thead>tr>th{
                    padding: 2vh 0.8vw;
                    font-weight: 400;
                    border-right: 1px solid #464646;
                    font-size: 14px;
                }
                tbody>tr>td{
                    padding: 1.5vh 0.8vw;
                    font-weight: 400;
                    border-right: 1px solid #464646;
                    font-size: 13px;
                    background: rgba(38, 38, 38, 1);
                }
            }
        }
        .table-list{
            width: 100%;
            /*text-align: center;*/
            .tab-header{
                font-size: 1.2vw;
            }
            .tab-lists{
                font-size: 1.1vw;
            }
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
