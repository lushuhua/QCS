<template>
    <div>
        <div id="print-wrapper" style="margin: 20px 30px;padding: 20px">
            <div v-if="hospitalInfo">
                <img :src="hospitalInfo.avatar" width="50" height="50" style="border-radius: 50%;margin-right: 10px;vertical-align: middle" alt="">{{hospitalInfo.name}}
            </div>
            <div class="report-tab" style="font-size: 30px;margin-top: 20px;height: 60vh;overflow-y: auto">
                <table class="table report-tab-content" border="0" cellspacing="0">
                    <thead class="tab-header">
                    <tr>
                        <th>项目名称</th>
                        <th>检测值</th>
                        <th>检测时间</th>
                    </tr>
                    </thead>
                    <tbody class="tab-lists">
                    <tr v-for="(project,index) in projects" :key="index">
                        <td>{{project.name}}{{project.subName?('('+project.subName+')'):''}}</td>
                        <td>
                            <div v-if="project.detectType=='影像分析'">
                                <div v-for="v in project.testResult">{{v.power}} {{v.size}}cm-{{v.value}}mm</div>
                            </div>
                            <div v-else>
                                <div v-if="project.testResult" v-for="te in project.testResult" class="test-result">{{te.val}}</div>
                            </div>
                        </td>
                        <td>{{project.createDate}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div style="text-align: center;padding-bottom: 20px">
            <el-button type="primary" class="active active-print" @click="print">打印报表</el-button>
        </div>
    </div>

</template>

<script>
    export default {
        name: "print",
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
        methods: {
            print(){
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
        }
        td{
            background: #ffffff;
            color: #333;
            border-color: #D2D2D2;
            border-bottom: 1px solid #D2D2D2;
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
</style>
