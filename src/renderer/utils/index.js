// 过期提醒计算
export function calcWarningTime(val) {
    let colorOver = '#E02020',colorWarn='#FF7E2A',color='rgba(255,255,255,0.7)'
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

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
    if (arguments.length === 0 || !time) {
        return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if ((typeof time === 'string')) {
            if ((/^[0-9]+$/.test(time))) {
                // support "1548221490638"
                time = parseInt(time)
            } else {
                // support safari
                // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
                time = time.replace(new RegExp(/-/gm), '/')
            }
        }

        if ((typeof time === 'number') && (time.toString().length === 10)) {
            time = time * 1000
        }
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
        const value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
        return value.toString().padStart(2, '0')
    })
    return time_str
}
