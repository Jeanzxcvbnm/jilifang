<template>
    <div v-loading="loading">
        <div class="pad_15">
            <el-row>
                <el-col :span="24" class="text_right">
                    <el-button type="primary" size="mini" plain @click="cancelClick">返回</el-button>
                    <el-button type="primary" size="mini" @click="isaddData(2)" :loading="modalLoading">完成盘点
                    </el-button>
                    <el-button type="primary" size="mini" @click="isaddData(1)" :loading="modalLoading">保存</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="pad_5 backfff">
            <div class="pad_5 nav_header">
                <span class="font_14 marrt_20">盘点信息</span>
            </div>
            <div class="nav_header">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :inline="true" class="demo-form-inline">
                    <el-form-item label="盘点仓库" prop="warehouseID">
                        <el-select v-model="ruleForm.warehouseID" filterable placeholder="请选择" size="mini"
                                   @change="warehouseChange">
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
                    <el-form-item label="盘点日期" prop="billDate">
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
                    <el-col :span="14">
                        <span class="font_14 marrt_20">盘点明细</span>
                        <el-button type="primary" size="mini" icon="el-icon-document" @click="addProduct"
                                   v-if="checked">新增
                        </el-button>
                        <el-button type="primary" size="mini" icon="el-icon-circle-close" @click="cancelProduct"
                                   v-if="checked">取消
                        </el-button>
                        <!--<el-button type="primary" size="mini" icon="el-icon-milk-tea" @click="deleteClick">删除</el-button>-->
                        <!--<el-button type="primary" size="mini" icon="el-icon-s-claim">保存</el-button>-->
                        <!--<el-button type="primary" size="mini" icon="el-icon-printer">打印</el-button>-->
                        <!--<el-button type="primary" size="mini" icon="el-icon-s-unfold">导出</el-button>-->
                        <!--<el-button type="primary" size="mini" icon="el-icon-s-fold">导入</el-button>-->
                    </el-col>
                    <el-col :span="10" class="text_right">
                        <el-checkbox v-model="checked" @change="warehouse">0库存不显示</el-checkbox>
                        <el-button type="primary" size="mini" icon="el-icon-document" @click="Access">取数</el-button>
                    </el-col>
                </el-row>
            </div>
            <div>
                <el-table :data="replenishmentList" ref="multipleTable" tooltip-effect="dark"
                          max-height="680" style="width: 100%">
                    <el-table-column type="index" label="序号" width="55"></el-table-column>
                    <el-table-column prop="name" label="名称" width="200">
                        <template slot-scope="scope">
                            <div v-if="scope.row.isTake">{{scope.row.productIDName}}</div>
                            <el-select v-else class="width__fill_available" v-model="scope.row.isAdd" v-loadmore="loadMore"
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
                    <el-table-column prop="Unit" label="最小单位"></el-table-column>
                    <el-table-column prop="oldBalance" label="盘点数量">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.oldBalance" min="0"
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
                <!--<el-button type="primary" size="mini" icon="el-icon-document">打印</el-button>-->
                <!--<el-button type="primary" size="mini" icon="el-icon-s-unfold">导出</el-button>-->
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
                    <el-table-column prop="billDate" label="开单日期">
                        <template slot-scope="scope">
                             <div>{{scope.row.billDate | dateformat('YYYY-MM-DD')}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="stockIOTypeName" label="单据类型"></el-table-column>
                    <el-table-column  prop="Unit" label="单位"></el-table-column>
                    <el-table-column prop="IAmount" label="入库数量"></el-table-column>
                    <el-table-column prop="OAmount" label="出库数量"></el-table-column>
                    <!--<el-table-column prop="entityName" label="往来单位"></el-table-column>-->
                    <el-table-column prop="name" label="制单人"></el-table-column>
                    <el-table-column prop="remark" label="备注"></el-table-column>
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">返 回</el-button>
            </span>
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
                dialogVisible: false,
                modalTitle: "",
                selectPage: 1,
                selectTotal: 0,
                selectName: "",
                tableData: [],
                checked: true,
                productLists: [],
                productID: "",
                warehouseList: [], //仓库列表
                productList: [], //产品列表
                barCodeList: [],//单位列表
                replenishmentList: [],
                multipleSelection: [],//取数数组
                take: false,
                zeroDisplay: "",
                ruleForm: {
                    typeValue: "期初入库",
                    productID: "", // 盘点仓库
                    billDate: new Date(),
                    remark: "",
                    isStatus: "盘点中",
                    empID: "",
                    empName: "",
                },
                rules: {
                    warehouseID: [{required: true, message: '请选择盘点仓库', trigger: 'change'}],
                    billDate: [{required: true, message: '请选择盘点时间', trigger: 'change'}],
                },
                pickerOptions:{
                    disabledDate(time){
                        return   time.getTime() < Date.now() - 8.64e7*6 || time.getTime() > Date.now() + 8.64e7*6;
                    }
                },//时间配置
                getnumber: 0
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
                            let time = new Date()
                            var startDay = Math.floor((new Date().getTime() - res.data.AccountDate) / 86400000)
                            var endDay = Math.floor((new Date().getTime() - res.data.MaxDate) / 86400000)
                            if (time.getTime()<=res.data.MaxDate && time.getTime()>=res.data.AccountDate) {
                                that.ruleForm.billDate = new Date()
                            }else {
                                that.ruleForm.billDate = new Date(res.data.AccountDate + 86400000);
                            }
                            that.pickerOptions = {
                                disabledDate(time) {
                                    return time.getTime() < Date.now() - 8.64e7 * startDay || time.getTime() > Date.now() - 8.64e7 * endDay;
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
            warehouse: function () {
                var that = this;
                // if (that.take == false) {
                //     that.$message.error({
                //         message: "请先取数",
                //         duration: 2000
                //     });
                //     return false;
                // }
                // localStorage.setItem("stockNo", that.checked)
                that.replenishmentList = [];
                that.stockData()
            },

            // 库存展示
            stockData: function () {
                var that = this;
                that.zeroDisplay = "";
                that.loading = true;
                that.productData();

                var params = {
                    warehouseID: that.ruleForm.warehouseID,
                    zeroDisplay: that.checked,
                }
                that.productList = [];
                API.selectNumberByID(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            res.data.forEach(function (item) {
                                item.isTake = true;
                                item.isStatus = 0;
                                item.isGet = true;
                                item.isAdd = item.productID;
                                item.oldBalance = item.amount;
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
                            that.take = true;
                        } else {
                            that.$message.error({
                                message: res.message,
                                duration: 2000
                            });
                        }
                    }).finally(function () {
                      that.loading = false;
                })
                 
            },

            //取数
            Access: function () {
                var that = this;
                if (that.take == true) {
                    that.$message.error({
                        message: '已经取过啦，换个仓库吧',
                        duration: 2000
                    });
                    return false;
                }
                that.productList = [];
                if (that.ruleForm.warehouseID == "" || that.ruleForm.warehouseID == null) {
                    that.$message.error({
                        message: "请选择盘点仓库",
                        duration: 2000
                    });
                    return false;
                }
                that.stockData()
            },
            // 仓库更换
            warehouseChange: function () {
                var that = this;
                that.replenishmentList = [];
                that.take = false;
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
                API.codeProductList2(params)
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
                that.productData()
                that.replenishmentList.unshift(
                    {
                        isTake :false,
                        productID: "",
                        oldBalance: 0,
                        plAmount: "",
                        isStatus: 0,
                        remark: "",
                    }
                )
            },
            // 产品详情
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
                // console.log(that.replenishmentList);
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
                that.replenishmentList[index].plAmount = row.oldBalance - row.amount;
                if (parseFloat(row.oldBalance) > row.amount) {
                    that.replenishmentList[index].stockIOType = 1;
                    that.replenishmentList[index].isStatus = 1;
                } else if (parseFloat(row.oldBalance) < row.amount) {
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
            // 是否可以新增
            isaddData:function(index){
                var that = this;
                var params = {
                    warehouseID:that.ruleForm.warehouseID
                }
                API.statusNot(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                             if(index ==1){
                                 that.saveClick()
                             }else {
                                 that.physicalCount()
                             }
                        }  else {
                            that.$message.error({
                                message: res.message,
                            });
                        }
                    })
                   
            },
            // 新增盘点
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
                            billDate: that.ruleForm.billDate,
                            isStatus: "0",
                            warehouseID: that.ruleForm.warehouseID,
                            empID: that.ruleForm.empName,
                            remark: that.ruleForm.remark,
                            dEntityList: that.replenishmentList
                        }
                        API.insertEntity(params)
                            .then(res => {
                                if (res.stateCode == 100) {
                                    that.$message({
                                        message: res.message,
                                    });
                                    that.$refs["ruleForm"].resetFields();
                                    that.replenishmentList = [];
                                    that.$router.go(-1);
                                }  else {
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

               // 完成盘点
            physicalCount: function () {
                var that = this;
                var save = true;
                that.replenishmentList.forEach(function (item) {
                    if (item.productID == "") {
                        save = false;
                    }
                })
                if (that.replenishmentList.length == 0) {
                    that.$message.error({
                        message: "必须要新增至少1条明细才能完成盘点",
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
                            billDate: that.ruleForm.billDate,
                            isStatus: "0",
                            warehouseID: that.ruleForm.warehouseID,
                            empID: that.ruleForm.empName,
                            remark: that.ruleForm.remark,
                            dEntityList: that.replenishmentList
                        }
                        API.stockInsertOK(params)
                            .then(res => {
                                if (res.stateCode == 100) {
                                    that.$message({
                                        message: res.message,
                                    });
                                    that.$refs["ruleForm"].resetFields();
                                    that.replenishmentList = [];
                                    that.$router.go(-1);
                                }  else {
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
            // 出入库明细
            showDetailed: function (row) {
                var that = this;
                that.modalTitle = row.productIDName;
                that.dialogVisible = true;
                var params = {
                    productID: row.productID,
                    warehouseID:that.ruleForm.warehouseID
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

        },
        mounted() {
            var that = this;
            var empName = JSON.parse(localStorage.getItem("access-user")).empName;
            that.ruleForm.empName = empName;
            that.dateScope();
            that.warehouseData();
            that.productData();
        }
    };
</script>


<style scoped lang="scss">
</style>
