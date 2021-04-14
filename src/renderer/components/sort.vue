<template>
    <div class="sort-wrapper" :class="className" @click="onclickSort">
        <i class="sort-cart ascending"></i>
        <i class="sort-cart descending"></i>
    </div>
</template>

<script>
    export default {
        name: "sort",
        data(){
            return {
                className: ''
            }
        },
        props: {

        },
        methods:{
            onclickSort(){
                console.log(11111)
                if (!this.className){
                    this.className = 'ascending'
                }else if (this.className === 'ascending') {
                    this.className = 'descending'
                } else if (this.className === 'descending') {
                    this.className = ''
                }
                this.$emit('sortClick',this.className)
            }
        }
    }
</script>

<style lang="scss" scoped>
.sort-wrapper{
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    height: 34px;
    width: 24px;
    vertical-align: middle;
    cursor: pointer;
    overflow: initial;
    position: relative;
    .sort-cart{
        width: 0;
        height: 0;
        border: solid 5px transparent;
        position: absolute;
        left: 7px;
    }
    .ascending {
        border-bottom-color: #C0C4CC;
        top: 5px;
    }
    .descending {
        border-top-color: #C0C4CC;
        bottom: 7px;
    }
}
.ascending .ascending{
    border-bottom-color: #2CCEAD;
}
.descending .descending{
    border-top-color: #2CCEAD;
}
</style>
