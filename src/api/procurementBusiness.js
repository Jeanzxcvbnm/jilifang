/**
 * Created by jerry on 2019/07/10.
 * 采购api
 */
import * as API from '.'

export default {
    //时间范围
    getDateScope: params => {
        return API.POST('home/findTime', params)
    },
    //仓库列表
    warehouseList: params => {
        return API.POST('StockIO/findSiteWareHouseListByType', params)
    },
    //供应商列表
    siteCustomerList: params => {
        return API.POST('StockIO/siteCustomer', params)
    },
    // 组织单位列表
    entityList: params => {
        return API.POST('StockIO/entityList', params)
    },
    //.采购订货列表
    PIOrdersList: params => {
        return API.POST('purchase/PIOrders', params)
    },
    //采购订货(采购下单) 明细
    PIOrdersDetails: params => {
        return API.POST('purchase/PIOrdersDetails', params)
    },
    //产品列表 （设置过条码的产品）
    codeProductList: params => {
        return API.POST('Product/barCodeProduct', params)
    },
    //产品价格信息 （设置过条码的产品）
    codeProductDetail: params => {
        return API.POST('Product/barCodeProductPrice', params)
    },
    //采购订货(采购下单) 新增 purchase/insertPIOrders
    insertPIOrders: params => {
        return API.POST('purchase/insertPIOrdersTwo', params)
    },
    //采购订货(采购下单) 编辑
    updatePIOrders: params => {
        return API.POST('purchase/updatePIOrders', params)
    },
    //发送订单
    sendPIOrders: params => {
        return API.POST('purchase/sendPIOrders', params)
    },
    //采购审核列表
    PIOrders2: params => {
        return API.POST('purchase/PIOrders2', params)
    },
    //采购审核 按钮[单据退回][确认审核][确认复核]
    verifyPIOrders: params => {
        return API.POST('purchase/verifyPIOrders', params)
    },
    //采购入库列表
    purchaseList: params => {
        return API.POST('purchase/selectPurchasePIOrders', params)
    },
    //采购入库明细
    purchaseOrderDetails: params => {
        return API.POST('purchase/selectPurchasePIOrdersDetailsTwo', params)
    },
    //确认入库
    purchasePIOrders: params => {
        return API.POST('purchase/purchasePIOrders', params)
    },
    //采购退货列表
    purchasingReturnList: params => {
        return API.POST('purchase/purchaseReturns', params)
    },
    //采购退货明细
    purchaseReturnsDetails: params => {
        return API.POST('purchase/purchaseReturnsDetails', params)
    },
    //新增采购退货
    addPurchaseReturn: params => {
        return API.POST('purchase/insertPurchaseM', params)
    },
    //编辑采购退货
    updatePurchaseReturn: params=> {
        return API.POST('purchase/updateMAndD',params)
    },
    //发送订单
    sendPurchase: params=> {
        return API.POST('purchase/sendPurchase',params)
    },

    //采购订货导出
    exportOP: params => {
        return API.exportExcel('excel/exportOP', params)
    },
    //采购审核导出
    exportCS: params => {
        return API.exportExcel('excel/exportCS', params)
    },
    //采购入库导出
    exportTPI: params => {
        return API.exportExcel('excel/exportTPI', params)
    },
    //采购退货导出
    exportCT: params => {
        return API.exportExcel('excel/exportCT', params)
    },
}
