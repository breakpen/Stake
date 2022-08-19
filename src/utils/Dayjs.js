import Dayjs from "dayjs"

import "dayjs/locale/zh-cn"

import relativeTime from 'dayjs/plugin/relativeTime'

import Vue from 'vue'

Dayjs.extend(relativeTime)

Dayjs.locale('zh-cn')

// Dayjs().format('YYYY-MM-DD')



Vue.filter('relativeTime', value => {

    return Dayjs().to(Dayjs(value))
})
Vue.filter('transformTime_MDMS', time => {

    return Dayjs(time).format('MM-DD HH:mm')
})

Vue.filter("transformTime_Zh", time => {
    return Dayjs(time).format('YYYY-MM-DD HH:mm:ss')
})

Vue.filter("trsfTime_30timeout", time => {
    return Dayjs(time).add(30, 'second').format('YYYY-MM-DD HH:mm:ss')
})


Vue.prototype.transformTime_Zh = (time) => {
    return Dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}


Vue.prototype.trsfTime_30timeout = (time,delay,type = 'minute') => {
    return Dayjs(time).add(delay, type).format('YYYY-MM-DD HH:mm:ss')
}

Vue.prototype.diff_30timeout = (time1, time2) => {
    return new Date(time1).getTime() - new Date(time2).getTime()
}