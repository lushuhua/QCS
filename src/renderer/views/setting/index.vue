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
                        <th>常用x射线能量档</th>
                        <th>常用电子射线能量档</th>
                        <th>x射线百分深度计量</th>
                        <th>电子射线百分深度计量</th>
                        <th>常用电子线线光筒</th>
                        <th>多叶光栅对数</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody class="tab-lists">
                    <tr>
                        <td>GZ1908</td>
                        <td>0001</td>
                        <td>3MV（最小/FFF模式）</td>
                        <td>-</td>
                        <td>5%</td>
                        <td>-</td>
                        <td>10cm*10cm 6cm cone</td>
                        <td>40</td>
                        <td class="">
                            <div class="handle">
                                <el-popover
                                        placement="bottom"
                                        width="200"
                                        trigger="click"
                                >
                                    <div class="project-lists clearfix">
                                        <div class="project-lists-item left clearfix">
                                            <div class="project-icon el-icon-folder left"></div>
                                            <div class="project-name left">6.2.1</div>
                                        </div>
                                        <div class="project-lists-item left clearfix">
                                            <div class="project-icon el-icon-folder left"></div>
                                            <div class="project-name left">6.2.1</div>
                                        </div>
                                        <div class="project-lists-item left clearfix">
                                            <div class="project-icon el-icon-folder left"></div>
                                            <div class="project-name left">6.2.1</div>
                                        </div>
                                        <div class="project-lists-item left clearfix">
                                            <div class="project-icon el-icon-folder left"></div>
                                            <div class="project-name left">6.2.1</div>
                                        </div>
                                        <div class="project-lists-item left clearfix">
                                            <div class="project-icon el-icon-folder left"></div>
                                            <div class="project-name left">6.2.1</div>
                                        </div>
                                        <div class="project-lists-item left clearfix">
                                            <div class="project-icon el-icon-folder left"></div>
                                            <div class="project-name left">6.2.1</div>
                                        </div>
                                        <div class="project-lists-item left clearfix">
                                            <div class="project-icon el-icon-folder left"></div>
                                            <div class="project-name left">6.2.1</div>
                                        </div>
                                        <div class="project-lists-item left clearfix">
                                            <div class="project-icon el-icon-folder left"></div>
                                            <div class="project-name left">6.2.1</div>
                                        </div>
                                        <div class="project-lists-item left clearfix">
                                            <div class="project-icon el-icon-folder left"></div>
                                            <div class="project-name left">6.2.1</div>
                                        </div>
                                        <div class="project-lists-item left clearfix">
                                            <div class="project-icon el-icon-folder left"></div>
                                            <div class="project-name left">6.2.1</div>
                                        </div>
                                        <div class="project-lists-item left clearfix">
                                            <div class="project-icon el-icon-folder left"></div>
                                            <div class="project-name left">6.2.1</div>
                                        </div>
                                        <div class="project-lists-item left clearfix">
                                            <div class="project-icon el-icon-folder left"></div>
                                            <div class="project-name left">6.2.1</div>
                                        </div>
                                        <div class="project-lists-item left clearfix">
                                            <div class="project-icon el-icon-folder left"></div>
                                            <div class="project-name left">6.2.1</div>
                                        </div>

                                    </div>
                                    <div slot="reference">查看项目</div>
                                </el-popover>
                                <!--<div class="handle-item">查看项目</div>-->
                                <div class="handle-item" @click="showProjectChange()">修改</div>
                                <div class="handle-item" @click="showDelete()">删除</div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>GZ1908</td>
                        <td>0001</td>
                        <td>3MV（最小/FFF模式）</td>
                        <td>-</td>
                        <td>5%</td>
                        <td>-</td>
                        <td>10cm*10cm 6cm cone</td>
                        <td>40</td>
                        <td class="">
                            <div class="handle">
                                <el-popover
                                        placement="bottom"
                                        width="200"
                                        trigger="click"
                                >
                                    <div class="project-lists clearfix">
                                        <div class="project-lists-item left clearfix">
                                            <div class="project-icon el-icon-folder left"></div>
                                            <div class="project-name left">6.2.1</div>
                                        </div>
                                        <div class="project-lists-item left clearfix">
                                            <div class="project-icon el-icon-folder left"></div>
                                            <div class="project-name left">6.2.1</div>
                                        </div>
                                        <div class="project-lists-item left clearfix">
                                            <div class="project-icon el-icon-folder left"></div>
                                            <div class="project-name left">6.2.1</div>
                                        </div>
                                        <div class="project-lists-item left clearfix">
                                            <div class="project-icon el-icon-folder left"></div>
                                            <div class="project-name left">6.2.1</div>
                                        </div>
                                        <div class="project-lists-item left clearfix">
                                            <div class="project-icon el-icon-folder left"></div>
                                            <div class="project-name left">6.2.1</div>
                                        </div>
                                        <div class="project-lists-item left clearfix">
                                            <div class="project-icon el-icon-folder left"></div>
                                            <div class="project-name left">6.2.1</div>
                                        </div>
                                        <div class="project-lists-item left clearfix">
                                            <div class="project-icon el-icon-folder left"></div>
                                            <div class="project-name left">6.2.1</div>
                                        </div>
                                        <div class="project-lists-item left clearfix">
                                            <div class="project-icon el-icon-folder left"></div>
                                            <div class="project-name left">6.2.1</div>
                                        </div>
                                        <div class="project-lists-item left clearfix">
                                            <div class="project-icon el-icon-folder left"></div>
                                            <div class="project-name left">6.2.1</div>
                                        </div>
                                        <div class="project-lists-item left clearfix">
                                            <div class="project-icon el-icon-folder left"></div>
                                            <div class="project-name left">6.2.1</div>
                                        </div>
                                        <div class="project-lists-item left clearfix">
                                            <div class="project-icon el-icon-folder left"></div>
                                            <div class="project-name left">6.2.1</div>
                                        </div>
                                        <div class="project-lists-item left clearfix">
                                            <div class="project-icon el-icon-folder left"></div>
                                            <div class="project-name left">6.2.1</div>
                                        </div>
                                        <div class="project-lists-item left clearfix">
                                            <div class="project-icon el-icon-folder left"></div>
                                            <div class="project-name left">6.2.1</div>
                                        </div>

                                    </div>
                                    <div slot="reference">查看项目</div>
                                </el-popover>
                                <!--<div class="handle-item">查看项目</div>-->
                                <div class="handle-item" @click="showProjectChange()">修改</div>
                                <div class="handle-item" @click="showDelete()">删除</div>
                            </div>

                        </td>

                    </tr>
                    <tr>
                        <td>GZ1908</td>
                        <td>0001</td>
                        <td>3MV（最小/FFF模式）</td>
                        <td>-</td>
                        <td>5%</td>
                        <td>-</td>
                        <td>10cm*10cm 6cm cone</td>
                        <td>40</td>
                        <td class="">
                            <div class="handle">
                                <el-popover
                                        placement="bottom"
                                        width="200"
                                        trigger="click"
                                >
                                    <div class="project-lists clearfix">
                                        <div class="project-lists-item left clearfix">
                                            <div class="project-icon el-icon-folder left"></div>
                                            <div class="project-name left">6.2.1</div>
                                        </div>
                                        <div class="project-lists-item left clearfix">
                                            <div class="project-icon el-icon-folder left"></div>
                                            <div class="project-name left">6.2.1</div>
                                        </div>
                                        <div class="project-lists-item left clearfix">
                                            <div class="project-icon el-icon-folder left"></div>
                                            <div class="project-name left">6.2.1</div>
                                        </div>
                                        <div class="project-lists-item left clearfix">
                                            <div class="project-icon el-icon-folder left"></div>
                                            <div class="project-name left">6.2.1</div>
                                        </div>
                                        <div class="project-lists-item left clearfix">
                                            <div class="project-icon el-icon-folder left"></div>
                                            <div class="project-name left">6.2.1</div>
                                        </div>
                                        <div class="project-lists-item left clearfix">
                                            <div class="project-icon el-icon-folder left"></div>
                                            <div class="project-name left">6.2.1</div>
                                        </div>
                                        <div class="project-lists-item left clearfix">
                                            <div class="project-icon el-icon-folder left"></div>
                                            <div class="project-name left">6.2.1</div>
                                        </div>
                                        <div class="project-lists-item left clearfix">
                                            <div class="project-icon el-icon-folder left"></div>
                                            <div class="project-name left">6.2.1</div>
                                        </div>
                                        <div class="project-lists-item left clearfix">
                                            <div class="project-icon el-icon-folder left"></div>
                                            <div class="project-name left">6.2.1</div>
                                        </div>
                                        <div class="project-lists-item left clearfix">
                                            <div class="project-icon el-icon-folder left"></div>
                                            <div class="project-name left">6.2.1</div>
                                        </div>
                                        <div class="project-lists-item left clearfix">
                                            <div class="project-icon el-icon-folder left"></div>
                                            <div class="project-name left">6.2.1</div>
                                        </div>
                                        <div class="project-lists-item left clearfix">
                                            <div class="project-icon el-icon-folder left"></div>
                                            <div class="project-name left">6.2.1</div>
                                        </div>
                                        <div class="project-lists-item left clearfix">
                                            <div class="project-icon el-icon-folder left"></div>
                                            <div class="project-name left">6.2.1</div>
                                        </div>

                                    </div>
                                    <div slot="reference">查看项目</div>
                                </el-popover>
                                <!--<div class="handle-item">查看项目</div>-->
                                <div class="handle-item" @click="showProjectChange()">修改</div>
                                <div class="handle-item" @click="showDelete()">删除</div>
                            </div>

                        </td>
                    </tr>
                    <tr>
                        <td>GZ1908</td>
                        <td>0001</td>
                        <td>3MV（最小/FFF模式）</td>
                        <td>-</td>
                        <td>5%</td>
                        <td>-</td>
                        <td>10cm*10cm 6cm cone</td>
                        <td>40</td>
                        <td class="">
                            <div class="handle">
                                <el-popover
                                        placement="bottom"
                                        width="200"
                                        trigger="click"
                                      >
                                      <div class="project-lists clearfix">
                                          <div class="project-lists-item left clearfix">
                                              <div class="project-icon el-icon-folder left"></div>
                                              <div class="project-name left">6.2.1</div>
                                          </div>
                                          <div class="project-lists-item left clearfix">
                                              <div class="project-icon el-icon-folder left"></div>
                                              <div class="project-name left">6.2.1</div>
                                          </div>
                                          <div class="project-lists-item left clearfix">
                                              <div class="project-icon el-icon-folder left"></div>
                                              <div class="project-name left">6.2.1</div>
                                          </div>
                                          <div class="project-lists-item left clearfix">
                                              <div class="project-icon el-icon-folder left"></div>
                                              <div class="project-name left">6.2.1</div>
                                          </div>
                                          <div class="project-lists-item left clearfix">
                                              <div class="project-icon el-icon-folder left"></div>
                                              <div class="project-name left">6.2.1</div>
                                          </div>
                                          <div class="project-lists-item left clearfix">
                                              <div class="project-icon el-icon-folder left"></div>
                                              <div class="project-name left">6.2.1</div>
                                          </div>
                                          <div class="project-lists-item left clearfix">
                                              <div class="project-icon el-icon-folder left"></div>
                                              <div class="project-name left">6.2.1</div>
                                          </div>
                                          <div class="project-lists-item left clearfix">
                                              <div class="project-icon el-icon-folder left"></div>
                                              <div class="project-name left">6.2.1</div>
                                          </div>
                                          <div class="project-lists-item left clearfix">
                                              <div class="project-icon el-icon-folder left"></div>
                                              <div class="project-name left">6.2.1</div>
                                          </div>
                                          <div class="project-lists-item left clearfix">
                                              <div class="project-icon el-icon-folder left"></div>
                                              <div class="project-name left">6.2.1</div>
                                          </div>
                                          <div class="project-lists-item left clearfix">
                                              <div class="project-icon el-icon-folder left"></div>
                                              <div class="project-name left">6.2.1</div>
                                          </div>
                                          <div class="project-lists-item left clearfix">
                                              <div class="project-icon el-icon-folder left"></div>
                                              <div class="project-name left">6.2.1</div>
                                          </div>
                                          <div class="project-lists-item left clearfix">
                                              <div class="project-icon el-icon-folder left"></div>
                                              <div class="project-name left">6.2.1</div>
                                          </div>

                                      </div>
                                    <div slot="reference">查看项目</div>
                                </el-popover>
                                <!--<div class="handle-item">查看项目</div>-->
                                <div class="handle-item" @click="showProjectChange()">修改</div>
                                <div class="handle-item" @click="showDelete()">删除</div>
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
                        <th>检测点</th>
                        <th>输入值</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody class="tab-lists">
                    <tr>
                        <td>6.1.6</td>
                        <td>日稳定性（剂量</td>
                        <td>-</td>
                        <td>≤2%</td>
                        <td>日检</td>
                        <td>x射线和电子射线</td>
                        <td>x线：4mv</td>
                        <td>2个</td>
                        <td>3个</td>
                        <td class="">
                            <div class="handle">
                                <div class="handle-item" @click="showProjectChange()">修改</div>
                                <div class="handle-item" @click="showDelete()">删除</div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>6.1.6</td>
                        <td>X射线深度吸收剂量特性</td>
                        <td>-</td>
                        <td>≤2%</td>
                        <td>日检</td>
                        <td>x射线和电子射线</td>
                        <td>x线：4mv</td>
                        <td>2个</td>
                        <td>3个</td>
                        <td class="">
                            <div class="handle">
                                <div class="handle-item" @click="showProjectChange()">修改</div>
                                <div class="handle-item" @click="showDelete()">删除</div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>6.1.6</td>
                        <td>日稳定性（剂量</td>
                        <td>-</td>
                        <td>≤2%</td>
                        <td>日检</td>
                        <td>x射线和电子射线</td>
                        <td>x线：4mv</td>
                        <td>2个</td>
                        <td>3个</td>
                        <td class="">
                            <div class="handle">
                                <div class="handle-item" @click="showProjectChange()">修改</div>
                                <div class="handle-item" @click="showDelete()">删除</div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>6.1.6</td>
                        <td>日稳定性（剂量</td>
                        <td>-</td>
                        <td>≤2%</td>
                        <td>日检</td>
                        <td>x射线和电子射线</td>
                        <td>x线：4mv</td>
                        <td>2个</td>
                        <td>3个</td>
                        <td class="">
                            <div class="handle">
                                <div class="handle-item" @click="showProjectChange()">修改</div>
                                <div class="handle-item" @click="showDelete()">删除</div>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <table class="table setting-tab-content" border="0" cellspacing="0" v-if="showTypeIndex==2">
                    <thead class="tab-header">
                    <tr>
                        <th>客户端</th>
                        <th>AE Title</th>
                        <th>IP</th>
                        <th>端口号</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody class="tab-lists">
                    <tr>
                        <td>SRS</td>
                        <td>BBCT</td>
                        <td>192.168.113.81</td>
                        <td>8088</td>
                        <td class="">
                            <div class="handle">
                                <div class="handle-item" @click="showProjectChange()">修改</div>
                                <div class="handle-item" @click="showDelete()">删除</div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>SRS</td>
                        <td>BBCT</td>
                        <td>192.168.113.81</td>
                        <td>8088</td>
                        <td class="">
                            <div class="handle">
                                <div class="handle-item" @click="showProjectChange()">修改</div>
                                <div class="handle-item" @click="showDelete()">删除</div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>SRS</td>
                        <td>BBCT</td>
                        <td>192.168.113.81</td>
                        <td>8088</td>
                        <td class="">
                            <div class="handle">
                                <div class="handle-item" @click="showProjectChange()">修改</div>
                                <div class="handle-item" @click="showDelete()">删除</div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>SRS</td>
                        <td>BBCT</td>
                        <td>192.168.113.81</td>
                        <td>8088</td>
                        <td class="">
                            <div class="handle">
                                <div class="handle-item" @click="showProjectChange()">修改</div>
                                <div class="handle-item" @click="showDelete()">删除</div>
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
                <el-dialog
                        title="修改加速器"
                        :visible.sync="showAccelerate"
                        width="40%"
                        :before-close="handleClose"
                        center
                >
                    <div class="add-item clearfix">
                        <div class="add-item-lists left">
                            <el-input placeholder="请输入加速器型号"></el-input>
                        </div>
                        <div class="add-item-lists left">
                            <el-input placeholder="请输入加速器序号"></el-input>
                        </div>
                        <div class="add-item-lists left">
                            <el-input placeholder="添加检测项目"></el-input>
                        </div>
                    </div>
                    <div slot="footer">
                        <div class="confirm-btn">
                            <el-button type="primary" class="">取消</el-button>
                            <el-button type="primary" class="active">保存</el-button>
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
                            <el-button type="primary" class="">取消</el-button>
                            <el-button type="primary" class="active">确定删除</el-button>
                        </div>
                    </div>
                </el-dialog>
                <el-dialog
                        title="修改项目配置"
                        :visible.sync="isShowProjectChange"
                        width="40%"
                        :before-close="handleClose"
                        center
                >
                    <div class="project-change-lists">
                         <div class="project-change-lists-item clearfix">
                             <div class="item-content left">
                                 <input type="text">
                             </div>
                             <div class="item-name left">检测周期</div>
                         </div>
                        <div class="project-change-lists-item clearfix">
                            <div class="item-content left">
                                <input type="text">
                            </div>
                            <div class="item-name left">阈值</div>
                        </div>
                    </div>
                    <div slot="footer">
                        <div class="confirm-btn">
                            <el-button type="primary" class="">取消</el-button>
                            <el-button type="primary" class="active">保存</el-button>
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
                                <input type="text" placeholder="请输入">
                            </div>
                            <div class="item-name left">客户端</div>
                        </div>
                        <div class="project-change-lists-item clearfix">
                            <div class="item-content left">
                                <input type="text" placeholder="请输入">
                            </div>
                            <div class="item-name left">AE Title</div>
                        </div>
                    </div>
                    <div slot="footer">
                        <div class="confirm-btn">
                            <el-button type="primary" class="">取消</el-button>
                            <el-button type="primary" class="active">保存</el-button>
                        </div>
                    </div>
                </el-dialog>
            </div>
        </div>
    </div>
</template>
<script>
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
            }
        },
        mounted() {
        },
        methods: {
            handleClick() {

            },
            changeType(typeName,index){
               this.typeName = typeName;
               this.showTypeIndex = index;
            },
            addAccelerate(){
                this.showAccelerate=true;
            },
            addDICOM(){
               this.isShowDICOM = true;
            },
            showDelete(){
                this.isShowDelete=true;
            },
            showProjectChange(){
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
            padding: 2% 0;
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
        padding: 8% 0;
        border-bottom: 1px solid #464646;
        .project-change-lists-item{
            width: 40%;
            border: 1px solid #464646;
            background-color: #2C2C2C;
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
