<template>
    <div v-loading="loading">
        <div class="pad_5 backfff">
            <div class="pad_5 nav_header">
                <el-row>
                    <el-col :span="24">
                        <el-form :inline="true" class="demo-form-inline">
                            <el-form-item label="名称">
                                <el-input v-model="name" size="mini" placeholder="请输入" clearable></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" size="mini" @click="handleSearch">搜索</el-button>
                            </el-form-item>
                            <el-form-item style="margin-left: 30px;">
                                <el-button type="primary" size="mini" @click="showAddDialog">新增</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
            <div>
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column prop="warehouseType" label="编号"></el-table-column>
                    <el-table-column prop="name" label="名称"></el-table-column>
                    <el-table-column prop="isPurchase" label="是否允许采购" :formatter="formatStatus1"></el-table-column>
                    <el-table-column prop="isStockIO" label="是否允许调拨" :formatter="formatStatus2"></el-table-column>
                    <el-table-column prop="isSale" label="是否允许销售" :formatter="formatStatus3"></el-table-column>
                    <el-table-column prop="isClearing" label="是否允许结算" :formatter="formatStatus4"></el-table-column>
                    <el-table-column prop="isState" label="是否有效" :formatter="formatState"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                                    type="primary"
                                    size="mini"
                                    @click="showEditDialog(scope.$index,scope.row)"
                            >编辑
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <!-- 弹窗 -->
        <el-dialog :title="modalTitle" :visible.sync="dialogVisible" width="30%">
            <div>
                <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm">
                    <el-form-item label="编号" prop="warehouseType">
                        <el-input v-model="ruleForm.warehouseType" :disabled="modalTitle=='编辑'"
                                  placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="ruleForm.name" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="是否允许采购" prop="isPurchase">
                        <el-radio-group v-model="ruleForm.isPurchase">
                            <el-radio :label=true>是</el-radio>
                            <el-radio :label=false>否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否允许调拨" prop="isStockIO">
                        <el-radio-group v-model="ruleForm.isStockIO">
                            <el-radio :label=true>是</el-radio>
                            <el-radio :label=false>否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否允许销售" prop="isSale">
                        <el-radio-group v-model="ruleForm.isSale">
                            <el-radio :label=true>是</el-radio>
                            <el-radio :label=false>否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否允许结算" prop="isClearing">
                        <el-radio-group v-model="ruleForm.isClearing">
                            <el-radio :label=true>是</el-radio>
                            <el-radio :label=false>否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否有效" prop="isState">
                        <el-radio-group v-model="ruleForm.isState">
                            <el-radio :label=true>是</el-radio>
                            <el-radio :label=false>否</el-radio>
                        </el-radio-group>
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
    import API from "@/api/unitSet";

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
                ruleForm: {
                    warehouseType: "",
                    name: '',
                    isPurchase: true,
                    isStockIO: true,
                    isSale: true,
                    isClearing: true,
                    isState: true,
                },
                rules: {
                    warehouseType: [{required: true, message: '请输入编号', trigger: 'blur'}],
                    name: [{required: true, message: '请输入名称', trigger: 'blur'}],
                    isPurchase: [{required: true, message: '请选择是否允许采购', trigger: 'change'}],
                    isStockIO: [{required: true, message: '请选择是否允许调拨', trigger: 'change'}],
                    isSale: [{required: true, message: '请选择是否允许销售', trigger: 'change'}],
                    isClearing: [{required: true, message: '请选择是否允许结算', trigger: 'change'}],
                    isState: [{required: true, message: '请选择有效性', trigger: 'change'}],
                }
            };
        },
        methods: {
            //状态显示转换
            formatStatus1: function (row, column) {
                return row.isPurchase == true ? "是" : "否";
            },
            formatStatus2: function (row, column) {
                return row.isStockIO == true ? "是" : "否";
            },
            formatStatus3: function (row, column) {
                return row.isSale == true ? "是" : "否";
            },
            formatStatus4: function (row, column) {
                return row.isClearing == true ? "是" : "否";
            },
            formatState: function (row, column) {
                return row.isState == true ? "是" : "否";
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
                    name: that.name,
                }
                API.warehouseTypeList(params)
                    .then(res => {
                        if (res.stateCode == 100) {
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
            // 新增
            showAddDialog: function () {
                var that = this;
                that.dialogVisible = true;
                that.modalTitle = "新增";
                that.ruleForm = {
                    warehouseType: "",
                    name: '',
                    isPurchase: true,
                    isStockIO: true,
                    isSale: true,
                    isClearing: true,
                    isState: true,
                };
            },
            //编辑
            showEditDialog: function (index, row) {
                var that = this;
                that.dialogVisible = true;
                that.modalTitle = "编辑";
                that.ruleForm = Object.assign({}, row);
            },
            //模态窗数据
            addSubmit: function () {
                let that = this;
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        that.modalLoading = true;
                        let para = Object.assign({}, that.ruleForm);
                        if (that.modalTitle == "新增") {
                            API.insertWarehouseType(para)
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
                            API.updateWarehouseType(para)
                                .then(function (res) {
                                    if (res.stateCode === 100) {
                                        that.$message({
                                            showClose: true,
                                            message: "编辑成功",
                                            duration: 2000
                                        });
                                        that.$refs["ruleForm"].resetFields();
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
