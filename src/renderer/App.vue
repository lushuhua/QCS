<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'QSC-APP'
}
</script>

<style lang="scss">
@import url(./assets/styles/public.scss);
html{
  font-size: 16px;
}
body {
  padding: 0;
  margin: 0;
  -webkit-user-select: none;
  /*height: 800px;*/
  overflow: hidden;
  color: rgba(255,255,255,0.8);
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}
  .el-popover{
    background: #1C1C1C !important;
    border: 1px solid #464646;
  }
  .el-popover .el-popover__title{
    color: rgba(255,255,255,0.8);
  }
  .el-popper .popper__arrow::after{
    border-bottom-color: #1C1C1C !important;

  }
  input{
    color: rgba(255,255,255,0.8);
  }
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
 /*.el-select-dropdown__item.hover{*/
   /*background-color: #464646;*/
 /*}*/
.el-select-dropdown__item.selected{
  color: #1C1C1C;
}
.el-checkbox__label,.el-radio__label{
  color: rgba(255,255,255,0.8);
  padding-left: 6px;
}
.el-checkbox__input.is-checked .el-checkbox__inner,.el-radio__input.is-checked .el-radio__inner{
  background: #2CCEAD;
  border-color: #2CCEAD;
}
.el-checkbox__input.is-checked+.el-checkbox__label,.el-radio__input.is-checked+.el-radio__label{
  color: #2CCEAD;
}
.el-pagination .el-pager li.active{
  background: #2CCEAD !important;
}
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar
{
  width: 6px;
  height: 6px;
  background-color: #F5F5F5;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track
{
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  border-radius: 10px;
  background-color: #F5F5F5;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb
{
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  background-color: #555;
}
  .el-dialog{
    background: #262626;
  }
</style>
