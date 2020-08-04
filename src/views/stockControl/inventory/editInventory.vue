<template>
    <div v-loading="loading">
        <div class="pad_15">
            <el-row>
                <el-col :span="24" class="text_right">
                    <el-button type="primary" size="mini" plain @click="cancelClick">返回</el-button>
                    <el-button type="primary" size="mini" plain @click="updateClick" :loading="modalLoading">保存修改
                    </el-button>
                    <el-button type="primary" size="mini" @click="saveClick" :loading="modalLoading">完成盘点</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="pad_5 backfff">
            <div class="pad_5 nav_header">
                <span class="font_14 marrt_20">盘点信息</span>
            </div>
            <div class="nav_header">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :inline="true" class="demo-form-inline">
                    <el-form-item label="订单编号" prop="billID">
                        <el-input  v-model="billID"  size="mini" disabled class="width_220"></el-input>
                    </el-form-item>
                    <el-form-item label="盘点仓库" prop="warehouseID">
                        <el-select v-model="ruleForm.warehouseID" filterable placeholder="请选择" size="mini" disabled>
                            <el-option
                                    v-for="item in warehouseList"
                                    :key="item.warehouseID"
                                    :label="item.name"
                                    :value="item.warehouseID">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="盘点状态" prop="isStatus">
                        <el-input v-model="ruleForm.isStatus" size="mini" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="盘点日期">
                        <el-date-picker
                                size="mini"
                                v-model="ruleForm.billDate"
                                align="right"
                                type="date"
                                placeholder="选择日期"
                                value-format="yyyy-MM-dd"
                                :picker-options="pickerOptions"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <!--<el-form-item label="审核日期">-->
                    <!--<el-date-picker-->
                    <!--size="mini"-->
                    <!--v-model="ruleForm.verifyDate"-->
                    <!--align="right"-->
                    <!--type="date"-->
                    <!--placeholder="选择日期"-->
                    <!--&gt;-->
                    <!--</el-date-picker>-->
                    <!--</el-form-item>-->
                    <el-form-item label="盘点人员">
                        <el-input v-model="ruleForm.empName" disabled size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input type="textarea" v-model="ruleForm.remark" placeholder="请输入100字符以内文字" maxlength="100"
                                  show-word-limit
                                  size="mini"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>

        <div class="pad_10 backfff martp_15">
            <div class="pad_10 nav_header">
                <el-row>
                    <el-col :span="20">
                        <span class="font_14 marrt_20">盘点明细</span>
                        <!--<el-button type="primary" size="mini" icon="el-icon-document" @click="addProduct">新增</el-button>-->
                        <!--<el-button type="primary" size="mini" icon="el-icon-circle-close" @click="cancelProduct">取消-->
                        <!--</el-button>-->
                    </el-col>
                    <!--<el-col :span="3" class="text_right">-->
                    <el-checkbox v-model="checked" @change="warehouse">0库存不显示</el-checkbox>
                    <!--<el-button type="primary" size="mini" icon="el-icon-document" @click="Access">取数</el-button>-->
                    <!--</el-col>-->
                </el-row>
            </div>
            <div>
                <el-table :data="replenishmentList" ref="multipleTable" tooltip-effect="dark"
                          @selection-change="handleSelectionChange" max-height="680" style="width: 100%">
                    <el-table-column type="index" label="序号" width="55"></el-table-column>
                    <el-table-column prop="name" label="名称" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="productID" label="货品编号"></el-table-column>

                    <el-table-column prop="Unit" label="最小单位"></el-table-column>
                    <el-table-column prop=" oldBalance" label="盘点数量">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.oldBalance" type="number" min="0"
                                      placeholder="请输入" @change="numberChange(scope.$index,scope.row)"
                                      v-enter-number></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="amount" label="库存数量"></el-table-column>
                    <el-table-column prop="plAmount" label="盈亏"></el-table-column>
                    <el-table-column prop="stockIOType" label="处理类型" :formatter="formatType"></el-table-column>
                    <el-table-column prop="isStatus" label="处理状态" :formatter="formatState"></el-table-column>
                    <el-table-column prop="remark" label="处理说明">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.remark"
                                      placeholder="请输入处理说明"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="出入库单据">
                        <template slot-scope="scope">
                            <el-button
                                    type="primary"
                                    size="mini"
                                    @click="showDetailed(scope.row)"
                            >出入库明细
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!-- 弹窗 -->
        <el-dialog :title="modalTitle" :visible.sync="dialogVisible" width="50%">
            <!--<div class="pad_10 nav_header">-->
                <!--&lt;!&ndash;<el-button type="primary" size="mini" icon="el-icon-document">打印</el-button>&ndash;&gt;-->
                <!--&lt;!&ndash;<el-button type="primary" size="mini" icon="el-icon-s-unfold">导出</el-button>&ndash;&gt;-->
            <!--</div>-->
            <div>
                <el-table :data="productLists" style="width: 100%" height="400">
                    <el-table-column prop="billID" label="单位编号" width="120">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" :content="scope.row.billID" placement="top-start">
                                <div class="text_nowarp">{{scope.row.billID}}</div>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column prop="billDate" label="开单日期"></el-table-column>
                    <el-table-column prop="stockIOTypeName" label="单据类型"></el-table-column>
                    <el-table-column prop="Unit" label="单位"></el-table-column>
                    <el-table-column prop="IAmount" label="入库数量"></el-table-column>
                    <el-table-column prop="OAmount" label="出库数量"></el-table-column>
                    <!--<el-table-column prop="entityName" label="往来单位"></el-table-column>-->
                    <el-table-column prop="name" label="制单人"></el-table-column>
                    <el-table-column prop="remark" label="备注"></el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">返 回</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import API from "@/api/stockControl";
    import util from "@/components/js/util"

    export default {
        data() {
            return {
                loading: false,
                selectLoading: false,
                modalLoading: false,
                billID: "",
                selectPage: 1,
                productLists: [],
                selectTotal: 0,
                selectName: "",
                tableData: [],
                checked: true,
                productID: "",
                warehouseList: [], //仓库列表
                entityList: [], //经手单位
                productList: [], //产品列表
                barCodeList: [],//单位列表
                replenishmentList: [],
                multipleSelection: [],
                modalTitle: "",
                dialogVisible: false,
                take: false,
                zeroDisplay: "",
                ruleForm: {
                    warehouseID: "", // 入库仓库
                    billDate: "",
                    verifyDate: "",
                    remark: "",
                    isStatus: "盘点中",
                    empName: "",
                },
                rules: {
                    warehouseID: [{required: true, message: '请选择盘点仓库', trigger: 'change'}],
                },
                pickerOptions:{
                    disabledDate(time){
                        return   time.getTime() < Date.now() - 8.64e7*6 || time.getTime() > Date.now() + 8.64e7*6;
                    }
                }//时间配置
            };
        },
        methods: {
            formatState: function (row) {
                if (row.isStatus == 0) {
                    return "未处理";
                } else if (row.isStatus == 1) {
                    return "处理中 ";
                } else {
                    return '正常';
                }
            },
            formatType: function (row) {
                if (row.stockIOType == 0) {
                    return "平仓";
                } else if (row.stockIOType == 1) {
                    return "入库 ";
                } else {
                    return '出库';
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
            //零库存操作
            warehouse: function () {
                var that = this;
                that.replenishmentList = [];
                that.stockData()
            },
            // 库存展示
            stockData: function () {
                var that = this;
                that.zeroDisplay = "";
                that.productData();
                var params = {
                    billID: that.billID,
                    warehouseID: that.ruleForm.warehouseID,
                    zeroDisplay: that.checked,
                }
                that.productList = [];
                API.selectNumberByList(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            res.data.forEach(function (item) {
                                item.isStatus = 0;
                                item.isGet = true;
                                item.isAdd = item.productID;
                                // item.oldBalance = item.amount;
                                item.plAmount = item.oldBalance - item.amount;
                                if(item.oldBalance > item.amount){
                                    item.stockIOType = 1;
                                    item.isStatus = 1;
                                }else if(item.oldBalance < item.amount){
                                    item.stockIOType = -1;
                                    item.isStatus = 1;
                                }else {
                                    item.stockIOType = 0;
                                    item.isStatus = 2;
                                }
                            })
                            that.multipleSelection = res.data;
                            for (var i = 0; i < that.replenishmentList.length; i++) {
                                that.multipleSelection.forEach(function (mult) {
                                    if (that.replenishmentList[i].productID == mult.productID) {
                                        that.replenishmentList.splice(i, 1);
                                    }
                                })
                            }
                            that.replenishmentList.push.apply(that.replenishmentList, that.multipleSelection);
                        } else {
                            that.$message.error({
                                message: res.message,
                                duration: 2000
                            });
                        }
                    })

            },

            // 仓库列表
            warehouseData: function () {
                var that = this;
                API.warehouseList()
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
                    warehouseID: that.ruleForm.warehouseID,
                    pageNum: that.selectPage,
                    keyword: that.selectName,
                    zeroDisplay: that.zeroDisplay,
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
                if (that.selectPage * 10 <= that.selectTotal + 10) {
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
                let that = this;
                that.search();
            },
            // 数据显示
            search: function () {
                let that = this;
                that.loading = true;
                var params = {
                    billID: that.billID,
                    warehouseID: that.ruleForm.warehouseID,
                    zeroDisplay: that.checked,
                }

                API.selectNumberByList(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            res.data.forEach(function (item) {
                                item.isAdd = item.productID;
                                // item.oldBalance = item.oldBalance;
                                item.plAmount = item.oldBalance - item.amount;
                                if(item.oldBalance > item.amount){
                                    item.stockIOType = 1;
                                    item.isStatus = 1;
                                }else if(item.oldBalance < item.amount){
                                    item.stockIOType = -1;
                                    item.isStatus = 1;
                                }else {
                                    item.stockIOType = 0;
                                    item.isStatus = 2;
                                }
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
                that.zeroDisplay = false;
                that.selectPage = 1;
                that.productList = [];
                if (that.ruleForm.warehouseID == "" || that.ruleForm.warehouseID == null) {
                    that.$message.error({
                        message: "请选择盘点仓库",
                        duration: 2000
                    });
                    return false;
                }
                that.productData();
                that.replenishmentList.unshift(
                    {
                        productID: "",
                        oldBalance: "",
                        plAmount: "",
                        isStatus: 0,
                        remark: "",
                    }
                )
            },
            priceDetailData: function (index) {
                var that = this;
                var params = {
                    warehouseID: that.ruleForm.warehouseID,
                    productID: that.productID,
                }
                API.codeProductDetail(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            // that.replenishmentList[index].barCodeList = res.data.barCodeList;
                            that.replenishmentList[index].productID = that.productID;
                            that.replenishmentList[index].Unit = res.data.Unit;
                            that.replenishmentList[index].amount = res.data.quantityAmount;
                            that.replenishmentList[index].oldBalance = res.data.oldBalance;
                            if (that.replenishmentList[index].oldBalance > that.replenishmentList[index].amount) {
                                that.replenishmentList[index].stockIOType = 1;
                                that.replenishmentList[index].isStatus = 1;
                            } else if (that.replenishmentList[index].oldBalance < that.replenishmentList[index].amount) {
                                that.replenishmentList[index].stockIOType = -1;
                                that.replenishmentList[index].isStatus = 1;
                            } else {
                                that.replenishmentList[index].stockIOType = 0;
                                that.replenishmentList[index].isStatus = 2;
                            }
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
                var oldBalance = row.oldBalance - row.amount;
                that.replenishmentList[index].plAmount = oldBalance;
                if (row.oldBalance > row.amount) {
                    that.replenishmentList[index].stockIOType = 1;
                    that.replenishmentList[index].isStatus = 1;
                } else if (row.oldBalance < row.amount) {
                    that.replenishmentList[index].stockIOType = -1;
                    that.replenishmentList[index].isStatus = 1;
                } else {
                    that.replenishmentList[index].stockIOType = 0;
                    that.replenishmentList[index].isStatus = 2;
                }
            },
            // 取消商品
            cancelProduct: function () {
                var that = this;
                if (that.replenishmentList[0].isGet) {
                    that.$message.error({
                        message: "获取的产品不能取消",
                    })
                    return false;
                }
                that.replenishmentList.splice(0, 1);
            },
            updateClick: function () {
                var that = this;
                var save = true;
                that.replenishmentList.forEach(function (item) {
                    if (item.productID == "") {
                        save = false;
                    }
                })
                if (that.replenishmentList.length == 0) {
                    that.$message.error({
                        message: "必须要新增至少1条明细才能保存",
                    });
                    return false;
                }
                if (!save) {
                    that.$message.error({
                        message: "请填写必填项",
                        duration: 2000
                    });
                    return false;
                }

                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        that.modalLoading = true;
                        var params = {
                            billID: that.billID,
                            billDate: that.ruleForm.billDate,
                            warehouseID: that.ruleForm.warehouseID,
                            remark: that.ruleForm.remark,
                            dEntityList: that.replenishmentList
                        }
                        API.updateEntity(params)
                            .then(res => {
                                if (res.stateCode == 100) {
                                    that.$message({
                                        message: res.message,
                                    });
                                    that.$refs["ruleForm"].resetFields();
                                    that.replenishmentList = [];
                                    that.$router.go(-1);
                                } else if (res.stateCode == 110) {

                                    this.$confirm(res.message, '提示', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        type: 'warning'
                                    }).then(() => {
                                        that.check = true
                                        that.saveClick();
                                    })
                                } else {
                                    that.$message.error({
                                        message: res.message,
                                    });
                                }
                            })
                            .finally(function () {
                                that.modalLoading = false;
                            });
                    }
                })

            },
            saveClick: function () {
                var that = this;
                var save = true;
                that.replenishmentList.forEach(function (item) {
                    if (item.productID == "") {
                        save = false;
                    }
                })
                if (that.replenishmentList.length == 0) {
                    that.$message.error({
                        message: "必须要新增至少1条明细才能保存",
                    });
                    return false;
                }
                if (!save) {
                    that.$message.error({
                        message: "请填写必填项",
                        duration: 2000
                    });
                    return false;
                }

                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        that.modalLoading = true;
                        var params = {
                            billID: that.billID,
                            billDate: that.ruleForm.billDate,
                            warehouseID: that.ruleForm.warehouseID,
                            remark: that.ruleForm.remark,
                            dEntityList: that.replenishmentList
                        }
                        API.stockUpdateOK(params)
                            .then(res => {
                                if (res.stateCode == 100) {
                                    that.$message({
                                        message: res.message,
                                    });
                                    that.$refs["ruleForm"].resetFields();
                                    that.replenishmentList = [];
                                    that.$router.go(-1);
                                } else if (res.stateCode == 110) {

                                    this.$confirm(res.message, '提示', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        type: 'warning'
                                    }).then(() => {
                                        that.check = true
                                        that.saveClick();
                                    })
                                } else {
                                    that.$message.error({
                                        message: res.message,
                                    });
                                }
                            })
                            .finally(function () {
                                that.modalLoading = false;
                            });
                    }
                })

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
            //显示出入库明细
            showDetailed: function (row) {
                var that = this;
                that.modalTitle = row.name;
                that.dialogVisible = true;
                var params = {
                    productID: row.productID,
                    warehouseID:that.ruleForm.warehouseID,
                }
                API.selectListInventoty(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.productLists = res.data;
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
            // 多选
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }
        },
        mounted() {
            var that = this;
            that.warehouseData();
            var stockNo = JSON.parse(localStorage.getItem("stockNo")) || "";
            var empName = JSON.parse(localStorage.getItem("access-user")).empName;
            // that.checked = stockNo;
            that.ruleForm.empName = empName
            var detail = that.$route.query.detail;
            that.billID = detail.billID;
            that.ruleForm.warehouseID = detail.warehouseID || "";
            that.ruleForm.billDate=detail.billDate;
            that.ruleForm.remark = detail.remark;
            that.dateScope();
            that.productData();
            that.handleSearch();
        }
    };
</script>


<style scoped lang="scss">

</style>
