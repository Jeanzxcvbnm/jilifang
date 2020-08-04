
<template>
    <div v-loading="loading">
        <div class="pad_5 backfff">
            <div class="pad_5 nav_header">
                <el-row>
                    <el-col :span="24">
                        <el-form :inline="true" class="demo-form-inline">
                            <el-form-item label="单位名称">
                                <el-input v-model="name" placeholder="请输入" size="mini"></el-input>
                            </el-form-item>
                            <el-form-item label="单位性质">
                                <el-select v-model="unitNatureValue" placeholder="请选择" size="mini" clearable>
                                    <el-option
                                            v-for="item in unitNatureList"
                                            :key="item.custProperty"
                                            :label="item.custPropertyName"
                                            :value="item.custProperty">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="单位类型">
                                <el-select v-model="typeValue" placeholder="请选择" size="mini" clearable>
                                    <el-option
                                            v-for="item in typeList"
                                            :key="item.custType"
                                            :label="item.typeName"
                                            :value="item.custType">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="有效性">
                                <el-select v-model="effectiveValue" placeholder="请选择" size="mini">
                                    <el-option
                                            v-for="item in effectiveList"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" size="mini" @click="handleSearch">搜索</el-button>
                            </el-form-item>
                            <!--<el-form-item>-->
                                <!--<el-button type="primary" size="mini">导出</el-button>-->
                            <!--</el-form-item>-->
                            <el-form-item style="margin-left: 30px;">
                                <el-button type="primary" size="mini" @click="showAddDialog">新增</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
            <div>
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column prop="siteIDName" label="所属账套"></el-table-column>
                    <el-table-column prop="custID" label="单位编号"></el-table-column>
                    <el-table-column prop="name" label="单位名称"></el-table-column>
                    <el-table-column prop="custPropertyName" label="单位性质"></el-table-column>
                    <el-table-column prop="typeName" label="类型"></el-table-column>
                    <el-table-column prop="active" label="有效性" :formatter="formatStatus"></el-table-column>
                    <el-table-column prop="isGlobal" label="属性" :formatter="formatIsGlobal">
                    </el-table-column>
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
        <el-dialog :title="modalTitle" :visible.sync="dialogVisible" width="50%">
            <div>
                <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="单位性质 :" prop="custProperty">
                                <el-select v-model="ruleForm.custProperty" placeholder="请选择单位性质" class="width__fill_available">
                                    <el-option
                                            v-for="item in unitNatureList"
                                            :key="item.custProperty"
                                            :label="item.custPropertyName"
                                            :value="item.custProperty">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="单位编号 :" prop="custID">
                                <el-input v-model="ruleForm.custID" placeholder="请输入4位数字编码" :disabled="modalTitle == '编辑'"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="单位类型 :" prop="custType">
                                <el-select v-model="ruleForm.custType" placeholder="请选择单位类型" class="width__fill_available">
                                    <el-option
                                            v-for="item in typeList"
                                            :key="item.custType"
                                            :label="item.typeName"
                                            :value="item.custType">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="单位名称 :" prop="name">
                                <el-input  v-model="ruleForm.name" placeholder="请选择单位名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="拼音简码 :">
                                <el-input  v-model="ruleForm.pym" placeholder="请输入拼音简码"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="邮政编码 :" >
                                <el-input  v-model="ruleForm.postalCode" placeholder="请输入邮政编码"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="所属账套 :" prop="siteID">
                                <el-select v-model="ruleForm.siteID" placeholder="请选择所属账套" class="width__fill_available" :disabled="modalTitle == '编辑'">
                                    <el-option
                                            v-for="item in ownershipList"
                                            :key="item.siteID"
                                            :label="item.name"
                                            :value="item.siteID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="联系手机 :" >
                                <el-input  v-model="ruleForm.mobile" placeholder="请输入联系手机"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="联系人 :" >
                                <el-input  v-model="ruleForm.contacts" placeholder="请输入联系人"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="注册日期 :">
                                <el-date-picker
                                        width="100%"
                                        v-model="ruleForm.joinDate"
                                        align="right"
                                        type="date"
                                        placeholder="选择日期"
                                        disabled
                                >
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="有效性 :" prop="active">
                                <el-radio-group v-model="ruleForm.active">
                                    <el-radio :label=true>是</el-radio>
                                    <el-radio :label=false>否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="属性 :" prop="isGlobal">
                                <el-radio-group v-model="ruleForm.isGlobal">
                                    <el-radio :label=false>私有</el-radio>
                                    <el-radio :label=true>公有</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="备注 :" >
                                <el-input type="textarea"  v-model="ruleForm.remark" placeholder="请输入100字符以内文字" maxlength="100"
                                  show-word-limit  :rows="3" ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
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
    import util from "@/components/js/util"
    export default {
        data() {
            return {
                loading: false,
                dialogVisible: false,
                modalLoading:false,
                modalTitle:"",
                name: "",
                unitNatureValue:"",                //单位性质列表
                typeValue:"",
                effectiveValue:"",
                effectiveList:[
                    {name: "否", id: 0},
                    {name: "是", id: 1},
                    {name: "全部", id: ""},
                ],
                unitNatureList:[],
                //单位类型列表
                typeList:[],
                //所属账套列表
                ownershipList:[ ],
                tableData: [],
                //需要给分页组件传的信息
                paginations: {
                    page: 1, // 当前位于哪页
                    total: 0, // 总数
                    page_size: 10, // 1页显示多少条
                    layout: "total,sizes, prev, pager, next,jumper" // 翻页属性
                },
                ruleForm: {
                    siteID:"",
                    custProperty:"",//单位性质
                    custType:"",//单位类型
                    custID:"",//单位编号
                    name: '',
                    pym:"",
                    postalCode:"",//邮政编码
                    contacts:"",//联系人
                    mobile:"",//联系手机
                    active: true,
                    isGlobal:true,
                    joinDate:new Date(),
                    remark:"",
                },
                rules: {
                    custProperty: [{required: true, message: '请选择单位性质', trigger: 'change' }],
                    custID: [{ required: true, message: '请输入4位数字编码', trigger: 'blur' }],
                    custType: [{required: true, message: '请选择单位类型', trigger: 'change' }],
                    siteID: [{required: true, message: '请选择所属账套', trigger: 'change' }],
                    name: [{ required: true, message: '请输入单位名称', trigger: 'blur' }],
                    active: [{required: true, message: '请选择有效性', trigger: 'change' }],
                    isGlobal: [{required: true, message: '请选择属性', trigger: 'change' }]
                }
            };
        },
        methods: {
            //状态显示转换
            formatStatus: function(row) {
                return row.active == true ? "是" : "否";
            },
            //状态显示转换
            formatIsGlobal: function(row) {
                return row.isGlobal == true ? "公有" : "私有";
            },
            //单位类型列表
            selectCustTypeData: function () {
                var that = this;
                API.selectCustTypeList()
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.typeList = res.data;
                        } else {
                            that.$message.error({
                                message: res.message,
                                duration: 2000
                            });
                        }
                    })
                   
            },
            //单位性质列表
            selectCustPropertyData: function () {
                var that = this;
                API.selectCustProperty()
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.unitNatureList = res.data;
                        } else {
                            that.$message.error({
                                message: res.message,
                                duration: 2000
                            });
                        }
                    })
                   
            },
            //账套列表
            accoutSetData: function () {
                var that = this;
                var params={
                    name: "",
                    pageNum: 1,
                    pageSize: 0
                }
                API.accoutSetList(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.ownershipList = res.data.list;
                        } else {
                            that.$message.error({
                                message: res.message,
                                duration: 2000
                            });
                        }
                    })
                  
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
                var params={
                    name: that.name,
                    pageNum: that.paginations.page,
                    pageSize: that.paginations.page_size,
                    custPropertyName:that.unitNatureValue,
                    typeName:that.typeValue,
                    active:that.effectiveValue,
                }
                API.unitMessageList(params)
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
            // 新增
            showAddDialog: function () {
                var that = this;
                that.dialogVisible = true;
                that.modalTitle = "新增";
                that.ruleForm = {
                    siteID:"",
                    custProperty:"",//单位性质
                    custType:"",//单位类型
                    custID:"",//单位编号
                    name: '',
                    pym:"",
                    postalCode:"",//邮政编码
                    contacts:"",//联系人
                    mobile:"",//联系手机
                    active: true,
                    isGlobal:true,
                    joinDate:new Date(),
                    remark:"",
                };
            },
            //编辑
            showEditDialog: function(index, row) {
                var that = this;
                that.dialogVisible = true;
                that.modalTitle = "编辑";
                that.ruleForm = Object.assign({}, row);
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
            //模态窗数据
            addSubmit: function () {
                let that = this;
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        that.modalLoading = true;
                        let para = Object.assign({}, that.ruleForm);
                        if (that.modalTitle == "新增") {
                            API.insertUnitMessage(para)
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
                            API.editUnitMessage(para)
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
            that.selectCustTypeData();
            that.selectCustPropertyData();
            that.accoutSetData();
            that.handleSearch();
        }
    };
</script>


<style scoped lang="scss">
</style>
