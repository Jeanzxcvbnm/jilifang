<template>
    <div v-loading="loading">
        <div class="pad_15">
            <el-row>
                <el-col :span="24" class="text_right">
                    <el-button type="primary" size="mini" plain @click="cancelClick">返回</el-button>
                    <el-button type="primary" size="mini" @click="affirmClick(4)">订单退回</el-button>
                    <el-button type="primary" size="mini" v-if="isEdit" @click="affirmClick(5)">订单完成</el-button>
                    <el-button type="primary" size="mini" @click="affirmClick(6)">订单复核</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="pad_5 backfff">
            <div class="pad_5 nav_header">
                <span class="font_14 marrt_20">销售信息</span>
            </div>
            <div class="nav_header">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :inline="true" class="demo-form-inline">
                    <el-form-item label="订单编号">
                        <el-input size="mini" v-model="billID" disabled class="width_220"></el-input>
                    </el-form-item>
                    <el-form-item label="单据状态">
                        <el-input size="mini" v-model="ruleForm.isConfirm" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="供应商">
                        <el-input size="mini" v-model="ruleForm.custName" disabled></el-input>
                    </el-form-item>

                    <el-form-item label="客户商">
                        <el-input size="mini" v-model="ruleForm.clientName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="发货仓库" prop="stockDestID">
                        <el-select v-model="ruleForm.stockDestID" filterable placeholder="请选择" size="mini">
                            <el-option
                                    v-for="item in warehouseList"
                                    :key="item.warehouseID"
                                    :label="item.name"
                                    :value="item.warehouseID">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="收货仓库" prop="warehouseName">
                        <el-input size="mini" v-model="ruleForm.warehouseName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="经手单位" prop="entityID">
                        <el-select v-model="ruleForm.entityID" filterable clearable placeholder="请选择" size="mini">
                            <el-option
                                    v-for="item in entityList"
                                    :key="item.entityID"
                                    :label="item.name"
                                    :value="item.entityID">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="开单日期">
                        <el-date-picker
                                size="mini"
                                v-model="ruleForm.billDate"
                                align="right"
                                type="date"
                                placeholder="选择日期"
                                :picker-options="pickerOptions"
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
                                value-format="yyyy-MM-dd"
                                :default-value="defaultValue"
                                :picker-options="pickerOptions"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input type="textarea" v-model="ruleForm.remark" disabled placeholder="请输入" size="mini"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>

        <div class="pad_10 backfff martp_15">
            <div class="pad_10 nav_header">
                <span class="font_14 marrt_20">销售明细</span>
                <el-button type="primary" size="mini" icon="el-icon-document" @click="addProduct">新增</el-button>
                <el-button type="primary" size="mini" icon="el-icon-circle-close" @click="cancelProduct">取消
                </el-button>
                <el-button type="primary" size="mini" icon="el-icon-milk-tea" @click="deleteClick">删除</el-button>
                <!--<el-button type="primary" size="mini" icon="el-icon-printer">打印</el-button>-->
                <!--<el-button type="primary" size="mini" icon="el-icon-s-unfold">导出</el-button>-->
                <!--<el-button type="primary" size="mini" icon="el-icon-s-fold">导入</el-button>-->
            </div>
            <div>
                <el-table :data="replenishmentList" ref="multipleTable" tooltip-effect="dark"
                          @selection-change="handleSelectionChange" max-height="400" style="width: 100%">
                    <el-table-column type="index" label="序号" width="55"></el-table-column>
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="name" label="货品名称" width="200">
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
                    <el-table-column prop="disctRate" label="折扣率(%)"></el-table-column>
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
                    <el-table-column prop="maxPrice" label="选择单位单价">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.maxPrice"
                                      placeholder="请输入" @change="priceChange(scope.$index,scope.row)" v-enter-number2></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="unit" label="最小单位"></el-table-column>
                    <el-table-column prop="price" label="最小单价"></el-table-column>
                    <el-table-column prop="amount" label="最小数量"></el-table-column>
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
                isEdit:true,
                billID:"",
                clientID:"", //客户商id
                selectPage: 1,
                selectTotal: 0,
                selectName: "",
                productID: "",
                entityList: [], //经手单位
                supplierList: [],//供应商列表
                clientList:[], //客户商
                warehouseList: [], //仓库列表
                productList: [], //产品列表
                barCodeList: [],//单位列表
                replenishmentList: [],
                multipleSelection: [],
                ruleForm: {
                    isConfirm:"",//单据状态
                    custName:"",//供应商
                    clientName:"",//客户商
                    warehouseName: "", // 收货仓库
                    stockDestID: "",  // 发货仓库
                    entityID:"",//经手单位部门
                    billDate: "",//开单日期
                    verifyDate:"", //审核日期
                    remark: "",
                },
                rules: {
                    warehouseID: [{required: true, message: '请选择收货仓库', trigger: 'change'}],
                    stockDestID: [{required: true, message: '请选择发货仓库', trigger: 'change'}],
                    entityID: [{required: true, message: '请选择经手单位', trigger: 'change'}],
                },
                defaultValue:"", //默认显示时间
                pickerOptions:{
                    disabledDate(time){
                        return   time.getTime() < Date.now() - 8.64e7*6 || time.getTime() > Date.now() + 8.64e7*6;
                    }
                }//时间配置
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
            // 取消
            cancelClick: function () {
                var that = this;
                that.$router.go(-1);
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
                            that.ruleForm.billDate = new Date(res.data.AccountDate+86400000);
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
            //供应商
            siteCustomerData: function () {
                var that = this;
                API.siteCustomerList()
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.supplierList = res.data;
                        } else {
                            that.$message.error({
                                message: res.message,
                                duration: 2000
                            });
                        }
                    })
                   
            },
            // 经手单位列表
            entityData: function () {
                var that = this;
                API.entityList()
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.entityList = res.data;
                        } else {
                            that.$message.error({
                                message: res.message,
                                duration: 2000
                            });
                        }
                    })
                    .catch(() => {
                        that.$message.error({
                            message: "网络连接失败，请稍后再试！",
                            duration: 2000
                        });
                    })
            },
            // 客户商列表
            clientData: function () {
                var that = this;
                API.getClientList()
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.clientList = res.data;
                        } else {
                            that.$message.error({
                                message: res.message,
                                duration: 2000
                            });
                        }
                    })
                    .catch(() => {
                        that.$message.error({
                            message: "网络连接失败，请稍后再试！",
                            duration: 2000
                        });
                    })
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

            // 产品列表
            productData: function () {
                var that = this;
                var params = {
                    warehouseID:that.ruleForm.srcWarehouseID,
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
                                item.isAdd = item.productID;
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

            // 新增商品
            addProduct: function () {
                var that = this;
                that.selectPage = 1;
                that.productList = [];
                if(that.ruleForm.stockDestID =="" || that.ruleForm.stockDestID == null){
                    that.$message.error({
                        message: "请选择发货仓库",
                        duration: 2000
                    });
                    return false;
                }
                that.productData();
                that.replenishmentList.unshift(
                    {
                        isAdd: "",
                        productID: "",
                        inAmount: 1,
                        disctRate: 100,
                        quantityAmount: "必填",
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
                    warehouseID: that.ruleForm.stockDestID,
                    productID: that.productID,
                }
                API.codeProductDetail(params)
                    .then(res => {
                        if (res.stateCode == 100) {

                            that.replenishmentList[index].barCodeList = res.data.barCodeList;
                            that.replenishmentList[index].productID = that.productID;
                            that.replenishmentList[index].inAmount = 1;
                            that.replenishmentList[index].disctRate = 100;
                            that.replenishmentList[index].quantityAmount = res.data.quantityAmount;
                            that.replenishmentList[index].maxPrice = (res.data.price * res.data.amount).toFixed(2);
                            that.replenishmentList[index].inUnit = res.data.inUnit;
                            that.replenishmentList[index].amount = res.data.amount;
                            that.replenishmentList[index].unitAmount = res.data.amount;
                            that.replenishmentList[index].unit = res.data.unit;
                            that.replenishmentList[index].price = res.data.price;
                            that.replenishmentList[index].totalPrice = (res.data.amount * res.data.price).toFixed(2);
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
                that.isEdit = false;
                that.clearDetail(index);
                that.productID = row.isAdd;
                that.replenishmentList.forEach(function (item) {
                    if (item.productID == row.isAdd) {
                        addProduct = false;
                    }
                })
                if (addProduct) {
                    that.priceDetailData(index)
                } else {
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
                that.replenishmentList[index].disctRate = 100;
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
                that.replenishmentList[index].price = (row.maxPrice / row.unitAmount).toFixed(2);
                var totalPrice = (row.inAmount * row.maxPrice).toFixed(2);
                that.replenishmentList[index].totalPrice = totalPrice;

            },

            // 最小单价改变
            priceChange: function (index, row) {
                var that = this;
                if(!(/^\d+(?:\.\d{1,4})?$/).test(row.maxPrice)){
                    that.$message.error({
                        message: "最多只能输入4位小数",
                    });
                    row.maxPrice = (row.maxPrice-0).toFixed(4)
                }
                that.replenishmentList[index].price = (row.maxPrice / row.unitAmount).toFixed(2);
                var totalPrice = (row.inAmount * row.maxPrice).toFixed(2);
                that.replenishmentList[index].totalPrice = totalPrice;
            },
            // 取消商品
            cancelProduct: function () {
                var that = this;
                that.replenishmentList.splice(0, 1);
            },

            // [单据退回][确认完成][单据复核]
            affirmClick:function(isConfirm){
                var that = this;
                var save = true;
                if(that.ruleForm.stockDestID=='' || that.ruleForm.stockDestID ==null){
                    that.$message.error({
                        message: "请选择发货仓库",
                        duration: 2000
                    });
                    return false;
                }
                if(that.ruleForm.entityID =='' || that.ruleForm.entityID == null){
                    that.$message.error({
                        message: "请选择经手人",
                        duration: 2000
                    });
                    return false;
                }
                that.replenishmentList.forEach(function (item) {
                    if (item.productID == "") {
                        save = false;
                    }
                })
                if (!save) {
                    that.$message.error({
                        message: "请填写必填项",
                        duration: 2000
                    });
                    return false;
                }
                this.$confirm('确认审核订单, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        that.loading = true;
                        var params = {
                            clientID:that.clientID,
                            billID:that.billID,
                            isConfirm:isConfirm,
                            stockDest:that.ruleForm.stockDestID,
                            entityID:that.ruleForm.entityID,
                            billDate:that.ruleForm.billDate,
                            verifyDate:that.ruleForm.verifyDate,
                            orderDEntities:that.replenishmentList
                        }
                        API.getConfirm(params)
                            .then(res => {
                                if (res.stateCode == 100) {
                                    that.$message({
                                        message: "审核成功",
                                    });
                                    that.$router.go(-1)
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
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消审核'
                        });
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
            that.clientID = detail.clientID;
            that.ruleForm.isConfirm = that.formatStatus(detail.isConfirm)  || "";
            that.ruleForm.custName = detail.custName || "";
            that.ruleForm.clientName = detail.clientName || "";
            that.ruleForm.warehouseName = detail.warehouseName || "";
            that.ruleForm.stockDestID = detail.stockDestID || "";
            that.ruleForm.entityID = detail.entityID || "";
            that.ruleForm.billDate = detail.billDate || "";
            that.ruleForm.verifyDate = detail.verifyDate || "";
            that.ruleForm.remark = detail.remark || "";
            that.dateScope();
            that.handleSearch();
            that.warehouseData();
            that.productData();
            that.siteCustomerData()
            that.entityData();
            that.clientData();
        }
    };
</script>


<style scoped lang="scss">
</style>
