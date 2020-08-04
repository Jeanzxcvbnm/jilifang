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
    //客户商列表
    getClientList: params => {
        return API.POST('StockIO/clientSiteCustomer', params)
    },
    // 组织单位列表
    entityList: params => {
        return API.POST('StockIO/entityList', params)
    },
    //产品列表 （设置过条码的产品）
    codeProductList: params => {
        return API.POST('Product/barCodeProduct', params)
    },
    //产品价格信息 （设置过条码的产品）
    codeProductDetail: params => {
        return API.POST('Product/barCodeProductPrice', params)
    },
    //销售订货列表
    salesQuotationList: params => {
        return API.POST('sales/SOOrders', params)
    },
    //销售订货明细列表
    salesQuotationOrders: params => {
        return API.POST('sales/SOOrdersDetails', params)
    },
    //新增销售订货
    addSalesQuotation: params => {
        return API.POST('sales/insertOrderAndDetails', params)
    },
    //编辑销售订货
    updateSalesQuotation: params => {
        return API.POST('sales/editOrder', params)
    },
    //发送订单&&作废
    sendSOOrder: params => {
        return API.POST('sales/sendSOOrder', params)
    },
    //销售复核列表
    salesReviewList: params=> {
        return API.POST('sales/getOrders',params)
    },
    //销售审核--确认审核
    affirmData: params=> {
        return API.POST('sales/ToReview',params)
    },
    //订单复核列表
    getRecheck: params=> {
        return API.POST('purchase/PIOrdersTwo',params)
    },
    //订单复核明细
    getRecheckDetail: params=> {
        return API.POST('purchase/PIOrdersDetails',params)
    },
    //订单复核--发送 [单据退回][确认完成][单据复核]
    getConfirm: params=> {
        return API.POST('sales/updateBYisConfirm',params)
    },
    //销售收发货列表
    receiveList: params=> {
        return API.POST('sales/getSaleBillOrder',params)
    },
    //销售收发货明细列表
    receiveDetailList: params=> {
        return API.POST('sales/getSaleBillOrderDetails',params)
    },
    //销售收发货--发送
    getDeliver: params=> {
        return API.POST('sales/sendSaleOrderTwo',params)
    },
    //销售退货列表
    salesReturnList: params=> {
        return API.POST('sales/getMOrders',params)
    },
    //销售退货明细列表
    salesReturnOrder: params=> {
        return API.POST('sales/getDOrders',params)
    },
    //发送订单
    sendOrder: params=> {
        return API.POST('sales/pcAndSaleReview',params)
    },
    //新增销售退货
    addSalesReturn: params=> {
        return API.POST('sales/insertMAndD',params)
    },
    //编辑销售退货
    updateSalesReturn: params=> {
        return API.POST('sales/editMAndD',params)
    },
    //销售订货导出
    exportOS: params => {
        return API.exportExcel('excel/exportOS', params)
    },
    //销售复核导出
    exportFH: params => {
        return API.exportExcel('excel/exportFH', params)
    },
    //销售收发货导出
    exportSF: params => {
        return API.exportExcel('excel/exportSF', params)
    },
    //销售退货导出
    exportSI: params => {
        return API.exportExcel('excel/exportSI', params)
    },


}
