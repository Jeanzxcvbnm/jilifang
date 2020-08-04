<template>
    <div v-loading="loading">
        <div class="pad_15">
            <el-row>
                <el-col :span="24" class="text_right">
                    <el-button type="primary" size="mini" plain @click="cancelClick">返回</el-button>
                    <el-button type="primary" size="mini" @click="affirmClick">确认审核</el-button>
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
                        <el-input :value="billID" disabled size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="单据状态">
                        <el-input :value="isConfirm"  disabled size="mini"></el-input>
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
                <el-button type="primary" size="mini" icon="el-icon-document" @click="addProduct">新增</el-button>
                <el-button type="primary" size="mini" icon="el-icon-circle-close" @click="cancelProduct">取消
                </el-button>
                <el-button type="primary" size="mini" icon="el-icon-milk-tea" @click="deleteClick">删除</el-button>
                <!--<el-button type="primary" size="mini" icon="el-icon-s-claim">打印</el-button>-->
            </div>
            <div>
                <el-table :data="replenishmentList" ref="multipleTable" tooltip-effect="dark"
                          @selection-change="handleSelectionChange" max-height="400" style="width: 100%">
                    <el-table-column type="index" label="序号" width="55"></el-table-column>
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="name" label="名称" width="200">
                        <template slot-scope="scope">
                            <el-select class="width__fill_available" v-model="scope.row.isAdd" v-loadmore="loadMore"
                                       filterable remote reserve-keyword :remote-method="remoteMethod"
                                        placeholder="请选择" @change="productChange(scope.$index,scope.row)"
                            >
                                <el-option
                                        v-for="item in productList"
                                        :key="item.productID"
                                        :label="item.name"
                                        :value="item.productID">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="productID" label="货品编号"></el-table-column>
                    <el-table-column prop="inAmount" label="输入数量">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.inAmount"
                                      placeholder="请输入" @blur="numberChange(scope.$index,scope.row)"
                                      v-enter-number></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="inUnit" label="选择单位">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.inUnit" placeholder="请选择"
                                       @change="UnitChange(scope.$index,scope.row,$event)">
                                <el-option
                                        v-for="item in scope.row.barCodeList"
                                        :key="item.unit"
                                        :label="item.unit"
                                        :value="item.unit">
                                </el-option>
                            </el-select>
                        </template>
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
                selectLoading: false,
                modalLoading: false,
                selectPage: 1,
                selectTotal: 0,
                selectName: "",
                multipleSelection: [],
                billID: "",
                typeValue: "",
                warehouseID: "", // 入库仓库
                entityID: "",  // 经手单位
                isConfirm:"",
                billDate: "",
                verifyDate:"",
                remark: "",
                tableData: [],
                replenishmentList:[],
                productList: [], //产品列表
                barCodeList: [],//单位列表
                productID: "",
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
                                item.units.forEach(function (u) {
                                    u.amount = u.unitAmount
                                })
                                item.barCodeList = item.units;
                                item.totalPrice = (item.inAmount * item.maxPrice).toFixed(2);
                                item.unitAmount = item.unitAmount;
                                item.isAdd = item.productID;
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
            // 产品列表
            productData: function () {
                var that = this;
                var params = {
                    pageNum: that.selectPage,
                    keyword: that.selectName
                }
                API.codeProductList(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.productList.push.apply(that.productList, res.data.list)
                            that.selectTotal = res.data.total;
                        } else {
                            that.$message.error({
                                message: res.message,
                                duration: 2000
                            });
                        }
                    })
                  
            },
            // select 滑动选择
            loadMore: function () {
                var that = this;
                // that.selectLoading = true;
                that.selectPage++;
                if (that.selectPage * 10 <= that.selectTotal+10) {
                    that.productData()
                }
            },

            // 远程搜索
            remoteMethod(query) {
                var that = this;
                that.productList = [];
                that.selectPage = 1;
                that.selectName = query.trim();
                that.selectLoading = true;
                setTimeout(() => {
                    that.selectLoading = false;
                    that.productData()
                }, 200);

            },
            // 新增商品
            addProduct: function () {
                var that = this;
                  that.selectPage = 1;
                that.productList = [];
                that.productData();
                that.replenishmentList.unshift(
                    {
                        isAdd:"",
                        productID: "",
                        inAmount: 1,
                        maxPrice: "必填",
                        inUnit: "必填",
                        amount: "必填",
                        unit: "必填",
                        price: "必填",
                        totalPrice: "必填"
                    }
                )
            },
            priceDetailData: function (index) {
                var that = this;
                var params = {
                    productID: that.productID,
                }
                API.codeProductDetail(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.replenishmentList[index].barCodeList = res.data.barCodeList;
                            that.replenishmentList[index].productID = that.productID;
                            that.replenishmentList[index].inAmount = 1;
                            that.replenishmentList[index].maxPrice = res.data.POMaxPrice;
                            that.replenishmentList[index].inUnit = res.data.inUnit;
                            that.replenishmentList[index].amount = res.data.amount;
                            that.replenishmentList[index].unitAmount = res.data.amount;
                            that.replenishmentList[index].unit = res.data.unit;
                            that.replenishmentList[index].price = res.data.POPrice;
                            that.replenishmentList[index].totalPrice = (res.data.amount * res.data.POPrice).toFixed(2);
                        } else {
                            that.$message.error({
                                message: res.message,
                                duration: 2000
                            });
                        }
                    })
                
            },
            // 选择商品
            productChange: function (index, row) {
                var that = this;
                var addProduct = true;
                that.clearDetail(index);
                that.productID = row.isAdd;
                that.replenishmentList.forEach(function (item) {
                    if(item.productID == row.isAdd){
                        addProduct = false;
                    }
                })
                if(addProduct){
                    that.priceDetailData(index)
                }else {
                    that.$message.error({
                        message: "不能重复添加！",
                    });
                }
                 that.selectName = "";
                that.productData();
            },
                       // 清空详情数据
            clearDetail: function (index) {
                var that = this;
                that.replenishmentList[index].productID = "";
                that.replenishmentList[index].inAmount = 1;
                that.replenishmentList[index].quantityAmount = "必填";
                that.replenishmentList[index].maxPrice = "必填";
                that.replenishmentList[index].inUnit = "必填";
                that.replenishmentList[index].amount = "必填";
                that.replenishmentList[index].unit = "必填";
                that.replenishmentList[index].price = "必填";
                that.replenishmentList[index].totalPrice = "必填";
            },
            // 数量改变
            numberChange: function (index, row) {
                var that = this;
                if(row.inAmount<=0){
                    row.inAmount = 1;
                    that.$message.error({
                        message: "数量最小为1",
                    });
                }
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
                that.replenishmentList[index].maxPrice = (row.price *row.unitAmount).toFixed(2);
                var totalPrice = (row.price *row.amount).toFixed(2);
                that.replenishmentList[index].totalPrice = totalPrice;

            },

            // 最小单价改变
            priceChange:function(index, row){
                var that = this;
                if(!(/^\d+(?:\.\d{1,4})?$/).test(row.maxPrice)){
                    that.$message.error({
                        message: "最多只能输入4位小数",
                    });
                    row.maxPrice = (row.maxPrice-0).toFixed(4)
                }
                that.replenishmentList[index].price = (row.maxPrice / row.unitAmount ).toFixed(2);
                var totalPrice = (row.price *row.amount).toFixed(2);
                that.replenishmentList[index].totalPrice = totalPrice;
            },
            // 取消商品
            cancelProduct: function () {
                var that = this;
                that.replenishmentList.splice(0, 1);
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
            },
                  // 确认审核
            affirmClick :function () {
                var that = this;
                 var productList = [];
                that.replenishmentList.forEach(function (item) {
                    productList.push({productID:item.productID,amount:item.amount,unit:item.unit,price:item.price,inUnit:item.inUnit,inAmount:item.inAmount,maxPrice:item.maxPrice})
                })
                that.$confirm('确认审核此订单？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        var params = {
                            billID: that.billID,
                            isConfirm: "0",
                            verifyDate:that.verifyDate,
                            productList:productList,
                        }
                        API.ConfirmationReview(params)
                            .then(res=>{
                                if(res.stateCode==100){
                                    that.$message({
                                        message:"审核成功",
                                    })
                                    that.$router.go(-1);
                                }else{
                                    that.message.error({
                                        message:res.message,
                                        duration:2000
                                    })
                                }
                            })
                            .finally(function(){
                                that.loading=false;
                            })
                    })
                    .catch(() => {
                        that.$message({
                            type: 'info',
                            message: '已取消审核'
                        });
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
            that.isConfirm = that.formatStatus(detail)  || "";
            that.remark = detail.remark || ""
            that.typeValue = detail.stockIOTypeName;
            if (that.formatStatus(detail)==='未审核'){
                that.verifyDate=new Date();
            }else{
                that.verifyDate = detail.verifyDate || "";
            }
            that.dateScope();
            that.handleSearch();
            that.productData();
        }
    };
</script>


<style scoped lang="scss">
</style>
