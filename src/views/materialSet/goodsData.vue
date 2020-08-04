<template>
    <div v-loading="loading">
        <div class="pad_5 backfff">
            <div class="pad_5 nav_header">
                <el-row>
                    <el-col :span="24">
                        <el-form :inline="true" class="demo-form-inline">
                            <el-form-item label="名称">
                                <el-input v-model="name" size="mini"   placeholder="请输入名称或编码" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="货品类别">
                                <el-select v-model="categoryValue" placeholder="请选择" clearable size="mini">
                                    <el-option
                                            v-for="item in categoryList"
                                            :key="item.pcategory"
                                            :label="item.name"
                                            :value="item.pcategory">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="用途">
                                <el-select v-model="pattribute" placeholder="请选择" clearable size="mini">
                                    <el-option
                                            v-for="item in useList"
                                            :key="item.tradeMark"
                                            :label="item.name"
                                            :value="item.pattribute">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="品牌">
                                <el-select v-model="tradeMark" placeholder="请选择" clearable size="mini">
                                    <el-option
                                            v-for="item in brandList"
                                            :key="item.tradeMark"
                                            :label="item.tradeMarkName"
                                            :value="item.tradeMark">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" size="mini" @click="handleSearch">搜索</el-button>
                            </el-form-item>
                            <!--<el-form-item>-->
                                <!--<el-button type="primary" size="mini">导入</el-button>-->
                            <!--</el-form-item>-->
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
                    <el-table-column prop="productId" label="货品编号"></el-table-column>
                    <el-table-column prop="tradeMark" label="品牌编号"></el-table-column>
                    <el-table-column prop="name" label="名称"></el-table-column>
                    <el-table-column prop="tradeMarkName" label="品牌名称"></el-table-column>
                    <el-table-column prop="Unit" label="默认单位"></el-table-column>
                    <el-table-column prop="pattributeName" label="用途"></el-table-column>
                    <el-table-column prop="PCategoryName" label="货品类别"></el-table-column>
                    <el-table-column prop="specification" label="规格"></el-table-column>
                    <el-table-column prop="active" label="有效性" :formatter="formatStatus"></el-table-column>
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
                                   @size-change="handleSizeChange"
                                   @current-change="handleCurrentChange"
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
                <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm">
                    <el-form-item label="编号" prop="productId">
                        <el-input v-model="ruleForm.productId" :disabled="modalTitle=='编辑'"></el-input>
                    </el-form-item>
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="ruleForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="拼音编码" prop="pym">
                        <el-input v-model="ruleForm.pym"></el-input>
                    </el-form-item>
                    <el-form-item label="规格" prop="specification">
                        <el-input v-model="ruleForm.specification"></el-input>
                    </el-form-item>
                    <el-form-item label="货品类别" prop="pCategory">
                        <el-select v-model="ruleForm.pCategory" placeholder="请选择" class="width__fill_available">
                            <el-option
                                    v-for="item in categoryList"
                                    :key="item.pcategory"
                                    :label="item.name"
                                    :value="item.pcategory">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="货品用途:" prop="pattribute">
                        <el-select v-model="ruleForm.pattribute" placeholder="请选择" class="width__fill_available">
                            <el-option
                                    v-for="item in useList"
                                    :key="item.pattribute"
                                    :label="item.name"
                                    :value="item.pattribute">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="品牌名称:" prop="tradeMark">
                        <el-select v-model="ruleForm.tradeMark" placeholder="请选择" class="width__fill_available">
                            <el-option
                                    v-for="item in brandList"
                                    :key="item.tradeMark"
                                    :label="item.tradeMarkName"
                                    :value="item.tradeMark">
                            </el-option>
                        </el-select>
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
    import API from "@/api/materialSet";

    export default {
        data() {
            return {
                loading: false,
                modalLoading: false,
                dialogVisible: false,
                modalTitle: "新增",
                name: "",
                categoryValue: "", //类别
                pattribute: "", //用途
                tradeMark:"",
                tableData: [],
                categoryList: [],
                brandList:[],
                useList: [],
                //需要给分页组件传的信息
                paginations: {
                    page: 1, // 当前位于哪页
                    total: 0, // 总数
                    page_size: 10, // 1页显示多少条
                    layout: "total,sizes, prev, pager, next,jumper" // 翻页属性
                },
                ruleForm: {
                    pCategory: "", //类别编号
                    productId: "", //编号
                    name: "", //名称
                    specification: '', //规格
                    pym: '',  //拼音缩写
                    pattribute: "", //用途
                    tradeMark:"", //品牌
                    active: true //是否有效
                },
                rules: {
                    pCategory: [{required: true, message: '请选择类别', trigger: 'change'}],
                    productId: [{required: true, message: '请输入编号', trigger: 'blur'}],
                    name: [{required: true, message: '请输入名称', trigger: 'blur'}],
                    specification: [{required: true, message: '请输入规格', trigger: 'blur'}],
                    // pym: [{required: true, message: '请输入拼音缩写', trigger: 'blur'}],
                    pattribute: [{required: true, message: '请选择用途', trigger: 'change'}],
                    tradeMark: [{required: true, message: '请选择品牌', trigger: 'change'}],
                    active: [{required: true, message: '请选择有效性', trigger: 'change'}]
                }
            };
        },
        methods: {
            //状态显示转换
            formatStatus: function (row) {
                return row.active ? "有效" : "无效";
            },

            // 获取类别
            categoryData: function () {
                var that = this;
                 var params = {
                     active:true
                 }
                API.categoryList(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.categoryList = res.data;
                        } else {
                            that.$message.error({
                                message: res.message,
                                duration: 2000
                            });
                        }
                    })
               
            },
            // 获取用途
            useData: function () {
                var that = this;
                API.useList()
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.useList = res.data;
                        } else {
                            that.$message.error({
                                message: res.message,
                                duration: 2000
                            });
                        }
                    })
                

            },
            // 获取品牌
            brandData: function () {
                var that = this;
                API.getTradeMark()
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.brandList = res.data;
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
                that.paginations.page = 1;
                that.search();
            },
            // 数据显示
            search: function () {
                let that = this;
                that.loading = true;
                var params = {
                    keyword: that.name,
                    pCategory:that.categoryValue,
                    useTo:that.pattribute,
                    tradeMark:that.tradeMark,
                    pageNum: that.paginations.page,
                    pageSize: that.paginations.page_size
                }
                API.getProductAll(params)
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
                    pCategory: "", //类别编号
                    productId: "", //编号
                    name: "", //名称
                    specification: '', //规格
                    pym: '',  //拼音缩写
                    pattribute:"",
                    tradeMark:"", //品牌
                    active: true //是否有效
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
                            API.addProduct(that.ruleForm)
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
                            API.editProduct(that.ruleForm)
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
                                .finally(function (error) {
                                    that.modalLoading = false;
                                });
                        }
                    }
                });
            },

        },
        mounted() {
            var that = this;
            that.categoryData();
            that.useData();
            that.brandData();
            that.handleSearch();
        }
    };
</script>


<style scoped lang="scss">
</style>
