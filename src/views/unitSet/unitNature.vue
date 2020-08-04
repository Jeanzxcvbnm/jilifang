
<template>
    <div v-loading="loading">
        <div class="pad_15 backfff">
            <div class="pad_15 nav_header">
                <el-row>
                    <el-col :span="22">
                        <el-form :inline="true" class="demo-form-inline">
                            <el-form-item label="名称">
                                <el-input v-model="name" placeholder="请输入"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" size="mini">搜索</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :span="2" class="text_right">
                        <el-button type="primary" size="mini" @click="showAddDialog">新增</el-button>
                    </el-col>
                </el-row>
            </div>
            <div>
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column prop="serialNumber" label="编号"></el-table-column>
                    <el-table-column prop="name" label="名称"></el-table-column>
                    <el-table-column prop="status" label="有效性"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                                    type="primary"
                                    size="mini"
                                    @click="showEditDialog(scope.$index,scope.row)"
                            >编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <!-- 弹窗 -->
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
            <div>
                <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="编号" prop="serialNumber">
                        <el-input v-model="ruleForm.serialNumber" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="名称" prop="name">
                        <el-input  v-model="ruleForm.name" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="有效性" prop="status">
                        <el-radio-group v-model="ruleForm.status">
                            <el-radio label="0">是</el-radio>
                            <el-radio label="1">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">保 存</el-button>
      </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                loading: false,
                dialogVisible: false,
                name: "",
                tableData: [
                    {
                        serialNumber:'001',
                        name:"肯定不是方便大家拜年的空间拜访客户上班看到就发给v看到就回宾馆",
                        status:"1"
                    },
                    {
                        serialNumber:'001',
                        name:"rhdsef",
                        status:"1"
                    },
                    {
                        serialNumber:'001',
                        name:"rhdsef",
                        status:"1"
                    }
                ],
                //需要给分页组件传的信息
                ruleForm: {
                    serialNumber:"",
                    name: '',
                    status: '0',

                },
                rules: {
                    serialNumber: [{ required: true, message: '请输入编号', trigger: 'blur' }],
                    name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
                    status: [{required: true, message: '请选择有效性', trigger: 'change' }]
                }
            };
        },
        methods: {
            //状态显示转换
            formatStatus: function(row, column) {
                return row.status == "1" ? "有效" : "无效";
            },

            // 数据显示
            handleSearch: function() {
                let that = this;
                that.paginations.page = 1;
                that.search();
            },
            // 数据显示
            search: function() {
                let that = this;
                that.loading = true;
            },
            // 新增
            showAddDialog: function() {
                var that = this;
                that.dialogVisible = true;
            },
            //编辑
            showEditDialog: function(index, row) {
                var that = this;
                that.dialogVisible = true;
                that.ruleForm = row;
            },
        },
        mounted() {}
    };
</script>


<style scoped lang="scss">
</style>
