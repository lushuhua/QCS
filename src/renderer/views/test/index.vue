<template>
    <div class="test-page">
        <div class="test-search">
            <div class="test-search-left">
                <div class="test-search-lists">
                    <el-input placeholder="请输入项目号"></el-input>
                </div>
                <div class="test-search-lists">
                    <el-input placeholder="请输入项目名称"></el-input>
                </div>
                <div class="test-search-lists">
                    <el-input placeholder="请输入检测值"></el-input>
                </div>
                <div class="test-search-btn">
                    <el-button type="primary" class="active">查询</el-button>
                </div>
                <div class="test-search-btn">
                    <el-button type="primary">重置</el-button>
                </div>
            </div>
        </div>
        <div class="test-tab clearfix">
            <div class="test-tab-left left">
                <div class="test-type clearfix">
                    <div class="test-type-item left" :class="{active:typeName=='image'}" @click="typeName='image'">图像分析</div>
                    <div class="test-type-item right" :class="{active:typeName=='number'}" @click="typeName='number'">数值分析</div>
                </div>
                <div class="test-upload" v-if="typeName=='image'">
                    <el-button type="primary" class="active" @click="addImage">载入图片</el-button>
                    <el-button type="primary" class="active" @click="addDicom()">DICOM传输</el-button>
                </div>
                <table class="table test-tab-content" border="0" cellspacing="0" v-if="typeName=='image'">
                    <thead class="tab-header">
                    <tr>
                        <th>全选</th>
                        <th>项目号</th>
                        <th>项目名称</th>
                        <th>次级项目名称</th>
                        <th>检测值</th>
                        <th>阈值</th>
                        <th>检测日期</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody class="tab-lists">
                    <tr>
                        <td>
                            <input type="checkbox"/>
                        </td>
                        <td>6.6.3</td>
                        <td>旋转运动标尺的零刻度位置</td>
                        <td>-</td>
                        <td>1.2</td>
                        <td>≤0.5°</td>
                        <td>2021-02-19</td>
                        <td>保存</td>
                    </tr>
                    <tr>
                        <td>
                            <input type="checkbox"/>
                        </td>
                        <td>6.6.3</td>
                        <td>旋转运动标尺的零刻度位置</td>
                        <td>-</td>
                        <td>1.2</td>
                        <td>≤0.5°</td>
                        <td>2021-02-19</td>
                        <td>保存</td>

                    </tr>
                    <tr>
                        <td>
                            <input type="checkbox"/>
                        </td>
                        <td>6.6.3</td>
                        <td>旋转运动标尺的零刻度位置</td>
                        <td>-</td>
                        <td>1.2</td>
                        <td>≤0.5°</td>
                        <td>2021-02-19</td>
                        <td>保存</td>

                    </tr>
                    <tr>
                        <td>
                            <input type="checkbox"/>
                        </td>
                        <td>6.6.3</td>
                        <td>旋转运动标尺的零刻度位置</td>
                        <td>-</td>
                        <td>1.2</td>
                        <td>≤0.5°</td>
                        <td>2021-02-19</td>
                        <td>保存</td>

                    </tr>
                    </tbody>
                </table>
                <table class="table test-tab-content" border="0" cellspacing="0" v-if="typeName=='number'" style="margin-top: 2%;">
                    <thead class="tab-header">
                    <tr>
                        <th>项目号</th>
                        <th>项目名称</th>
                        <th>次级项目名称</th>
                        <th>辐射类型</th>
                        <th>能量档</th>
                        <th>检测值</th>
                        <th>阈值</th>
                        <th>过期提醒</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody class="tab-lists">
                    <tr>
                        <td>6.6.3</td>
                        <td>日稳定性（剂量</td>
                        <td>-</td>
                        <td>x射线</td>
                        <td>
                            <el-popover
                                    placement="bottom"
                                    width="200"
                                    trigger="click"
                            >
                                <div class=test-item>
                                     <div class="test-result">
                                         <div class="test-result-title">检测值</div>
                                         <div class="test-result-item clearfix">
                                              <div class="item-number left">3.9</div>
                                              <div class="item-unit left">mm</div>
                                         </div>
                                     </div>
                                    <div class="test-number">
                                         <div class="test-number-title">输入值</div>
                                        <div class="test-number-lists clearfix">
                                             <div class="test-number-lists-item left">
                                                 <input type="text">
                                             </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div slot="reference">3MV</div>
                            </el-popover>
                        </td>
                        <td>3.9%</td>
                        <td>≤0.5°</td>
                        <td>已过期</td>
                        <td>保存</td>
                    </tr>
                    <tr>
                        <td>6.6.3</td>
                        <td>x线深度吸收剂量特征</td>
                        <td>-</td>
                        <td>x线和电子线</td>
                        <td>
                            <el-popover
                                    placement="bottom"
                                    width="200"
                                    trigger="click"
                            >
                                <div class=test-item>
                                    <div class="test-result">
                                        <div class="test-result-title">检测值</div>
                                        <div class="test-result-item clearfix">
                                            <div class="item-number left">3.9</div>
                                            <div class="item-unit left">mm</div>
                                        </div>
                                    </div>
                                    <div class="test-number">
                                        <div class="test-number-title">输入值</div>
                                        <div class="test-number-lists clearfix">
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div slot="reference">3MV</div>
                            </el-popover>
                            <el-popover
                                    placement="bottom"
                                    width="200"
                                    trigger="click"
                            >
                                <div class=test-item>
                                    <div class="test-result">
                                        <div class="test-result-title">检测值</div>
                                        <div class="test-result-item clearfix">
                                            <div class="item-number left">3.9</div>
                                            <div class="item-unit left">mm</div>
                                        </div>
                                    </div>
                                    <div class="test-number">
                                        <div class="test-number-title">输入值</div>
                                        <div class="test-number-lists clearfix">
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div slot="reference">4MeV</div>
                            </el-popover>
                            <el-popover
                                    placement="bottom"
                                    width="200"
                                    trigger="click"
                            >
                                <div class=test-item>
                                    <div class="test-result">
                                        <div class="test-result-title">检测值</div>
                                        <div class="test-result-item clearfix">
                                            <div class="item-number left">3.9</div>
                                            <div class="item-unit left">mm</div>
                                        </div>
                                    </div>
                                    <div class="test-number">
                                        <div class="test-number-title">输入值</div>
                                        <div class="test-number-lists clearfix">
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div slot="reference">5MeV</div>
                            </el-popover>
                        </td>
                        <td>3.9%</td>
                        <td>≤0.5°</td>
                        <td>已过期</td>
                        <td>保存</td>
                    </tr>
                    <tr>
                        <td>6.6.3</td>
                        <td>线性</td>
                        <td>-</td>
                        <td>电子线</td>
                        <td>
                            <el-popover
                                    placement="bottom"
                                    width="200"
                                    trigger="click"
                            >
                                <div class=test-item>
                                    <div class="test-result">
                                        <div class="test-result-title">检测值</div>
                                        <div class="test-result-item clearfix">
                                            <div class="item-number left">3.9</div>
                                            <div class="item-unit left">mm</div>
                                        </div>
                                    </div>
                                    <div class="test-number">
                                        <div class="test-number-title">输入值</div>
                                        <div class="test-number-lists clearfix">
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div slot="reference">3MV</div>
                            </el-popover>
                        </td>
                        <td>3.9%</td>
                        <td>≤0.5°</td>
                        <td>1天后过期</td>
                        <td>保存</td>
                    </tr>
                    <tr>
                        <td>6.6.3</td>
                        <td>等中心的指示（激光灯）</td>
                        <td>剂量</td>
                        <td>非x线和非电子线</td>
                        <td>
                            <el-popover
                                    placement="bottom"
                                    width="200"
                                    trigger="click"
                            >
                                <div class=test-item>
                                    <div class="test-result">
                                        <div class="test-result-title">检测值</div>
                                        <div class="test-result-item clearfix">
                                            <div class="item-number left">3.9</div>
                                            <div class="item-unit left">mm</div>
                                        </div>
                                    </div>
                                    <div class="test-number">
                                        <div class="test-number-title">输入值</div>
                                        <div class="test-number-lists clearfix">
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                            <div class="test-number-lists-item left">
                                                <input type="text">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div slot="reference">3MV</div>
                            </el-popover>
                        </td>
                        <td>3.9%</td>
                        <td>≤0.5°</td>
                        <td>已过期</td>
                        <td>保存</td>
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
            <div class="test-tab-right right">
                 <div class="test-tab-right-item">
                     拍片条件
                 </div>
                <div class="test-tab-right-name">
                    6.6.3 旋转运动标尺的零刻度位置
                </div>
                <div class="test-tab-right-content">
                    将慢感光胶片置于治疗床面，用建成材料覆盖其上。将70KG负载（成人）均匀分布在床面，中心作用在等中心上，照射野调至10cm*10cm，治疗床面调至近似于等中心高度时，对慢感光胶片进行照射。然后将床面将至20cm并在此照射，测出两个照射野中心的位移。
                </div>
            </div>
        </div>
        <el-dialog
                title="DICOM输出"
                :visible.sync="showDICOM"
                width="40%"
                :before-close="handleClose"
                center
        >
            <div slot="footer">
                <div>

                </div>
            </div>
        </el-dialog>
        <el-dialog
                title="本地上传的DICOM图片"
                :visible.sync="showImage"
                width="40%"
                :before-close="handleClose"
                center
        >
            <div class="img-lists clearfix">
                <div class="img-lists-item left">
                    <img src="" alt="">
                </div>
                <div class="img-lists-item left">
                    <img src="" alt="">
                </div>
                <div class="img-lists-item left">
                    <img src="" alt="">
                </div>
                <div class="img-lists-item left">
                    <img src="" alt="">
                </div>
                <div class="img-lists-item left">
                    <img src="" alt="">
                </div>
                <div class="img-lists-item left">
                    <img src="" alt="">
                </div>
                <div class="img-lists-item left">
                    <img src="" alt="">
                </div>
                <div class="img-lists-item left">
                    <img src="" alt="">
                </div>
                <div class="img-lists-item left">
                    <img src="" alt="">
                </div>
                <div class="img-lists-item left">
                    <img src="" alt="">
                </div>

            </div>
            <div slot="footer">
                <div class="add-image-btn">
                    <el-button type="primary" class="">取消</el-button>
                    <el-button type="primary" class="active" @click="showImageAnalyse()">下一步</el-button>
                </div>
            </div>
        </el-dialog>
        <el-dialog
                title="载入图片分析"
                :visible.sync="showAnalyse"
                width="50%"
                :before-close="handleClose"
                center
        >
            <div class="img-analyse">

            </div>
            <div class="img-lists clearfix">
                <div class="img-analyse">
                    <div class="list-name">
                        <div class="list-name-title">项目名称</div>
                        <div class="list-name-content">
                            <div class="project-name-lists active">
                                <div class="project-name-lists-item">
                                    旋转运动标尺的零刻度位置
                                </div>
                            </div>
                            <div class="project-name-lists">
                                <div class="project-name-lists-item">
                                    旋转运动标尺的零刻度位置
                                </div>
                            </div>
                            <div class="project-name-lists">
                                <div class="project-name-lists-item">
                                    旋转运动标尺的零刻度位置
                                </div>
                            </div>
                            <div class="project-name-lists">
                                <div class="project-name-lists-item">
                                    旋转运动标尺的零刻度位置
                                </div>
                            </div>
                            <div class="project-name-lists">
                                <div class="project-name-lists-item">
                                    旋转运动标尺的零刻度位置
                                </div>
                            </div>
                            <div class="project-name-lists">
                                <div class="project-name-lists-item">
                                    旋转运动标尺的零刻度位置
                                </div>
                            </div>
                            <div class="project-name-lists">
                                <div class="project-name-lists-item">
                                    旋转运动标尺的零刻度位置
                                </div>
                            </div>
                            <div class="project-name-lists">
                                <div class="project-name-lists-item">
                                    旋转运动标尺的零刻度位置
                                </div>
                            </div>
                            <div class="project-name-lists">
                                <div class="project-name-lists-item">
                                    旋转运动标尺的零刻度位置
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    <div class="list-image-item">
                        <div class="list-image-item-left">
                            <div class="list-image-item-left-title">照射野</div>
                            <div class="img-left-content">
                                <div class="img-left-content-lists">
                                    <img src="" alt="">
                                </div>
                                <div class="image-size">10cm*10cm</div>
                                <div class="img-left-content-lists">
                                    <img src="" alt="">
                                </div>
                                <div class="image-size">10cm*10cm</div>
                                <div class="img-left-content-lists">
                                    <img src="" alt="">
                                </div>
                                <div class="image-size">10cm*10cm</div>
                                <div class="img-left-content-lists">
                                    <img src="" alt="">
                                </div>
                                <div class="image-size">10cm*10cm</div>
                            </div>
                        </div>
                    </div>
                    <div class="list-image-item">
                        <div class="list-image-item-left">
                            <div class="list-image-item-left-title">已上传图片</div>
                            <div class="img-left-content">
                                <div class="img-left-content-lists right-image">
                                    <img src="" alt="">
                                </div>
                                <div class="img-left-content-lists right-image">
                                    <img src="" alt="">
                                </div>
                                <div class="img-left-content-lists right-image">
                                    <img src="" alt="">
                                </div>
                                <div class="img-left-content-lists right-image">
                                    <img src="" alt="">
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
            <div slot="footer">
                <div class="add-image-btn">
                    <el-button type="primary" class="" @click="toLastStpe()">上一步</el-button>
                    <el-button type="primary" class="active">确定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        components: {
        },
        data() {
            return {
                dialogVisible:false,
                showDICOM:false,
                showImage:false,
                showAnalyse:false,
                typeName:'image',
            }
        },
        mounted() {
        },
        methods: {
            handleClick() {

            },
            addImage(){
                this.showImage=true;
            } ,
            addDicom(){
                this.showDICOM=true;
            },
            showImageAnalyse(){
                this.showImage=false;
                this.showAnalyse = true;
            },
            toLastStpe(){
                this.showImage=true;
            }

        }
    }
</script>
<style lang="scss" scoped>
    .test-page {
        width: 100%;
       padding:25px 26px 44px;
        .test-search{
            width: 100%;
            height: 10%;
            min-height: 80px;
            background: rgba(255,255,255,0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            .test-search-left{
                width: 80%;
                height: 100%;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                margin-left: 3%;
                .test-search-lists{
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
                .test-search-btn{
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
            .test-search-right{
                width: 20%;
                height: 100%;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                margin-right: 3%;
                .test-print{
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
        .test-tab{
            height: 84%;
            margin-top: 25px;
            .test-tab-left{
                width: 82%;
                height: 100%;
                background: rgba(255,255,255,0.1);
                .test-type{
                    .test-type-item{
                        width: 50%;
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
                .test-upload{
                    height: 10%;
                    margin-right: 1%;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    /deep/ .el-button--primary {
                        width: 14%;
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
                .test-tab-content{
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
            .test-tab-right{
                width: 16%;
                height: 100%;
                background: rgba(255,255,255,0.1);
                .test-tab-right-item{
                    background: #2C2C2C;
                    padding: 6% 0;
                    text-align: center;
                    font-size: 14px;
                    border-left: 6px solid #2CCEAD;
                    color: rgba(255,255,255,0.8);
                }
                .test-tab-right-name{
                    padding: 6% 2%;
                    text-align: center;
                    font-size: 13px;
                    color: rgba(255,255,255,0.8);
                    border-bottom: 1px solid #464646;
                }
                .test-tab-right-content{
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
    .img-lists{
        padding: 2%;
        border-bottom: 1px solid #464646;
        .img-lists-item{
            /*height: 75px;*/
            background: #fff;
            margin: 1%;
            padding: 9%;
        }
        .img-analyse{
            width: 100%;
            display: flex;
            justify-content: space-around;
            .list-name{
                width: 42%;
                background: #2C2C2C;
                text-align: center;
                .list-name-title{
                    padding: 2% 0;
                }
                .list-name-content{
                    /*padding: 90% 0;*/
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    .project-name-lists{
                        width: 90%;
                        margin-bottom: 5%;
                        background: #3C3C3C;
                        border-radius: 4px;
                        .project-name-lists-item{
                            padding: 2% 0;
                        }
                    }
                    .active{
                        background: #2CCEAD;
                    }
                }
            }
            .list-image-item{
                width: 20%;
                background: #2C2C2C;
                text-align: center;
                .list-image-item-left{

                    .list-image-item-left-title{
                        padding: 2% 0;
                        border-bottom: 1px solid #464646;
                    }
                    .img-left-content{
                        width: 100%;
                       display: flex;
                        flex-direction: column;
                        align-items: center;
                        .img-left-content-lists{
                            padding: 30%;
                            background: #3C3C3C;
                            margin-top: 8%;
                            img{


                            }

                        }
                        .right-image{
                            padding: 38%;
                            background: #3C3C3C;
                            margin-top: 8%;
                            img{


                            }
                        }
                        .image-size{
                            margin-top: 4%;
                        }
                    }
                }
                .list-image-item-right{
                    padding: 2% 0;
                    border-bottom: 1px solid #464646;
                }
            }
        }

    }
    .add-image-btn{
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
    .test-item{
        padding: 2%;
        .test-result{
           background-color: #2C2C2C;
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 3% 0;
            .test-result-title{
                
            }
            .test-result-item{
                width: 40%;
                background-color: #3C3C3C;
                .item-number{
                    text-align: center;
                    width: 55%;
                }
                .item-unit{
                    width: 40%;
                    text-align: center;
                    border-left: 1px solid #464646;
                }
            }
        }
        .test-number{
            background-color: #2C2C2C;
            margin-top: 8%;
            .test-number-title{
                padding: 3% 0;
                margin-left: 10%;
            }
            .test-number-lists{
                padding: 4%;
                .test-number-lists-item{
                    width: 42%;
                    margin: 4%;
                    background-color: #3C3C3C;
                    border-radius:2px;
                    input{
                        width: 100%;
                        border: 0;
                        background-color: #3C3C3C;
                        color: rgba(255,255,255,0.8);
                    }
                }
            }
        }
    }
</style>
