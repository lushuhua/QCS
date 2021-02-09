<template>
    <div class="project-page">
        <div class="project-search">
            <div class="project-search-lists">
                <el-input placeholder="请输入项目号"></el-input>
            </div>
            <div class="project-search-lists">
                <el-input placeholder="请输入项目名称"></el-input>
            </div>
            <div class="project-search-lists">
                <el-input placeholder="请输入阈值"></el-input>
            </div>
            <div class="project-search-lists">
                <el-select placeholder="请选择检测日期">
                    <el-option>
                            <!--v-for="item in options"-->
                            <!--:key="item.value"-->
                            <!--:label="item.label"-->
                            <!--:value="item.value"-->
                    </el-option>
                </el-select>
            </div>
            <div class="project-search-lists">
                <el-select placeholder="请选择合格有效期">
                    <el-option>
                        <!--v-for="item in options"-->
                        <!--:key="item.value"-->
                        <!--:label="item.label"-->
                        <!--:value="item.value"-->
                    </el-option>
                </el-select>
            </div>
            <div class="project-search-btn">
                <el-button type="primary" class="active">查询</el-button>
            </div>
            <div class="project-search-btn">
                <el-button type="primary">重置</el-button>
            </div>
        </div>
        <div class="project-tab">
            <table class="table project-tab-content" border="0" cellspacing="0">
                <thead class="tab-header">
                    <tr>
                        <th>项目号</th>
                        <th>项目名称</th>
                        <th>次级项目名称</th>
                        <th>辐射类型</th>
                        <th>检测值</th>
                        <th>阈值</th>
                        <th>检测类型</th>
                        <th>检测周期</th>
                        <th>检测日期</th>
                        <th>合格有效期</th>
                        <th>过期提醒</th>
                        <th>照射野</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody class="tab-lists">
                    <tr>
                        <td>6.6.3</td>
                        <td>旋转运动标尺的零刻度位置</td>
                        <td>-</td>
                        <td class="table-more">
                            <div class="table-child">x线</div>
                            <div class="table-child">电子线</div>
                        </td>
                        <td class="table-more">
                            <div class="table-child">x线：3mv-3.9</div>
                            <div class="table-child">电子线：4mv-1.2</div>
                        </td>
                        <td>图像分析</td>
                        <td>日检</td>
                        <td>≤0.5°</td>
                        <td>2021-02-19</td>
                        <td>2021-02-19</td>
                        <td>已过期</td>
                        <td class="table-more">
                            <div class="table-child">20cm*20cm</div>
                            <div class="table-child">20cm*20cm</div>
                        </td>
                        <td>
                            <div class="watch-history" @click="openDialog()">
                                查看历史
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>6.6.3</td>
                        <td>旋转运动标尺的零刻度位置</td>
                        <td>-</td>
                        <td class="table-more">
                            <div class="table-child">x线</div>
                            <div class="table-child">电子线</div>
                        </td>
                        <td class="table-more">
                            <div class="table-child">x线：3mv-3.9</div>
                            <div class="table-child">电子线：4mv-1.2</div>
                        </td>
                        <td>图像分析</td>
                        <td>日检</td>
                        <td>≤0.5°</td>
                        <td>2021-02-19</td>
                        <td>2021-02-19</td>
                        <td>已过期</td>
                        <td class="table-more">
                            <div class="table-child">20cm*20cm</div>
                            <div class="table-child">20cm*20cm</div>
                        </td>
                        <td>
                            <div class="watch-history" @click="openDialog()">
                                查看历史
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>6.6.3</td>
                        <td>旋转运动标尺的零刻度位置</td>
                        <td>-</td>
                        <td class="table-more">
                            <div class="table-child">x线</div>
                            <div class="table-child">电子线</div>
                        </td>
                        <td class="table-more">
                            <div class="table-child">x线：3mv-3.9</div>
                            <div class="table-child">电子线：4mv-1.2</div>
                        </td>
                        <td>图像分析</td>
                        <td>日检</td>
                        <td>≤0.5°</td>
                        <td>2021-02-19</td>
                        <td>2021-02-19</td>
                        <td>已过期</td>
                        <td class="table-more">
                            <div class="table-child">20cm*20cm</div>
                            <div class="table-child">20cm*20cm</div>
                        </td>
                        <td>
                            <div class="watch-history" @click="openDialog()">
                                查看历史
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>6.6.3</td>
                        <td>旋转运动标尺的零刻度位置</td>
                        <td>-</td>
                        <td class="table-more">
                            <div class="table-child">x线</div>
                            <div class="table-child">电子线</div>
                        </td>
                        <td class="table-more">
                            <div class="table-child">x线：3mv-3.9</div>
                            <div class="table-child">电子线：4mv-1.2</div>
                        </td>
                        <td>图像分析</td>
                        <td>日检</td>
                        <td>≤0.5°</td>
                        <td>2021-02-19</td>
                        <td>2021-02-19</td>
                        <td>已过期</td>
                        <td class="table-more">
                            <div class="table-child">20cm*20cm</div>
                            <div class="table-child">20cm*20cm</div>
                        </td>
                        <td>
                            <div class="watch-history" @click="openDialog()">
                                查看历史
                            </div>
                            <div class="watch-history" @click="openDialog2()">
                                测试
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="pagination clearfix">
                <el-pagination
                        background="#1C1C1C"
                        layout="prev, pager, next,jumper"
                        :page-size="4"
                        :total="40"
                        :pager-count="3"
                        :prev-text="'上一页'"
                        :next-text="'下一页'"
                        class="right"
                >
                </el-pagination>
                
            </div>
        </div>
        <el-dialog
                title="项目6.6.3 检测历史记录"
                :visible.sync="dialogVisible"
                width="40%"
                :before-close="handleClose"
                center
        >
            <table class="table-list " border="0" cellspacing="0">
                <thead class="tab-header">
                <tr>
                    <th>检测日期</th>
                    <th>检测值</th>
                    <th>阈值</th>
                </tr>
                </thead>
                <tbody class="tab-lists">
                <tr>
                    <td>2021-02-19</td>
                    <td class="table-more">
                        <div class="table-child">x线：3mv-3.9</div>
                        <div class="table-child">x线：3mv-3.9</div>
                        <div class="table-child">x线：3mv-3.9</div>
                    </td>
                    <td>≤0.5°</td>
                </tr>
                <tr>
                    <td>2021-02-19</td>
                    <td class="table-more">
                        <div class="table-child">x线：3mv-3.9</div>
                        <div class="table-child">x线：3mv-3.9</div>
                        <div class="table-child">x线：3mv-3.9</div>
                    </td>
                    <td>≤0.5°</td>
                </tr>
                <tr>
                    <td>2021-02-19</td>
                    <td class="table-more">
                        <div class="table-child">x线：3mv-3.9</div>
                        <div class="table-child">x线：3mv-3.9</div>
                        <div class="table-child">x线：3mv-3.9</div>
                    </td>
                    <td>≤0.5°</td>
                </tr>
                <tr>
                    <td>2021-02-19</td>
                    <td class="table-more">
                        <div class="table-child">x线：3mv-3.9</div>
                        <div class="table-child">x线：3mv-3.9</div>
                        <div class="table-child">x线：3mv-3.9</div>
                    </td>
                    <td>≤0.5°</td>
                </tr>
                <tr>
                    <td>2021-02-19</td>
                    <td class="table-more">
                        <div class="table-child">x线：3mv-3.9</div>
                        <div class="table-child">x线：3mv-3.9</div>
                        <div class="table-child">x线：3mv-3.9</div>
                    </td>
                    <td>≤0.5°</td>
                </tr>

                </tbody>
            </table>
            <div slot="footer" class="dialog-footer">
                <div class="pagination clearfix">
                    <el-pagination
                            background="#1C1C1C"
                            layout="prev, pager, next,jumper"
                            :page-size="4"
                            :total="40"
                            :pager-count="3"
                            :prev-text="'上一页'"
                            :next-text="'下一页'"
                    >
                    </el-pagination>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { getPlaylistHot,toplist,addDicom } from "../../api";
    export default {
        components: {
        },
        data() {
            return {
                topIndex:0,
                dialogVisible:false,
            }
        },
        mounted() {
            console.log('mounted')
            this.getTags();
        },
        methods: {
            getTags() {
                getPlaylistHot().then(res => {
                    console.log(res)
                    this.tags = res.tags
                })
            },
            handleClick() {
                console.log('handleClick=',this.topIndex)
                this.topIndex++;
                toplist(this.topIndex).then(res => {
                    console.log(res)
                })

            },
            handleClose(){

            },
            openDialog(){
                console.log('openDialog')
                this.getTags();
                this.dialogVisible=true
            },
            openDialog2(){
                    var dicom={
                    customer: "SRS",
                    aeTitle:"AE TITLE1",
                    ip:"192.168.0.2",
                    port:"8081"
                };
                addDicom(dicom).then(res =>{
                    console.log(res);
                })
            }

        }
    }
</script>
<style lang="scss" scoped>
    .project-page {
        width: 100%;
       padding:25px 26px 44px;
        .project-search{
            width: 100%;
            height: 10%;
            min-height: 80px;
            background: rgba(255,255,255,0.1);
            display: flex;
            justify-content: center;
            align-items: center;
            .project-search-lists{
                width: 15%;
                height: 40%;
                margin-right: 1%;
                color: #fff;
                /deep/ .el-input{
                    height: 100%;
                    font-size: 1.1vw;
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
                        font-size: 1.1vw;
                        letter-spacing: 0px;
                    }
                    .el-input__icon {
                        line-height: 28px;
                    }
                }

            }
            .project-search-btn{
                width: 6.5%;
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
                    font-size: 1.1vw;
                }
                .active{
                    background: #2CCEAD;
                    border-radius: 4px;
                    color: #FFFFFF;
                }
            }
        }
        .project-tab{
            height: 84%;
            margin-top: 25px;
            background: rgba(255,255,255,0.1);
            .project-tab-content{
                width: 100%;
                .tab-header{
                    background: rgba(255,255,255,0.1);
                    color: #fff;
                    font-family: "Microsoft YaHei";
                    font-weight: 400;
                    font-size: 1.1vw;
                }
                .tab-lists{
                    /*background: rgba(255,255,255,0.1);*/
                    color: rgba(255,255,255,0.8);
                    font-family: "Microsoft YaHei";
                    font-size: 1vw;
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
                    font-size: 1.2vw;

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
            .tab-header{
                font-size: 1.2vw;
            }
            .tab-lists{
                font-size: 1.1vw;
            }
        }
        .dialog-footer{
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
