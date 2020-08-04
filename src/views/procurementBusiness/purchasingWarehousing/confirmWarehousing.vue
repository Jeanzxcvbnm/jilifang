<template>
    <div v-loading="loading">
        <div class="pad_10_15">
            <el-row>
                <el-col :span="24" class="text_right">
                    <el-button type="primary" size="mini" plain @click="cancelClick">返回</el-button>
                    <el-button type="primary" size="mini" v-if="isConfirm=='已入库'" @click="voidClick" v-loading="modalLoading">单据作废</el-button>
                    <el-button type="primary" size="mini" @click="affirmClick" v-loading="modalLoading">确认入库</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="pad_5 backfff">
            <div class="pad_5 nav_header">
                <span class="font_14 marrt_20">采购信息</span>
            </div>
            <div class="nav_header">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="订单编号">
                        <el-input class="width_220" v-model="billID" disabled size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="订单状态">
                        <el-input v-model="isConfirm" disabled size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="供应商">
                        <el-input v-model="custName" size="mini" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="收货仓库">
                        <el-input v-model="warehouseName" disabled size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="经手单位">
                        <el-input v-model="entityName" disabled size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="开单日期">
                        <el-date-picker
                                size="mini"
                                v-model="billDate"
                                align="right"
                                type="date"
                                placeholder="选择日期"
                                disabled
                        >
                        </el-date-picker>
                    </el-form-item>
                    <!--<el-form-item label="审核日期">-->
                        <!--<el-date-picker-->
                                <!--size="mini"-->
                                <!--v-model="verifyDate"-->
                                <!--align="right"-->
                                <!--type="date"-->
                                <!--placeholder="选择日期"-->
                                <!--disabled-->
                        <!--&gt;-->
                        <!--</el-date-picker>-->
                    <!--</el-form-item>-->
                    <el-form-item label="备注">
                        <el-input type="textarea" v-model="remark" disabled size="mini"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>

        <div class="pad_10 backfff martp_15">
            <div class="pad_10 nav_header">
                <span class="font_14 marrt_20">采购明细</span>
                <!--<el-button type="primary" size="mini" icon="el-icon-printer">打印</el-button>-->
                <!--<el-button type="primary" size="mini" icon="el-icon-s-unfold">导出</el-button>-->
            </div>
            <div>
                <el-table :data="replenishmentList" ref="multipleTable"
                          max-height="400" style="width: 100%">
                    <el-table-column type="index" label="序号" width="55"></el-table-column>
                    <el-table-column prop="name" label="名称"></el-table-column>
                    <el-table-column prop="productID" label="货品编号"></el-table-column>
                    <el-table-column prop="inAmount" label="输入数量">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.inAmount"
                                      placeholder="请输入" @blur="numberChange(scope.$index,scope.row)"
                                      v-enter-number></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="inUnit" label="选择单位">
                        <!--<template slot-scope="scope">-->
                            <!--<el-select v-model="scope.row.inUnit" placeholder="请选择"-->
                                       <!--@change="UnitChange(scope.$index,scope.row,$event)">-->
                                <!--<el-option-->
                                        <!--v-for="item in scope.row.barCodeList"-->
                                        <!--:key="item.unit"-->
                                        <!--:label="item.unit"-->
                                        <!--:value="item.unit">-->
                                <!--</el-option>-->
                            <!--</el-select>-->
                        <!--</template>-->
                    </el-table-column>
                    <el-table-column prop="maxPrice" label="选择单位单价（元）">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.maxPrice"
                                      placeholder="请输入" @change="priceChange(scope.$index,scope.row)" v-enter-number2></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="unit" label="最小单位"></el-table-column>
                    <el-table-column prop="price" label="最小单价（元）"></el-table-column>
                    <el-table-column prop="amount" label="最小单位数量合计"></el-table-column>
                    <el-table-column prop="cgAmount" label="采购数量"></el-table-column>
                    <el-table-column prop="hasInAmount" label="已入库数量"></el-table-column>
                    <el-table-column prop="totalPrice" label="合计金额（元）"></el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
    import API from "@/api/procurementBusiness";

    export default {
        data() {
            return {
                loading: false,
                selectLoading: false,
                modalLoading: false,
                billID: "", //订单编号
                custID:"",
                custName: "", //供应商
                isConfirm: "", //单据状态
                warehouseName: "", // 收库仓库
                entityName: "", //经手单位
                billDate: "", //开单日期
                verifyDate: "", //到货日期
                remark: "",// 备注
                productList: [], //产品列表
                barCodeList: [],//单位列表
                replenishmentList: [],
            };
        },
        methods: {
            // 单据状态
            formatStatus: function (row) {
              if (row.isConfirm == 0) {
                    return "未入库";
                } else if (row.isConfirm == 1) {
                    return "已入库";
                }  else if (row.isConfirm == 3) {
                    return "已完成";
                } else {
                    return "已发货";
                }
            },
            // 取消
            cancelClick: function () {
                var that = this;
                that.$router.go(-1);
            },
            // 单据作废
            voidClick: function () {
                var that = this;
                that.setConfirmClick(2)
            },
            // 确认入库
            affirmClick: function () {
                var that = this;
                that.setConfirmClick(1)
            },
            setConfirmClick: function (isConfirm) {
                var that = this;
                var params = "";
                if (isConfirm == 1) {
                    params = {
                        custID:that.custID,
                        billID: that.billID,
                        warehouseID: that.warehouseID,
                        billDate: that.billDate,
                        purchaseDEntities: that.replenishmentList,
                    }
                } else {
                    params = {
                        billID: that.billID,
                        isConfirm: isConfirm
                    }
                }
              that.modalLoading = true;
                API.purchasePIOrders(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                           if (isConfirm == 1){
                               that.$message({
                                   message: "入库成功",
                               });
                           } else {
                               that.$message({
                                   message: "已作废",
                               });
                           }
                            that.$router.go(-1);
                        } else {
                            that.$message.error({
                                message: res.message,
                                duration: 2000
                            });
                        }
                    })
                    .finally(function () {
                        that.modalLoading = false;
                    });
            },
            // 数据显示
            handleSearch: function () {
                var that = this;
                that.loading = true;
                var params = {
                    billID: that.billID
                }
                API.purchaseOrderDetails(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            res.data.forEach(function (item) {
                                item.units.forEach(function (u) {
                                    u.amount = u.unitAmount
                                })
                                item.cgAmount=parseInt(item.cgAmount)
                                item.hasInAmount=parseInt(item.hasInAmount)
                                item.barCodeList = item.units;
                                item.quantityAmount = item.stock;
                                item.unitAmount = item.unitAmount;
                                item.totalPrice = (item.amount * item.price).toFixed(2);
                            })
                            that.replenishmentList = res.data;
                        } else {
                            that.$message.error({
                                message: res.message,
                                duration: 2000
                            });
                        }
                    })
                    .finally(function () {
                        that.loading = false;
                    });
            },

            // 数量改变
            numberChange: function (index, row) {
                var that = this;
                that.replenishmentList[index].amount = row.unitAmount * row.inAmount;
                that.replenishmentList[index].price = (row.maxPrice / row.unitAmount).toFixed(2);
                var totalPrice = (row.inAmount * row.maxPrice).toFixed(2);
                that.replenishmentList[index].totalPrice = totalPrice;
                // that.$set(that.replenishmentList[index], 'totalPrice', totalPrice)
            },
            // 默认单位改变
            UnitChange: function (index, row, value) {
                var that = this;
                var unitAmount = "";
                row.barCodeList.forEach(function (item) {
                    if (item.unit == value) {
                        unitAmount = item.amount
                    }
                })
                that.replenishmentList[index].unitAmount = unitAmount;
                that.replenishmentList[index].amount = unitAmount * row.inAmount;
                that.replenishmentList[index].maxPrice = (row.price * row.unitAmount).toFixed(2);
                var totalPrice = (row.price * row.amount).toFixed(2);
                that.replenishmentList[index].totalPrice = totalPrice;

            },

            // 默认单价改变
            priceChange: function (index, row) {
                var that = this;
                if(!(/^\d+(?:\.\d{1,4})?$/).test(row.maxPrice)){
                    that.$message.error({
                        message: "最多只能输入4位小数",
                    });
                    row.maxPrice = (row.maxPrice-0).toFixed(4)
                }
                that.replenishmentList[index].price = (row.maxPrice / row.unitAmount ).toFixed(2);
                var totalPrice = (row.price * row.amount).toFixed(2);
                that.replenishmentList[index].totalPrice = totalPrice;
            },
        },
        mounted() {
            var that = this;
            var detail = that.$route.query.detail;
            that.billID = detail.billID;
            that.custID = detail.custID,
            that.billDate = detail.billDate || "";
            that.warehouseID = detail.warehouseID;
            that.entityName = detail.entityName || "";
            that.custName = detail.custName || "";
            // that.verifyDate = detail.verifyDate || "";
            that.warehouseName = detail.warehouseName || "";
            that.isConfirm = that.formatStatus(detail) || "";
            that.remark = detail.remark || ""
            that.handleSearch();
        }
    };
</script>


<style scoped lang="scss">
</style>
