<template>
    <div v-loading="loading">
        <div class="pad_10_15">
            <el-row>
                <el-col :span="24" class="text_right">
                    <el-button type="primary" size="mini" plain @click="cancelClick">返回</el-button>
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
                        <el-input  v-model="isConfirm" disabled size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="供应商">
                        <el-input v-model="custName" size="mini" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="收货仓库" >
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
                <el-table :data="tableData" show-summary :summary-method="getSummaries" max-height="400" style="width: 100%">
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column prop="name" label="名称"></el-table-column>
                    <el-table-column prop="productID" label="货品编号"></el-table-column>
                    <el-table-column prop="inAmount" label="输入数量"></el-table-column>
                    <el-table-column prop="inUnit" label="选择单位"></el-table-column>
                    <el-table-column prop="maxPrice" label="选择单位单价（元）"></el-table-column>
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
                billID: "", //订单编号
                custName:"", //供应商
                isConfirm: "", //单据状态
                warehouseName: "", // 收库仓库
                entityName:"", //经手单位
                warehouseList: [], //仓库列表
                billDate: "", //开单日期
                verifyDate:"", //到货日期
                remark: "",// 备注
                tableData: [],
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
            getSummaries(param) {
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计';
                        return;
                    }
                    if (index==2||index == 3 || index == 5 || index == 7) {
                        sums[index] = '';
                        return
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
                        if (index===11){
                            sums[index]=sums[index].toFixed(2)
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
                that.$router.go(-1)
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
                                item.totalPrice = (item.hasInAmount * item.maxPrice).toFixed(2);
                                item.cgAmount=parseInt(item.cgAmount)
                                item.hasInAmount=parseInt(item.hasInAmount)
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
            that.billDate = detail.billDate || "";
            that.warehouseID=detail.warehouseID;
            that.entityName = detail.entityName || "";
            that.custName = detail.custName || "";
            that.verifyDate = detail.verifyDate || "";
            that.warehouseName = detail.warehouseName || "";
            that.isConfirm = that.formatStatus(detail)  || "";
            that.remark = detail.remark || ""
            that.handleSearch();
        }
    };
</script>


<style scoped lang="scss">
</style>
