<template>
  <div class="test-page page-qcs">
    <div class="test-search page-qcs-head">
      <div class="test-search-left">
        <div class="test-search-lists">
          <el-input
            placeholder="请输入项目号"
            v-model="projectSearch.projectNo"
          ></el-input>
        </div>
        <div class="test-search-lists">
          <el-input
            placeholder="请输入项目名称"
            v-model="projectSearch.name"
          ></el-input>
        </div>
        <div class="test-search-lists">
          <el-select
            v-model="projectSearch.period"
            placeholder="请选择检测周期"
          >
            <el-option value="一天"></el-option>
            <el-option value="一周"></el-option>
            <el-option value="一个月"></el-option>
            <el-option value="三个月"></el-option>
            <el-option value="六个月"></el-option>
            <el-option value="一年"></el-option>
          </el-select>
        </div>
        <el-button type="primary" @click="getProjectsFn(1)">查询</el-button>
        <el-button @click="resetFn">重置</el-button>
      </div>
    </div>
    <div class="test-tab clearfix page-qcs-body">
      <div
        class="test-tab-left"
        style="
          overflow-y: auto;
          position: relative;
          display: flex;
          background: #000000;
        "
      >
        <div style="flex: auto">
          <div class="test-type clearfix">
            <div
              class="test-type-item left"
              :class="{ active: typeName == 'image' }"
              @click="switchProject('image', '影像分析')"
            >
              图像分析
            </div>
            <div
              class="test-type-item right"
              :class="{ active: typeName == 'number' }"
              @click="switchProject('number', '数值分析')"
            >
              数值分析
            </div>
          </div>
          <div class="test-upload" v-if="typeName == 'image'">
            <el-upload
              class="upload-demo"
              action="123"
              :show-file-list="false"
              accept=".dcm"
              :http-request="onHttpRequest"
              :limit="50"
              multiple
            >
              <el-button type="primary" @click="onclickOpen"
                >载入图片</el-button
              >
            </el-upload>
            <!--<el-button type="primary" class="active" @click="addImage">载入图片</el-button>-->
            <el-button
              type="primary"
              style="margin-left: 10px"
              @click="onclickDicom()"
              >RT_Plan Dicom输出</el-button
            >
          </div>
          <table
            class="table test-tab-content"
            border="0"
            cellspacing="0"
            v-if="typeName == 'image'"
          >
            <thead class="tab-header">
              <tr>
                <th>
                  Plan
                  <!--<el-checkbox v-model="checkedAll" @change="handleChangeAll"></el-checkbox>-->
                </th>
                <th class="word-break-not">
                  项目号<sort @sortClick="onclickSort"></sort>
                </th>
                <th>项目名称</th>
                <th>检测值</th>
                <!--<th>辐射类型</th>-->
                <th>阈值</th>
                <th>检测周期</th>
                <th>上次检测时间</th>
                <th class="word-break-not">过期提醒</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody class="tab-lists">
              <tr
                :class="{
                  'table-current-row':
                    currentRowIndex == index && index % 2 !== 0,
                  'table-current-row-odd':
                    currentRowIndex == index && index % 2 === 0,
                }"
                v-for="(project, index) in projectImage.data"
                :key="index"
                @click="handleCurrentChangeSelected(project, index)"
              >
                <td>
                  <el-checkbox
                    v-model="project.checked"
                    v-if="isDicom(project)"
                    @change="handleChangeSingle(project)"
                  ></el-checkbox>
                </td>
                <td>{{ project.projectNo }}</td>
                <td class="table-project-name">
                  {{ project.name
                  }}{{ project.subName ? "(" + project.subName + ")" : "" }}
                </td>
                <td>
                  <!-- 检测值 -->
                  <div v-if="project.tmpResult">
                    <div v-for="v in project.tmpResult">
                      <span v-if="v.value !== 'NaN'"
                        >{{ v.power }} {{ v.size }}cm-{{ v.value
                        }}{{ v.testUnit }}</span
                      >
                      <span v-if="v.value == 'NaN'">{{ v.value }}</span>
                      <!-- <img v-if="!compare(v.val,project.threshold)" src="../assets/images/arrow.png" /> -->
                      <img
                        class="showArrow"
                        v-if="!compareCal(v.value, project.threshold)"
                        src="../../assets/images/arrow.png"
                      />
                    </div>
                  </div>
                  <div v-else>
                    <div v-for="v in project.testResult">
                      {{ v.power }} {{ v.size }}cm-{{ v.value }}{{ v.testUnit }}
                    </div>
                  </div>
                </td>
                <!--<td>{{project.radioType}}</td>-->
                <td>{{ project.threshold }}</td>
                <td>{{ project.period }}</td>
                <td>{{ project.createDate }}</td>
                <td>
                  <div :style="{ color: getOverDate(project).color }">
                    {{ getOverDate(project).name }}
                  </div>
                </td>
                <td style="width: 50px">
                  <div class="handle">
                    <div
                      class="handle-item"
                      :style="{
                        color:
                          project.tmpResult && project.tmpResult.length > 0
                            ? '#2CCEAD'
                            : 'rgba(255, 255, 255, 0.4)',
                      }"
                      @click="saveProjectChangeImage(project)"
                    >
                      保存
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- 数值输入 -->
          <table
            class="table test-tab-content"
            border="0"
            cellspacing="0"
            v-if="typeName == 'number'"
            style="margin-top: 2%"
          >
            <thead class="tab-header">
              <tr>
                <th class="word-break-not">
                  项目号<sort @sortClick="onclickSortNum"></sort>
                </th>
                <th>项目名称</th>
                <!--<th>辐射类型</th>-->
                <th>输入值</th>
                <th>计算值</th>
                <th>阈值</th>
                <th class="word-break-not">检测周期</th>
                <th>上次检测时间</th>
                <th class="word-break-not">过期提醒</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody class="tab-lists">
              <tr
                :class="{
                  'table-current-row':
                    currentRowIndexNum == index && index % 2 !== 0,
                  'table-current-row-odd':
                    currentRowIndexNum == index && index % 2 === 0,
                }"
                v-for="(project, index) in projectNum.data"
                :key="index"
                @click="handleCurrentChangeSelected(project, index, 1)"
              >
                <!-- 数值输入 项目号 -->
                <td>{{ project.projectNo }}</td>
                <td class="table-project-name">
                  {{ project.name
                  }}{{ project.subName ? "(" + project.subName + ")" : "" }}
                </td>
                <!--<td>{{project.radioType}}</td>-->
                <!-- 数值输入 输入值 -->
                <td>
                  <el-popover
                    placement="bottom"
                    :width="getWidth(project.numOfInput)"
                    trigger="click"
                    v-for="(item, index) in project.energy"
                    :key="index"
                    class="test-popover"
                    @show="onShowInput(project, item, index)"
                  >
                    <div class="test-item">
                      <div class="test-result">
                        <div class="test-result-title">
                          <span v-if="item != '-'">{{ item }}的</span
                          >检测值<span v-if="showTitle1(project)"
                            >（10*10）</span
                          >
                        </div>
                        <div class="test-result-item clearfix">
                          <!--<div class="item-number left"><span>{{project.energyJson.levelNum}}</span></div>-->
                          <!--<div class="item-unit left">mm</div>-->
                          <div class="item-number left">
                            <span v-if="getTestResultCalc(project, item)"
                              >{{ getTestResultCalc(project, item)
                              }}{{ project.testUnit }}</span
                            >
                            <img
                              v-if="
                                project.testResult &&
                                  !compareCal(
                                    getTestResultCalc(project, item),
                                    project.threshold
                                  )
                              "
                              src="../../assets/images/arrow.png"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="test-number">
                        <!--<div class="test-number-title">输入值</div>-->
                        <div class="test-number-lists clearfix">
                          <div v-if="project.energyJson.levelNum == 1">
                            <!--此处无能量档 无检测点 -->
                            <div
                              class="test-number-lists-item left"
                              v-for="(inputValue, inputIndex) in project
                                .energyJson.inputData"
                              :key="inputIndex"
                              :style="{ width: 66 / project.numOfInput + '%' }"
                            >
                              <input
                                type="text"
                                :placeholder="
                                  inputPlaceholder(
                                    project,
                                    inputValue,
                                    inputIndex
                                  )
                                "
                                v-model="
                                  project.energyJson.inputData[inputIndex]
                                "
                                @change="onchangeVal(project)"
                              />
                            </div>
                          </div>
                          <div
                            v-if="
                              project.energyJson.levelNum == 2 &&
                                energyIndex == selectedEnergy
                            "
                            v-for="(energy, energyIndex) in project.energyJson"
                            :key="energyIndex"
                          >
                            <!--此处有能量档 无检测点-->
                            <div
                              class="left"
                              style="
                                width: 50px;
                                line-height: 30px;
                                margin: 2% 0;
                              "
                              v-if="energyIndex != 'levelNum'"
                            >
                              {{ energyIndex }}
                            </div>
                            <div
                              class="test-number-lists-item left"
                              v-if="energyIndex != 'levelNum'"
                              v-for="(inputValue,
                              inputIndex) in energy.inputData"
                              :key="inputIndex"
                              :style="{ width: 66 / project.numOfInput + '%' }"
                            >
                              <input
                                type="text"
                                :placeholder="
                                  inputPlaceholder(
                                    project,
                                    inputValue,
                                    inputIndex
                                  )
                                "
                                v-model="energy.inputData[inputIndex]"
                                @change="onchangeVal(project)"
                              />
                            </div>
                            <span
                              style="
                                white-space: nowrap;
                                line-height: 32px;
                                float: left;
                                top: 3px;
                                position: relative;
                              "
                              v-if="
                                project.projectID === 8 &&
                                  energyIndex != 'levelNum'
                              "
                              >Gy</span
                            >
                          </div>
                          <div
                            v-if="project.energyJson.levelNum == 3"
                            v-for="(energy, energyIndex) in project.energyJson"
                            :key="energyIndex"
                          >
                            <!--此处有能量档 有检测点-->
                            <div
                              v-if="
                                energyIndex != 'levelNum' && energyIndex == item
                              "
                              v-for="(pointValues, pointIndex) in energy.points"
                              :key="pointIndex"
                            >
                              <div
                                class="left"
                                style="
                                  width: 68px;
                                  line-height: 30px;
                                  margin: 2% 0;
                                "
                              >
                                {{
                                  getPonitValue(
                                    project,
                                    energy.points,
                                    pointIndex
                                  )
                                }}
                              </div>
                              <div
                                class="test-number-lists-item left"
                                v-for="(pointValue,
                                pointValueIndex) in pointValues"
                                :key="pointValueIndex"
                                :style="{
                                  width: 66 / project.numOfInput + '%',
                                }"
                              >
                                <input
                                  type="text"
                                  :placeholder="
                                    inputPlaceholder(
                                      project,
                                      pointValue,
                                      pointValueIndex
                                    )
                                  "
                                  v-model="pointValues[pointValueIndex]"
                                  @change="onchangeVal(project)"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div slot="reference" class="test-popover-item">
                      {{ item }}
                    </div>
                  </el-popover>
                </td>
                <td>
                  <!-- 这个是计算值的组件 -->
                  <test-result :project="project"> </test-result>
                </td>
                <td>{{ project.threshold }}</td>
                <td>{{ project.period }}</td>
                <td>{{ project.createDate }}</td>
                <td>
                  <div :style="{ color: getOverDate(project).color }">
                    {{ getOverDate(project).name }}
                  </div>
                </td>
                <td class="" style="width: 40px">
                  <div class="handle">
                    <div
                      class="handle-item"
                      :style="{
                        color: project.changed
                          ? '#2CCEAD'
                          : 'rgba(255, 255, 255, 0.4)',
                      }"
                      @click="saveProjectChange(project)"
                    >
                      保存
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="pagination clearfix" v-if="typeName == 'image'">
            <el-pagination
              :background="true"
              layout="total, prev, pager, next,jumper"
              :page-size="projectImage.offset"
              :total="projectImage.count"
              prev-text="上一页"
              next-text="下一页"
              class="right"
              @current-change="handleCurrentChangeImage"
              :current-page="projectImage.pageNum"
            >
            </el-pagination>
          </div>
          <div class="pagination clearfix" v-if="typeName == 'number'">
            <el-pagination
              :background="true"
              layout="total, prev, pager, next,jumper"
              :page-size="projectNum.offset"
              :total="projectNum.count"
              prev-text="上一页"
              next-text="下一页"
              class="right"
              @current-change="handleCurrentChange"
              :current-page="projectNum.pageNum"
            >
            </el-pagination>
          </div>
        </div>
        <div style="width: 20px"></div>
      </div>
      <div class="test-tab-right">
        <div class="test-tab-right-item">WS674标准</div>
        <div class="test-tab-right-name" v-if="currentRow && currentRow.id">
          <!--6.6.3 旋转运动标尺的零刻度位置-->
          {{ currentRow.projectNo }} {{ currentRow.name }}
        </div>
        <div class="test-tab-right-content" v-if="currentRow && currentRow.id">
          <!--将慢感光胶片置于治疗床面，用建成材料覆盖其上。将70KG负载（成人）均匀分布在床面，中心作用在等中心上，照射野调至10cm*10cm，治疗床面调至近似于等中心高度时，对慢感光胶片进行照射。然后将床面将至20cm并在此照射，测出两个照射野中心的位移。-->
          {{ currentRow.detail }}
          <br />
          <img
            v-if="currentRow.detailUrl"
            :src="currentRow.detailUrl"
            style="max-width: 100%; max-height: 100%"
            alt=""
          />
        </div>
      </div>
    </div>
    <el-dialog
      title="RT_Plan Dicom输出"
      :visible.sync="showDICOM"
      width="40%"
      center
    >
      <el-main class="table-out">
        <table class="table test-tab-content" border="0" cellspacing="0">
          <thead class="tab-header">
            <tr>
              <th></th>
              <th>终端名</th>
              <th>AE TITLE</th>
              <th>IP</th>
              <th>端口号</th>
            </tr>
          </thead>
          <tbody class="tab-lists">
            <tr
              v-for="(v, index) in dicomData.data"
              :key="index"
              @click="onclickTr(v)"
            >
              <td style="width: 50px">
                <!--<el-radio name="dicomname" @click="onclickTr(v)"  :ref="v.refName"></el-radio>-->
                <!--<input name="dicomname" type="radio" @click="onclickTr(v)"  :ref="v.refName">-->
                <label class="page-radio"
                  ><input
                    type="radio"
                    name="dicomname"
                    @click="onclickTr(v)"
                    :ref="v.refName"/><label
                    ><span class="radio-span"></span></label
                ></label>
              </td>
              <td style="width: 100px; text-align: center">{{ v.customer }}</td>
              <td style="width: 100px; text-align: center">{{ v.aeTitle }}</td>
              <td style="width: 100px; text-align: center">
                {{ v.ip }}:{{ v.port }}
              </td>
              <td style="width: 100px; text-align: center">{{ v.port }}</td>
            </tr>
          </tbody>
        </table>
        <div class="pagination clearfix">
          <el-pagination
            :background="true"
            layout="total, prev, pager, next,jumper"
            :page-size="dicomData.offset"
            :total="dicomData.count"
            prev-text="上一页"
            next-text="下一页"
            class="right"
            @current-change="handleCurrentChangeDic"
            :current-page="dicomData.pageNum"
            style="margin-top: 0"
          >
          </el-pagination>
        </div>
      </el-main>
      <div slot="footer">
        <div class="add-image-btn">
          <el-button @click="showDICOM = false">取消</el-button>
          <el-button type="primary" @click="onclickSave()">保存</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="本地上传的DICOM图片"
      :visible.sync="showImage"
      width="50vw"
      center
    >
      <div class="img-lists">
        <div
          class="img-lists-item"
          v-for="(v, index) in imageData"
          :key="index"
        >
          <canvas :ref="v.refName" :name="getData(index, v)"></canvas>
        </div>
      </div>
      <div slot="footer">
        <div class="add-image-btn">
          <el-button @click="showImage = false">取消</el-button>
          <el-button type="primary" @click="showImageAnalyse()"
            >下一步</el-button
          >
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="载入图片分析"
      :visible.sync="showAnalyse"
      :before-close="handleClose"
      width="60vw"
      center
    >
      <div class="img-lists clearfix">
        <div class="img-analyse">
          <div class="list-name">
            <div class="list-name-title">项目名称</div>
            <div class="list-name-content list-name-content-val">
              <div
                class="project-name-lists"
                :class="{ active: activeProjectIndex == index }"
                v-for="(v, index) in projectsData"
                @click="onProjectChange(index, v)"
                :key="v.id"
              >
                <div class="project-name-lists-item">
                  {{ v.name }}{{ v.subName ? "(" + v.subName + ")" : "" }}
                </div>
              </div>
            </div>
          </div>
          <div class="list-image-item list-image-item-content">
            <div class="list-name-title">照射野</div>
            <div class="list-name-content-val">
              <div
                class="image-canvas image-canvas-view"
                v-for="(v, index) in viewData"
                :key="index"
              >
                <div
                  class="image-canvas-item"
                  draggable="true"
                  @dragstart="dragStart($event, index, 0)"
                  @drop="drop($event, index, viewData, viewImageData, 0)"
                  @dragover="allowDrop($event)"
                >
                  <canvas
                    :ref="v.refNameAna"
                    v-if="v.refNameAna"
                    :name="getDataAna(index, v)"
                  ></canvas>
                </div>
                <div class="image-canvas-text">
                  {{ v.power }} - {{ v.size }}
                </div>
              </div>
            </div>
          </div>
          <div class="list-image-item list-image-item-content">
            <div class="list-name-title">已上传图片</div>
            <div class="list-name-content-val">
              <div
                class="image-canvas"
                v-for="(v, index) in viewImageData"
                :key="index"
              >
                <div
                  class="image-canvas-item"
                  draggable="true"
                  @dragstart="dragStart($event, index, 1)"
                  @drop="drop($event, index, viewImageData, viewData, 1)"
                  @dragover="allowDrop($event)"
                >
                  <canvas
                    :ref="v.refNameAna"
                    v-if="v.refNameAna"
                    :name="getDataAna(index, v)"
                  ></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <div class="add-image-btn">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="onclickAna">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";
import "../../utils/main";
import { deepCopy } from "../../../main/util/util";
import { calcWarningTime } from "../../utils";

import {
  addDicom,
  getDicoms,
  delDicom,
  addDevice,
  getDevices,
  delDevice,
  getProjects,
  updateProject,
  addTestResult,
  getTestValue,
  transferDicom,
} from "../../api";
import * as cacTestVal from "../../utils/result";

import TestResult from "../../components/testResult";
import Sort from "../../components/sort";
import { ipcRenderer } from "electron";
export default {
  components: {
    TestResult,
    Sort,
  },
  data() {
    return {
      dialogVisible: false,
      showDICOM: false,
      showImage: false,
      showAnalyse: false,
      typeName: "image",
      detectType: "影像分析",
      projects: [],
      project: {},
      files: [],
      projectsData: [],
      activeProjectIndex: 0,
      imageData: [],
      viewData: [],
      viewImageData: [],
      projectImage: {
        data: [],
        pageNum: 1,
        offset: 110,
        count: 0,
        orderBy: "",
      },
      projectNum: {
        data: [],
        pageNum: 1,
        offset: 10,
        count: 0,
        orderBy: undefined,
      },
      dicomData: {
        data: [],
        pageNum: 1,
        offset: 10,
        count: 0,
      },
      projectSearch: {
        projectNo: undefined,
        name: undefined,
        testValue: undefined,
      },
      selectedVal: [],
      selectedDicom: {},
      currentRow: {},
      selectedRow: {},
      selectedEnergy: null,
      selectedIndex: null,
      checkedAll: false,
      currentRowIndex: null,
      currentRowIndexNum: null,
      tempTestResult: [], /// 测试临时数据保存
      currentFile: "",
      pathRT: [],
      fromIndex: 0,
    };
  },
  computed: mapState({
    currentDeviceID: (state) => state.user.currentDeviceID,
    currentDeviceInfo: (state) => state.user.currentDeviceInfo,
    getData() {
      return function(index, val) {
        // console.log(1111)
        this.$nextTick(() => {
          // console.log(this.$refs,val)
          let canvas = this.$refs[val.refName];
          if (canvas && canvas.length > 0) {
            canvas = canvas[0];
            const ctx = canvas.getContext("2d");
            const pixelData = val.data;
            if (pixelData) {
              canvas.width = pixelData.width;
              canvas.height = pixelData.height;
              ctx.putImageData(pixelData, 0, 0);
            }
          }
        });
        return 1;
      };
    },
    getDataAna() {
      return function(index, val) {
        console.log("getDataAna");
        if (!val.refNameAna) return;
        this.$nextTick(() => {
          // console.log(this.$refs,val)
          let canvas = this.$refs[val.refNameAna];
          if (canvas && canvas.length > 0) {
            canvas = canvas[0];
            const ctx = canvas.getContext("2d");
            const pixelData = val.data;
            if (pixelData) {
              canvas.width = pixelData.width;
              canvas.height = pixelData.height;
              ctx.putImageData(pixelData, 0, 0);
            }
          }
        });
        return 1;
      };
    },
    getOverDate() {
      return function(val) {
        return calcWarningTime(val);
      };
    },
    isDicom() {
      return function(val) {
        return [18, 19, 20, 21, 22, 23, 24, 25, 26, 27].includes(val.projectID);
      };
    },
    getTestResultCalc() {
      return function(project, item) {
        console.log("666666666666666666", project, item);
        let val = null;
        if (project.testResult && project.testResult.length > 0) {
          let obj = project.testResult.find((val1) => val1.key == item);
          if (obj) {
            val = obj.val;
          }
          // else {
          //   val = project.testResult[0].val;
          // }
        }
        console.log("val======>", val);
        return val;
      };
    },
    compareCal() {
      return function(val, data) {
        if (!data) return;
        let testVal = 0,
          testData = 0;
        // if (val) {
        //   // testVal = val.replace(/mm|%|°/, "");
        // }
        testData = data.substr(1);
        testData = testData.replace(/mm|%|°/, "");
        // testVal = val?(val.includes('%')?val.replace('%','')/100:val):0;
        testVal = val ? val : 0;
        return testVal - testData <= 0;
      };
    },
  }),
  mounted() {
    this.getProjectsFn(1);
  },

  watch: {
    currentDeviceID: function(val) {
      console.log(val);
      this.getProjectsFn(1);
    },
    $route: function() {
      console.log("$route");
      if (this.$route.name === "test") {
        this.getProjectsFn();
      }
    },
  },
  methods: {
    getViewData() {
      let project = this.projectsData[this.activeProjectIndex];
      let data = [];
      let powerList = [];
      let energy = [];
        project.energy.forEach((item) => {
        powerList.push({ num: parseInt(item), value: item });
         powerList.sort(function(a,b){return a.num-b.num});
      });
      if (
        project.extraRequire ==
        "两个能量，最大和最小，每个能量两张图，10*10和20*20"
      ) {
        energy.push(powerList[0].value);
        energy.push(powerList[powerList.length - 1].value);
      } else if (project.extraRequire == "单个能量，两张图10*10") {
        energy.push(powerList[0].value);
      } else if (
        project.extraRequire == "两个能量，最大和最小，每个能量单张图，10*10"
      ) {
        energy.push(powerList[0].value);
        energy.push(powerList[powerList.length - 1].value);
      } else if ((project.extraRequire = "单个能量，单张图，10*10")) {
        energy.push(powerList[0].value);
      } else if (
        project.extraRequire == "单个能量，首选X线检测能量，分析3张图10*10"
      ) {
        energy.push(powerList[0].value);
      }
      if (energy) {
        energy.forEach((val) => {
          let views = project.views;
          if (views) {
            views = views.split(",");
            views.forEach((value) => {
              let item = { power: val };
              item.size = value;
              data.push(item);
            });
          }
        });
      }
      return data;
    },
    onProjectChange(index, value) {
      this.activeProjectIndex = index;
      this.viewData = this.getViewData();
      this.viewImageData = [];
      console.log(this.imageData);
      this.imageData.forEach((val) => {
        this.viewImageData.push({
          data: val.data,
          refNameAna: val.refNameAna,
          testValue: val.testValue,
          filePath: val.filePath,
        });
      });
    },
    getProjectsImage(state) {
      if (state) this.projectImage.pageNum = 1;
      let obj = {
        deviceID: this.currentDeviceID,
        detectType: this.detectType,
        pageNum: this.projectImage.pageNum - 1,
        offset: this.projectImage.offset,
        analysis: 1,
        projectNo: this.projectSearch.projectNo,
        name: this.projectSearch.name,
        period: this.projectSearch.period,
        orderBy: this.projectImage.orderBy,
        timeout: 1,
      };
      getProjects(obj).then((res) => {
        console.log(res);
        //根据检测点数 和输入值的数量以及是否有x线和电子线来自动分配数据
        let data = this.makeupJson(res.projects);
        data.forEach((val) => {
          let obj = this.tempTestResult.find((item) => item.id === val.id);
          if (obj) {
            console.log(`obj,`, obj);
            val.tmpResult = obj.tmpResult;
            val.testResult = obj.testResult;
          }
        });
        this.projectImage.data = data;
        this.projectImage.count = res.count;
        console.log(`projectImage,`, this.projectImage);
        this.$forceUpdate();
      });
    },
    getProjectsNum(state) {
      if (state) this.projectNum.pageNum = 1;
      let obj = {
        deviceID: this.currentDeviceID,
        detectType: this.detectType,
        pageNum: this.projectNum.pageNum - 1,
        offset: this.projectNum.offset,
        projectNo: this.projectSearch.projectNo,
        name: this.projectSearch.name,
        period: this.projectSearch.period,
        orderBy: this.projectNum.orderBy,
      };
      getProjects(obj).then((res) => {
        console.log(res);
        //根据检测点数 和输入值的数量以及是否有x线和电子线来自动分配数据
        console.log("this.tempTestResult", this.tempTestResult);
        let data = this.makeupJson(res.projects);
        data.forEach((val) => {
          let obj = this.tempTestResult.find((item) => item.id === val.id);
          if (obj) {
            console.log("onbj", obj);
            val.tmpResult = obj.tmpResult;
            val.testResult = obj.testResult;
            val.changed = true;
          }
        });
        this.projectNum.data = data;
        this.projectNum.count = res.count;
        console.log(`projectNum,`, this.projectNum);
        this.$forceUpdate();
      });
    },
    async onHttpRequest(file) {
      // console.log('onHttpRequest',library)
      console.log("onHttpRequest", file);
      this.currentFile = file;
      const libraryData = await library.loadFile(file.file);
      console.log(
        "%c [ libraryData ]",
        "font-size:13px; background:pink; color:#bf2c9f;",
        libraryData
      ); //dicom的信息
      let filePath = file.file.path;
      console.log(`filePath=${filePath}`);
      let len = this.imageData.length,
        refName = "canvas" + len,
        refNameAna = "canvasAna" + len;
      this.imageData.push({
        data: libraryData.imageData,
        refName: refName,
        refNameAna: refNameAna,
        filePath: filePath,
        pixels: libraryData.Pixels,
        image: libraryData.image,
      });
      this.viewImageData.push({
        data: libraryData.imageData,
        refNameAna: refNameAna,
        filePath: filePath,
        pixels: libraryData.Pixels,
        image: libraryData.image,
      });
      this.showAnalyse = true;
      console.log("onHttpRequest", this.imageData);
    },

    onclickOpen(file) {
      this.imageData = [];
      getProjects({
        deviceID: this.currentDeviceID,
        pageNum: 0,
        offset: 200,
        analysis: 1,
      }).then((res) => {
        console.log(res);
        this.projectsData = this.makeupJson(res.projects);
        this.viewData = this.getViewData();
        console.log(
          "%c [ this.viewData  ]",
          "font-size:13px; background:pink; color:#bf2c9f;",
          this.viewData
        );
        // let powerArr = this.getViewData();
        // powerArr.forEach(item=>{
        //   let max = powerArr[i].power
        // })
        // this.projectsData.forEach(item=>{
        //   if(this.projectsData[item].extraRequire=='两个能量，最大和最小，每个能量两张图，10*10和20*20') {

        //   }
        // })

        // console.log(this.viewData);
      });
    },
    //选择项目--选中rtplan文件
    onclickDicom() {
      this.selectedVal = this.projectImage.data.filter((val) => val.checked);
      if (this.selectedVal.length == 0) {
        this.$message.error("请选择项目");
        return;
      }
      console.log("222222222", this.selectedVal);
      this.showDICOM = true;
      this.getDicomdData();
    },
    sort(val, type) {
      let orderBy;
      if (val === "ascending") {
        orderBy = "projectNo&asc";
      } else if (val === "descending") {
        orderBy = "projectNo&desc";
      } else {
        orderBy = "projectNo&asc";
      }
      if (type) {
        this.projectNum.orderBy = !val ? "" : orderBy;
      } else {
        this.projectImage.orderBy = orderBy;
      }
      this.getProjectsFn(1);
    },
    onclickSort(val) {
      console.log(val);
      this.sort(val);
    },
    onclickSortNum(val) {
      console.log(val);
      this.sort(val, 1);
    },
    getDicomdData(state) {
      if (state) this.dicomData.pageNum = 1;
      getDicoms({
        deviceID: this.currentDeviceID,
        pageNum: this.dicomData.pageNum - 1,
        offset: this.dicomData.offset,
      }).then((res) => {
        if (res.dicoms && res.dicoms.length > 0) {
          res.dicoms.forEach((val) => {
            val.refName = "dicom" + val.id;
          });
        }
        this.dicomData.data = res.dicoms;
        console.log("getDicomdData", this.dicomData.data);
        this.dicomData.count = res.count;
      });
    },
    handleClick() {},
    makeupJson(data) {
      for (let i in data) {
        let project = data[i];
        //
        let energy = data[i].energy;
        let energyJson = {};
        if (energy.length == 0 || (energy.length == 1 && energy[0] == "-")) {
          //只需要处理输入值
          energyJson.levelNum = 1;
          energyJson.inputData = new Array(project.numOfInput).fill(null);
        } else {
          for (let j in energy) {
            if (project.testPoint == 0) {
              //只需要处理输入值
              energyJson.levelNum = 2;
              energyJson[energy[j]] = {};
              energyJson[energy[j]]["inputData"] = new Array(
                project.numOfInput
              ).fill(null);
              energyJson[energy[j]]["result"] = 0; //默认值
            } else {
              energyJson.levelNum = 3;
              energyJson[energy[j]] = {};
              energyJson[energy[j]]["points"] = {};
              for (let n = 0; n < project.testPoint; n++) {
                energyJson[energy[j]]["points"][(n + 1) * 2 + "MU"] = new Array(
                  project.numOfInput
                ).fill(null);
              }
            }
          }
        }

        data[i].energyJson = energyJson;
      }
      console.log("makeupJson", data);
      return data;
    },
    handleClose() {
      console.log("handleClose2");
      this.imageData = [];
      this.viewImageData = [];
      this.viewData = [];
      this.showAnalyse = false;
    },
    switchProject(typeName, detectType) {
      this.typeName = typeName;
      this.detectType = detectType;
      this.getProjectsFn();
    },
    onclickTr(val) {
      console.log(this.$refs[val.refName][0]);
      this.$refs[val.refName][0].checked = true;
      this.selectedDicom = val;
    },
    handleCurrentChangeDic(val) {
      this.dicomData.pageNum = val;
      this.getDicomdData();
    },
    handleCurrentChange(val) {
      this.projectNum.pageNum = val;
      this.getProjectsFn();
    },
    handleCurrentChangeImage(val) {
      this.projectImage.pageNum = val;
      this.getProjectsFn();
    },
    getProjectsFn(state) {
      switch (this.typeName) {
        case "image":
          this.getProjectsImage(state);
          break;
        case "number":
          this.getProjectsNum(state);
          break;
      }
    },
    resetFn() {
      this.projectSearch = {};
      this.projectImage = {
        data: [],
        pageNum: 1,
        offset: 110,
        count: 0,
        orderBy: "projectNo&asc",
      };
      this.projectNum = {
        data: [],
        pageNum: 1,
        offset: 10,
        count: 0,
        orderBy: undefined,
      };
      this.getProjectsFn(1);
    },
    saveProjectChangeImage(project) {
      console.log("saveProjectChangeImage", project);
      if (!project.tmpResult || project.tmpResult.length === 0) return;
      var result = {
        qscDeviceProjID: project.id,
        projectID: project.projectID,
        deviceID: project.deviceID,
        testResult: JSON.stringify(project.tmpResult),
        personName: "无",
      };
      this.tempTestResult = this.tempTestResult.filter(
        (value) => value.id !== project.id
      );
      addTestResult(result).then((res) => {
        console.log(res);
        this.$message.success("保存成功");
        this.getProjectsFn();
      });
    },
    saveProjectChange(project) {
      if (!project.changed) return;
      console.log(project);
      //计算检测值
      var calcValue = 0;
      if (project.energyJson.levelNum == 1) {
        //平均值
        var num = 0;
        for (var i in project.energyJson.inputData) {
          calcValue += parseInt(project.energyJson.inputData[i]);
          num++;
        }
        calcValue = calcValue / num;
        project.energyJson.result = calcValue;
      } else if (project.energyJson.levelNum == 2) {
        for (var i in project.energyJson) {
          if (i == "levelNum") continue;
          var inputData = project.energyJson[i].inputData;
          calcValue = 0;
          for (var j in inputData) {
            calcValue += inputData[j];
          }
          console.log(212);
          project.energyJson[i].result = calcValue;
        }
      } else if (project.energyJson.levelNum == 3) {
        console.log(project.energyJson.levelNum);
        for (var i in project.energyJson) {
          if (i == "levelNum") continue;

          var points = project.energyJson[i].points;
          console.log(project.energyJson[i], points);
          calcValue = 0;
          var oneInputData,
            num = 0;
          for (var k in points) {
            var inputData = points[k];
            num++;
            oneInputData = inputData;
            console.log(k, inputData);
            for (var j in inputData) {
              console.log(inputData[j]);
              calcValue += parseInt(inputData[j]);
            }
          }
          console.log(calcValue, num, oneInputData.length);
          calcValue = calcValue / (num * oneInputData.length);

          project.energyJson[i].result = calcValue;
        }
      }

      var result = {
        qscDeviceProjID: project.id,
        projectID: project.projectID,
        deviceID: project.deviceID,
        testResult: JSON.stringify(
          project.testResult.filter((val) => val && val.hasOwnProperty("key"))
        ),
        personName: "无",
      };
      console.log("saveProjectChange", project.energyJson, project.result);
      this.tempTestResult = this.tempTestResult.filter(
        (value) => value.id !== project.id
      );
      // return
      addTestResult(result).then((res) => {
        console.log(res);
        this.$message.success("保存成功");
        this.getProjectsFn();
      });
    },
    hideInput() {
      // this.testUnit = this.selectedRow.testUnit//检测值单位
      if (!this.selectedRow.changed) return;
      let $val =
          this.selectedRow.name +
          (this.selectedRow.subName
            ? "(" + this.selectedRow.subName + ")"
            : ""),
        result = { key: this.selectedEnergy };
      let args = [],
        testResult = [];
      switch (this.selectedRow.energyJson.levelNum) {
        case 1:
          args = this.selectedRow.energyJson.inputData;
          break;
        case 2:
          args = this.selectedRow.energyJson[this.selectedEnergy].inputData;
          testResult = Array(
            Object.keys(this.selectedRow.energyJson).filter(
              (val) => val != "levelNum"
            ).length
          ).fill({});
          break;
        case 3:
          args = Object.values(
            this.selectedRow.energyJson[this.selectedEnergy].points
          );
          testResult = Array(
            Object.keys(this.selectedRow.energyJson).filter(
              (val) => val != "levelNum"
            ).length
          ).fill({});
          break;
      }
      this.selectedRow.testResult = this.selectedRow.testResult || testResult;
      switch ($val) {
        case "等中心的指示（激光灯）":
          args = args.map((value) => (value ? parseFloat(value) : 0));
          result.val = cacTestVal.center(...args);
          break;
        case "重复性（剂量）":
          result.val = cacTestVal.getRepeat(...args);
          break;
        case "日稳定性（剂量）":
          let reargs = args.flat().map((val) => +val);
          result.val = cacTestVal.stableDay(...reargs);
          break;
        case "线性(剂量)":
          console.log("args", args);
          reargs = args.map((val, index) => {
            let total = val.reduce((accumulator, currentValue) => {
              console.log("accumulator", accumulator);
              accumulator += Number.isNaN(currentValue) ? 0 : +currentValue;
              return accumulator;
            }, 0);
            return { u: 0.2 * (index + 1), d: total / val.length };
          });
          result.val = cacTestVal.getLd(reargs);
          break;
        case "线性(剂量率)":
          reargs = args.map((val, index) => {
            let total = val.reduce((accumulator, currentValue) => {
              accumulator += Number.isNaN(currentValue) ? 0 : +currentValue;
              return accumulator;
            }, 0);
            return { u: 1.5 * (index + 1), d: total / val.length };
          });
          result.val = cacTestVal.getLdr(reargs);
          break;
        case "随设备角度位置的变化（剂量）":
          reargs = args.map((val) =>
            this.getAverage(val.filter((v) => v != null))
          );
          result.val = cacTestVal.angle(...reargs);
          break;
        case "随机架旋转的变化（剂量）(X)":
          reargs = args.map((val) =>
            this.getAverage(val.filter((v) => v != null))
          );
          result.val = cacTestVal.angle(...reargs);
          break;
        case "随机架旋转的变化（剂量）(电子)":
          reargs = args.map((val) =>
            this.getAverage(val.filter((v) => v != null))
          );

          result.val = cacTestVal.angle(...reargs);
          break;
        case "X射线深度吸收剂量特性":
          let x_energy_level = JSON.parse(this.selectedRow.x_energy_level);
          let x_deep = x_energy_level[this.selectedIndex].deep;
          args = args.map((value) => (value ? value - x_deep : 0));
          result.val = cacTestVal.shaft(...args);
          break;
        case "电子线深度吸收剂量特性":
          let e_energy_level = JSON.parse(this.selectedRow.e_energy_level);
          let e_deep = e_energy_level[this.selectedIndex].deep;
          args = args.map((value) => (value ? value - e_deep : 0));
          result.val = cacTestVal.shaft(...args);
          break;
        case "剂量偏差":
          result.val = cacTestVal.wrong(args[0] ? args[0] : 0);
          break;
        case "治疗床的等中心旋转":
          args = args.map((value) => (value ? value : 0));
          result.val = cacTestVal.rotate(...args);
          break;
        case "旋转运动标尺的零刻度位置(治疗床面纵向转动轴)":
          args = args.map((value) => (value ? value : 0));
          result.val = cacTestVal.shaft(...args);
          break;
        case "旋转运动标尺的零刻度位置(治疗床面横向转动轴)":
          args = args.map((value) => (value ? value : 0));
          result.val = cacTestVal.shaft(...args);
          break;
        case "治疗床的刚度(横向（侧向倾斜角度）)":
          args = args.map((value) => (value ? value : 0));
          result.val = cacTestVal.shaft(...args);
          break;
        case "治疗床的刚度(横向（高度的变化）)":
          args = args.map((value) => (value ? value : 0));
          result.val = cacTestVal.shaft(...args);
          break;
        case "治疗床的刚度(纵向（高度的变化）)":
          args = args.map((value) => (value ? value : 0));
          result.val = cacTestVal.shaft(...args);
          break;
        default:
          result.val = args[this.selectedIndex];
          break;
      }
      // this.selectedRow.testResult[this.selectedIndex] = result
      this.selectedRow.testResult.splice(this.selectedIndex, 1, result);
      /// 将数据保存在临时变量中
      this.saveDataToTemp(this.selectedRow);
      this.$forceUpdate();
    },
    /// 获取一组数字的平均值
    getAverage(data) {
      if (data.length == 0) {
        return null;
      }
      let total = data.reduce((accumulator, currentValue) => {
        accumulator += Number.isNaN(currentValue) ? 0 : +currentValue;
        return accumulator;
      }, 0);

      return total / data.length;
    },
    getDeepCal(radioType, energy) {
      energy = +energy.substring(0, energy.length - 2);
      console.log("getDeepCal", radioType, energy);
      let val = 0,
        energy_level =
          radioType === "X"
            ? JSON.parse(this.currentDeviceInfo.x_energy_level)
            : JSON.parse(this.currentDeviceInfo.e_energy_level);
      if (energy_level) {
        let obj = energy_level.find((val) => val.x == energy);
        if (obj) val = obj.deep;
      }
      console.log("getDeepCalval", val);
      return val / 100;
    },
    saveDataToTemp(value) {
      let index = this.tempTestResult.findIndex((val) => val.id == value.id);
      if (index != -1) {
        this.tempTestResult.splice(index, 1, this.tempTestResult[index]);
      } else {
        this.tempTestResult.push(value);
      }
    },
    onchangeVal(val) {
      console.log("onchangeVal====>", val);
      this.selectedRow.changed = true;
      this.hideInput();
      this.$forceUpdate();
    },
    onShowInput(val, item, index) {
      console.log("onShowInput", val);
      console.log(item);
      this.selectedRow = val;
      this.selectedEnergy = item;
      this.selectedIndex = index;
    },
    getWidth(num) {
      var width = "260";
      if (num == 1) width = "300";
      else if (num == 2) width = "270";
      else if (num == 3) width = "380";
      else if (num == 4) width = "360";
      else if (num == 5) width = "600";
      return width;
    },
    addDicom() {
      this.showDICOM = true;
    },
    showImageAnalyse() {
      this.showImage = false;
      this.showAnalyse = true;
      this.viewImageData = [];
      this.imageData.forEach((val) => {
        this.viewImageData.push({
          data: val.data,
          refNameAna: val.refNameAna,
          testValue: val.testValue,
        });
      });
      console.log(this.viewImageData);
    },

    toLastStpe() {
      this.showImage = true;
    },
    showMessage() {
      this.$confirm("“影像与检测项目不符，请查核！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$message({
          type: "info",
          message: "请注意检测结果!",
        });
      });
    },
    async onclickAna() {
      if (this.projectsData && this.projectsData.length > 0) {
        let activeProject = this.projectsData[this.activeProjectIndex];
        const apiUrl = activeProject.nameAPI;
        console.log(apiUrl);
        let filePath = this.currentFile.file.path;
        let testValue;
        let $val =
          activeProject.name +
          (activeProject.subName ? "(" + activeProject.subName + ")" : "");
                  console.log('%c [  $val ]', 'font-size:13px; background:pink; color:#bf2c9f;',  $val)

        if ($val == "X射线方形照射野的对称性") {
          console.log('%c [ this.viewData ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.viewData)
          let viewData = this.viewData[0]; // 找到照射野里的第一张图片的数据
          let imageData = this.imageData.find(
            (item) => item.refNameAna === viewData.refNameAna
          ); // 根据viewData的refNameAna在imageData中找出对应的一项
          let rows = imageData.data.width;
          let columns = imageData.data.height;
          let pixel_data_8 = imageData.image;
          let pixel_data_16 = imageData.pixels;
          let symmetry = ipcRenderer.sendSync(
            "cal_symmetry",
            rows,
            columns,
            pixel_data_16,
            pixel_data_8
          );
          if (symmetry == undefined) {
            testValue = "NaN";
            this.showMessage();
          } else {
            testValue = (symmetry * 100).toFixed(2);
          }
        } else if (
          $val == "X射线方形照射野的均整度(5 cm×5 cm ~30 cm×30 cm)" ||
          $val == "X射线方形照射野的均整度(大于30 cm×30 cm)"
        ) {
          let image_shape;
          let viewData = this.viewData[0].data
            ? this.viewData[0]
            : this.viewData[1];
          let imageData = this.imageData.find(
            (item) => item.refNameAna === viewData.refNameAna
          );
          let rows = imageData.data.width;
          let columns = imageData.data.height;
          let pixel_data_8 = imageData.image;
          let pixel_data_16 = imageData.pixels;
          this.viewData.forEach((val) => {
            if (val.data) {
              val.size = "10*10" ? "10" : "20";
              image_shape = val.size;
            }
          });
          let uniformity = ipcRenderer.sendSync(
            "cal_uniformity",
            rows,
            columns,
            pixel_data_16,
            pixel_data_8,
            image_shape
          );
          if (uniformity == undefined) {
            this.showMessage();
            testValue = "NaN";
          } else {
            testValue = (uniformity * 100).toFixed(2);
          }
        } else if ($val == "照射野的数字指示（多元限束）(最大照射野)") {
          let first_viewData = this.viewData[0];
          let second_viewData = this.viewData[1];
          let first_imageData = this.imageData.find(
            (item) => item.refNameAna === first_viewData.refNameAna
          );
          let second_imageData = this.imageData.find(
            (item) => item.refNameAna === second_viewData.refNameAna
          );
          let rows = first_viewData.data.width;
          let columns = first_viewData.data.height;
          let first_pixel_data_8 = first_imageData.image;
          let first_pixel_data_16 = first_imageData.pixels;
          let second_pixel_data_16 = second_imageData.pixels;
          let second_pixel_data_8 = second_imageData.image;
          let pairs_number = this.currentDeviceInfo.multileaf_collimator_size;
          let muliiple_limiting = ipcRenderer.sendSync(
            "cal_large_muliiple_limiting",
            rows,
            columns,
            first_pixel_data_16,
            first_pixel_data_8,
            pairs_number,
            second_pixel_data_16,
            second_pixel_data_8
          );

          if (muliiple_limiting == undefined) {
            this.showMessage();
            testValue = "NaN";
          } else {
            testValue = muliiple_limiting.toFixed(2);
          }
        } else if ($val == "辐射束轴在患者入射表面上的位置指示(20cm×20cm)") {
          let first_viewData = this.viewData[0];
          
          let second_viewData = this.viewData[1];
          let first_imageData = this.imageData.find(
            (item) => item.refNameAna === first_viewData.refNameAna
          );
          let second_imageData = this.imageData.find(
            (item) => item.refNameAna === second_viewData.refNameAna
          );
          let rows = first_viewData.data.width;
          let columns = first_viewData.data.height;
          let first_pixel_data_8 = first_imageData.image;
          let first_pixel_data_16 = first_imageData.pixels;
          let second_pixel_data_16 = second_imageData.pixels;
          let second_pixel_data_8 = second_imageData.image;
          let first_image_shape = first_viewData.size == "10*10" ? "10" : "20";
          let second_image_shape =
            second_viewData.size == "10*10" ? "10" : "20";
          let indication = ipcRenderer.sendSync(
            "cal_position_indication",
            rows,
            columns,
            first_pixel_data_16,
            first_pixel_data_8,
            first_image_shape,
            second_pixel_data_16,
            second_pixel_data_8,
            second_image_shape
          );
          // indication == undefined?this.showMessage():indication
          if (indication == undefined) {
            this.showMessage();
            testValue = "NaN";
          } else {
            testValue = indication.toFixed(2);
          }
        } else if ($val == "旋转运动标尺的零刻度位置(限束系统旋转轴)") {
          let first_viewData = this.viewData[0];
          let second_viewData = this.viewData[1];
          let first_imageData = this.imageData.find(
            (item) => item.refNameAna === first_viewData.refNameAna
          );
          let second_imageData = this.imageData.find(
            (item) => item.refNameAna === second_viewData.refNameAna
          );
          let rows = first_viewData.data.width;
          let columns = first_viewData.data.height;
          let first_pixel_data_8 = first_imageData.image;
          let first_pixel_data_16 = first_imageData.pixels;
          let second_pixel_data_16 = second_imageData.pixels;
          let second_pixel_data_8 = second_imageData.image;
          let first_image_shape = first_imageData.size == "10*10" ? "10" : "20";
          let second_image_shape =
            second_imageData.size == "10*10" ? "10" : "20";
          let cal_scale_position = ipcRenderer.sendSync(
            "cal_scale_position",
            rows,
            columns,
            first_pixel_data_16,
            first_pixel_data_8,
            first_image_shape,
            second_pixel_data_16,
            second_pixel_data_8,
            second_image_shape
          );
          if (cal_scale_position == undefined) {
            this.showMessage();
            testValue = "NaN";
          } else {
            testValue = cal_scale_position.toFixed(2);
          }
        } else if ($val == "照射野的半影(应符合厂家给出值)") {
          let viewData = this.viewData[0]; // 找到照射野里的第一张图片的数据
          let imageData = this.imageData.find(
            (item) => item.refNameAna === viewData.refNameAna
          ); // 根据viewData的refNameAna在imageData中找出对应的一项
          let rows = imageData.data.width;
          let columns = imageData.data.height;
          let pixel_data_8 = imageData.image;
          let pixel_data_16 = imageData.pixels;
          let cal_penumbra = ipcRenderer.sendSync(
            "cal_penumbra",
            rows,
            columns,
            pixel_data_16,
            pixel_data_8
          );
          if (cal_penumbra == undefined) {
            this.showMessage();
            testValue = "NaN";
          } else {
            testValue = cal_penumbra.toFixed(2);
          }
        } else if (
          $val == "照射野的数字指示（多元限束）(最大照射野)" ||
          $val == "照射野的数字指示（单元限束）(5 cm×5 cm ~20 cm×20 cm)"
        ) {
          let viewData = this.viewData[0]; // 找到照射野里的第一张图片的数据
          let imageData = this.imageData.find(
            (item) => item.refNameAna === viewData.refNameAna
          ); // 根据viewData的refNameAna在imageData中找出对应的一项
          let rows = imageData.data.width;
          let columns = imageData.data.height;
          let pixel_data_8 = imageData.image;
          let pixel_data_16 = imageData.pixels;
          let cal_unit_limiting = ipcRenderer.sendSync(
            "cal_unit_limiting",
            rows,
            columns,
            pixel_data_16,
            pixel_data_8
          );
          if (cal_unit_limiting == undefined) {
            this.showMessage();
            testValue = "NaN";
          } else {
            testValue = cal_unit_limiting.toFixed(2);
          }
        } else if ($val == "照射野的数字指示（多元限束）(10 cm×10 cm)") {
          let viewData = this.viewData[0].data
            ? this.viewData[0]
            : this.viewData[1];
          let imageData = this.imageData.find(
            (item) => item.refNameAna === viewData.refNameAna
          ); // 根据viewData的refNameAna在imageData中找出对应的一项
          let rows = imageData.data.width;
          let columns = imageData.data.height;
          let pixel_data_8 = imageData.image;
          let pixel_data_16 = imageData.pixels;
          let pairs_number = this.currentDeviceInfo.multileaf_collimator_size;
          let cal_small = ipcRenderer.sendSync(
            "cal_small_multiple_limiting",
            rows,
            columns,
            pixel_data_16,
            pixel_data_8,
            pairs_number
          );
          if (cal_small == undefined) {
            this.showMessage();
            testValue = "NaN";
          } else {
            testValue = cal_small.toFixed(2);
          }
        }
        this.showAnalyse = false;
        let index = this.projectImage.data.findIndex(
          (val) => val.id === activeProject.id
        );
        if (index != -1) {
          let obj = deepCopy(this.projectImage.data[index]);
          obj.tmpResult = [];
          this.viewData.forEach((val) => {
            if (val.data) {
              obj.tmpResult.push({
                power: val.power,
                size: val.size,
                filePath: val.filePath,
                testUnit: obj.testUnit,
                value: testValue,
              });
            }
          });
          // obj.tmpResult.push({ value: testValue });
          this.projectImage.data.splice(index, 1, obj);
          this.saveDataToTemp(obj);
        }
        this.handleClose();
        console.log(this.projectImage.data);
      }
    },

    dragStart($event, index, type) {
      console.log("dragStart");
      $event.dataTransfer.setData("imageIndex", index);
      $event.dataTransfer.setData("type", type);
    },
    allowDrop($event) {
      // console.log('allowDrop')
      $event.preventDefault();
    },
    drop($event, index, data, fromData, type) {
      $event.preventDefault();
      let fromIndex = $event.dataTransfer.getData("imageIndex");
      let fromType = $event.dataTransfer.getData("type");
      if (fromType == type) {
        /// 同一区域内拖拽
        this.changeValue(data[fromIndex], data[index]);
      } else {
        if (fromType == 1) {
          /// 从右向左
          this.changeValue(fromData[fromIndex], data[index]);
        } else {
          console.log("right");
          this.changeValue(fromData[fromIndex], data[index]);
        }
      }
      this.fromIndex = fromIndex;
      console.log("drop", data, fromData, fromIndex, index);
      this.$forceUpdate();
    },
    changeValue(dataFrom, dataTo) {
      if (!dataFrom.data) return;
      let itemFromData = dataFrom.data,
        itemFromRef = dataFrom.refNameAna,
        itemFromVal = dataFrom.testValue,
        filePath = dataFrom.filePath;
      dataFrom.data = dataTo.data;
      dataFrom.refNameAna = dataTo.refNameAna;
      dataFrom.testValue = dataTo.testValue;
      dataFrom.filePath = dataTo.filePath;
      dataTo.data = itemFromData;
      dataTo.refNameAna = itemFromRef;
      dataTo.testValue = itemFromVal;
      dataTo.filePath = filePath;
    },
    handleSelectionChange(val) {
      this.selectedVal = val;
    },
    handleCurrentChangeSelected(val, index, type) {
      // console.log(val);
      // console.log(val.pathRT);//rtplan文件名字
      // console.log(1111111111111);

      this.currentRow = val;
      if (type) {
        this.currentRowIndexNum = index;
      } else {
        this.currentRowIndex = index;
      }
    },
    handleChangeAll() {
      console.log(this.checkedAll);
      this.projectImage.data.forEach(
        (value) => (value.checked = this.checkedAll)
      );
    },
    handleChangeSingle(val) {
      if (val.checked == true) {
        this.pathRT.push(val.pathRT);
      } else if (val.checked == false) {
        this.pathRT.pop(val.pathRT);
      }
      // console.log(this.pathRT)
      this.checkedAll =
        this.projectImage.data.filter((value) => value.checked).length ===
        this.projectImage.data.length;
      this.$forceUpdate();
    },
    onclickSave() {
      if (!this.selectedDicom.id) {
        this.$message.error("请选择DICOM输出配置");
        return;
      }
      let files = [],
        projectIDs = [];
      this.selectedVal.forEach((val) => {
        console.log("aaaaaaaaa");
        console.log(val);
        if (val.testResult && val.testResult.length > 0) {
          files.push(val.testResult.map((value) => value.filePath));
        }
        projectIDs.push(val.id);
      });
      files = files.flat();
      // if (files.length===0) {
      //     this.$message.error('所选中的项目未包含dicom文件')
      //     return
      // }
      console.log(this.selectedDicom, this.selectedVal);
      transferDicom({
        deviceID: this.currentDeviceID,
        dicomID: this.selectedDicom.id,
        ip: this.selectedDicom.ip,
        port: this.selectedDicom.port,
        aeTitle: this.selectedDicom.aeTitle,
        customer: this.selectedDicom.customer,
        files: files,
        projectIDs: projectIDs,
        pathRT: this.pathRT,
      })
        .then((res) => {
          this.$message.success("dicom文件已传输");
        })
        .finally((res) => {
          this.showDICOM = false;
        });
    },
    inputPlaceholder(data, value, index) {
      if (
        data.supply ===
        "每个输入框中有个提示，将“请输入”分别改为“左水平，左竖直，体中线，右水平，右竖直”"
      ) {
        let list = ["左水平", "左竖直", "体中线", "右水平", "右竖直"];
        return list[index];
      } else {
        return "请输入" + data.unit;
      }
    },

    showTitle1(data) {
      if (data.supply != null) {
        return data.supply.indexOf("对应能量, 10cm*10cm") > -1;
      } else {
        return false;
      }
    },

    getPonitValue(project, obj, point) {
      if (project.tips != null) {
        const tipList = project.tips.split("，");
        let keys = Object.keys(obj);
        let index = keys.indexOf(point);
        return tipList[index];
      } else {
        return point;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.test-page {
  width: 100%;
  padding: 25px 26px 44px;

  .test-popover {
    &-item {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      line-height: 21px;
      width: 77px;
      margin: auto;
      padding: 3px;
    }
  }
  .test-popover:not(:last-of-type) {
    .test-popover-item {
      margin-bottom: 5px;
    }
  }
  .test-search {
    min-height: 80px;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    .test-search-left {
      width: 80%;
      height: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .test-search-lists {
        width: 22%;
        height: 40px;
        margin-right: 1%;
        color: #fff;
        /deep/ .el-input {
          height: 100%;
          width: 100%;
          .el-input__inner {
            color: #fff;
            height: 100%;
            background: rgba(255, 255, 255, 0.08);
            border-radius: 4px;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
        }
        /deep/ .el-select {
          width: 100%;
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
    }
    .test-search-right {
      width: 20%;
      height: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-right: 3%;
    }
  }
  .test-tab {
    display: flex;
    .test-tab-left {
      flex: auto;
      background: rgba(255, 255, 255, 0.1);
      .test-type {
        .test-type-item {
          width: 50%;
          background: #2c2c2c;
          color: rgba(255, 255, 255, 0.8);
          text-align: center;
          padding: 17px 0;
          font-size: 18px;
          border-bottom: 6px solid #2c2c2c;
        }
        .active {
          background: #3c3c3c;
          border-bottom: 6px solid #2ccead;
          color: #2ccead;
        }
      }
      .test-upload {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 20px 16px;
        .active {
          background: #2ccead;
          border-radius: 4px;
          color: #ffffff;
        }
      }
      .test-tab-content {
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
      &-value {
        &:not(:last-of-type) {
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
      }
    }
    .test-tab-right {
      width: 300px;
      height: 100%;
      background: rgba(255, 255, 255, 0.1);
      overflow-y: auto;
      .test-tab-right-item {
        background: #2c2c2c;
        padding: 20px 0;
        text-align: center;
        font-size: 16px;
        border-left: 6px solid #2ccead;
        color: rgba(255, 255, 255, 0.8);
      }
      .test-tab-right-name {
        padding: 6% 2%;
        text-align: center;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.8);
        border-bottom: 1px solid #464646;
        letter-spacing: 1px;
      }
      .test-tab-right-content {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.8);
        line-height: 24px;
        padding: 0 10%;
        margin-top: 10%;
        letter-spacing: 1px;
      }
    }
  }
  /deep/ .el-dialog__wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  /deep/ .el-dialog {
    margin-top: 0vh !important;
    margin: 0;
    .el-dialog__header {
      background: #3c3c3c;
      padding: 8px 0;
      .el-dialog__title {
        color: rgba(255, 255, 255, 0.8);
        font-size: 14px;
      }
      .el-dialog__headerbtn {
        top: 12px;
      }
    }
    .el-dialog__body {
      background-color: #1c1c1c;
      color: rgba(255, 255, 255, 0.8);
      padding: 0 2%;
    }
    .el-dialog__footer {
      background-color: #1c1c1c;
      color: rgba(255, 255, 255, 0.8);
    }
  }
  .table-list {
    width: 100%;
    /*text-align: center;*/
  }
  .dialog-footer {
  }
}
.table-more {
  padding: 0;
  .table-child {
    border-bottom: 1px solid #464646;
    padding: 2% 0;
  }
  :last-child {
    border-bottom: 0;
  }
}
.img-lists {
  width: 100%;
  padding: 2%;
  border-bottom: 1px solid #464646;
  display: flex;
  flex-wrap: wrap;
  .img-lists-item {
    /*height: 75px;*/
    background: #fff;
    margin: 1%;
    width: 18%;
    height: 0;
    padding-top: 18%;
    position: relative;
    canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
  .img-analyse {
    width: 100%;
    display: flex;
    justify-content: space-around;
    .list-name {
      width: 42%;
      background: #2c2c2c;
      text-align: center;
      overflow-y: auto;
      .list-name-content {
        /*padding: 90% 0;*/
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: default;
        .project-name-lists {
          width: 90%;
          margin-bottom: 5%;
          background: #3c3c3c;
          border-radius: 4px;
          .project-name-lists-item {
            padding: 2% 0;
          }
        }
        .active {
          background: #2ccead;
        }
      }
    }
    .list-name-title {
      padding: 13px 0 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      margin-bottom: 10px;
    }
    .list-name-content-val {
      height: 60vh;
      overflow-y: auto;
    }
    .list-image-item {
      width: 20%;
      background: #2c2c2c;
      text-align: center;
      position: relative;
      .img-left-content {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        .img-left-content-lists {
          padding: 30%;
          background: #3c3c3c;
          img {
          }
        }
        .right-image {
          padding: 38%;
          background: #3c3c3c;
          margin-top: 8%;
          img {
          }
        }
        .image-size {
          margin-top: 4%;
        }
      }
      .list-image-item-right {
        padding: 2% 0;
        border-bottom: 1px solid #464646;
      }
    }
    .list-image-item-content {
      overflow-y: auto;
      .image-canvas {
        position: relative;
        width: 80%;
        padding-top: 80%;
        height: 0;
        margin: auto;
        &:not(:last-child) {
          margin-bottom: 10px;
        }
        &-view {
          &:not(:last-child) {
            margin-bottom: 30px;
          }
        }
        &-item {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          margin: 0;
          padding-top: 0;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.25);
          canvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
        }
        &-text {
          position: absolute;
          width: 150%;
          left: -25%;
          bottom: -20px;
          font-size: 12px;
        }
      }
    }
  }
}
.add-image-btn {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .active {
    background: #2ccead;
    border-radius: 4px;
    color: #ffffff;
  }
}
.test-item {
  padding: 2%;
  color: #ffffff;
  .test-result {
    background-color: #2c2c2c;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 3% 0;
    .test-result-title {
    }
    .test-result-item {
      width: 40%;
      background-color: #3c3c3c;
      .item-number {
        text-align: center;
        width: 55%;
        white-space: nowrap;
        img {
          width: 7px;
          height: 13px;
          position: relative;
          top: -1px;
        }
        &-min {
          transform: rotate(180deg);
        }
      }
      .item-unit {
        width: 40%;
        text-align: center;
        border-left: 1px solid #464646;
      }
    }
  }
  .test-number {
    background-color: #2c2c2c;
    margin-top: 13px;
    .test-number-title {
      padding: 3% 0;
      margin-left: 10%;
    }
    .test-number-lists {
      padding: 4%;
      .test-number-lists-item {
        width: 42%;
        margin: 2%;
        background-color: #3c3c3c;
        border-radius: 2px;
        input {
          width: 100%;
          border: 0;
          line-height: 30px;
          background-color: #3c3c3c;
          color: rgba(255, 255, 255, 0.8);
          text-align: center;
        }
      }
    }
  }
}
tr td {
  border: 1px solid transparent;
}
.el-dialog__body {
  .table-out {
    width: 100%;
    table {
      width: 100%;
      margin-bottom: 20px;
      thead tr {
        background: transparent;
        th {
          background: transparent;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          border-right: none;
        }
      }
      tbody tr {
        background: transparent;
        td {
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          border-right: none;
          background: transparent;
        }
      }
    }
  }
}
.showArrow {
  width: 7px;
  height: 13px;
  position: relative;
  top: -1px;
}
</style>
