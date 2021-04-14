<template>
    <div>
        <div v-if="project.detectType=='影像分析'">
            <div v-for="(v,vIndex) in project.testResult" :key="vIndex">{{v.power}} {{v.size}}cm-{{v.value}}mm</div>
        </div>
        <div v-else>
            <div v-if="project.testResult" v-for="(te,teIndex) in project.testResult" :key="teIndex" class="test-result">{{te.val}}
                <!--<img :class="{'test-result-min': compare(te.val,project.threshold)}" src="../assets/images/arrow.png">-->
                <img v-if="!compare(te.val,project.threshold)" src="../assets/images/arrow.png">
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
                    if (val){
                        testVal = val.replace(/mm|%|°/,'')
                    }
                    testData = data.substr(1)
                    testData = testData.replace(/mm|%|°/,'')
                    // val = val?(val.includes('%')?val.replace('%','')/100:val):0
                    console.log(val,testVal,testData)
                    return (testVal - testData) <0
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
