<template>
    <div v-loading="loading">
        <div class="pad_15">
            <el-row>
                <el-col :span="24" class="text_right">
                    <el-button type="primary" size="mini" plain @click="cancelClick">返回</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="pad_5 backfff">
            <div class="pad_5 nav_header">
                <span class="font_14 marrt_20">销售信息</span>
            </div>
            <div class="nav_header">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="订单编号">
                       <el-input size="mini" v-model="billID" disabled class="width_220"></el-input>
                    </el-form-item>
                    <el-form-item label="单据状态">
                        <el-input size="mini" v-model="isConfirm" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="供应商">
                        <el-input size="mini" v-model="custName" disabled></el-input>
                    </el-form-item>

                    <el-form-item label="客户商">
                        <el-input size="mini" v-model="clientName" disabled></el-input>
                    </el-form-item>

                    <el-form-item label="收货仓库">
                        <el-input size="mini" v-model="warehouseName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="发货仓库">
                        <el-input size="mini" v-model="stockDestName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="经手单位">
                        <el-input size="mini" v-model="entityName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="开单日期">
                        <el-date-picker
                                size="mini"
                                v-model="billDate"
                                align="right"
                                type="date"
                                placeholder="选择日期"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="审核日期">
                        <el-date-picker
                                size="mini"
                                v-model="verifyDate"
                                align="right"
                                type="date"
                                placeholder="选择日期"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input type="textarea" v-model="remark" placeholder="请输入100字符以内文字" maxlength="100"
                                  show-word-limit size="mini"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>

        <div class="pad_10 backfff martp_15">
            <div class="pad_10 nav_header">
                <span class="font_14 marrt_20">销售明细</span>
                <!--<el-button type="primary" size="mini" icon="el-icon-printer">打印</el-button>-->
                <!--<el-button type="primary" size="mini" icon="el-icon-s-unfold">导出</el-button>-->
                <!--<el-button type="primary" size="mini" icon="el-icon-s-fold">导入</el-button>-->
            </div>
            <div>
                <el-table :data="tableData" show-summary :summary-method="getSummaries"  max-height="400" style="width: 100%">
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column prop="name" label="货品名称"></el-table-column>
                    <el-table-column prop="productID" label="货品编号"></el-table-column>
                    <el-table-column prop="disctRate" label="折扣率(%)"></el-table-column>
                    <el-table-column prop="inAmount" label="输入数量"></el-table-column>
                    <el-table-column prop="inUnit" label="选择单位"></el-table-column>
                    <el-table-column prop="maxPrice" label="选择单位单价"></el-table-column>
                    <el-table-column prop="unit" label="最小单位"></el-table-column>
                    <el-table-column prop="price" label="最小单价"></el-table-column>
                    <el-table-column prop="amount" label="最小单位数量合计"></el-table-column>
                    <el-table-column prop="totalPrice" label="合计金额"></el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
    import API from "@/api/salesBusiness";
    import util from "@/components/js/util"

    export default {
        data() {
            return {
                loading: false,
                selectLoading: false,
                modalLoading: false,
                billID:"",
                isConfirm:"",//单据状态
                custName:"",//供应商
                clientName:"",//客户商
                warehouseName: "", // 收货仓库
                stockDestName:"", //发货仓库
                entityName:"",//销售部门
                billDate: "",//开单日期
                verifyDate:"", //审核日期
                remark: "",
                tableData: [],

            };
        },
        methods: {
            // 单据状态
            formatStatus: function (row) {
                if (row.isConfirm == 0) {
                    return "未发送";
                } else if (row.isConfirm == 1) {
                    return "未审核";
                } else if (row.isConfirm == 2) {
                    return  "已作废";
                }else if (row.isConfirm == 3) {
                    return  "已审核";
                }else if (row.isConfirm == 4) {
                    return  "已退回";
                }else if (row.isConfirm == 5) {
                    return  "已完成";
                }else if (row.isConfirm == 6) {
                    return  "已复核";
                } else {
                    return  "已完成";
                }
            },
            getSummaries(param) {
                const {columns, data} = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计';
                        return;
                    }
                    const values = data.map(item => Number(item[column.property]));
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return parseFloat((prev + curr).toFixed(2));
                            } else {
                                return prev;
                            }
                        }, 0);
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

            // 数据显示
            handleSearch: function () {
                var that = this;
                that.loading = true;
                var params = {
                    billID: that.billID
                }
                API.getRecheckDetail(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            res.data.forEach(function (item) {
                                item.totalPrice = (item.inAmount * item.maxPrice * item.disctRate).toFixed(2);
                                item.disctRate = item.disctRate * 100;
                            })
                            that.tableData = res.data;
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

        },
        mounted() {
            var that = this;
            var detail = that.$route.query.detail;
            that.billID = detail.billID;
            that.isConfirm = that.formatStatus(detail.isConfirm)  || "";
            that.custName = detail.custName || "";
            that.clientName = detail.clientName || "";
            that.warehouseName = detail.warehouseName || "";
            that.stockDestName = detail.stockDestName || "";
            that.entityName = detail.entityName || "";
            that.billDate = detail.billDate || "";
            that.verifyDate = detail.verifyDate || "";
            that.remark = detail.remark || ""
            that.handleSearch();
        }
    };
</script>


<style scoped lang="scss">
</style>
