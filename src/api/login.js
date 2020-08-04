/**
 * Created by jerry on 2019/07/1.
 * 登录api
 */
import * as API from '.'

export default {
    // 登录
    getlogin: params => {
        return API.POST('account/businessLogin', params)
    },
    // 获取验证码
    getCode: params => {
        return API.POST('/account/verificationCode', params)
    },
    // 重置密码
    resetPassword: params => {
        return API.POST('/account/resetEmployeePassword', params)
    },
    // 退出
    logout: params => {
        return API.GET('admin/Login/loginout', params)
    },
    // 各门店销售总计
    getStore: params => {
        return API.POST('home/findStoreSell', params)
    },
    // 仓库实时库存
    getStoreRole: params => {
        return API.POST('home/findStockStoreRoleTime', params)
    },
    // 门店实时库存
    getStockRole: params => {
        return API.POST('home/findStockRoleTime', params)
    },
    // 总库存各类别金额占比
    getInventoryAmount: params => {
        return API.POST('home/totalInventory', params)
    },
    // 近30天门店各类别销售金额占比
    getStoreInventory: params => {
        return API.POST('home/storeInventory', params)
    },
    // 仓库列表
    getInventory: params => {
        return API.POST('StockIO/siteWarehouseList', params)
    },
    // 组织单位列表
    getEntityList: params => {
        return API.POST('StockIO/entityList', params)
    },
    // 类别列表
    getCategory: params => {
        return API.POST('PCategory/listNotPage', params)
    }
}
