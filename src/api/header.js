/**
 * Created by jerry on 2019/07/10.
 * 单位设置api
 */
import * as API from '.'

export default {

    //账套列表
    accoutSetList:params => {
        return API.POST('site/list', params)
    },
    // 账套切换
    editSite: params => {
        return API.POST('account/switchSite', params)
    },
    //消息提醒
    getMessage:params => {
        return  API.POST('home/messagesTwo', params)
    },
    //是否初始化
    getInitial:params => {
        return  API.POST('home/findISInit', params)
    },
    //是否初始化
    getJurisdiction:params => {
        return  API.POST('permission/findRoleInit', params)
    },
}
