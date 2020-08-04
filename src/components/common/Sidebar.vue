<template>
    <div class="sidebar">
        <!-- <el-aside> -->
        <!--<div class="title">{{siteName}}</div>-->
        <el-menu
                class="sidebar-el-menu"
                :default-active="onRoutes"
                :collapse="collapse"
                text-color="#bfcbd9"
                active-text-color="#20a0ff"
                :unique-opened="true"
                router
        >

            <template v-for="item in items">
                <template v-if="item.children.length>0">
                    <el-submenu :index="item.key" :key="item.id">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.text }}</span>
                        </template>
                        <template v-for="subItem in item.children">
                            <el-submenu v-if="subItem.children.length>0" :index="subItem.key" :key="subItem.id">
                                <template slot="title">{{ subItem.text }}</template>
                                <el-menu-item
                                        v-for="(threeItem,i) in subItem.children"
                                        :key="i"
                                        :index="threeItem.key"
                                >{{ threeItem.text }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.key" :key="subItem.id">{{ subItem.text }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.key" :key="item.id">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.text }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
        <!-- </el-aside> -->
    </div>
</template>

<script>
    import bus from "@/components/js/bus";
    import API from "@/api/slider";

    export default {
        data() {
            return {
                collapse: false,
                siteName: "",
                items: [
                    {
                        icon: "el-icon-s-home",
                        key: "/homePage",
                        text: "系统首页"
                    },
                    {
                        icon: "el-icon-s-promotion",
                        key: "",
                        text: "调拨业务",
                        children: [
                            {
                                key: "/allot/replenishmentApply/replenishment",
                                text: "调拨申请"
                            },

                            {
                                key: "/allot/replenishmentAudit/replenishmentAudit",
                                text: "调拨审核"
                            },

                            {
                                key: '/allot/allotDelivery/allotDelivery',
                                text: '调拨出库'
                            },
                            {
                                key: '/allot/allotStorage/storage',
                                text: '调拨入库'
                            },

                        ]
                    },
                    {
                        icon: "el-icon-menu",
                        key: "",
                        text: "库存管理",
                        children: [
                            {
                                key: "/stockControl/initialStorage/initialStorage",
                                text: "期初结存",
                            },
                            {
                                key: '/stockControl/depletion/depletion',
                                text: '消耗出库'
                            },
                            {
                                key: '/stockControl/purchase/purchase',
                                text: '采购入库'
                            },
                            {
                                key: '/stockControl/inventory/inventory',
                                text: '库存盘点'
                            },
                        ]
                    },
                    {
                        icon: "el-icon-s-custom",
                        key: "",
                        text: "销售业务",
                        children: [
                            {
                                key: "/salesBusiness/salesQuotation/salesQuotation",
                                text: "销售订货",
                            },
                            {
                                key: "/salesBusiness/salesReview/salesReview",
                                text: "销售复核",
                            },
                            {
                                key: "/salesBusiness/salesOrders/salesOrders",
                                text: "订单复核",
                            },
                            {
                                key: "/salesBusiness/salesDelivery/salesDelivery",
                                text: "销售收发货",
                            },
                            {
                                key: "/salesBusiness/salesReturn/salesReturn",
                                text: "销售退货",
                            },
                        ]
                    },
                    {
                        icon: "el-icon-s-check",
                        key: "",
                        text: "采购业务",
                        children: [
                            {
                                key: "/procurementBusiness/purchasingOrder/purchasingOrder",
                                text: "采购订货",
                            },
                            {
                                key: "/procurementBusiness/purchasingAudit/purchasingAudit",
                                text: '采购审核',
                            },
                            {
                                key: '/procurementBusiness/purchasingWarehousing/purchasingWarehousing',
                                text: '采购入库',
                            },
                            {
                                key: '/procurementBusiness/purchaseReturn/purchaseReturn',
                                text: '采购退货',
                            }
                        ]
                    },
                    {
                        icon: "el-icon-s-marketing",
                        key: "",
                        text: "报表中心",
                        children: [
                            {
                                key: "/reports/outPutBills",
                                text: "单据出入库报表"
                            },
                            {
                                key: "/reports/replenishmentApplication",
                                text: "调拨申请单查询报表",
                            },
                            {
                                key: "/reports/realTimeInventory",
                                text: "货品实时库存报表",
                            },
                            {
                                key: "/reports/classifiedReport",
                                text: "出入库成本汇总类型分类报表",
                            },
                            {
                                key: "/reports/summaryReport",
                                text: "出入库成本汇总报表",
                            },
                        ]
                    },
                    {
                        icon: "el-icon-s-order",
                        key: "",
                        text: "物料设置",
                        children: [
                            {
                                key: "/material/goodsType",
                                text: "货品类别"
                            },
                            {
                                key: "/material/packingUnit",
                                text: "包装单位"
                            },
                            {
                                key: "/material/goodsData",
                                text: "货品资料"
                            },
                            {
                                key: "/material/goodsCode",
                                text: "货品条码"
                            }
                        ]
                    },
                    {
                        icon: "el-icon-s-management",
                        key: "",
                        text: "价格设置",
                        children: [
                            {
                                key: "/priceSet/allocationPrice",
                                text: '调拨价格'
                            },
                            {
                                key: "/priceSet/maintain",
                                text: '货品售价'
                            },
                        ]
                    },
                    {
                        icon: "el-icon-s-flag",
                        key: "",
                        text: "单位设置",
                        children: [
                            // {
                            //     key: "/unitSet/unitNature",
                            //     text: "单位性质"
                            // },
                            {
                                key: "/unitSet/warehouseType",
                                text: "仓库类型"
                            },
                            {
                                key: "/unitSet/warehouseUnit",
                                text: "仓库管理"
                            },
                            {
                                key: "/unitSet/unitMessage",
                                text: "往来单位信息"
                            },
                            // {
                            //     key: "/unitSet/supplier",
                            //     text: "供应商"
                            // },
                            {
                                key: "/unitSet/accountSet",
                                text: "账套管理"
                            },
                        ]
                    },
                    {
                        icon: "el-icon-s-cooperation",
                        key: "",
                        text: "核算方式",
                        children: [
                            {
                                key: "/accountMethod/setRule",
                                text: "定义结算规则"
                            },
                            // {
                            //     key: "/accountMethod/setDate",
                            //     text: "结账日期设置"
                            // },
                            {
                                key: "/accountMethod/setAccount",
                                text: "库存成本月结账"
                            },
                            {
                                key: "/accountMethod/backSetAccount",
                                text: "库存成本月反结账"
                            },
                            {
                                key: "/accountMethod/accountMethod",
                                text: "核算方式"
                            },
                        ]
                    },
                    {
                        icon: "el-icon-s-tools",
                        key: "",
                        text: "权限设置",
                        children: [
                            {
                                key: "/authoritySet/roleList",
                                text: "角色权限"
                            },
                            {
                                key: "/authoritySet/userList",
                                text: "用户权限"
                            },
                        ]
                    },
                ]
            };
        },
        computed: {
            onRoutes() {
                var that = this;
                if (that.$route.meta.supPath) {
                    return that.$route.meta.supPath.replace("#", "");
                } else {
                    return that.$route.path.replace("#", "");
                }
            },
        },
        created() {
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on("collapse", msg => {
                this.collapse = msg;
            });
        },
        methods: {
            sliderData: function () {
                var that = this;
                API.getJurisdiction()
                    .then(res => {
                        if (res.stateCode == 100) {

                            that.items = res.data.children

                        } else {
                            that.$message.error({
                                message: res.message,
                                duration: 2000
                            });
                        }
                    })
            },
        },
        mounted() {
            var that = this;
            that.siteName = JSON.parse(localStorage.getItem('access-user')).siteName;
            that.sliderData()
        }
    };
</script>

<style scoped lang="scss">
    .sidebar {
        display: block;
        position: absolute;
        left: 0;
        top: 50px;
        bottom: 0;
        overflow-y: scroll;
        .title {
            padding: 15px;
            text-align: center;
            background-color: #d1dadf;
        }
    }

    .sidebar::-webkit-scrollbar {
        width: 0;
    }

    .sidebar-el-menu:not(.el-menu--collapse) {
        width: 180px;
    }

    .sidebar {
        ul {
            height: 100%;
        }
    }

    .sidebar {
        .sidebar-el-menu {
            .el-menu-item {
                color: #000 !important;
            }
            .el-submenu {
                .el-submenu__title {
                    color: #000 !important;
                }
            }

        }
    }

    .sidebar-el-menu {
        .is-opened {
            .is-active {
                color: #3296FA !important;
                background-color: #F4FBFF;

            }

        }
    }

    .el-menu--vertical {
        .el-menu {
            li {
                color: #333 !important;
            }
        }
    }

</style>
