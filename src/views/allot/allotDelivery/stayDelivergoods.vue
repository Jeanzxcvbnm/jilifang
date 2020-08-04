<template>
    <div v-loading="loading">
        <div class="pad_15">
            <el-row>
                <el-col :span="24" class="text_right">
                    <el-button type="primary" size="mini" plain @click="printClick">打印单据</el-button>
                    <el-button type="primary" size="mini" plain @click="cancelClick">返回</el-button>

                    <el-button type="primary" size="mini" @click="affirmClick()" v-if="isConfirm != '3'">确认发货
                    </el-button>
                </el-col>
            </el-row>
        </div>
        <div class="pad_5 backfff">
            <div class="pad_5 nav_header">
                <span class="font_14 marrt_20">调拨信息</span>
            </div>
            <div class="nav_header">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="订单编号">
                        <el-input class="width_220" :value="billID" disabled size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="单据状态">
                        <el-input class="width_220" :value="isState" disabled size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="收货仓库">
                        <el-input class="width_220" :value="warehouseName" disabled size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="发货仓库">
                        <el-input class="width_220" :value="stockDestName" disabled size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="开单日期">
                        <el-date-picker size="mini" v-model="billDate" align="right" type="date"
                                        disabled></el-date-picker>
                    </el-form-item>
                    <el-form-item label="审核日期">
                        <el-date-picker size="mini" v-model="verifyDate" align="right" type="date"
                                        disabled></el-date-picker>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input
                                type="textarea"
                                v-model="remark"
                                disabled
                                placeholder="请输入100字符以内文字"
                                maxlength="100"
                                show-word-limit
                                size="mini"
                        ></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>

        <div class="pad_10 backfff martp_15">
            <div class="pad_10 nav_header">
                <span class="font_14 marrt_20">调拨明细</span>
            </div>
            <div>
                <el-table
                        :data="tableData"
                        show-summary
                        :summary-method="getSummaries"
                        max-height="400"
                        style="width: 100%"
                >
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column prop="productName" label="名称"></el-table-column>
                    <el-table-column prop="productID" label="货品编号"></el-table-column>
                    <el-table-column prop="inAmount" label="出库数量">
                        <template slot-scope="scope">
                            <el-input
                                    v-model="scope.row.inAmount"
                                    placeholder="请输入"
                                    @blur="numberChange(scope.$index,scope.row)"
                                    v-enter-number
                            ></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="applyNum" label="申请数量(最小数量)"></el-table-column>
                    <el-table-column prop="hasOutNum" label="已出库数量(最小数量)"></el-table-column>
                    <el-table-column prop="inUnit" label="选择单位">
                        <!--<template slot-scope="scope">-->
                        <!--<el-select v-model="scope.row.inUnit" placeholder="请选择"-->
                        <!--@change="UnitChange(scope.$index,scope.row,$event)">-->
                        <!--<el-option-->
                        <!--v-for="item in scope.row.units"-->
                        <!--:key="item.unit"-->
                        <!--:label="item.unit"-->
                        <!--:value="item.unit">-->
                        <!--</el-option>-->
                        <!--</el-select>-->
                        <!--</template>-->
                    </el-table-column>
                    <el-table-column prop="maxPrice" label="选择单位单价（元）"></el-table-column>
                    <el-table-column prop="unit" label="最小单位"></el-table-column>
                    <el-table-column prop="price" label="最小单价（元）"></el-table-column>
                    <el-table-column prop="amount" label="最小单位数量合计"></el-table-column>
                    <el-table-column prop="totalPrice" label="合计金额（元）"></el-table-column>
                </el-table>
            </div>
        </div>

        <!--打印显示的东西-->
        <div class="backfff martp_15 none" id="printContent">
            <div class="pad_10">
                <div
                        style="display: flex;justify-content: space-between;font-size: 15px;padding-top: 15px;padding-bottom: 15px;"
                >
                    <div class="con" style="display: flex;width: 50%">
                        <div style="display: inline-block">订单编号：</div>
                        <div style="display: inline-block;padding-left: 20px; ">{{this.billID}}</div>
                    </div>

                    <div style="display: inline-block;width: 50%">
                        <div style="display: inline-block;">开单时间：</div>
                        <div
                                style=" display: inline-block;padding-left: 20px; display: inline-block; padding-right: 20px;"
                        >{{this.billDate}}
                        </div>
                    </div>
                </div>

                <div
                        style="display: flex;justify-content: space-between;font-size: 15px;padding-top: 15px;padding-bottom: 15px;"
                >
                    <div class="con" style="display: inline-block;width: 50%">
                        <div style="display: inline-block;">发货仓库：</div>
                        <div style="display: inline-block;padding-left: 20px; ">{{this.stockDestName}}</div>
                    </div>
                    <div class="con" style="display: flex;width: 50%">
                        <div style="display: inline-block;">收获仓库：</div>
                        <div style="display: inline-block;padding-left: 20px;  ">{{this.warehouseName}}</div>
                    </div>
                </div>
                <div
                        style="display: flex;justify-content: space-between;font-size: 15px;padding-top: 15px;padding-bottom: 15px;"
                >
                    <div style="display: inline-block;width: 50%">
                        <div style="display: inline-block;">制单人：</div>
                        <div
                                style="display: inline-block;padding-left: 20px; padding-right: 20px;"
                        >{{this.accountName}}
                        </div>
                    </div>
                    <div style="display: inline-block;width: 50%">
                        <div style="display: inline-block;">单据状态：</div>
                        <div
                                style="display: inline-block;padding-left: 20px; padding-right: 20px;"
                        >{{this.isState}}
                        </div>
                    </div>
                </div>
                <div
                        style="display: flex;justify-content: space-between;font-size: 15px;padding-top: 15px;padding-bottom: 15px;"
                >
                    <div style="display: inline-block;width: 100%">
                        <div style="display: inline-block;">备注：</div>
                        <div
                                style="display: inline-block;padding-left: 20px; padding-right: 20px;"
                        >{{this.remark}}
                        </div>
                    </div>
                </div>
            </div>
            <el-table
                    :data="tableData"
                    show-summary
                    :summary-method="getSummaries"
                    max-height="400"
                    style="width: 100%;"
            >
                <el-table-column prop="productID" label="编号"></el-table-column>
                <el-table-column prop="productName" label="品名"></el-table-column>
                <el-table-column prop="inUnit" label="单位"></el-table-column>
                <el-table-column prop="inAmount" label="数量/本次数量"></el-table-column>
                <el-table-column prop="price" label="销售单价"></el-table-column>
                <el-table-column prop="totalPrice" label="销售金额"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import API from "@/api/allot";
    import printJS from "print-js";

    export default {
        data() {
            return {
                loading: false,
                billID: "", //订单编号
                isState: "", //单据状态
                isConfirm: "",
                warehouseID: "", // 收库仓库
                warehouseName: "",
                stockDestName: "", //发货仓库
                warehouseList: [], //仓库列表
                billDate: "",
                verifyDate: "",
                remark: "",
                tableData: [],
                accountName: "",
            };
        },
        methods: {
            // 单据状态
            formatStatus: function (row) {
                if (row.isConfirm == 1) {
                    return "待发货";
                } else if (row.isConfirm == 4) {
                    return "已发货";
                } else {
                    return "已完成";
                }
            },
            //单据打印
            printClick() {
                printJS({
                    printable: "printContent",
                    type: "html",
                    scanStyles: false,
                    header: "调拨出库单",
                    headerStyle: "text-align:center;font-size:18px",
                    style:
                        "table tr td,th { padding: 15px;text-align:center;} .el-table__footer-wrapper{margin-top:40px}",
                    // targetStyles: ["*"],
                });
            },
            getSummaries(param) {
                const {columns, data} = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = "合计";
                        return;
                    }
                    if (index == 3 || index == 7 || index == 9) {
                        sums[index] = "";
                        return;
                    }
                    const values = data.map((item) => Number(item[column.property]));
                    if (!values.every((value) => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return parseFloat((prev + curr).toFixed(2));
                            } else {
                                return prev;
                            }
                        }, 0);
                        if (index === 11) {
                            sums[index] = sums[index].toFixed(2);
                        }
                        // sums[index] += ' 元';
                    } else {
                        // sums[index] = 'N/A';
                    }
                });

                return sums;
            },

            // 取消
            cancelClick: function () {
                var that = this;
                that.$router.go(-1);
            },
            // 仓库列表
            warehouseData: function () {
                var that = this;
                var params = {
                    Type: 2,
                };
                API.warehouseList(params).then((res) => {
                    if (res.stateCode == 100) {
                        that.warehouseList = res.data;
                    } else {
                        that.$message.error({
                            message: res.message,
                            duration: 2000,
                        });
                    }
                });
            },
            // 数据显示
            handleSearch: function () {
                var that = this;
                that.loading = true;
                var params = {
                    billID: that.billID,
                };
                API.getStockOrdersDetails(params)
                    .then((res) => {
                        if (res.stateCode == 100) {
                            res.data.forEach(function (item) {
                                item.units.forEach(function (u) {
                                    if (item.inUnit == u.unit) {
                                        item.unitAmount = u.unitAmount;
                                    }
                                });
                                console.log(item);
                                item.totalPrice = (
                                    item.unitAmount *
                                    item.price *
                                    item.inAmount
                                ).toFixed(2);
                                item.maxPrice = (item.price * item.unitAmount).toFixed(2);
                                item.amount = item.inAmount * item.unitAmount;
                            });
                            that.tableData = res.data;
                        } else {
                            that.$message.error({
                                message: res.message,
                                duration: 2000,
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
                if (row.inAmount < 1) {
                    that.$message.error({
                        message: "数量不能为0",
                        duration: 2000,
                    });
                    row.inAmount = 1;
                }
                that.tableData[index].amount = row.unitAmount * row.inAmount;
                that.tableData[index].price = (row.maxPrice / row.unitAmount).toFixed(2);
                var totalPrice = (row.inAmount * row.maxPrice).toFixed(2);
                that.tableData[index].totalPrice = totalPrice;
            },
            // 默认单位改变
            UnitChange: function (index, row, value) {
                var that = this;
                var unitAmount = "";
                row.units.forEach(function (item) {
                    if (item.unit == value) {
                        unitAmount = item.unitAmount;
                    }
                });
                that.tableData[index].unitAmount = unitAmount;
                that.tableData[index].amount = unitAmount * row.inAmount;
                that.tableData[index].maxPrice = (row.price * row.unitAmount).toFixed(2);
                var totalPrice = (row.inAmount * row.maxPrice).toFixed(2);
                that.tableData[index].totalPrice = totalPrice;
            },
            // 确认发货
            affirmClick: function () {
                var that = this;
                that.loading = true;
                var params = {
                    billID: that.billID,
                    warehouseID: that.warehouseID,
                    productList: that.tableData,
                };
                API.getDeliveryConfirm(params)
                    .then((res) => {
                        if (res.stateCode == 100) {
                            that.$message({
                                message: "发货成功",
                            });
                            that.$router.push({path: "/allot/allotDelivery/allotDelivery"});
                        } else {
                            that.$message.error({
                                message: res.message,
                                duration: 2000,
                            });
                        }
                    })
                    .catch(() => {
                        that.$message.error({
                            message: "网络连接失败，请稍后再试！",
                            duration: 2000,
                        });
                    })
                    .finally(function () {
                        that.loading = false;
                    });
            },
        },
        mounted() {
            var that = this;
            var detail = that.$route.query.detail;
            that.billID = detail.billID;
            that.warehouseID = detail.warehouseID || "";
            that.warehouseName = detail.warehouseName || "";
            that.stockDestName = detail.stockDestName || "";
            that.billDate = detail.billDate || "";
            that.verifyDate = detail.verifyDate || "";
            that.isState = that.formatStatus(detail) || "";
            that.isConfirm = detail.isConfirm;
            that.remark = detail.remark || "";
            that.accountName = JSON.parse(localStorage.getItem("access-user")).empName;
            that.warehouseData();
            that.handleSearch();
        },
    };
</script>


<style scoped lang="scss">
    .none {
        width: 70%;
        position: absolute;
        top: -10000px;
    }
</style>
