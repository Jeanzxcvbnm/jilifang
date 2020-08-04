<template>
    <div v-loading="loading">
        <div class="pad_10_15">
            <el-row>
                <el-col :span="24" class="text_right">
                    <el-button type="primary" size="mini" plain @click="cancelClick">返回</el-button>
                    <el-button type="primary" size="mini" plain @click="cancellationClick">单据退回</el-button>
                    <el-button type="primary" size="mini" @click="affirmClick">确认复核</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="pad_5 backfff">
            <div class="pad_5 nav_header">
                <span class="font_14 marrt_20">采购信息</span>
            </div>
            <div class="nav_header">
                <el-form :model="ruleForm" ref="ruleForm" :inline="true" class="demo-form-inline">
                    <el-form-item label="订单编号">
                        <el-input class="width_220" v-model="billID" disabled size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="订单状态">
                        <el-input v-model="ruleForm.isConfirm" disabled size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="供应商">
                        <el-input v-model="ruleForm.custName" disabled size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="客户商">
                        <el-input v-model="ruleForm.clientName" disabled size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="发货仓库">
                        <el-input v-model="ruleForm.stockDest" disabled size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="收货仓库">
                        <el-input v-model="ruleForm.warehouseName" disabled size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="经手单位">
                        <el-input v-model="ruleForm.entityName" disabled size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="开单日期">
                        <el-date-picker
                                size="mini"
                                v-model="ruleForm.billDate"
                                align="right"
                                type="date"
                                disabled
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="审核日期">
                        <el-date-picker
                                size="mini"
                                v-model="ruleForm.verifyDate"
                                align="right"
                                type="date"
                                value-format="yyyy-MM-dd"
                                :default-value="defaultValue"
                                :picker-options="pickerOptions"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input type="textarea" v-model="ruleForm.remark" disabled size="mini"></el-input>
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
                <el-table :data="replenishmentList" ref="multipleTable" tooltip-effect="dark"
                          @selection-change="handleSelectionChange" max-height="400" style="width: 100%">
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column prop="name" label="名称"></el-table-column>
                    <el-table-column prop="productID" label="货品编号"></el-table-column>
                    <el-table-column prop="disctRate" label="折扣率"></el-table-column>
                    <el-table-column prop="inAmount" label="输入数量"></el-table-column>
                    <el-table-column prop="inUnit" label="选择单位"></el-table-column>
                    <el-table-column prop="maxPrice" label="选择单位单价（元）"></el-table-column>
                    <el-table-column prop="unit" label="最小单位"></el-table-column>
                    <el-table-column prop="price" label="最小单价（元）"></el-table-column>
                    <el-table-column prop="amount" label="最小单位数量合计"></el-table-column>
                    <el-table-column prop="totalPrice" label="合计金额（元）"></el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
    import API from "@/api/procurementBusiness";
    import util from "@/components/js/util"

    export default {
        data() {
            return {
                loading: false,
                selectLoading: false,
                modalLoading: false,
                billID: "",
                custID: "",
                isConfirm: "", //单据状态
                selectPage: 1,
                selectTotal: 0,
                selectName: "",
                tableData: [],
                productID: "",
                stockTotype: "",
                replenishmentList: [],
                ruleForm: {
                    warehouseID: "", // 收货仓库
                    srcWarehouseID: "",  // 发货仓库
                    billDate: new Date(),
                    verifyDate: "",
                    remark: "",
                },
                defaultValue: "", //默认显示时间
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7 * 6 || time.getTime() > Date.now() + 8.64e7 * 6;
                    }
                }//时间配置
            };
        },
        methods: {
            // 单据状态
            formatStatus: function (row) {
                if (row.isConfirm == 1) {
                    return "未审核";
                } else if (row.isConfirm == 3) {
                    return "已审核";
                } else if (row.isConfirm == 2) {
                    return "已作废";
                } else if (row.isConfirm == 4) {
                    return "已退回";
                } else if (row.isConfirm == 6) {
                    return "已复核";
                } else if (row.isConfirm == 5) {
                    return "已完成"
                }
            },
            // 取消
            cancelClick: function () {
                var that = this;
                that.$router.go(-1);
            },
            // 获取时间范围
            dateScope: function () {
                var that = this;
                API.getDateScope()
                    .then(res => {
                        if (res.stateCode == 100) {
                            console.log(res)
                            var startDay = Math.floor((new Date().getTime() - res.data.AccountDate) / 86400000)
                            var endDay = Math.floor((new Date().getTime() - res.data.MaxDate) / 86400000)
                            that.defaultValue = new Date(res.data.AccountDate + 86400000);
                            that.pickerOptions = {
                                disabledDate(time) {
                                    return time.getTime() < Date.now() - 8.64e7 * startDay || time.getTime() > Date.now() - 8.64e7 * endDay;
                                }
                            }
                        } else {
                            that.$message.error({
                                message: res.message,
                                duration: 2000
                            });
                        }
                    })
            },
            // 单据退回
            cancellationClick: function () {
                var that = this;
                that.setConfirmClick(4)
            },
            // 确认复核
            affirmClick: function () {
                var that = this;
                that.setConfirmClick(5)
            },
            setConfirmClick: function (isConfirm) {
                var that = this;
                var params = {
                    billID: that.billID,
                    custID: that.custID,
                    isConfirm: isConfirm,
                    warehouseID: that.ruleForm.warehouseID,
                    billDate: that.ruleForm.billDate,
                    verifyDate: that.ruleForm.verifyDate,
                    stockTotype: that.stockTotype,
                }
                API.verifyPIOrders(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.$message({
                                message: res.message,
                            });
                            that.$router.go(-1);
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
            // 数据显示
            handleSearch: function () {
                var that = this;
                that.loading = true;
                var params = {
                    billID: that.billID
                }
                API.PIOrdersDetails(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            res.data.forEach(function (item) {
                                item.totalPrice = (item.inAmount * item.maxPrice).toFixed(2);
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
            // 删除
            deleteClick: function () {
                var that = this;
                if (that.multipleSelection == "") {
                    that.$message.error({
                        message: "请选择要删除的选项",
                        duration: 2000
                    });
                } else {
                    for (var i = 0; i < that.replenishmentList.length; i++) {
                        that.multipleSelection.forEach(function (item) {
                            if (that.replenishmentList[i].productID == item.productID) {
                                that.replenishmentList.splice(i, 1);
                            }
                        })
                    }
                }
            },
            // 多选
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }
        },
        mounted() {
            var that = this;
            var detail = that.$route.query.detail;
            that.billID = detail.billID;
            that.custID = detail.custID;
            that.ruleForm.billDate = detail.billDate || "";
            that.ruleForm.entityName = detail.entityName || "";
            that.ruleForm.custName = detail.custName || "";
            that.ruleForm.verifyDate = detail.verifyDate || "";
            that.ruleForm.warehouseName = detail.warehouseName || "";
            that.ruleForm.stockDest = detail.stockDest || "";
            that.ruleForm.clientName = detail.clientName || "";
            that.ruleForm.isConfirm = that.formatStatus(detail) || "";
            that.ruleForm.remark = detail.remark || "";
            that.dateScope();
            that.handleSearch();
        }
    };
</script>


<style scoped lang="scss">
</style>
