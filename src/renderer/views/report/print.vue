<template>
  <div>
    <div id="print-wrapper" style="margin: 20px 30px; padding: 20px;">
      <div>
      <div
        v-show="hospitalInfo"
        style="
          display: flex;
          align-items: center;
          flex-direction: row;
          justify-content: space-between;
        "
      >
        <div
          style="
            font-size: 14px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          "
        >
          <!-- <img key=""
          v-if="currentPage == 1"
            :src="hospitalInfo.avatar"
            width="50"
            height="50"
            style="
              border-radius: 50%;
              margin: 0 auto;
              vertical-align: middle;
              width: 50px;
              height: 50px;
            "
            alt=""
          /> -->
          <img key=""
          v-if="currentPage == 1"
            src="/src/extraResources/ images/hospital.png"
            width="50"
            height="50"
            style="
              border-radius: 50%;
              margin: 0 auto;
              vertical-align: middle;
              width: 50px;
              height: 50px;
            "
            alt=""
          />
          <div v-if="currentPage == 1">{{ hospitalInfo.name }}</div>
        </div>
        <div style="margin-bottom: -35px" v-if="currentPage == 1">
          加速器设备：{{ model }}-{{ sequence }}
        </div>
        <!-- <div style="font-size:19px;width:220px;text-align:center;font-weight:300px">医用电子直线加速器稳定性检测报告</div> -->
      </div>
      <div
        style="
          width: 100%;
          height: 1px;
          background-color: #ccc;
          margin-top: 10px;
        "
      ></div>
      <div
        style="
          height: 50px;
          line-height: 50px;
          text-align: center;
          font-size: 20px;
          font-weight: 600;
        "
      >
        医用电子直线加速器稳定性检测报告
      </div>
      <div style="float: left; font-size: 10px" v-if="currentPage == 1">
        依据：WS674-2020《医用电子直线加速器质量控制检测规范》
      </div>
      </div>
    
      <div
      id = 'content'
        class="report-tab"
        style="
          font-size: 30px;
          margin-top: 20px;
          height: 60vh;
          overflow-y: auto;
       
        "
      >
        <table class="report-tab-content" border="0" cellspacing="0">
          <thead class="tab-header" >
            <tr>
              <th>项目号</th>
              <th>项目名称</th>
              <th>标称能量</th>
              <th style="width: 50px;">检测值</th>
              <!-- <th>照射野</th> -->
              <th style="width: 40px;">阈值</th>
              <th style="width: 60px;">检测时间</th> 
            </tr>
          </thead>
          <tbody class="tab-lists">
            <tr v-for="(project, index) in projectData(projects)" :key="index">
              <td>{{ project.projectNo }}</td>
              <td :rowspan="project.rowspan" v-show="project.rowspan > 0">
                {{ project.name
                }}{{ project.subName ? "(" + project.subName + ")" : "" }}
              </td>
              <td class="word-break-not">
                {{
                  project.result && project.result
                    ? project.detectType == "影像分析"
                      ? project.result.power
                      : project.result.key
                    : ""
                }}
              </td>
              <td class="word-break-not">
                {{
                  project.result && project.result
                    ? project.detectType == "影像分析"
                      ? project.result.value
                      : project.result.val
                    : ""
                }}
                <!-- 检测值单位 -->
                <span>{{project.testUnit}}</span>
                <!--<div v-if="project.detectType=='影像分析'">-->
                <!--<div v-for="v in project.testResult">{{v.power}} {{v.size}}cm-{{v.value}}mm</div>-->
                <!--</div>-->
                <!--<div v-else>-->
                <!--<div v-if="project.testResult" v-for="te in project.testResult" class="test-result">{{te.val}}</div>-->
                <!--</div>-->
              </td>
              <td>{{ project.threshold }}</td>
              <!-- <td class="word-break-not">{{project.result&&project.result?(project.detectType=='影像分析'?(project.result.size+'cm'):'-'):''}}</td> 照射野 -->
              <td
                :rowspan="project.rowspan"
                v-show="project.rowspan > 0"
                class="word-break-not"
              >
                {{ project.createDate ? project.createDate.substr(0, 16) : "" }}
              </td>
            </tr>
          </tbody>
        </table>
        <div id = 'pageFooter' class="footer">
          <!-- <div style="color: #9b9b9b; font-size: 12px">
            打印时间：{{ nowTme }}
          </div> -->
          <div
            style="
              font-size: 15px;
              display: flex;
              flex-derection: row;
              justify-content: space-between;
              margin-top: 30px;
            "
          >
            <div style="display: flex; flex-direction: column">
              <div>检测人签名：</div>
              <div
                style="
                  height: 1px;
                  width: 200px;
                  background-color: black;
                  margin-top: 30px;
                "
              ></div>
            </div>
            <div style="display: flex; flex-direction: column; float: right">
              <div>报告日期：</div>
              <div
                style="
                  height: 1px;
                  width: 200px;
                  background-color: black;
                  margin-top: 30px;
                "
              ></div>
            </div>
          </div>
          <div
            style="
              font-size: 14px;
              color: #ccc;
              margin-top: 50px;
              display: flex;
              flex-derection: row;
              justify-content: space-between;
            "
            class="print-footer"
          >
            <div>医用电子直线加速器质量控制报告</div>
            <div>第{{ currentPage }}页/共{{total}}页</div>
          </div>
        </div>
      </div>
    </div>
    <div style="text-align: center; padding-bottom: 20px">
      <el-button type="primary" class="active" @click="print"
        >打印报表</el-button
      >
      <!-- <el-button type="primary" class="active" v-print="'#print-wrapper'">打印报表</el-button> -->
    </div>
  </div>
</template>

<script>
import { parseTime } from "../../utils";
import { getDevices, editHospital, getHospitals, fileUpload } from "../../api";
import { mapState } from "vuex";
export default {
  name: "print",
  data() {
    return {
      nowTme: parseTime(Date.now())
    };
  },
  props: {
    hospitalInfo: {
      type: Object,
      default: {}
    },
    projects: {
      type: Array,
      default: []
    },
    currentPage: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    }
  },
  computed: {
    projectData() {
      return function(value) {
        let data = [];
        value.forEach(val => {
          val.rowspan = 1;
          if (val.testResult && Array.isArray(val.testResult)) {
            val.rowspan = val.testResult.length;
            val.testResult.forEach((item, index) => {
              if (index !== 0) val.rowspan = 0;
              data.push({ ...val, ...{ result: item } });
            });
          } else {
            data.push(val);
          }
        });
        console.log("data", data);
        return data;
      };
    },
    //加速器设备
    device() {
      return this.$store.state.user.devices;
    },
    model() {
      return this.$store.state.user.currentDeviceInfo.model;
    },
    sequence() {
      return this.$store.state.user.currentDeviceInfo.sequence;
    }
  },
  methods: {
    print() {
      this.nowTme = parseTime(Date.now());
      let html = document.getElementById("print-wrapper").outerHTML,
        style = this.getStyle();
      console.log(html.indexOf("height: 60vh"));
      html = html.replace("height: 60vh", "");
      html = html.replace("overflow-y: auto", "");
      console.log(html)
      this.writeIframe(style + html);
    },
    // getElementTop(el) {
    //   let targetEl = "print-wrapper";
    //   let elTop = el.offsetTop;
    //   el = el.offsetParent;
    //   while (el.id !== targetEl) {
    //     elTop += el.offsetTop;
    //     el = el.offsetParent;
    //   }
    //   return elTop;
    // },
    // insetFooter() {
    //   let el = document.getElementById("print-wrapper");
    //   let trs = el.getElementsByTagName('tr');
    //   let relativePosition = 0;
    //   let insertList = [];
    //   Array.prototype.forEach.call(trs, item => {
    //     let topHeight = this.getElementTop(item) - relativePosition;
    //     let height = item.offsetHeight;
    //     if (topHeight + height > 900) {
    //       insertList.push(item)
    //       relativePosition = this.getElementTop(item);
    //     }
    //   })
    //   insertList.forEach((item, index) => {
    //     let tmpTr = document.createElement('tr');
    //     let pageTr = document.createElement('tr');
    //     pageTr.style.pageBreakAfter = 'always';
    //     tmpTr.innerHTML = `
    //       <td colspan="6" style="border-top:1px solid #d2d2d2;position:relative;left:1px;background:#fff;">
    //         <div style="font-size:14px;color:#ccc;display:flex;justify-content: space-between;margin-top:10px;">
    //           <div>医用电子直线加速器质量控制报告</div>
    //           <div>第${index + 1}页/共${insertList.length + 1}页</div>
    //         </div>
    //       </td>
    //     `
    //     item.parentNode.insertBefore(tmpTr, item);  
    //     item.parentNode.insertBefore(pageTr, item);
    //   })
    //   var tmpTr = document.createElement("div");
    //   let footer = el.getElementsByClassName('footer')[0];
    //   let top = this.getElementTop(footer);
    //   let marginTop = 1000 * (insertList.length + 1) - top - footer.offsetHeight - 18;
    //   tmpTr.innerHTML = `
    //       <div style="
    //         font-size: 14px;
    //         color: #ccc;

    //         display: flex;
    //         flex-derection: row;
    //         justify-content: space-between;
    //         margin-top: ${marginTop}px;

    //       ">
    //         <div>医用电子直线加速器质量控制报告</div>
    //         <div>第${insertList.length + 1}页/共${insertList.length + 1}页</div>
    //       </div>
    //   `;
    //   el.getElementsByClassName('report-tab')[0].appendChild(tmpTr);
    // },
    getStyle() {
      var str = "",
        styles = document.querySelectorAll("style,link");
      for (var i = 0; i < styles.length; i++) {
        str += styles[i].outerHTML;
      }
      // str += "<style>" + (this.options.noPrint ? this.options.noPrint : '.no-print') + "{display:none;}</style>";
      // str += "<style>input[type=text]{border: none;outline:none;}</style>";
      // console.log(str)
      return str;
    },
    writeIframe(content) {
      var w,
        doc,
        iframe = document.createElement("iframe"),
        f = document.body.appendChild(iframe);
      iframe.id = "myIframe";
      iframe.style =
        "position:absolute;width:0;height:0;top:-10px;left:-10px;font-size:12px;";
      w = f.contentWindow || f.contentDocument;
      doc = f.contentDocument || f.contentWindow.document;
      // console.log(content)
      doc.open();
      doc.write(content);
      doc.close();
      w.onload = function() {
        console.log("printframe onload");
        w.print();
        setTimeout(function() {
          document.body.removeChild(iframe);
        }, 100);
      };
    }
  },
  created() {
    console.log("aaaaa", this.$store.state.user.devices);
  },
  // mounted() {
  //   this.insetFooter();
  // }
};
</script>

<style lang="scss" scoped>
#print-wrapper {
  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    background-color: rgba(0, 0, 0, 0.01);
  }
  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.24);
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0);
    /*background-color: #c1c1c0;*/
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: rgba(139, 139, 138, 0.47);
  }
  background: #ffffff;
  color: #333;
  position: relative;
  table {
    border-right: 1px solid #d2d2d2;
    border-bottom: 1px solid #d2d2d2;
    tr {
      th {
        color: #333;
        border-color: #d2d2d2;
        border-top: 1px solid #d2d2d2;
        border-left: 1px solid #d2d2d2;
        font-size: 12px;
        padding: 6px;
        white-space: nowrap;
        font-weight: 700;
        background: #f3f3f3;
        &:last-of-type {
          /*border-right: none;*/
        }
      }
      td {
        background: #ffffff;
        color: #333;
        border-color: #d2d2d2;
        border-top: 1px solid #d2d2d2;
        border-left: 1px solid #d2d2d2;
        font-size: 11px;
        padding: 6px;
        &:last-of-type {
          /*border-right: none;*/
        }
      }
      &:last-of-type {
        td {
          /*border-bottom: none;*/
        }
      }
    }
  }
  .report-tab {
    height: 84%;
    margin-top: 25px;
    background: rgba(255, 255, 255, 0.1);
    .report-tab-content {
      width: 100%;
      .tab-header {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
        font-family: "Microsoft YaHei";
        font-weight: 400;
        font-size: 14px;
      }
      .tab-lists {
        /*background: rgba(255,255,255,0.1);*/
        color: rgba(255, 255, 255, 0.8);
        font-family: "Microsoft YaHei";
        font-size: 13px;
        text-align: center;
        .watch-history {
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #2ccead;
        }
      }
    }
    .pagination {
      margin-top: 2%;
      /deep/ .el-pagination {
        .btn-prev {
          background-color: #1c1c1c;
          border: 1px solid #464646;
          color: rgba(255, 255, 255, 0.8);
        }
        :disabled {
          color: rgba(255, 255, 255, 0.8);
        }
        .btn-next {
          background-color: #1c1c1c;
          border: 1px solid #464646;
          color: rgba(255, 255, 255, 0.8);
        }
        .el-pager li {
          background: #1c1c1c;
          border: 1px solid #464646;
          color: rgba(255, 255, 255, 0.8);
        }
        .el-pagination.is-background .el-pager li:not(.disabled).active {
          background-color: #3d3d3d !important;
        }
        .el-pagination__jump {
          color: rgba(255, 255, 255, 0.8);
          .el-input__inner {
            background-color: #1c1c1c;
            border: 1px solid #464646;
            color: rgba(255, 255, 255, 0.8);
          }
        }
      }
    }
  }
}
@media print {
  #print-wrapper {
    -webkit-print-color-adjust: exact;
    padding-bottom: 20px;
    box-sizing: border-box;

    .report-tab {
    height: 100%!important;
    overflow-y: visible!important;
}
  }
}
// #content {
//     display: table;
// }

// #pageFooter {
//     display: table-footer-group;
// }

// #pageFooter:after {
//     counter-increment: page;
//     content:"Page " counter(page);
//     left: 0; 
//     top: 100%;
//     white-space: nowrap; 
//     z-index: 20;
//     -moz-border-radius: 5px; 
//     -moz-box-shadow: 0px 0px 4px #222;  
//     background-image: -moz-linear-gradient(top, #eeeeee, #cccccc);  
//   }
</style>
