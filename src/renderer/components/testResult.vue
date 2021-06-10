<template>
    <div>
        <div v-if="project.detectType=='影像分析'">
            <div v-for="(v,vIndex) in project.testResult" :key="vIndex" class="test-result">{{v.power}} {{v.size}}cm-{{v.value}}{{project.testUnit}}</div>
        </div>
        <div v-else>
            <div v-if="project.testResult" v-for="(te,teIndex) in project.testResult" :key="teIndex" class="test-result">
                <span v-if="showPower && te.key && te.key!='-'">{{te.key}} -</span>
                {{te.val}}<span v-if="te.val!=null">{{project.testUnit}}</span>
                <!--<img :class="{'test-result-min': compare(te.val,project.threshold)}" src="../assets/images/arrow.png">-->
                <img v-if="!compare(te.val,project.testUnit)&&te.val!==null" src="../assets/images/arrow.png">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "testResult",
        props: {
            project: {
                default: {},
                type: Object
            },
            showPower:{
                default: false,
                type: Boolean
            }
        },
        computed:{
            compare(){
                return function (val,data) {
                    if (!data) return
                    // let index = data.indexOf('mm')
                    // if (index>-1){
                    //     data = data.substring(1,index)
                    // } else {
                    //     data = data.substring(1,data.length-1)
                    // }
                    let testVal = 0,testData = 0
                    // if (val){
                    //     testVal = val.replace(/mm|%|°/,'')
                    // }
                    testData = data.substr(1)
                    testData = testData.replace(/mm|%|°/,'')
                    testVal=val?val:0;
                    console.log('%c [ val,testVal,testData ]', 'font-size:13px; background:pink; color:#bf2c9f;', val,testVal,testData)
                    return (testVal - testData) <=0
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .test-result{
        line-height: 30px;
        white-space: nowrap;
        min-height: 30px;
        img{
            width: 7px;
            height: 13px;
            position: relative;
            top: -1px;
        }
        &-min{
             transform: rotate(180deg);
         }
    }
    .test-result:not(:last-of-type){
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
</style>
