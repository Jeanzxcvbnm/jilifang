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
                <el-table :data="tableData" style="width:100%">
                    <el-table-column prop="custID" label="编号" width="100" ></el-table-column>
                    <el-table-column prop="name" label="名称" width="150"></el-table-column>
                    <!--<el-table-column prop="active" label="有效性" :formatter="formatStatus" width="100"></el-table-column>-->
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
                <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="供应商编号" prop="custID">
                        <el-input v-model="ruleForm.custID" placeholder="请输入1位大写字母加3位数字组合" :disabled="modalTitle=='编辑'"></el-input>
                    </el-form-item>
                    <el-form-item label="供应商名称" prop="name">
                        <el-input v-model="ruleForm.name" placeholder="请输入"></el-input>
                    </el-form-item>
                    <!--<el-form-item label="有效性" prop="active">-->
                        <!--<el-radio-group v-model="ruleForm.active">-->
                            <!--<el-radio :label=true>是</el-radio>-->
                            <!--<el-radio :label=false>否</el-radio>-->
                        <!--</el-radio-group>-->
                    <!--</el-form-item>-->
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
                paginations: {
                    page: 1, // 当前位于哪页
                    total: 0, // 总数
                    page_size: 10, // 1页显示多少条
                    layout: "total,sizes, prev, pager, next,jumper" // 翻页属性
                },
                ruleForm: {
                    custID: "",
                    name: '',
                    // active: true,

                },
                rules: {
                    custID: [{required: true, message: '请输入供应商编号', trigger: 'blur'},{ pattern: /^[A-Z][0-9]{3}$/, message: '请输入1位大写字母加3位数字组合' }],
                    name: [{required: true, message: '请输入供应商名称', trigger: 'blur'}],
                    // active: [{required: true, message: '请选择有效性', trigger: 'change'}]
                }
            };
        },
        methods: {
            // //状态显示转换
            // formatStatus: function (row) {
            //     return row.active ? "有效" : "无效";
            // },

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
                API.supplierList(params)
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
                that.ruleForm = {
                    custID: "",
                    name: '',
                };
            },
            //编辑
            showEditDialog:  function (row) {
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
                            API.addSupplier(para)
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
                            var params = {
                                custID: para.custID,
                                name: para.name,
                            };
                            API.editSupplier(params)
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
