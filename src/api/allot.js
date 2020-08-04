/**
 * Created by jerry on 2019/07/24.
 * 调拨流程api
 */
import * as API from '.'

export default {
    //时间范围
    getDateScope: params => {
        return API.POST('home/findTime', params)
    },
    //仓库列表（所有）
    getWarehouseAll: params => {
        return API.POST('StockIO/AllSiteWarehouses', params)
    },
    //仓库列表
    warehouseList: params => {
        return API.POST('StockIO/findSiteWareHouseListByType', params)
    },
    //收货仓库列表
    getacceptWarehouse: params => {
        return API.POST('StockIO/acceptWarehouse', params)
    },
    //产品列表 （设置过条码的产品）
    codeProductList: params => {
        return API.POST('Product/barCodeProduct', params)
    },
    //产品价格信息 （设置过条码的产品）
    codeProductDetail: params => {
        return API.POST('Product/barCodeProductPrice', params)
    },
    //产品价格信息 （设置过条码的产品）
    getRpProductPrice: params => {
        return API.POST('Product/rpProductPrice', params)
    },
    //调拨申请
    getAllotApply : params => {
        return API.POST('ti/TiOrdersTwo', params)
    },
    //新增调拨申请
    addAllotApply: params => {
        return API.POST('ti/insertTiOrder', params)
    },
    //编辑调拨申请
    editAllotApply: params => {
        return API.POST('ti/updateTiOrder', params)
    },
    //删除调拨申请
    deleteAllotApply: params => {
        return API.POST('ti/deleteTiOrder', params)
    },
    //调拨申请明细
    allotApplyDetails: params => {
        return API.POST('ti/OrdersDetails', params)
    },
    //单据作废 确认审核(修改订单状态码)
    setConfirm: params => {
        return API.POST('ti/updateIsConfirm', params)
    },
    // 调拨出库
    getDelivery : params => {
        return API.POST('StockIO/TOOrdersTwo', params)
    },
    // 调拨入库
    getStorage : params => {
        return API.POST('StockIO/TIOrdersTwo', params)
    },
    // 调拨出入库明细
    getOrdersDetails : params => {
        return API.POST('StockIO/StockOrdersDetails', params)
    },
    // 调拨出库明细
    getStockOrdersDetails : params => {
        return API.POST('StockIO/StockOrdersTODetails', params)
    },
    // 调拨出入库确认收货
    getOrdersConfirm : params => {
        return API.POST('StockIO/ConfirmTIOrder', params)
    },
    // 调拨出库确认收货
    getDeliveryConfirm : params => {
        return API.POST('StockIO/uodateTOOrder', params)
    },

    //调拨申请导出 、调拨审核导出
    exportRP: params => {
        return API.exportExcel('excel/exportRP', params)
    },
    //调拨出库导出
    exportTO: params => {
        return API.exportExcel('excel/exportTO', params)
    },
    //调拨入库导出
    exportTI: params => {
        return API.exportExcel('excel/exportTI', params)
    },
}
