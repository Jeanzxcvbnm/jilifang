/**
 * Created by jerry on 2019/07/24.
 * 核算方式api
 */
import * as API from '.'

export default {
    //结账日期
    closeDayList: params => {
        return API.POST('closeDay/list', params)
    },
    //编辑结账日期
    updateCloseDay:params => {
        return API.POST('closeDay/updateCloseDay',params)
    },
    //结算规则列表
    checkRulesList:params => {
        return API.POST('checkrules/list',params)
    },
    //新增结算规则
    addCheckRule:params => {
        return API.POST('checkrules/insert',params)
    },
    //编辑结算规则
    editCheckRule:params => {
        return API.POST('checkrules/update',params)
    },
    //库存成本月结帐
    getAccount:params => {
        return API.POST('settle/settleAccount',params)
    },
    //库存成本月反结帐
    getBackAccount:params => {
        return API.POST('settle/ReverseCheckout',params)
    }
}
