/**
 * Created by jerry on 2019/07/24.
 * 报表中心api
 */
import * as API from '.'

export default {

    //仓库列表
    warehouseList: params => {
        return API.POST('StockIO/siteWarehouseList', params)
    },
    //仓库(报表)
    reportWarehouseList: params => {
        return API.POST('StockIO/siteWarehouses', params)
    },
    // 类别列表（select）
    categoryList: params => {
        return API.POST('PCategory/listNotPage', params)
    },
    // 组织单位列表
    entityList: params => {
        return API.POST('StockIO/entityList', params)
    },
    //单据出入库类型
    getType : params => {
        return API.POST('Documents/IOType', params)
    },
    //单据出入库
    getDocuments : params => {
        return API.POST('Documents/list', params)
    },
    //单据出入库明细
    documentsDetails: params => {
        return API.POST('Documents/decailList', params)
    },
    //补货申请明细
    getReplenishment: params => {
        return API.POST('Documents/replenishmentList', params)
    },
    //货品实时库存报表
    getWarehouse: params => {
        return API.POST('StockQuantity/findWarehouseTwo', params)
    },
    //货品实时库存报表详情
    getWarehouseDdetail: params => {
        return API.POST('StockQuantity/findInventory', params)
    },
    //仓库ID查出实时信息
    getFindProduct: params => {
        return API.POST('StockQuantity/findProduct', params)
    },
    // 用途列表（select）
    useList: params => {
        return API.POST('Product/pattribute', params)
    },
    // 出入库成本汇总
    outInDataList: params => {
        return API.POST('Documents/findOutInDataList', params)
    },
    // 出入库成本汇总类型分类
    findOutInDataTypeList: params => {
        return API.POST('Documents/findOutInDataTypeList', params)
    },
    // 月结批次
    settleList : params =>{
        return API.POST('settle/list',params)
    },

    // 导出单据出入库报表
    exportIOWarehouse : params =>{
        return API.exportExcel('excel/exportIOWarehouse',params)
    },
    // 导出出入库总表
    exportAllIO : params =>{
        return API.exportExcel('excel/exportAllIO',params)
    },
    // 导出调拨申请明细报表
    exportRPDetail : params =>{
        return API.exportExcel('excel/exportRPDetail',params)
    },
    // 导出货品实时库存报表
    exportGood : params =>{
        return API.exportExcel('excel/exportGood',params)
    },
    // 导出出入库成本类型报表
    exportOutInType : params =>{
        return API.exportExcel('excel/exportOutInType',params)
    },






}
