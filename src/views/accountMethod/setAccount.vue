<template>
    <div v-loading="loading">
        <div class="pad_5 backfff martp_15">
            <div class="border_bottom pad_20">
                <el-row>
                    <el-col :span="24">
                        <el-form :inline="true" class="demo-form-inline">
                            <el-form-item label="结账日期">
                                <el-date-picker
                                        v-model="billDate"
                                        type="date"
                                        placeholder="选择日期"
                                        size="mini"
                                        disabled>
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" size="mini" @click="accountData">开始结账</el-button>
                            </el-form-item>
                            <!--<el-form-item>-->
                                <!--<el-button type="primary" size="mini" plain>单据自动入库</el-button>-->
                            <!--</el-form-item>-->
                            <!--<el-form-item>-->
                                <!--<el-button type="primary" size="mini" plain>更新实时库存</el-button>-->
                            <!--</el-form-item>-->
                        </el-form>
                    </el-col>
                </el-row>
            </div>
            <div class="pad_20 backfff">
                <el-table :data="tableData" style="width:100%">
                    <el-table-column prop="" width="100"></el-table-column>
                    <el-table-column type="index" label="步骤" width="100"></el-table-column>
                    <el-table-column prop="name" label="内容"></el-table-column>
                </el-table>
            </div>
        </div>

    </div>
</template>

<script>
    import API from "@/api/accountMethod";
    import util from "@/components/js/util"

    export default {
        data() {
            return {
                loading: false,
                tableData: [
                    {name: "检查结账日期是否大于系统日期"},
                    {name: "检查是否重复结账"},
                    {name: "检查期初单据是否已完成，是否异常"},
                    {name: "检查销售单据是否已完成，是否异常"},
                    {name: "检查采购单据是否已完成，是否异常"},
                    {name: "生成本期结账标记"},
                    {name: "清空临时账表和临时成本单价表"},
                    {name: "汇总所有可能的仓库和产品，并初始化期初数据为0"},
                    {name: "更新货品总帐表的期初价格为绝对值"},
                    {name: "更新本期批次"},
                    {name: "设置货品总帐表本期期初的数据，本期入库货品"},
                    {name: "生成本期月移动加权平均仓库成本单价"},
                    {name: "设置销售成本单价和出入库单据的成本单价"},
                    {name: "设置本期入库"},
                    {name: "设置本期出库"},
                    {name: "更新结账周期"},
                    {name: "备份总帐表数据到专有总账历史表"},
                    {name: "检查并更新账套货品价格，检查并备份仓库价格"}
                ],
                account: "",
                radio: '1',
                billDate: new Date(),

            };
        },
        methods: {

            // 数据显示
            search: function () {
                var that = this;
                that.loading = true;
                API.closeDayList()
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.billDate = res.data.maxDate;
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
            // 数据
            accountData: function () {
                var that = this;
                that.loading = true;
                var data =  util.formatDate.format( new Date(this.billDate), "YMD")
                var params = {
                    batchID: data
                }
                API.getAccount(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.account = res.data;
                        } else if (res.stateCode == 200) {
                            that.$message({
                                message: "成功！",
                                duration: 2000
                            });
                        } else {
                            that.$message.error({
                                message: res.message,
                                duration: 5000
                            });
                        }
                    }).finally(function () {
                    that.loading = false;
                });
            }
        },
        mounted() {
            var that = this;
            that.search();
        }
    };
</script>


<style scoped lang="scss">


</style>
