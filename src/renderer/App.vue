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
body {
  padding: 0;
  margin: 0;
  -webkit-user-select: none;
  /*height: 800px;*/
  overflow: hidden;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}
  .el-popover{
    background: #1C1C1C !important;
    border: 1px solid #464646;
    color: rgba(255,255,255,0.8);
  }
  .el-popover .el-popover__title{
    color: rgba(255,255,255,0.8);
  }
  .el-popper .popper__arrow::after{
    border-bottom-color: #1C1C1C !important;
    
  }
 /*.el-select-dropdown__item.hover{*/
   /*background-color: #464646;*/
 /*}*/
.el-select-dropdown__item.selected{
  color: #1C1C1C;
}
</style>
