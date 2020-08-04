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
                <span class="font_14 marrt_20">调拨信息</span>
            </div>
            <div class="nav_header">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="订单编号" prop="billID">
                        <el-input  v-model="billID"  size="mini" disabled class="width_220"></el-input>
                    </el-form-item>
                    <el-form-item label="发货仓库">
                        <el-input :value ="srcWarehouseID" disabled size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="收货仓库">
                        <el-input :value ="warehouseID" disabled size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="开单日期">
                        <el-date-picker
                                size="mini"
                                v-model="billDate"
                                align="right"
                                type="date"
                                disabled
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="备注" >
                        <el-input type="textarea" v-model="remark" disabled placeholder="请输入" size="mini"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>

        <div class="pad_10 backfff martp_15">
            <div class="pad_10 nav_header">
                <span class="font_14 marrt_20">调拨明细</span>
            </div>
            <div>
                <el-table :data="tableData" show-summary :summary-method="getSummaries" max-height="400" style="width: 100%">
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column prop="productName" label="名称"></el-table-column>
                    <el-table-column prop="productID" label="货品编号"></el-table-column>
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

    import API from "@/api/allot";

    export default {
        data() {
            return {
                loading: false,
                billID: "",
                srcWarehouseID:"", //发货仓库
                warehouseID: "", // 补货仓库
                billDate: "",
                remark: "",
                tableData: [],
            };
        },
        methods: {
            getSummaries(param) {
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计';
                        return;
                    }
                    if(index==3 ||index==5 ||index==7){
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
                        if (index===9){
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
                API.allotApplyDetails(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            res.data.forEach(function (item) {
                                item.totalPrice = (item.inAmount * item.maxPrice).toFixed(2);
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
            that.srcWarehouseID = detail.srcWarehouseName || "",
            that.warehouseID = detail.warehouseName || "";
            that.billDate = detail.billDate || "";
            that.remark = detail.remark || ""
            that.handleSearch();
        }
    };
</script>


<style scoped lang="scss">
</style>
