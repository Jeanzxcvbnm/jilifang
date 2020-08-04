<template>
    <div v-loading="loading">
        <div class="pad_5 backfff martp_15">
            <div class="border_bottom pad_20">
                <el-row>
                    <el-col :span="24" >
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
                                <el-button type="primary" size="mini" @click="accountData">开始反结账</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
            <div class="pad_20 backfff">
                <el-table :data="tableData" style="width:100%">
                    <el-table-column prop=""  width="100"></el-table-column>
                    <el-table-column type="index" label="步骤" width="100" ></el-table-column>
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
                tableData:[
                    {name:"解除采购订单结账日期"},
                    {name:"解除采购入库结账日期"},
                    {name:"解除销售出库结账日期"},
                    {name:"解除其他库存结账日期"},
                    {name:"还原新的结账日期"},
                    {name:"还原参考进价"},
                    {name:"解除结账所有账套结账账户"},
                    {name:"更改结账批次标记"},
                    {name:"删除调整过的成本单价数据"},
                    {name:"完成反结账，结账账套解除成功！"}
                ],
                radio:'1',
                billDate:new Date(),

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
            accountData:function () {
                var that = this;
                that.loading = true;
                var data =  util.formatDate.format( new Date(this.billDate), "YMD")
                var params = {
                    batchID:data
                }
                API.getBackAccount(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.account = res.data;
                        } else if(res.stateCode == 200) {
                            that.$message({
                                message: "成功！",
                                duration: 2000
                            });
                        }else {
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
