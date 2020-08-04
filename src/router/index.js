import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/common/Home'
import login from '@/views/login'
import Account from '@/views/account'
import AccountLogin from '@/views/accountLogin'
import SetDate from '@/views/setDate'
import Dashboard from '@/views/dashboard'
import HomePage from '@/views/homePage'
import ResetPassword from '@/views/resetPassword'


import GoodsType from '@/views/materialSet/goodsType'
import GoodsCode from '@/views/materialSet/goodsCode'
import GoodsData from '@/views/materialSet/goodsData'
import PackingUnit from '@/views/materialSet/packingUnit'

import BasicPrice from '@/views/priceSet/basicPrice'
import AllocationPrice from '@/views/priceSet/allocationPrice'
import Maintain from '@/views/priceSet/maintain'

import UnitNature from '@/views/unitSet/unitNature'
import WarehouseType from '@/views/unitSet/warehouseType'
import WarehouseUnit from '@/views/unitSet/warehouseUnit'
import UnitMessage from '@/views/unitSet/unitMessage'
import Supplier from '@/views/unitSet/supplier'
import AccountSet from '@/views/unitSet/accountSet'

import Stock from '@/views/reports/stock'
// import CostReal from '@/views/reports/costReal'
import ReplenishmentApplication from '@/views/reports/replenishmentApplication'
// import CostRealAllot from '@/views/reports/costRealAllot'
import OutPutBills from '@/views/reports/outPutBills'
import SropaWarehousing from '@/views/reports/sropaWarehousing'
import RealTimeInventory from '@/views/reports/realTimeInventory'
import ReportDetail from '@/views/reports/reportDetail'



import Replenishment from '@/views/allot/replenishmentApply/replenishment'
import AddReplenishment from '@/views/allot/replenishmentApply/addReplenishment'
import EditReplenishment from '@/views/allot/replenishmentApply/editReplenishment'
import ApplyDetail from '@/views/allot/replenishmentApply/applyDetail'


import ReplenishmentAudit from '@/views/allot/replenishmentAudit/replenishmentAudit'
import AuditDetail from '@/views/allot/replenishmentAudit/auditDetail'
import ToAuditDetail from '@/views/allot/replenishmentAudit/toAuditDetail'

import AllotDelivery from '@/views/allot/allotDelivery/allotDelivery'
import StayDelivergoods1 from '@/views/allot/allotDelivery/stayDelivergoods'


import AllotStorage from '@/views/allot/allotStorage/storage'
import AllotStorageDetail from '@/views/allot/allotStorage/storageDetail'

import Depletion from '@/views/stockControl/depletion/depletion'
import AddDepletion from '@/views/stockControl/depletion/addDepletion'
import DepletionDetails from '@/views/stockControl/depletion/details'

import InitialStorage from '@/views/stockControl/initialStorage/initialStorage'
import addInitialStorage from '@/views/stockControl/initialStorage/addinitialStorage'
import InitialStorageDetails from '@/views/stockControl/initialStorage/details'
import InitialStorageDetails2 from '@/views/stockControl/initialStorage/initialStorageDetails'

import Purchase from '@/views/stockControl/purchase/purchase'
import AddPurchase from '@/views/stockControl/purchase/addPurchase'
import PurchaseDetails from '@/views/stockControl/purchase/details'

import Inventory from '@/views/stockControl/inventory/inventory'
import Addinventory from '@/views/stockControl/inventory/addinventory'
import EditInventory from '@/views/stockControl/inventory/editInventory'
import InventoryDetail from '@/views/stockControl/inventory/inventoryDetail'

import SalesQuotation from '@/views/salesBusiness/salesQuotation/salesQuotation'
import AddSalesQuotation from '@/views/salesBusiness/salesQuotation/addSalesQuotation'
import EditSalesQuotation from '@/views/salesBusiness/salesQuotation/editSalesQuotation'
import SalesQuotationDetail from '@/views/salesBusiness/salesQuotation/salesQuotationDetail'

import SalesOrders  from '@/views/salesBusiness/salesOrders/salesOrders'
import SalesOrdersDetail  from '@/views/salesBusiness/salesOrders/salesOrdersDetail'
import EditSalesOrders  from '@/views/salesBusiness/salesOrders/editSalesOrders'

import SalesReview  from '@/views/salesBusiness/salesReview/salesReview'
import EditSalesReview  from '@/views/salesBusiness/salesReview/editSalesReview'
import SalesReviewDetail  from '@/views/salesBusiness/salesReview/salesReviewDetail'


import SalesDelivery  from '@/views/salesBusiness/salesDelivery/salesDelivery'
import SalesDeliveryDetail  from '@/views/salesBusiness/salesDelivery/salesDeliveryDetail'

import SalesReturn  from '@/views/salesBusiness/salesReturn/salesReturn'
import AddSalesReturn  from '@/views/salesBusiness/salesReturn/addSalesReturn'
import EditSalesReturn  from '@/views/salesBusiness/salesReturn/editSalesReturn'
import SalesReturnDetail  from '@/views/salesBusiness/salesReturn/salesReturnDetail'

import PurchasingOrder from '@/views/procurementBusiness/purchasingOrder/purchasingOrder'
import AddPurchasingOrder from '@/views/procurementBusiness/purchasingOrder/addPurchasingOrder'
import EditPurchasingOrder from '@/views/procurementBusiness/purchasingOrder/editPurchasingOrder'
import PurchasingOrderDetail from '@/views/procurementBusiness/purchasingOrder/purchasingOrderDetail'

import PurchasingAudit from '@/views/procurementBusiness/purchasingAudit/purchasingAudit'
import ToAuditdetail from '@/views/procurementBusiness/purchasingAudit/toAuditDetail'
import ToReviewDetail from '@/views/procurementBusiness/purchasingAudit/toReviewDetail'
import PurchasingAuditDetail from '@/views/procurementBusiness/purchasingAudit/purchasingAuditDetail'

import PurchasingWarehousing from '@/views/procurementBusiness/purchasingWarehousing/purchasingWarehousing'
import ConfirmWarehousing from '@/views/procurementBusiness/purchasingWarehousing/confirmWarehousing'
import PurchasingWarehousingDetail from '@/views/procurementBusiness/purchasingWarehousing/purchasingWarehousingDetail'

import PurchaseReturn from '@/views/procurementBusiness/purchaseReturn/purchaseReturn'
import AddPurchaseReturn from '@/views/procurementBusiness/purchaseReturn/addPurchaseReturn'
import EditPurchaseReturn from '@/views/procurementBusiness/purchaseReturn/editPurchaseReturn'
import PurchaseReturnDetail from '@/views/procurementBusiness/purchaseReturn/purchaseReturnDetail'


import AccountMethod from '@/views/accountMethod/accountMethod'
import SetRule from '@/views/accountMethod/setRule'
import SetAccount from '@/views/accountMethod/setAccount'
import BackSetAccount from '@/views/accountMethod/backSetAccount'

import ClassifiedReport from '@/views/reports/classifiedReport'
import SummaryReport from '@/views/reports/summaryReport'

import RoleList from '@/views/authoritySet/role/roleList'
import RoleSet from '@/views/authoritySet/role/roleSet'
import Initialize from '@/views/authoritySet/role/initialize'

import UserList from '@/views/authoritySet/user/userList'
import UserSet from '@/views/authoritySet/user/userSet'

//
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
    return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

let route = new Router({
    routes: [
        {
            path: '/account',
            name: 'Account',
            component: Account
        },
        {
            path: '/setDate',
            name: 'SetDate',
            component: SetDate
        },
        {
            path: '/accountLogin',
            name: 'AccountLogin',
            component: AccountLogin
        }, {
            path: '/login',
            name: 'login',
            component: login
        },
        {
            path: '/resetPassword',
            name: 'resetPassword',
            component: ResetPassword
        },
        {
            path: '/',
            redirect: '/homePage',
        },
        {
            path: '/',
            name: '首页',
            component: Home,
            children: [
                {path: '/homePage', component: HomePage, name: '系统首页', meta: {title: '系统首页', isTag: true}},
            ]

        },
        {
            path: '/',
            name: '首页',
            component: Home,
            children: [
                {path: '/dashboard', component: Dashboard, name: '系统首页', meta: {title: '系统首页', isTag: true}},
            ]

        },
        {
            path: '/',
            name: '物料设置',
            component: Home,
            children: [
                {path: '/material/goodsType', component: GoodsType, name: '货品类别', meta: {title: '货品类别', isTag: true}},
                {path: '/material/goodsCode', component: GoodsCode, name: '货品条码', meta: {title: '货品条码', isTag: true}},
                {path: '/material/goodsData', component: GoodsData, name: '货品资料', meta: {title: '货品资料', isTag: true}},
                {
                    path: '/material/packingUnit',
                    component: PackingUnit,
                    name: '包装单位',
                    meta: {title: '包装单位', isTag: true}
                },
            ]
        },
        {
            path: '/',
            name: '价格设置',
            component: Home,
            children: [
                {path: '/priceSet/basicPrice', component: BasicPrice, name: '基础价格', meta: {title: '基础价格', isTag: true}},
                {
                    path: '/priceSet/allocationPrice',
                    component: AllocationPrice,
                    name: '调拨价格',
                    meta: {title: '调拨价格', isTag: true}
                },
                {path: '/priceSet/maintain', component: Maintain, name: '货品价格维护', meta: {title: '货品价格维护', isTag: true}},
            ]
        },
        {
            path: '/',
            name: '单位设置',
            component: Home,
            children: [
                {path: '/unitSet/unitNature', component: UnitNature, name: '单位性质', meta: {title: '单位性质', isTag: true}},
                {
                    path: '/unitSet/warehouseType',
                    component: WarehouseType,
                    name: '仓库类型',
                    meta: {title: '仓库类型', isTag: true}
                },
                {
                    path: '/unitSet/warehouseUnit',
                    component: WarehouseUnit,
                    name: '仓库管理',
                    meta: {title: '仓库管理', isTag: true}
                },
                {
                    path: '/unitSet/unitMessage',
                    component: UnitMessage,
                    name: '单位信息',
                    meta: {title: '单位信息', isTag: true}
                },
                {
                    path: '/unitSet/supplier',
                    component: Supplier,
                    name: '供应商',
                    meta: {title: '供应商', isTag: true}
                },
                {
                    path: '/unitSet/accountSet',
                    component: AccountSet,
                    name: '账套',
                    meta: {title: '账套', isTag: true}
                },
            ]
        },
        {
            path: '/',
            name: '报表中心',
            component: Home,
            children: [
                {path: '/reports/stock', component: Stock, name: '仓库收发存汇总', meta: {title: '仓库收发存汇总', isTag: true}},
                // {path: '/reports/costReal',component: CostReal,name:"实时成本报表",meta: { title:'实时成本报表',isTag:true}},
                {
                    path: '/reports/replenishmentApplication',
                    component: ReplenishmentApplication,
                    name: "调拨申请明细报表",
                    meta: {title: '调拨申请明细报表', isTag: true}
                },
                // {path: '/reports/costRealAllot',component: CostRealAllot,name:"调拨实时成本报表",meta: { title:'调拨实时成本报表',isTag:true}},
                {
                    path: '/reports/outPutBills',
                    component: OutPutBills,
                    name: "单据出入库报表",
                    meta: {title: '单据出入库报表', isTag: true}
                },
                {
                    path: '/reports/sropaWarehousing',
                    component: SropaWarehousing,
                    name: "采购入库汇总报表",
                    meta: {title: '采购入库汇总报表', isTag: true}
                },
                {
                    path: '/reports/realTimeInventory',
                    component: RealTimeInventory,
                    name: "货品实时库存",
                    meta: {title: '货品实时库存', isTag: true}
                },
                {
                    path: '/reports/reportDetail',
                    component: ReportDetail,
                    name: "货品实时库存详情",
                    meta: {title: '货品实时库存详情', isTag: true,supPath: "/reports/realTimeInventory"}
                },
                {
                    path: '/reports/classifiedReport',
                    component: ClassifiedReport,
                    name: "出入库成本汇总类型分类报表",
                    meta: {title: '出入库成本汇总类型分类报表', isTag: true}
                },
                {
                    path: '/reports/summaryReport',
                    component: SummaryReport,
                    name: "出入库成本汇总报表",
                    meta: {title: '出入库成本汇总报表', isTag: true}
                },

            ]
        },
        {
            path: '/',
            name: '调拨流程',
            component: Home,
            children: [
                {
                    path: '/allot/replenishmentApply/replenishment',
                    component: Replenishment,
                    name: '调拨申请管理',
                    meta: {title: '调拨申请管理', isTag: true}
                },
                {
                    path: '/allot/replenishmentApply/addReplenishment',
                    component: AddReplenishment,
                    name: '新增补货申请',
                    meta: {title: '新增补货申请', isTag: false, supPath: "/allot/replenishmentApply/replenishment"}
                },
                {
                    path: '/allot/replenishmentApply/editReplenishment',
                    component: EditReplenishment,
                    name: '编辑补货申请',
                    meta: {title: '编辑补货申请', isTag: false, supPath: "/allot/replenishmentApply/replenishment"}
                },
                {
                    path: '/allot/replenishmentApply/applyDetail',
                    component: ApplyDetail,
                    name: '调拨申请详情',
                    meta: {title: '调拨申请详情', isTag: false, supPath: "/allot/replenishmentApply/replenishment"}
                },

                {
                    path: '/allot/replenishmentAudit/replenishmentAudit',
                    component: ReplenishmentAudit,
                    name: '调拨申请单审核',
                    meta: {title: '调拨申请单审核', isTag: true}
                },
                {
                    path: '/allot/replenishmentAudit/auditDetail',
                    component: AuditDetail,
                    name: '详情',
                    meta: {title: '详情', isTag: false, supPath: "/allot/replenishmentAudit/replenishmentAudit"}
                },
                {
                    path: '/allot/replenishmentAudit/toAuditDetail',
                    component: ToAuditDetail,
                    name: '待审核详情',
                    meta: {title: '待审核详情', isTag: false, supPath: "/allot/replenishmentAudit/replenishmentAudit"}
                },


                {
                    path: '/allot/allotDelivery/allotDelivery',
                    component: AllotDelivery,
                    name: "调拨出库",
                    meta: {title: '调拨出库', isTag: true}
                },
                {
                    path: '/allot/allotDelivery/stayDelivergoods',
                    component: StayDelivergoods1,
                    name: "详情",
                    meta: {title: '详情', isTag: false, supPath: "/allot/allotDelivery/allotDelivery"}
                },


                {
                    path: '/allot/allotStorage/storage',
                    component: AllotStorage,
                    name: "调拨入库",
                    meta: {title: '调拨入库', isTag: true}
                },
                {
                    path: '/allot/allotStorage/storageDetail',
                    component: AllotStorageDetail,
                    name: "详情",
                    meta: {title: '详情', isTag: true, supPath: "/allot/allotStorage/storage"}
                },

            ]
        },
        {
            path: '/',
            name: '库存管理',
            component: Home,
            children: [
                {
                    path: '/stockControl/initialStorage/initialStorage',
                    component: InitialStorage,
                    name: '期初结存',
                    meta: {title: '期初结存', isTag: true}
                },
                {
                    path: '/stockControl/initialStorage/addinitialStorage',
                    component: addInitialStorage,
                    name: '新增',
                    meta: {title: '期初入库新增', isTag: false, supPath: "/stockControl/initialStorage/initialStorage"}
                },
                {
                    path: '/stockControl/initialStorage/details',
                    component: InitialStorageDetails,
                    name: "详情",
                    meta: {title: '详情', isTag: false, supPath: "/stockControl/initialStorage/initialStorage"}
                },
                {
                    path: '/stockControl/initialStorage/initialStorageDetails',
                    component: InitialStorageDetails2,
                    name: "详情",
                    meta: {title: '详情', isTag: false, supPath: "/stockControl/initialStorage/initialStorage"}
                },

                {
                    path: '/stockControl/depletion/depletion',
                    component: Depletion,
                    name: "消耗出库",
                    meta: {title: '消耗出库', isTag: true}
                },
                {
                    path: '/stockControl/depletion/addDepletion',
                    component: AddDepletion,
                    name: "新增",
                    meta: {title: '消耗出库新增', isTag: false, supPath: "/stockControl/depletion/depletion"}
                },
                {
                    path: '/stockControl/depletion/details',
                    component: DepletionDetails,
                    name: "详情",
                    meta: {title: '详情', isTag: false, supPath: "/stockControl/depletion/depletion"}
                },
                {
                    path: '/stockControl/depletion/checkDetails',
                    component: DepletionDetails,
                    name: "详情",
                    meta: {title: '详情', isTag: false, supPath: "/stockControl/depletion/depletion"}
                },

                {
                    path: '/stockControl/purchase/purchase',
                    component: Purchase,
                    name: "",
                    meta: {title: '采购入库', isTag: true}
                },
                {
                    path: '/stockControl/purchase/addPurchase',
                    component: AddPurchase,
                    name: "新增",
                    meta: {title: '采购入库新增', isTag: false, supPath: "/stockControl/purchase/purchase"}
                },
                {
                    path: '/stockControl/purchase/details',
                    component: PurchaseDetails,
                    name: "详情",
                    meta: {title: '详情', isTag: false, supPath: "/stockControl/purchase/purchase"}
                },

                {
                    path: '/stockControl/inventory/inventory',
                    component: Inventory,
                    name: "",
                    meta: {title: '库存盘点', isTag: true}
                },
                {
                    path: '/stockControl/inventory/addinventory',
                    component: Addinventory,
                    name: '新增',
                    meta: {title: '新增库存盘点', isTag: false, supPath: "/stockControl/inventory/inventory"}
                },
                {
                    path: '/stockControl/inventory/editInventory',
                    component: EditInventory,
                    name: '编辑',
                    meta: {title: '编辑库存盘点', isTag: false, supPath: "/stockControl/inventory/inventory"}
                },
                {
                    path: '/stockControl/inventory/inventoryDetail',
                    component: InventoryDetail,
                    name: '详情',
                    meta: {title: '详情', isTag: false, supPath: "/stockControl/inventory/inventory"}
                },
            ]
        },
        {
            path: '/',
            name: '销售业务',
            component: Home,
            children: [
                {
                    path: '/salesBusiness/salesQuotation/salesQuotation',
                    component: SalesQuotation,
                    name: '销售订货',
                    meta: {title: '销售订货', isTag: true}
                },
                {
                    path: '/salesBusiness/salesQuotation/addSalesQuotation',
                    component: AddSalesQuotation,
                    name: "新增",
                    meta: {title: '销售报价新增', isTag: false, supPath: "/salesBusiness/salesQuotation/salesQuotation"}
                },
                {
                    path: '/salesBusiness/salesQuotation/editSalesQuotation',
                    component: EditSalesQuotation,
                    name: "编辑",
                    meta: {title: '销售报价编辑', isTag: false, supPath: "/salesBusiness/salesQuotation/salesQuotation"}
                },
                {
                    path: '/salesBusiness/salesQuotation/salesQuotationDetail',
                    component: SalesQuotationDetail,
                    name: "详情",
                    meta: {title: '销售报价详情', isTag: false, supPath: "/salesBusiness/salesQuotation/salesQuotation"}
                },

                {
                    path: '/salesBusiness/salesOrders/salesOrders',
                    component: SalesOrders,
                    name: '订单复核',
                    meta: {title: '订单复核', isTag: true}
                },
                {
                    path: '/salesBusiness/salesOrders/salesOrdersDetail',
                    component: SalesOrdersDetail,
                    name: "详情",
                    meta: {title: '详情', isTag: false, supPath: "/salesBusiness/salesOrders/salesOrders"}
                },
                {
                    path: '/salesBusiness/salesOrders/editSalesOrders',
                    component: EditSalesOrders,
                    name: "详情",
                    meta: {title: '详情', isTag: false, supPath: "/salesBusiness/salesOrders/salesOrders"}
                },

                {
                    path: '/salesBusiness/salesDelivery/salesDelivery',
                    component: SalesDelivery,
                    name: '销售收发货',
                    meta: {title: '销售收发货', isTag: true}
                },
                {
                    path: '/salesBusiness/salesDelivery/salesDeliveryDetail',
                    component: SalesDeliveryDetail,
                    name: "详情",
                    meta: {title: '详情', isTag: false, supPath: "/salesBusiness/salesDelivery/salesDelivery"}
                },

                {
                    path: '/salesBusiness/salesReturn/salesReturn',
                    component: SalesReturn,
                    name: '销售退货',
                    meta: {title: '销售退货', isTag: true}
                },
                {
                    path: '/salesBusiness/salesReturn/addSalesReturn',
                    component: AddSalesReturn,
                    name: "新增",
                    meta: {title: '新增销售退货', isTag: false, supPath: "/salesBusiness/salesReturn/salesReturn"}
                },
                {
                    path: '/salesBusiness/salesReturn/editSalesReturn',
                    component: EditSalesReturn,
                    name: "编辑",
                    meta: {title: '销售报价编辑', isTag: false, supPath: "/salesBusiness/salesReturn/salesReturn"}
                },
                {
                    path: '/salesBusiness/salesReturn/salesReturnDetail',
                    component: SalesReturnDetail,
                    name: "详情",
                    meta: {title: '销售报价编辑', isTag: false, supPath: "/salesBusiness/salesReturn/salesReturn"}
                },

                {
                    path: '/salesBusiness/salesReview/salesReview',
                    component: SalesReview,
                    name: '销售复核',
                    meta: {title: '销售复核', isTag: true}
                },
                {
                    path: '/salesBusiness/salesReview/editSalesReview',
                    component: EditSalesReview,
                    name: '销售复核审核',
                    meta: {title: '销售复核审核', isTag: true,supPath: "/salesBusiness/salesReview/salesReview"}
                },
                {
                    path: '/salesBusiness/salesReview/salesReviewDetail',
                    component: SalesReviewDetail,
                    name: "详情",
                    meta: {title: '详情', isTag: false, supPath: "/salesBusiness/salesReview/salesReview"}
                }

            ]
        },
        {
            path: '/',
            name: '采购业务',
            component: Home,
            children: [
                {
                    path:"/procurementBusiness/purchasingOrder/purchasingOrder",
                    component:PurchasingOrder,
                    name:'采购订货',
                    meta: {title: '采购订货', isTag: true}
                },
                {
                    path:"/procurementBusiness/purchasingOrder/addPurchasingOrder",
                    component:AddPurchasingOrder,
                    name:"新增",
                    meta:{title:'新增',isTag:false,supPath:"/procurementBusiness/purchasingOrder/purchasingOrder"}
                },
                {
                    path:"/procurementBusiness/purchasingOrder/editPurchasingOrder",
                    component:EditPurchasingOrder,
                    name:"编辑",
                    meta:{title:'编辑',isTag:false,supPath:'/procurementBusiness/purchasingOrder/purchasingOrder'}
                },
                {
                    path:"/procurementBusiness/purchasingOrder/purchasingOrderDetail",
                    component:PurchasingOrderDetail,
                    name:"详情",
                    meta:{title:'详情',isTag:false,supPath:"/procurementBusiness/purchasingOrder/purchasingOrder"}
                },

                {
                    path:"/procurementBusiness/purchasingAudit/purchasingAudit",
                    component:PurchasingAudit,
                    name:'采购审核',
                    meta:{title:'采购审核',isTag:true}
                },
                {
                    path:'/procurementBusiness/purchasingAudit/toAuditDetail',
                    component:ToAuditdetail,
                    name:'详情',
                    meta:{title:'详情',isTag:false,supPath:"/procurementBusiness/purchasingAudit/purchasingAudit"}
                },
                {
                    path:'/procurementBusiness/purchasingAudit/toReviewDetail',
                    component:ToReviewDetail,
                    name:'详情',
                    meta:{title:'详情',isTag:false,supPath:"/procurementBusiness/purchasingAudit/purchasingAudit"}
                },
                {
                    path:"/procurementBusiness/purchasingAudit/purchasingAuditDetail",
                    component:PurchasingAuditDetail,
                    name:"详情",
                    meta:{title:"详情",isTag:false,supPath:"/procurementBusiness/purchasingAudit/purchasingAudit"}
                },


                {
                    path:"/procurementBusiness/purchasingWarehousing/purchasingWarehousing",
                    component:PurchasingWarehousing,
                    name:"采购入库",
                    meta:{title:'采购入库',isTag:true}
                },
                {
                    path:"/procurementBusiness/purchasingWarehousing/confirmWarehousing",
                    component:ConfirmWarehousing,
                    name:'确认入库',
                    meta:{title:'确认入库',isTag:false,supPath:"/procurementBusiness/purchasingWarehousing/purchasingWarehousing"}
                },
                {
                    path:"/procurementBusiness/purchasingWarehousing/purchasingWarehousingDetail",
                    component:PurchasingWarehousingDetail,
                    name:'详情',
                    meta:{title:"详情",isTag:false,supPath:'/procurementBusiness/purchasingWarehousing/purchasingWarehousing'}
                },

                {
                    path:"/procurementBusiness/purchaseReturn/purchaseReturn",
                    component:PurchaseReturn,
                    name:"采购退货",
                    meta:{title:'采购退货',isTag:true}
                },
                {
                    path:"/procurementBusiness/purchaseReturn/addPurchaseReturn",
                    component:AddPurchaseReturn,
                    name:'新增',
                    meta:{title:'新增',isTag:false,supPath:"/procurementBusiness/purchaseReturn/purchaseReturn"}
                },
                {
                    path:"/procurementBusiness/purchaseReturn/editPurchaseReturn",
                    component:EditPurchaseReturn,
                    name:'新增',
                    meta:{title:'新增',isTag:false,supPath:"/procurementBusiness/purchaseReturn/purchaseReturn"}
                },
                {
                    path:"/procurementBusiness/purchaseReturn/purchaseReturnDetail",
                    component:PurchaseReturnDetail,
                    name:"详情",
                    meta:{title:'详情',isTag:false,supPath:"/procurementBusiness/purchaseReturn/purchaseReturn"}
                }


            ]
        },
        {
            path: '/',
            name: '核算方式',
            component: Home,
            children: [
                {
                    path:"/accountMethod/setRule",
                    component:SetRule,
                    name:'定义结算规则',
                    meta: {title: '定义结算规则', isTag: true}
                },
                // {
                //     path:"/accountMethod/setDate",
                //     component:SetDate,
                //     name:'结账日期设置',
                //     meta: {title: '结账日期设置', isTag: true}
                // },
                {
                    path:"/accountMethod/setAccount",
                    component:SetAccount,
                    name:'库存成本月结账',
                    meta: {title: '库存成本月结账', isTag: true}
                },
                {
                    path:"/accountMethod/backSetAccount",
                    component:BackSetAccount,
                    name:'库存成本月反结账',
                    meta: {title: '库存成本月反结账', isTag: true}
                },
                {
                    path:"/accountMethod/accountMethod",
                    component:AccountMethod,
                    name:'核算方式',
                    meta: {title: '核算方式', isTag: true}
                },
                ]
        },

                {
                    path:"/authoritySet/roleList",
                    component:RoleList,
                    name:'角色权限',
                    meta: {title: '角色权限', isTag: true}
                },
                {
                    path:"/authoritySet/roleSet",
                    component:RoleSet,
                    name:'角色权限设置',
                    meta: {title: '角色权限设置', isTag: true,supPath:"/authoritySet/roleList"}
                },
                {
                    path:"/authoritySet/initialize",
                    component:Initialize,
                    name:'初始化系统权限',
                    meta: {title: '角色权限设置', isTag: true,supPath:"/authoritySet/roleList"}
                },
                {
                    path:"/authoritySet/userList",
                    component:UserList,
                    name:'用户权限',
                    meta: {title: '用户权限', isTag: true}
                },
                {
                    path:"/authoritySet/userSet",
                    component:UserSet,
                    name:'用户权限设置',
                    meta: {title: '用户权限设置', isTag: true,supPath:"/authoritySet/userList"}
                }


    ]
})

export default route
