// 过期提醒计算
export function calcWarningTime(val) {
    let colorOver = '#E02020',colorWarn='#FF7E2A',color='rgba(255,255,255,0.8)'
    let overDate = {
        name: '',
        color: color,
        date: 0
    }
    if (val.createDate){
        let nowTime = Date.now(),testTime = new Date(val.createDate).getTime()
        let spaceTime = (nowTime-testTime)/(24*60*60*1000)
        console.log(spaceTime)
        switch (val.period) {
            case '一天':
                overDate.date = 1
                break
            case '一周':
                overDate.date = 7
                break
            case '一个月':
                overDate.date = 30
                break
            case '三个月':
                overDate.date = 90
                break
            case '六个月':
                overDate.date = 180
                break
            case '一年':
                overDate.date = 365
                break
        }
        if (overDate.date === 0){
            overDate.name = '无期限'
        } else {
            if (spaceTime >= overDate.date){
                overDate.name = '已过期';overDate.color=colorOver
            }  else if (overDate.date == 1&&spaceTime<1) {
                overDate.name = '1天后过期';overDate.color = color
            } else {
                let time = overDate.date - spaceTime
                overDate.name = parseInt(overDate.date - spaceTime)+'天后过期'
                if (time>3){
                    overDate.color=color
                } else {
                    overDate.color=colorWarn
                }
            }
        }
    }else {overDate.name = '已过期';overDate.color=colorOver}
    return overDate
}
