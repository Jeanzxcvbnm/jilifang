<template>
    <div v-loading="loading">
        <div class="pad_5 backfff">
            <div class="pad_5 nav_header">
                <el-row>
                    <el-col :span="24">
                        <el-form :inline="true" class="demo-form-inline">
                            <el-form-item label="仓库">
                                <el-input v-model="name" placeholder=" 请输入仓库名称或仓库编号" size="mini"></el-input>
                            </el-form-item>
                            <el-form-item label="类型">
                                <el-select v-model="typeValue" clearable placeholder="请选择" size="mini">
                                    <el-option
                                            v-for="item in typeList"
                                            :key="item.warehouseType"
                                            :label="item.name"
                                            :value="item.warehouseType"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="组织单位">
                                <el-select v-model="entityID" clearable placeholder="请选择" size="mini">
                                    <el-option
                                            v-for="item in findEntityList"
                                            :key="item.entityID"
                                            :label="item.name"
                                            :value="item.entityID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" size="mini" @click="handleSearch">搜索</el-button>
                            </el-form-item>
                            <!--<el-form-item style="margin-left: 30px;">-->
                            <!--<el-button type="primary" size="mini" >导出</el-button>-->
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
                    <el-table-column prop="siteIDName" label="账套"></el-table-column>
                    <el-table-column prop="warehouseID" label="仓库编号"></el-table-column>
                    <el-table-column prop="name" label="仓库名称"></el-table-column>
                    <el-table-column prop="warehouseTypeName" label="类型"></el-table-column>
                    <el-table-column prop="pym" label="拼音编码"></el-table-column>
                    <el-table-column prop="isSaleOrder" label="无货允许保存销售订单">
                        <template slot-scope="scope">
                            <span v-if="scope.row.isSaleOrder==true">是</span>
                            <span v-else-if="scope.row.isSaleOrder==false">否</span>
                        </template>
                    </el-table-column>
                    <!--<el-table-column prop="costRules" label="成本结算规则">-->
                    <!--<template slot-scope="scope">-->
                    <!--&lt;!&ndash;<span v-if="scope.row.costRules==true">账套成本价</span>&ndash;&gt;-->
                    <!--<span v-if="scope.row.costRules==false">仓库成本价</span>-->
                    <!--</template>-->
                    <!--</el-table-column>-->
                    <!--                    <el-table-column prop="checkRulesName" label="出入库成本结算规则"></el-table-column>-->
                    <el-table-column prop="entityName" label="所属组织"></el-table-column>
                    <!--<el-table-column prop="differentTrans" label="调拨方式" :formatter="formatStatus"></el-table-column>-->
                    <el-table-column prop="defaultStock" label="是否默认仓">
                        <template slot-scope="scope">
                            <span v-if="scope.row.defaultStock==true">是</span>
                            <span v-else-if="scope.row.defaultStock==false">否</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="zeroOut" label="是否允许0库存出库">
                        <template slot-scope="scope">
                            <span v-if="scope.row.zeroOut==true">是</span>
                            <span v-else-if="scope.row.zeroOut==false">否</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="active" label="有效性" :formatter="formatState"></el-table-column>
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
                <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="165px" class="demo-ruleForm">
                    <el-form-item label="账套" prop="siteID">
                        <el-input v-model="ruleForm.siteIDName" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="所属组织" prop="entityID">
                        <el-select v-model="ruleForm.entityID" placeholder="请选择" class="width__fill_available"
                                   :disabled="modalTitle=='编辑' && ruleForm.entityID!= '' ">
                            <el-option
                                    v-for="item in findEntityList"
                                    :key="item.entityID"
                                    :label="item.name"
                                    :value="item.entityID">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="仓库编号" prop="warehouseID">
                        <el-input v-model="ruleForm.warehouseID" placeholder="请输入编号" :disabled="modalTitle=='编辑'"
                                  minlength="5" maxlength="6"></el-input>
                    </el-form-item>
                    <el-form-item label="仓库名称" prop="name">
                        <el-input v-model="ruleForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="是否默认仓" prop="defaultStock">
                        <el-radio-group v-model="ruleForm.defaultStock" @change="defaultStockChange">
                            <el-radio :label=true>是</el-radio>
                            <el-radio :label=false>否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="仓库类型" prop="warehouseType">
                        <el-select v-model="ruleForm.warehouseType" placeholder="请选择" class="width__fill_available">
                            <el-option
                                    v-for="item in typeList"
                                    :key="item.warehouseType"
                                    :label="item.name"
                                    :value="item.warehouseType">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="拼音编码" prop="pym">
                        <el-input v-model="ruleForm.pym"></el-input>
                    </el-form-item>
                    <!--                    <el-form-item label="出入库成本结算规则" prop="checkRules">-->
                    <!--                        <el-select v-model="ruleForm.checkRules" placeholder="请选择" class="width__fill_available">-->
                    <!--                            <el-option-->
                    <!--                                    v-for="item in CheckRulesList"-->
                    <!--                                    :key="item.checkRules"-->
                    <!--                                    :label="item.name"-->
                    <!--                                    :value="item.checkRules">-->
                    <!--                            </el-option>-->
                    <!--                        </el-select>-->
                    <!--                    </el-form-item>-->
                    <!--<el-form-item label="成本结算规则" prop="costRules">-->
                    <!--<el-radio-group v-model="ruleForm.costRules">-->
                    <!--&lt;!&ndash;<el-radio :label=true>账套成本价</el-radio>&ndash;&gt;-->
                    <!--<el-radio :label=false>仓库成本价</el-radio>-->
                    <!--</el-radio-group>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="调拨方式" prop="differentTrans">-->
                    <!--<el-radio-group v-model="ruleForm.differentTrans">-->
                    <!--&lt;!&ndash;<el-radio :label=1>同价</el-radio>&ndash;&gt;-->
                    <!--<el-radio :label=0>异价</el-radio>-->
                    <!--</el-radio-group>-->
                    <!--</el-form-item>-->
                    <el-form-item label="无货允许保存销售订单" prop="isSaleOrder">
                        <el-radio-group v-model="ruleForm.isSaleOrder">
                            <el-radio :label=true>是</el-radio>
                            <el-radio :label=false>否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否允许0库存出库" prop="zeroOut">
                        <el-radio-group v-model="ruleForm.zeroOut">
                            <el-radio :label=true>是</el-radio>
                            <el-radio :label=false>否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="有效性" prop="active">
                        <el-radio-group v-model="ruleForm.active">
                            <el-radio :label=true>有效</el-radio>
                            <el-radio :label=false>无效</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit">保 存</el-button>
      </span>
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
                typeValue: "",
                entityID:"",
                CheckRulesList: [],//结算规则列表
                findEntityList: [],//组织列表
                tableData: [],
                ruleForm: {
                    siteID: "",
                    siteIDName: "",
                    warehouseID: "",
                    name: "",
                    warehouseType: "",
                    pym: "",
                    differentTrans: 0,
                    zeroOut: true,
                    active: true,
                    costRules: false,
                    checkRules: "",
                    isSaleOrder: true,
                    entityID: '',
                    defaultStock: false,
                },
                rules: {
                    siteID: [{required: true, message: '请输入账套', trigger: 'blur'}],
                    warehouseID: [{required: true, message: '请输入仓库编号', trigger: 'blur'}, {
                        pattern: /[A-Za-z0-9]{5,6}/,
                        message: '请输入5-6位数编号'
                    }],
                    entityID :[{required: true, message: '请选择所属组织', trigger: 'change'},],
                    name: [{required: true, message: '请输入仓库名称', trigger: 'blur'}],
                    warehouseType: [{required: true, message: '请选择仓库类型类型', trigger: 'change'},],
                    // pym: [{required: true, message: '请输入拼音编码', trigger: zl9102'blur'}],
                    differentTrans: [{required: true, message: '', trigger: 'change'}],
                    zeroOut: [{required: true, message: '', trigger: 'change'}],
                    active: [{required: true, message: '', trigger: 'change'}],
                    defaultStock: [{required: true, message: '', trigger: 'change'}],
                    // checkRules: [{required: true, message: '请选择出入库成本结算规则', trigger: 'change'}],
                    costRules: [{required: true, message: '', trigger: 'change'}],
                    isSaleOrder: [{required: true, message: '', trigger: 'change'}],
                },
                //类型
                typeList: [],
                // //需要给分页组件传的信息
                paginations: {
                    page: 1, // 当前位于哪页
                    total: 0, // 总数
                    page_size: 10, // 1页显示多少条
                    layout: "total,sizes, prev, pager, next,jumper" // 翻页属性
                },
            };
        },
        methods: {
            formatStatus: function (row) {
                if (row.differentTrans == 1) {
                    return "同价";
                } else {
                    return "异价";
                }
            },
            formatState: function (row) {
                if (row.active == 1) {
                    return "有效";
                } else {
                    return "无效";
                }
            },
            // 仓库类型列表
            typeData: function () {
                var that = this;
                var params = {
                    name: "",
                    isState:true,
                }
                API.warehouseTypeList(params)
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
            // // 仓库类型列表
            // CheckRulesData: function () {
            //     var that = this;
            //     API.findCheckRulesList()
            //         .then(res => {
            //             if (res.stateCode == 100) {
            //                 that.CheckRulesList = res.data;
            //             } else {
            //                 that.$message.error({
            //                     message: res.message,
            //                     duration: 2000
            //                 });
            //             }
            //         })
            //
            // },
            //组织列表
            findEntityData: function () {
                var that = this;
                API.findEntityList()
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.findEntityList = res.data;
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
                let that = this;
                that.search();
            },
            // 数据显示
            search: function () {
                let that = this;
                that.loading = true;
                var params = {
                    keyword: that.name,
                    warehouseType: that.typeValue,
                    entityID:that.entityID,
                    pageNum: that.paginations.page,
                    pageSize: that.paginations.page_size,
                }
                API.unitSetList(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.tableData = res.data.list;
                            that.paginations.total = res.data.total;
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
                var siteID = localStorage.getItem('siteID');
                var siteIDName = localStorage.getItem('siteIDName');

                that.ruleForm = {
                    siteID: siteID,
                    siteIDName: siteIDName,
                    warehouseID: "",
                    name: "",
                    warehouseType: "",
                    pym: "",
                    differentTrans: 0,
                    zeroOut: true,
                    active: true,
                    costRules: false,
                    checkRules: "",
                    isSaleOrder: true,
                    entityID: '',
                    defaultStock: false,
                }
            },
            //编辑
            showEditDialog: function (index, row) {
                var that = this;
                that.dialogVisible = true;
                that.modalTitle = "编辑";
                that.ruleForm = Object.assign({}, row);
            },
            // 是否默认
            defaultStockChange:function(){
                 var that = this;
                 if(that.ruleForm.entityID ==""){
                     that.$message.error({
                         message: "请选择所属组织",
                         duration: 2000
                     });
                     return false;
                 }
                 var params = {
                     warehouseID:that.ruleForm.warehouseID,
                     entityID:that.ruleForm.entityID,
                     defaultStock:that.ruleForm.defaultStock
                 }
                API.getDefaultWarehouse(params)
                    .then(function (res) {
                        if (res.stateCode === 100) {
                         if(!res.data){
                             that.ruleForm.defaultStock = false;
                             that.$message.error({
                                 message:"已有默认仓,不能设置默认仓",
                                 duration: 2000
                             });
                         }
                        } else {
                            that.$message.error({
                                showClose: true,
                                message: res.message,
                                duration: 2000
                            });
                        }
                    })
                    .finally(function (error) {
                        that.modalLoading = false;
                    });
            },
            allSubmit: function () {
                var that = this;
                that.modalLoading = true;
                let para = Object.assign({}, that.ruleForm);
                if (that.modalTitle == "新增") {
                    API.addUnitSet(para)
                        .then(function (res) {
                            if (res.stateCode === 100) {
                                that.$message({
                                    showClose: true,
                                    message: "新增成功",
                                    duration: 2000
                                });
                                that.$refs["ruleForm"].resetFields();
                                that.dialogVisible = false;
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
                            that.modalLoading = false;
                        });
                } else {
                    var siteID = localStorage.getItem('siteID');
                    var params = {
                        siteID: siteID,
                        warehouseID: that.ruleForm.warehouseID,
                        name: that.ruleForm.name,
                        warehouseType: that.ruleForm.warehouseType,
                        pym: that.ruleForm.pym,
                        differentTrans: that.ruleForm.differentTrans,
                        zeroOut: that.ruleForm.zeroOut,
                        active: that.ruleForm.active,
                        costRules: that.ruleForm.costRules,
                        checkRules: that.ruleForm.checkRules,
                        isSaleOrder: that.ruleForm.isSaleOrder,
                        entityID: that.ruleForm.entityID,
                        defaultStock: that.ruleForm.defaultStock,
                    }
                    API.editUnitSet(params)
                        .then(function (res) {
                            if (res.stateCode === 100) {
                                that.$message({
                                    showClose: true,
                                    message: "编辑成功",
                                    duration: 2000
                                });
                                that.$refs["ruleForm"].resetFields();
                                that.dialogVisible = false;
                                that.search();
                            } else {
                                that.$message.error({
                                    showClose: true,
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
                        .finally(function (error) {
                            that.modalLoading = false;
                        });
                }

            },
            //保存
            addSubmit: function () {
                let that = this;
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        if (that.ruleForm.entityID != '') {
                            this.$confirm('绑定组织后不能再次修改，是否绑定？', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                that.allSubmit();
                            }).catch(() => {
                                this.$message({
                                    type: 'info',
                                    message: '已取消'
                                });
                            });
                        } else {
                            that.allSubmit();
                        }
                    }
                });
            },
            // 上下分页
            handleCurrentChange(page) {
                this.paginations.page = page;
                this.search();
            },
            //每页多少条
            handleSizeChange(val) {
                this.paginations.page_size = val;
                this.search();
            }
        },
        mounted() {
            var that = this;
            that.typeData();
            that.handleSearch();
            // that.CheckRulesData();
            that.findEntityData();
        }
    };
</script>


<style scoped lang="scss">
</style>
