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
  font-family: PingFangSC-Regular, PingFang SC;
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
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar
{
  width: 6px;
  height: 6px;
  background-color: rgba(0,0,0,0.3);
  display: none;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track
{
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  border-radius: 10px;
  background-color: #555;
  /*background-color: #c1c1c0;*/
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb
{
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  background-color: #c1c1c0;
}
  .el-dialog{
    background: #262626;
  }

/*单选框*/
.page-radio {
  font-size: 12px;
  font-weight: normal;
  font-family: "PingFangSC Light";
  color: #333333;
  cursor: pointer;
  cursor: pointer;
  position: relative;
}

.page-radio .radio-span {
  /*position: absolute;*/
  /*display: block;*/
  /*content: " ";*/
  /*top: 4px;*/
  /*left: 4px;*/
  width: 6px;
  height: 6px;
  border-radius: 100%;
  background: transparent;
  -webkit-transform: scale(0);
  -moz-transform: scale(0);
  -ms-transform: scale(0);
  transform: scale(1);
  -webkit-transition: all .12s ease-in-out;
  -moz-transition: all .12s ease-in-out;
  transition: all .12s ease-in-out;
}

.page-radio input[type="radio"] {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: 0;
  cursor: pointer;
}

.page-radio input[type='radio'] + label {
  display: inline-flex;
  width: 16px;
  height: 16px;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  vertical-align: middle;
  border: 1px solid #777777;
  /*padding:0;*/
  /*background:url("../images/success.png") no-repeat -12px -12px;*/
  /*background-size: 100% 100%;*/
  position: relative;
  background-color: transparent;
}

.page-radio input[type='radio']:checked + label {
  background-color: #2CCEAD;
  border: 1px solid #2CCEAD;
}
.page-radio input[type='radio']:checked + label span {
  background-color: #ffffff;
}
  .input-label-container{
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.08);
    width: auto;
    input{
      background: rgba(255, 255, 255, 0.08);
      border: 0;
      border-right: 1px solid rgba(255, 255, 255, 0.2);
      line-height: 30px;
      &:hover,&:active,&:focus{
        border-right: 1px solid rgba(255, 255, 255, 0.2);
      }
    }
    span{
      flex: none;
      width: 40px;
      align-self: stretch;
      display: flex;justify-content: center;
      align-items: center;
      background: rgba(255, 255, 255, 0.08);
    }
  }
  .el-input__inner::-webkit-input-placeholder{
    font-size: 13px ;
  }
  .table-current-row{
    td{
      border-top: 1px solid rgba(255, 255, 255, 0.25)!important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.25)!important;
      &:first-of-type{
        border-left: 1px solid rgba(255, 255, 255, 0.25)!important;
      }
      &:last-of-type{
        position: relative;
        &::after{
          display: block;
          content: '';
          background: url("assets/images/arrow_tb.png") no-repeat;
          background-size: 100% 100%;
          width: 18px;
          height: 100%;
          position: absolute;
          left: 100%;
          top: 0;
          /*transform: rotate(48deg);*/
        }
      }
    }
  }
.table-current-row-odd{
  td{
    /*background: rgba(255, 255, 255, 0.1);*/
    border-top: 1px solid rgba(255, 255, 255, 0.25)!important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.25)!important;
    &:first-of-type{
      border-left: 1px solid rgba(255, 255, 255, 0.25)!important;
    }
    &:last-of-type{
      position: relative;
      &::after{
        display: block;
        content: '';
        background: url("assets/images/arrow_black.png") no-repeat;
        background-size: 100% 100%;
        width: 18px;
        height: 100%;
        position: absolute;
        left: 100%;
        top: 0;
        /*transform: rotate(48deg);*/
      }
    }
  }
}
.page-qcs{
    display: flex;
    flex-direction: column;
    &-head{
        margin-bottom: 25px;
        overflow: auto;
        padding: 0 20px;
    }
    &-body{
        flex: auto;overflow-y: auto;
    }
    table.table{
        text-align: center;
        width: 100%;
        thead{
            tr{
                th{
                    font-size: 16px;
                    font-weight: 400;
                    color: #E5E5E5;
                    line-height: 22px;
                    border-right: 1px solid #464646;
                    padding: 28px 6px;
                    background: rgba(255, 255, 255, 0.15);
                }
            }
        }
        tbody{
            tr{
                td{
                    font-size: 15px;
                    font-weight: 400;
                    color: rgba(255, 255, 255, 0.7);
                    line-height: 21px;
                    padding: 20px 6px;
                    border-right: 1px solid #464646;
                    border-bottom: 1px solid #2C2C2C;
                }
            }
        }
        .project-name{
            max-width: 220px;
        }
        .word-break-not{
            white-space: nowrap;
        }
    }
    .el-dialog{
        &__header{
            height: 60px;
            background: #3C3C3C;
            padding: 0!important;
            line-height: 60px;
        }
        &__title{
            font-size: 16px!important;
        }
    }
    .el-button{
        background: rgba(255, 255, 255, 0.08);
        border-radius: 4px;
        border: 1px solid rgba(44, 206, 173, 0.5);
        color: #2CCEAD;
        min-width: 104px;
        &:hover{
            border-color: #2CCEAD;
            color: #ffffff;
        }
        &--text{
            background: transparent;
            border-color: transparent;
            &:hover{
                border-color: transparent;
            }
        }
        &--primary{
            background-color: #2CCEAD;
            color: #fff
        }
    }

    .el-pagination {
        padding-right: 20px;
        margin-top: 30px;
        .el-pager li.active {
            background: rgba(115, 107, 107, 0.8) !important;
            color: #ffffff !important;
            border-color: transparent !important;
        }
        &__sizes .el-input__inner{
            background: #1C1C1C;
            border-color: #464646;
            color: rgba(255,255,255,0.8);
        }
        .btn-next,.btn-prev{
            padding: 0 6px!important;
        }
        .el-pager .number{
            background: rgba(38, 38, 38, 0.6)!important;
            border: 1px solid rgba(255,255,255,0.3)!important;
        }
    }
    .el-checkbox__inner{
        &:after{
            border-color: #ffffff;
        }
    }
    .el-radio__inner{
        &:after{
            background: #ffffff;
        }
    }
  .el-select{
    width: 100%;
  }
}
</style>
