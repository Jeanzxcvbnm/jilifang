<template>
    <div v-loading="loading">
        <div class="pad_15">
            <el-row>
                <el-col :span="24" class="text_right">
                    <el-button type="primary" size="mini" plain @click="cancelClick">返回</el-button>
                    <el-button type="primary" size="mini" @click="affirmClick" v-loading="modalLoading"  v-if="!cancels">取消审核</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="pad_5 backfff">
            <div class="pad_5 nav_header">
                <span class="font_14 marrt_20">期初信息</span>
            </div>
            <div class="nav_header">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item  label="订单编号">
                        <el-input :value="billID" disabled size="mini" style="width: 200px;"></el-input>
                    </el-form-item>
                    <el-form-item label="单据状态">
                        <el-input :value="isConfirm" disabled size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="经手单位">
                        <el-input :value ="entityID" disabled size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="出入类型">
                        <el-input :value ="typeValue" disabled size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="入库仓库">
                        <el-input :value ="warehouseID" disabled size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" >
                        <el-input type="textarea" v-model="remark" disabled placeholder="请输入" size="mini"></el-input>
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
                    <el-form-item label="审核日期" >
                        <el-date-picker
                                size="mini"
                                v-model="verifyDate"
                                align="right"
                                type="date"
                                value-format="yyyy-MM-dd"
                                :default-value="defaultValue"
                                :picker-options="pickerOptions"
                        >
                        </el-date-picker>
                    </el-form-item>
                </el-form>
            </div>
        </div>

        <div class="pad_10 backfff martp_15">
            <div class="pad_10 nav_header">
                <span class="font_14 marrt_20">期初明细</span>
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
    import API from "@/api/stockControl";

    export default {
        data() {
            return {
                loading: false,
                modalLoading:false,
                billID: "",
                typeValue: "",
                warehouseID: "", // 入库仓库
                entityID: "",  // 经手单位
                isConfirm:"",
                billDate: "",
                verifyDate:"",
                remark: "",
                tableData: [],
                cancels:"",
                defaultValue:"", //默认显示时间
                pickerOptions:{
                    disabledDate(time){
                        return   time.getTime() < Date.now() - 8.64e7*6 || time.getTime() > Date.now() + 8.64e7*6;
                    }
                }//时间配置
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
                    if (index === 2||index === 3||index === 5||index === 7) {
                        sums[index] = '';
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
            formatStatus:function(row){
                if(row.isConfirm==0){
                    return "未审核";
                }else{
                    return "已审核";
                }
            },
            // 取消
            cancelClick: function () {
                var that = this;
                that.$router.go(-1)
            },
            // 获取时间范围
            dateScope:function(){
                var that = this;
                API.getDateScope()
                    .then(res => {
                        if (res.stateCode == 100) {
                            console.log(res)
                            var startDay = Math.floor((new Date().getTime() - res.data.AccountDate ) / 86400000 )
                            var endDay =  Math.floor((new Date().getTime() - res.data.MaxDate ) / 86400000)
                            that.defaultValue = new Date(res.data.AccountDate+86400000);
                            that.pickerOptions ={
                                disabledDate(time){
                                    return   time.getTime() < Date.now() - 8.64e7*startDay || time.getTime() > Date.now() - 8.64e7*endDay;
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
            // 数据显示
            handleSearch: function () {
                var that = this;
                that.loading = true;
                var params = {
                    billID: that.billID
                }
                API.getOrdersDetails(params)
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
            //判断取消按钮
            cancel:function(){
                var that = this;
                var params={
                    billID:that.billID,
                }
                API.cancle(params)
                    .then(res=>{
                        if(res.stateCode==100){
                             that.cancels=res.data;
                        }else{
                            that.$message.error({
                                message:res.message,
                                duration:2000
                            })
                        }
                    })
                    .finally(function(){
                        that.loading=false;
                    })
            },
            affirmClick:function(){
                var that = this;
                that.$confirm('确认取消审核此订单？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.modalLoading = true;
                        var params={
                            billID:that.billID,
                            isConfirm:"3",
                            verifyDate:that.verifyDate,
                            productList:that.tableData
                        }
                        API.Cancelreview(params)
                            .then(res=>{
                                if(res.stateCode==100){
                                    that.$message({
                                        message:"取消成功"
                                    })
                                    that.$router.go(-1);
                                }else{
                                    that.$message.error({
                                        message:res.message
                                    })
                                }
                            })
                            .finally(function(){
                                that.modalLoading=false;
                            })
                    }).catch(() => {

                    });

            }

        },
        mounted() {
            var that = this;
            var detail = that.$route.query.detail;
            that.billID = detail.billID;
            that.warehouseID = detail.warehouseName || "";
            that.entityID = detail.entityName || "";
            that.billDate = detail.billDate || "";
            that.verifyDate = detail.verifyDate || "";
            that.isConfirm = that.formatStatus(detail)  || "";
            that.remark = detail.remark || "";
            that.typeValue = detail.stockIOTypeName;
            that.dateScope();
            that.handleSearch();
            that.cancel();
        }
    };
</script>


<style scoped lang="scss">
</style>
