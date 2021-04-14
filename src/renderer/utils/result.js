//6.5.2 等中心的指示（激光灯）
function center(X=0,Y1=0,Y2=0,Z1=0,Z2=0) {
    const a = X*X+(Y1+Y2)*(Y1+Y2)+(Z1+Z2)*(Z1+Z2);
    const resultCenter = (Math.sqrt(a));
    return resultCenter.toFixed(2);
};

//6.1.2 重复性（剂量）
function getR() {
    let sum = 0;
    let list = Array.from(arguments);
    list = list.map(item =>{
        if(item == null) {
            return 0
        }
        return item/2
    })
    list.forEach(item=>{
        sum+=item;
    });
    return sum/arguments.length.toFixed(2)*100+'%';
}
function getRepeat() {
    let r = getR(...arguments);
    let list = Array.from(arguments);
    list = list.map(item =>{
        if(item == null) {
            return 0
        }
        return item/2
    })
    let sum = 0;
    let n = list.length;
    list.forEach(item=>{
        sum+=(r-item)*(r-item)/(n-1);
    })
    sum = Math.sqrt(sum)
    let repeat =sum/r*100;
    return repeat.toFixed(2)+'%';
}

//6.1.6 日稳定性（剂量）
function stableDay(X1=0,X2=0,X3=0,X4=0,X5=0,X6=0) {
    const D1 = (X1+X2+X3)/3;
    const D2 = (X4+X5+X6)/3;
    const resultStableDay = ((D1 - D2) / D1) *100;
    return resultStableDay.toFixed(2)+'%';
}

//6.1.4随设备角度位置的变化 6.1.5 随机架旋转的变化（剂量 X） 6.1.5 随机架旋转的变化（剂量 电子）
function angle() {
    let values = Array.from(arguments);
    let sum = 0;
    values.forEach(item => {
        sum += item;
    })
    let avg = sum / arguments.length;
    let dMax = Math.max(...values);
    let dMin = Math.min(...values);
    let Da = (dMax-dMin)/avg * 100;
    return Da+'%';
}

// 6.1.1 剂量偏差

function wrong(val=0) {
    return val-2*100+'%'

}
// 6.1.3.2 线性（剂量）

// 计算Ld
function getLd(data) {
    const Ld = getMax(data);
    return (Ld *100).toFixed(2) + "%";
};

function getMax(list) {
    // 利用最小二乘法求出直线函数的斜率k和截距b
    const { k, b } = getKB(list);
    let Dcmax=[];
    list.forEach(item => {
        let Dc = getDc(k, item.u, b);
        Dcmax.push((item.d-Dc)/item.u);
    })
    let LDMax=Math.max(...Dcmax);
    return LDMax;
};

// 计算Dc
function getDc(S, U, B) {
    return S * U + B;
};

// 利用最小二乘法求出直线函数的斜率k和截距b
function getKB(list) {
    let k, b;
    let xList = list.map(item => item.u);
    let yList = list.map(item => item.d);
    let averageX = getAverage(...xList);
    let averageY = getAverage(...yList);
    let sum1 = 0;
    let sum2 = 0;
    list.forEach(item => {
        sum1 += (item.u - averageX) * (item.d - averageY);
        sum2 += (item.u - averageX) * (item.u - averageX);
    });
    k = sum1 / sum2;
    b = averageY - k * averageX;
    return { k, b };
};

// // 获取平均值
function getAverage() {
    const values = Array.from(arguments);
    let sum = 0;
    values.forEach(item => {
        sum += item;
    })
    return sum / arguments.length;
};

// 6.1.3.3 线性（剂量率）
// 计算得出Ldr（剂量线性）
function getLdr(data) {
    const Ldr = getMax(data);
    return (Ldr *100).toFixed(2) + "%";
}
// var a = [{u:1.2,d:2},{u:1.8,d:2.1},{u:2,d:2},{u:1.2,d:2.5}]
// console.log(getLdr(a))
// 6.2.1 X射线深度吸收剂量特性
function XRay(list) {
    let xDose = list.map(item => {
        if(item.xDose==null) {
            return 0
        }
        return item.xDose
    });
    let xValue = list.map(item => item.xValue);
    let rayX = xValue - xDose;
    console.log(rayX)
    return rayX.toFixed(2)
}

// 6.2.2 电子射线深度吸收剂量特性
function eleRay(list) {
    let eleDose = list.map(item => {
        if(item.eleDose==null) {
            return 0
        }
        return item.eleDose
    });
    let eleValue = list.map(item => item.eleValue);
    let rayEle = eleValue - eleDose;
    return rayEle.toFixed(2)
}

export {
    eleRay,XRay,getLdr,getLd,stableDay,getRepeat,center,angle,wrong
}
