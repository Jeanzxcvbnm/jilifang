/**
 * Created by jerry on 2019/07/1.
 * 物料设置api
 */
import * as API from '.'

export default {
    // 货品品牌
    getTradeMark: params => {
        return API.POST('Product/showTradeMark', params)
    },
    // 货品类别
    getCategory: params => {
        return API.POST('PCategory/list', params)
    },
    // 货品类别新增
    addCategory: params => {
        return API.POST('PCategory/insert', params)
    },
    // 货品类别编辑
    editCategory: params => {
        return API.POST('PCategory/update', params)
    },
    //货品资料（产品列表）
    getProduct: params => {
        return API.POST('Product/list', params)
    },
    //货品资料（产品列表）
    getProductAll: params => {
        return API.POST('Product/allList', params)
    },
    // 货品资料新增
    addProduct: params => {
        return API.POST('Product/insert', params)
    },
    // 货品资料编辑
    editProduct: params => {
        return API.POST('Product/update', params)
    },
    // 类别列表（select）
    categoryList: params => {
        return API.POST('PCategory/listNotPage', params)
    },
    // 用途列表（select）
    useList: params => {
        return API.POST('Product/pattribute', params)
    },
    //单位列表（select）
    unitList: params => {
        return API.POST('BarCode/units', params)
    },

    //货品条码
    getBarCode: params => {
        return API.POST('BarCode/list', params)
    },
    //新增货品条码
    addBarCode: params => {
        return API.POST('BarCode/insert', params)
    },
    //编辑货品条码
    editBarCode: params => {
        return API.POST('BarCode/update', params)
    },
    //货品单位
    getUnit: params => {
        return API.POST('BarCode/unitsPage', params)
    },
    //新增货品单位
    addUnit: params => {
        return API.POST('BarCode/insertUnit', params)
    },
    //编辑货品单位
    editUnit: params => {
        return API.POST('BarCode/updateUnit', params)
    }

}
