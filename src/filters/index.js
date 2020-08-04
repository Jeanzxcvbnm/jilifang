
import Vue from 'vue';
import moment from 'moment'

Vue.filter('dateformat', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
    if(dataStr!=""){
        return moment(dataStr).format(pattern)
    }else {
        return ""
    }
})
Vue.filter('numFilter', function(value) {
    let realVal = parseFloat(value).toFixed(2)
    return realVal
})