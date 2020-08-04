<template>
    <div v-loading="loading">
        <div>
            <Header></Header>
        </div>
        <div class="pad_15 backfff content">
            <div class="pad_15 nav_header">
                <el-row>
                    <el-col :span="12">
                      <div class="pad_0_15 color_blue font_16 font_weight_600">角色权限</div>
                    </el-col>
                    <el-col :span="10" :pull="1" class="text_right">
                             <el-button type="primary" size="mini" @click="showAddDialog">新增</el-button>
                    </el-col>
                </el-row>
            </div>
            <div>
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column prop="jobTitleID" label="编号"></el-table-column>
                    <el-table-column prop="name" label="名称"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                                    type="primary"
                                    size="mini"
                                    @click="showEditDialog(scope.row)"
                            >修改名称
                            </el-button>
                            <el-button
                                    type="primary"
                                    size="mini"
                                    @click="authorityClick(scope.row)"
                            >业务系统权限
                            </el-button>
                            <el-button
                                    type="primary"
                                    size="mini"
                                    @click="initializeCLick(scope.row)"
                            >初始化系统权限
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
        <el-dialog :title="modalTitle" :visible.sync="dialogVisible" width="30%">
            <div>
                <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm">
                    <el-form-item label="角色编号" prop="jobTitle">
                        <el-input v-model="ruleForm.jobTitle" maxlength="4" placeholder="请输入1位大写字母加3位数字组合"  :disabled="modalTitle=='编辑'"></el-input>
                    </el-form-item>
                    <el-form-item label="角色名称" prop="name">
                        <el-input v-model="ruleForm.name" maxlength="5" placeholder="请输入"></el-input>
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
    import Header from "@/components/common/Header1.vue";
    import API from "@/api/authoritySet";

    export default {
        components: {
            Header
        },
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
                    jobTitle: "",
                    name: '',

                },
                rules: {
                    jobTitle: [{required: true, message: '请输入编号', trigger: 'blur'}],
                    name: [{required: true, message: '请输入名称', trigger: 'blur'}],
                }
            };
        },
        methods: {

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
                    pageNum:that.paginations.page,
                    pageSize: that.paginations.page_size,
                }
                API.getRole(params)
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
                    jobTitle: "",
                    name: '',
                };
            },
            //编辑
            showEditDialog: function (row) {
                var that = this;
                that.dialogVisible = true;
                that.modalTitle = "编辑";
                that.ruleForm ={
                    jobTitle: row.jobTitleID,
                    name: row.name,
                }
            },

            // 系统权限
            authorityClick:function(item){
               var that = this;
                that.$router.push({path:"/authoritySet/roleSet",query:{jobTitleID:item.jobTitleID,name:item.name}})
            },
            // 初始化系统权限
            initializeCLick:function(item){
                var that = this;
                that.$router.push({path:"/authoritySet/initialize",query:{jobTitleID:item.jobTitleID,name:item.name}})
            },
            //模态窗数据
            addSubmit: function () {
                let that = this;
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        that.modalLoading = true;
                        let para = Object.assign({}, that.ruleForm);
                        if (that.modalTitle == "新增") {
                            API.addRole(para)
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
                                .finally(function () {
                                    that.dialogVisible = false;
                                    that.modalLoading = false;
                                });
                        } else {
                            API.editRole(para)
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
    .content{
        width: 80%;
        margin: 0 auto;
    }
</style>
