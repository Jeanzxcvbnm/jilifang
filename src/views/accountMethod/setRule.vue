<template>
    <div v-loading="loading">
        <div class="pad_5 backfff">
            <div class="pad_5 nav_header">
                <el-row>
                    <el-col :span="22">
                        <el-form :inline="true" class="demo-form-inline">
                            <el-form-item label="名称">
                                <el-input v-model="name" size="mini" placeholder="请输入" clearable></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" size="mini" @click="handleSearch">搜索</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :span="2" class="text_right">
                        <el-button type="primary" size="mini" @click="showAddDialog">新增</el-button>
                    </el-col>
                </el-row>
            </div>
            <div>
                <el-table :data="tableData" style="width:100%">
                    <el-table-column prop="checkRules" label="编号" width="100"></el-table-column>
                    <el-table-column prop="name" label="规则名称" width="200    "></el-table-column>
                    <el-table-column prop="active" label="有效性" :formatter="formatStatus" width="100"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                                    type="primary"
                                    size="mini"
                                    @click="showEditDialog(scope.row)"
                            >编辑
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pad_15 text_right">
                    <el-pagination background
                                   v-if="paginations.total > 0"
                                   @current-change="handleCurrentChange"
                                   @size-change="handleSizeChange"
                                   :current-page.sync="paginations.page"
                                   :page-size="paginations.page_size"
                                   :page-sizes="[10,15,20,30,40,50]"
                                   :layout="paginations.layout"
                                   :total="paginations.total"
                    ></el-pagination>
                </div>
            </div>

        </div>

        <!-- 弹窗 -->
        <el-dialog :title="modalTitle" :visible.sync="dialogVisible" width="40%">
            <div>
                <el-form ref="ruleForms" :model="ruleForms" :rules="rules" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="编号" prop="checkRules">
                        <el-input v-model="ruleForms.checkRules" placeholder="请输入"
                                  :disabled="modalTitle=='编辑'"></el-input>
                    </el-form-item>
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="ruleForms.name" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="规则明细" prop="meiyong">
                        <el-form-item label="PI采购入库">
                            <el-radio-group v-model="stockPI.isType">
                                <el-radio :label="0">入库</el-radio>
                                <el-radio :label="1">出库</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="PO采购退货">
                            <el-radio-group v-model="stockPO.isType">
                                <el-radio :label="0">入库</el-radio>
                                <el-radio :label="1">出库</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="DI盘点入库">
                            <el-radio-group v-model="stockDI.isType">
                                <el-radio :label="0">入库</el-radio>
                                <el-radio :label="1">出库</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="DO调拨出库">
                            <el-radio-group v-model="stockDO.isType">
                                <el-radio :label="0">入库</el-radio>
                                <el-radio :label="1">出库</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="SO销售出库">
                            <el-radio-group v-model="stockSO.isType">
                                <el-radio :label="0">入库</el-radio>
                                <el-radio :label="1">出库</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="SI销售退货">
                            <el-radio-group v-model="stockSI.isType">
                                <el-radio :label="0">入库</el-radio>
                                <el-radio :label="1">出库</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="TO调拨出库">
                            <el-radio-group v-model="stockTOO.isType">
                                <el-radio :label="0">入库</el-radio>
                                <el-radio :label="1">出库</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="TI调拨入库">
                            <el-radio-group v-model="stockTI.isType">
                                <el-radio :label="0">入库</el-radio>
                                <el-radio :label="1">出库</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form-item>

                    <el-form-item label="有效性" prop="active">
                        <el-radio-group v-model="ruleForms.active">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="计价方式">
                        <div>全月平均</div>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" :loading="modalLoading" @click="addSubmit">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import API from "@/api/accountMethod";

    export default {
        data() {
            return {
                loading: false,
                modalLoading: false,
                dialogVisible: false,
                modalTitle: "新增",
                name: "",
                tableData: [],
                //需要给分页组件传的信息
                paginations: {
                    page: 1, // 当前位于哪页
                    total: 0, // 总数
                    page_size: 10, // 1页显示多少条
                    layout: "total,sizes, prev, pager, next,jumper" // 翻页属性
                },
                ruleForms: {
                    checkRules: "",
                    name: "",
                    active: 1,
                },
                stockPI: {stockIOType: 'PI', isType: 1,},
                stockPO: {stockIOType: 'PO', isType: 1,},
                stockDI: {stockIOType: 'DI', isType: 1,},
                stockDO: {stockIOType: 'DO', isType: 1,},
                stockSO: {stockIOType: 'SO', isType: 1,},
                stockSI: {stockIOType: 'SI', isType: 1,},
                stockTOO: {stockIOType: 'TO', isType: 1,},
                stockTI: {stockIOType: 'TI', isType: 1,},
                rules: {
                    checkRules: [{required: true, message: '请输入编号', trigger: 'blur'}],
                    name: [{required: true, message: '请输入名称', trigger: 'blur'}],
                    active: [{required: true, message: '请选择有效性', trigger: 'change'}],
                }
            };
        },
        methods: {
            // //状态显示转换
            formatStatus: function (row) {
                return row.active ? "有效" : "无效";
            },

            // 数据显示
            handleSearch: function () {
                let that = this;
                that.paginations.page = 1;
                that.search();
            },
            // 数据显示
            search: function () {
                let that = this;
                that.loading = true;
                var params = {
                    name: that.name,
                    pageNum: that.paginations.page,
                    pageSize: that.paginations.page_size
                }
                API.checkRulesList(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.tableData = res.data.list;
                            that.paginations.total = res.data.total
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
            // 上下分页
            handleCurrentChange(page) {
                var that = this;
                that.paginations.page = page;
                that.search();
            },
            //每页条数
            handleSizeChange(val) {
                var that = this;
                that.paginations.page_size = val;
                that.search();
            },
            // 新增
            showAddDialog: function () {
                var that = this;
                that.dialogVisible = true;
                that.modalTitle = "新增";
                that.ruleForms = {
                    checkRules: "",
                    name: '',
                    active: 1,
                };
               that .stockPI={stockIOType: 'PI', isType: 1,};

                that .stockPO= {stockIOType: 'PO', isType: 1,};
                that .stockDI= {stockIOType: 'DI', isType: 1,};
                that .stockDO= {stockIOType: 'DO', isType: 1,};
                that .stockSO= {stockIOType: 'SO', isType: 1,};
                that .stockSI= {stockIOType: 'SI', isType: 1,};
                that .stockTOO= {stockIOType: 'TO', isType: 1,};
                that .stockTI= {stockIOType: 'TI', isType: 1,};
            },
            //编辑
            showEditDialog: function (row) {
                var that = this;
                that.dialogVisible = true;
                that.modalTitle = "编辑";
                that.ruleForms = Object.assign({}, row);
                if (row.active == true) {
                    that.ruleForms.active = 1;
                } else {
                    that.ruleForms.active = 0;
                }
                row.list.forEach(function (item) {
                    if (item.stockIOType == "PI") {
                        that.stockPI={
                                isType: item.isType ? 1 : 0,
                                stockIOType: item.stockIOType
                        }
                    } else if (item.stockIOType == "PO") {
                        that.stockPO = {
                                isType: item.isType ? 1 : 0,
                                stockIOType: item.stockIOType
                            }
                    } else if (item.stockIOType == "DI") {
                        that.stockDI = {
                                isType: item.isType ? 1 : 0,
                                stockIOType: item.stockIOType
                            }
                    } else if (item.stockIOType == "DO") {
                        that.stockDO ={
                                isType: item.isType ? 1 : 0,
                                stockIOType: item.stockIOType
                            }
                    } else if (item.stockIOType == "SO") {
                        that.stockSO = {
                                isType: item.isType ? 1 : 0,
                                stockIOType: item.stockIOType
                            }
                    } else if (item.stockIOType == "SI") {
                        that.stockSI = {
                                isType: item.isType ? 1 : 0,
                                stockIOType: item.stockIOType
                            }
                    } else if (item.stockIOType == "TO") {
                        that.stockTOO = {
                                isType: item.isType ? 1 : 0,
                                stockIOType: item.stockIOType
                            }
                    } else if (item.stockIOType == "TI") {
                        that.stockTI = {
                                isType: item.isType ? 1 : 0,
                                stockIOType: item.stockIOType
                            }
                    }
                })
            },
            //模态窗数据
            addSubmit: function () {
                let that = this;
                this.$refs.ruleForms.validate(valid => {
                    if (valid) {
                        that.modalLoading = true;
                        if (that.modalTitle == "新增") {
                            var arr = [];
                            that.stockPI.checkRules = that.ruleForms.checkRules;
                            that.stockPO.checkRules = that.ruleForms.checkRules;
                            that.stockDI.checkRules = that.ruleForms.checkRules;
                            that.stockDO.checkRules = that.ruleForms.checkRules;
                            that.stockSO.checkRules = that.ruleForms.checkRules;
                            that.stockSI.checkRules = that.ruleForms.checkRules;
                            that.stockTOO.checkRules = that.ruleForms.checkRules;
                            that.stockTI.checkRules = that.ruleForms.checkRules;
                            arr[0] = that.stockPI;
                            arr[1] = that.stockPO;
                            arr[2] = that.stockDI;
                            arr[3] = that.stockDO;
                            arr[4] = that.stockSO;
                            arr[5] = that.stockSI;
                            arr[6] = that.stockTOO;
                            arr[7] = that.stockTI;
                            let para = {
                                active: that.ruleForms.active,
                                checkRules: that.ruleForms.checkRules,
                                name: that.ruleForms.name,
                                list: arr,
                            }
                            API.addCheckRule(para)
                                .then(function (res) {
                                    if (res.stateCode === 100) {
                                        that.$message({
                                            showClose: true,
                                            message: "新增成功",
                                            duration: 2000
                                        });
                                        that.search();
                                        that.$refs["ruleForm"].resetFields();
                                    } else {
                                        that.$message.error({
                                            showClose: true,
                                            message: res.message,
                                            duration: 2000
                                        });
                                    }
                                })
                                .finally(function (error) {
                                    that.dialogVisible = false;
                                    that.modalLoading = false;
                                });
                        } else {
                            var arr = [];
                            arr[0] = that.stockPI;
                            arr[1] = that.stockPO;
                            arr[2] = that.stockDI;
                            arr[3] = that.stockDO;
                            arr[4] = that.stockSO;
                            arr[5] = that.stockSI;
                            arr[6] = that.stockTOO;
                            arr[7] = that.stockTI;
                            var params = {
                                active: that.ruleForms.active,
                                checkRules: that.ruleForms.checkRules,
                                name: that.ruleForms.name,
                                list: arr,
                            };
                            API.editCheckRule(params)
                                .then(function (res) {
                                    if (res.stateCode === 100) {
                                        that.$message({
                                            showClose: true,
                                            message: "编辑成功",
                                            duration: 2000
                                        });
                                        that.$refs["ruleForms"].resetFields();
                                        that.search();
                                    } else {
                                        that.$message.error({
                                            showClose: true,
                                            message: res.message,
                                            duration: 2000
                                        });
                                    }
                                })
                                .finally(function (error) {
                                    that.dialogVisible = false;
                                    that.modalLoading = false;
                                });
                        }
                    }
                });
            },
        },
        mounted() {
            var that = this;
            that.handleSearch();
        }
    };
</script>


<style scoped lang="scss">
</style>
