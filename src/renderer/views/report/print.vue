<template>
    <div>
        <div id="print-wrapper" style="margin: 20px 30px;padding: 20px">
            <div v-show="hospitalInfo" style="font-size: 14px;display: flex;justify-content: space-between;align-items: center">
                <div>
                    <img :src="hospitalInfo.avatar" width="50" height="50" style="border-radius: 50%;margin-right: 10px;vertical-align: middle;width: 50px;height: 50px" alt="">
                    <span>{{hospitalInfo.name}}</span>
                </div>
                <div style="color: #9B9B9B;font-size: 12px">
                    打印时间：{{nowTme}}
                </div>

            </div>
            <div class="report-tab" style="font-size: 30px;margin-top: 20px;height: 60vh;overflow-y: auto">
                <table class="table report-tab-content" border="0" cellspacing="0">
                    <thead class="tab-header">
                    <tr>
                        <th>项目名称</th>
                        <th>标称能量</th>
                        <th>检测值</th>
                        <th>照射野</th>
                        <th>检测时间</th>
                    </tr>
                    </thead>
                    <tbody class="tab-lists">
                    <tr v-for="(project,index) in projectData(projects)" :key="index">
                        <td :rowspan="project.rowspan" v-show="project.rowspan>0">{{project.name}}{{project.subName?('('+project.subName+')'):''}}</td>
                        <td class="word-break-not">{{project.result&&project.result?(project.detectType=='影像分析'?project.result.power:project.result.key):''}}</td>
                        <td class="word-break-not">
                            {{project.result&&project.result?(project.detectType=='影像分析'?project.result.value:project.result.val):''}}
                            <!--<div v-if="project.detectType=='影像分析'">-->
                                <!--<div v-for="v in project.testResult">{{v.power}} {{v.size}}cm-{{v.value}}mm</div>-->
                            <!--</div>-->
                            <!--<div v-else>-->
                                <!--<div v-if="project.testResult" v-for="te in project.testResult" class="test-result">{{te.val}}</div>-->
                            <!--</div>-->
                        </td>
                        <td class="word-break-not">{{project.result&&project.result?(project.detectType=='影像分析'?(project.result.size+'cm'):'-'):''}}</td>
                        <td :rowspan="project.rowspan" v-show="project.rowspan>0" class="word-break-not">{{project.createDate?project.createDate.substr(0,16):''}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div style="text-align: center;padding-bottom: 20px">
            <el-button type="primary" class="active" @click="print">打印报表</el-button>
        </div>
    </div>

</template>

<script>
    import {parseTime} from "../../utils";

    export default {
        name: "print",
        data(){
            return {
                nowTme: parseTime(Date.now())
            }
        },
        props: {
            hospitalInfo: {
                type: Object,
                default: {}
            },
            projects: {
                type: Array,
                default: []
            }
        },
        computed:{
            projectData(){
                return function (value) {
                    let data = []
                    value.forEach(val=>{
                        val.rowspan = 1
                        if (val.testResult && Array.isArray(val.testResult)){
                            val.rowspan = val.testResult.length
                            val.testResult.forEach((item,index)=>{
                                if (index !==0)  val.rowspan = 0
                                data.push({...val,...{result: item}})
                            })
                        } else {
                            data.push(val)
                        }
                    })
                    console.log('data',data)
                    return data
                }
            }
        },
        methods: {
            print(){
                this.nowTme = parseTime(Date.now())
                let html = document.getElementById('print-wrapper').outerHTML,style = this.getStyle()
                console.log(html.indexOf('height: 60vh'))
                html = html.replace('height: 60vh','')
                // console.log(html)
                this.writeIframe(style + html)
            },
            getStyle(){
                var str = "",
                    styles = document.querySelectorAll('style,link');
                for (var i = 0; i < styles.length; i++) {
                    str += styles[i].outerHTML;
                }
                // str += "<style>" + (this.options.noPrint ? this.options.noPrint : '.no-print') + "{display:none;}</style>";
                // str += "<style>input[type=text]{border: none;outline:none;}</style>";
                // console.log(str)
                return str;
            },
            writeIframe(content){
                var w, doc, iframe = document.createElement('iframe'),
                    f = document.body.appendChild(iframe);
                iframe.id = "myIframe";
                iframe.style = "position:absolute;width:0;height:0;top:-10px;left:-10px;font-size:12px;";
                w = f.contentWindow || f.contentDocument;
                doc = f.contentDocument || f.contentWindow.document;
                // console.log(content)
                doc.open();
                doc.write(content);
                doc.close();
                w.onload = function () {
                    console.log('printframe onload')
                    w.print()
                    setTimeout(function() {
                        document.body.removeChild(iframe)
                    }, 100)
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

    #print-wrapper{
        background: #ffffff;
        color: #333;
        table{
            border: 1px solid #D2D2D2;
        }
        th{
            color: #333;
            border-color: #D2D2D2;
            border-bottom: 1px solid #D2D2D2;
            border-right: 1px solid #D2D2D2;
            font-size: 12px;
            padding: 6px;
            white-space: nowrap;
            font-weight: 700;
            background: #F3F3F3;
            &:last-of-type{
                border-right: none;
            }
        }
        td{
            background: #ffffff;
            color: #333;
            border-color: #D2D2D2;
            border-bottom: 1px solid #D2D2D2;
            border-right: 1px solid #D2D2D2;
            font-size: 11px;
            padding: 6px;
            &:last-of-type{
                border-right: none;
            }
        }
        tr:last-of-type{
            td{
                border-bottom: none;
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
    }
    @media print {
        #print-wrapper {
            -webkit-print-color-adjust: exact;
        }
    }
</style>
