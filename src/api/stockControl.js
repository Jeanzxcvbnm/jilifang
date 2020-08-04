/**
 * Created by jerry on 2019/07/10.
 * 库存管理api
 */
import * as API from '.'

export default {
    //时间范围
    getDateScope: params => {
        return API.POST('home/findTime', params)
    },
    //仓库列表
    warehouseList: params => {
        return API.POST('StockIO/siteWarehouseList', params)
    },
    // 组织单位列表
    entityList: params => {
        return API.POST('StockIO/entityList', params)
    },
    //期初入库单
    getOrders: params => {
        return API.POST('StockIO/IIOrdersTwo', params)
    },
    //新增期初入库单
    addOrders: params => {
        return API.POST('StockIO/insertIIOrder', params)
    },
    //期初入库单明细
    getOrdersDetails: params => {
        return API.POST('StockIO/IIOrdersDetails', params)
    },
    //产品列表 （设置过条码的产品）
    codeProductList: params => {
        console.log(params)
        return API.POST('Product/barCodeProduct', params)
    },
    //产品列表 （设置过条码的产品）
    codeProductList2: params => {
        return API.POST('Product/barCodeProduct2', params)
    },
    //产品价格信息 （设置过条码的产品）
    codeProductDetail: params => {
        return API.POST('Product/barCodeProductPrice', params)
    },
    //供应商列表
    siteCustomerList: params => {
        return API.POST('StockIO/siteCustomer', params)
    },
    //采购入库单
    getProcurement: params => {
        return API.POST('StockIO/PIOrders', params)
    },
    //新增采购入库单
    addProcurement: params => {
        return API.POST('StockIO/insertPIOrder', params)
    },
    //采购入库单明细
    procurementDetails: params => {
        return API.POST('StockIO/PIOrdersDetails', params)
    },
    //消耗出库单
    getConsumeOrder: params => {
        return API.POST('StockIO/UOOrders', params)
    },
    //新增消耗出库单
    addConsumeOrder: params => {
        return API.POST('StockIO/insertUOOrder', params)
    },
    //消耗出库单明细
    consumeOrderDetails: params => {
        return API.POST('StockIO/UOOrdersDetails', params)
    },
    //确认审核
    ConfirmationReview: params => {
        return API.POST('StockIO/confirmationReview', params)
    },
    //用于判断取消按钮, 返回true或false
    cancle: params => {
        return API.POST('StockIO/returnValue', params)
    },
    //用于判断取消按钮, 返回true或false
    Cancelreview: params => {
        return API.POST('StockIO/cancelReview', params)
    },
    //excel导入
    excleUpload: params => {
        return API.POST('excel/import', params)
    },
    //员工列表
    empList: params => {
        return API.POST('StockInventory/selectEmpIDList', params)
    },
    //盘点列表
    inventoryList: params => {
        return API.POST('StockInventory/list', params)
    },
    //盘点明细
    selectNumberByList: params => {
        return API.POST('StockInventory/selectNumberByListID', params)
    },
    //根据下拉名称带入信息
    selectNumber: params => {
        return API.POST('StockInventory/selectNumberByName', params)
    },
    //取数
    selectNumberByID: params => {
        return API.POST('StockInventory/selectNumberByID', params)
    },
    //0库存不显示
    selectNumberByAmount: params => {
        return API.POST('StockInventory/selectNumberByAmount', params)
    },
    //完成盘点
    stockInsertOK: params => {
        return API.POST('StockInventory/stockInsertOK', params)
    },
   //保存
    insertEntity: params => {
        return API.POST('StockInventory/insertEntity', params)
    },
    //出入库明细
    selectListInventoty: params => {
        return API.POST('StockInventory/selectListInventoty2', params)
    },
    //保存修改
    updateEntity: params => {
        return API.POST('StockInventory/updateEntity', params)
    },
    //完成盘点
    stockUpdateOK: params => {
        return API.POST('StockInventory/stockUpdateOK', params)
    },
    //是否处于盘点中
    statusNot: params => {
        return API.POST('StockInventory/selectISStatusNot', params)
    },

    //期初结存导出
    exportII: params => {
        return API.exportExcel('excel/exportII', params)
    },
    //消耗出库导出
    exportUO: params => {
        return API.exportExcel('excel/exportUO', params)
    },
    //采购入库导出
    exportPI: params => {
        return API.exportExcel('excel/exportPI', params)
    },
    //库存盘点导出
    exportPD: params => {
        return API.exportExcel('excel/exportPD', params)
    },


}
