/**
 * Created by jerry on 2019/07/10.
 * 单位设置api
 */
import * as API from '.'

export default {
    //仓库列表
    unitSetList: params => {
        return API.POST('WManagement/newList', params)
    },
    //新增仓库
    addUnitSet: params => {
        return API.POST('WManagement/insertNewEntity', params)
    },
    //编辑仓库
    editUnitSet:params => {
        return API.POST('WManagement/updateNewEntity', params)
    },
    //结算规则列表
    findCheckRulesList:params => {
        return API.POST('WManagement/findCheckRulesList', params)
    },
    //是否默认仓库
    getDefaultWarehouse:params => {
        return API.POST('WManagement/isDefaultWarehouse', params)
    },
    //供应商--列表
    supplierList:params => {
        return API.POST('supplier/list', params)
    },
    //供应商--新增
    addSupplier:params => {
        return API.POST(' supplier/insertEntity', params)
    },
    //供应商--编辑
    editSupplier:params => {
        return  API.POST(' supplier/updateEntity', params)
    },
    //往来单位
    custSiteList:params => {
        return API.POST('site/findCustSiteID', params)
    },
    //账套列表
    accoutSetList:params => {
        return API.POST('site/list', params)
    },
    //账套--新增
    addAccoutSet:params => {
        return API.POST('site/insertEntity', params)
    },
    //账套--编辑
    editAccoutSet:params => {
        return  API.POST('site/updateEntity', params)
    },
    // 账套切换
    editSite: params => {
        return API.POST('account/switchSite', params)
    },
    //往来单位信息列表
    unitMessageList:params => {
        return  API.POST('Customer/list', params)
    },
    //单位类型列表
    selectCustTypeList:params => {
        return  API.POST('Customer/selectCustType', params)
    },
    //单位性质列表
    selectCustProperty:params => {
        return  API.POST('Customer/selectCustProperty', params)
    },
    //新增往来单位
    insertUnitMessage:params => {
        return  API.POST('Customer/insertEntity', params)
    },
    //编辑往来单位
    editUnitMessage:params => {
        return  API.POST('Customer/updateEntity', params)
    },
    //仓库类型列表
    warehouseTypeList:params => {
        return  API.POST('WarehouseType/list', params)
    },
    //新增仓库类型
    insertWarehouseType:params => {
        return  API.POST('WarehouseType/insertWarehouseType', params)
    },
    //编辑仓库类型
    updateWarehouseType:params => {
        return  API.POST('WarehouseType/updateWarehouseType', params)
    },
    //所属组织列表
    findEntityList:params => {
        return  API.POST('WManagement/findEntityList', params)
    },
}
