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
                <el-form :model="ruleForm" ref="ruleForm" :inline="true" class="demo-form-inline">
                    <el-form-item label="订单编号">
                       <el-input class="width_220" v-model="billID"  size="mini" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="单据状态">
                        <el-input v-model="ruleForm.isConfirm" size="mini" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="发货仓库" >
                        <el-input  v-model="ruleForm.stockDest" disabled size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="收货仓库" >
                        <el-input  v-model="ruleForm.warehouseName" disabled size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="客户商" >
                        <el-input  v-model="ruleForm.clientName" disabled size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="经手单位" >
                        <el-input  v-model="ruleForm.entityName" disabled size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="开单日期">
                        <el-date-picker
                                size="mini"
                                v-model="ruleForm.billDate"
                                align="right"
                                type="date"
                                placeholder="选择日期"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="审核日期">
                        <el-date-picker
                                size="mini"
                                v-model="ruleForm.verifyDate"
                                align="right"
                                type="date"
                                placeholder="选择日期"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input type="textarea" v-model="ruleForm.remark" placeholder="请输入100字符以内文字" maxlength="100"
                                  show-word-limit size="mini"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>

        <div class="pad_10 backfff martp_15">
            <div class="pad_10 nav_header">
                <span class="font_14 marrt_20">销售明细</span>
                <!--<el-button type="primary" size="mini" icon="el-icon-document" @click="addProduct">新增</el-button>-->
                <!--<el-button type="primary" size="mini" icon="el-icon-circle-close" @click="cancelProduct">取消-->
                <!--</el-button>-->
                <!--<el-button type="primary" size="mini" icon="el-icon-milk-tea" @click="deleteClick">删除</el-button>-->
                <!--<el-button type="primary" size="mini" icon="el-icon-s-claim">保存</el-button>-->
                <!--<el-button type="primary" size="mini" icon="el-icon-printer">打印</el-button>-->
                <!--<el-button type="primary" size="mini" icon="el-icon-s-unfold">导出</el-button>-->
                <!--<el-button type="primary" size="mini" icon="el-icon-s-fold">导入</el-button>-->
            </div>
            <div>
                <el-table :data="replenishmentList" ref="multipleTable"
                           max-height="400" style="width: 100%">
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column prop="productName" label="货品名称"></el-table-column>
                    <el-table-column prop="productID" label="货品编号"></el-table-column>
                    <el-table-column prop="disctRate" label="折扣率(%)"></el-table-column>
                    <el-table-column prop="inAmount" label="输入数量"></el-table-column>
                    <el-table-column prop="inUnit" label="选择单位"></el-table-column>
                    <el-table-column prop="maxPrice" label="选择单位单价"></el-table-column>
                    <el-table-column prop="unit" label="最小单位"></el-table-column>
                    <el-table-column prop="price" label="最小单价"></el-table-column>
                    <el-table-column prop="amount" label="最小单位数量合计"></el-table-column>
                    <el-table-column prop="totalPrice" label="合计金额"></el-table-column>
                    <el-table-column prop="stock" label="最小单位参考库存"></el-table-column>
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
                tableData: [],
                productID: "",
                replenishmentList: [],
                multipleSelection: [],
                ruleForm: {
                    isConfirm:"", //单据状态
                    warehouseName: "", // 收库仓库
                    stockDest:"",//发货仓库
                    entityName: "",  // 经手单位
                    billDate: new Date(),
                    verifyDate: new Date(),
                    remark: "",
                },
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
                    return "已作废";
                } else if (row.isConfirm == 3) {
                    return "已审核";
                } else if (row.isConfirm == 4) {
                    return "已发货";
                }else {
                    return "已完成";
                }
            },
            // 取消
            cancelClick: function () {
                var that = this;
                that.$router.go(-1);
            },
            // 仓库改变
            warehouseChange:function(){
                var that = this;
                that.replenishmentList = [];
            },
            // 仓库列表
            warehouseData: function () {
                var that = this;
                var params = {
                    Type:3,
                }
                API.warehouseList(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.warehouseList = res.data;
                        } else {
                            that.$message.error({
                                message: res.message,
                                duration: 2000
                            });
                        }
                    })
                   
            },

            // 数据显示
            handleSearch: function () {
                var that = this;
                that.loading = true;
                var params = {
                    billID: that.billID,
                    stockDestID:that.ruleForm.stockDestID
                }
                API.salesQuotationOrders(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            res.data.forEach(function (item) {
                                item.barCodeList = item.units;
                                item.quantityAmount = item.stock;
                                item.totalPrice = (item.inAmount * item.maxPrice * item.disctRate).toFixed(2);
                                item.disctRate = item.disctRate * 100;
                                item.unitAmount = item.unitAmount;
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

        },
        mounted() {
            var that = this;
            var detail = that.$route.query.detail;
            that.billID = detail.billID;
            that.ruleForm.isConfirm = that.formatStatus(detail)  || "";
            that.ruleForm.warehouseName = detail.warehouseName || "";
            that.ruleForm.stockDest = detail.stockDest || "";
            that.ruleForm.stockDestID = detail.stockDestID || "";
            that.ruleForm.clientName = detail.clientName || "";
            that.ruleForm.entityName = detail.entityName || "";
            that.ruleForm.verifyDate = detail.verifyDate || "";
            that.ruleForm.billDate = detail.billDate || "";
            that.ruleForm.remark = detail.remark || ""
            that.handleSearch();

        }
    };
</script>


<style scoped lang="scss">
</style>
