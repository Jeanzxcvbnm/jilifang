<template>
    <div v-loading="loading">
        <div class="pad_5 backfff">
            <div class="pad_5 nav_header">
                <el-row>
                    <el-col :span="24">
                        <el-form :inline="true" class="demo-form-inline">
                            <el-form-item label="名称">
                                <el-input v-model="name" placeholder="请输入" clearable size="mini"></el-input>
                            </el-form-item>
                            <el-form-item label="条码">
                                <el-input v-model="barCode" placeholder="请输入" clearable  size="mini"></el-input>
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
                    <el-table-column prop="productID" label="编号"></el-table-column>
                    <el-table-column prop="productName" label="名称"></el-table-column>
                    <el-table-column prop="barCode" label="条码"></el-table-column>
                    <el-table-column prop="unit" label="单位"></el-table-column>
                    <el-table-column prop="amount" label="包装数量"></el-table-column>
                    <el-table-column prop="pattribute" label="属性" :formatter="formatPattribute"></el-table-column>
                    <el-table-column prop="barDefult" label="默认单位" :formatter="formatBarDefult"></el-table-column>
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
                    <el-form-item label="名称:" prop="name">
                        <el-select class="width__fill_available" v-model="ruleForm.productName" v-loadmore="loadMore"
                                   filterable remote reserve-keyword :remote-method="remoteMethod"
                                    clearable placeholder="请选择" :disabled="modalTitle=='编辑'"
                                   @change="productChange($event)">
                            <el-option
                                    v-for="item in productList"
                                    :key="item.productId"
                                    :label="item.name"
                                    :value="item.productId">
                                <span style="float: left">{{ item.productId }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="编号:" prop="productID">
                        <el-input v-model="ruleForm.productID" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="条码:" prop="barCode">
                        <el-input v-model="ruleForm.barCode" :disabled="modalTitle=='编辑'" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="单位:" prop="unit">
                        <el-select v-model="ruleForm.unit" placeholder="请选择" class="width__fill_available" :disabled="modalTitle=='编辑'" filterable clearable>
                            <el-option
                                    v-for="item in unitList"
                                    :key="item.unit"
                                    :label="item.name"
                                    :value="item.unit">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="包装数量:" prop="amount">
                        <el-input type="number" v-model="ruleForm.amount" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="单位属性" prop="pattribute">
                        <el-radio-group v-model="ruleForm.pattribute">
                            <el-radio :label=true>最小单位</el-radio>
                            <el-radio :label=false>普通单位</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="收发属性:" prop="barDefult">
                        <el-radio-group v-model="ruleForm.barDefult">
                            <el-radio :label=true>默认收发</el-radio>
                            <el-radio :label=false>普通收发</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <div class="capion">每个货品必须有一个默认单位</div>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="modalLoading" @click="addSubmit">保 存</el-button>
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
                modalLoading:false,
                dialogVisible: false,
                modalTitle: "新增",
                name: "",
                barCode: "", //条码
                selectPage: 1,
                selectTotal: 0,
                selectLoading: false,
                selectName: "",
                tableData: [],
                productList: [],   //产品列表
                unitList: [],  //单位列表
                //需要给分页组件传的信息
                paginations: {
                    page: 1, // 当前位于哪页
                    total: 0, // 总数
                    page_size: 10, // 1页显示多少条
                    layout: "total,sizes, prev, pager, next,jumper" // 翻页属性
                },
                ruleForm: {
                    productName: "",
                    productID: '', //产品编号
                    barCode: "",  // 条码
                    unit: "", //单位
                    amount: "", //数量
                    pattribute: true,// 属性
                    barDefult: true, //默认单位
                },
                rules: {
                    productName: [{required: true, message: '请选择产品', trigger: 'change'}],
                    productID: [{required: true, message: '请选择产品', trigger: 'change'}],
                    barCode: [{required: true, message: '请输入条码', trigger: 'blur'}],
                    unit: [{required: true, message: '请选择单位', trigger: 'change'}],
                    amount: [{required: true, message: '请输入数量', trigger: 'blur'}],
                    pattribute: [{required: true, message: '请选择属性', trigger: 'change'}],
                    barDefult: [{required: true, message: '请选择默认单位', trigger: 'change'}]
                }
            };
        },
        methods: {
            //状态显示转换
            formatPattribute: function (row) {
                return row.pattribute ? "最小单位" : "普通单位";
            },
            formatBarDefult: function (row) {
                return row.barDefult ? "默认收发" : "普通收发";
            },
            // 获取产品
            productData: function () {
                var that = this;
                var params = {
                    pageNum: that.selectPage,
                    keyword: that.selectName
                }
                API.getProduct(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                             that.productList.push.apply(that.productList,res.data.list)
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
                if(that.selectPage*10 <= that.selectTotal){
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
            // 选择产品
            productChange: function (event) {
                var that = this;
                that.ruleForm.productID = event;
                 that.selectName = "";
                that.productData();
            },
            // 获取单位
            unitData: function () {
                var that = this;
                that.loading = true;
                API.unitList()
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.unitList = res.data;
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
                    barCode: that.barCode,
                    pageNum: that.paginations.page,
                    pageSize: that.paginations.page_size
                }
                API.getBarCode(params)
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
                    name: "",
                    productID: '', //产品编号
                    barCode: "",  // 条码
                    unit: "", //单位
                    amount: "", //数量
                    pattribute: true,// 属性
                    barDefult: true, //默认收发
                };
            },
            //编辑
            showEditDialog: function (row) {
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
                            API.addBarCode(that.ruleForm)
                                .then(function (res) {
                                    if (res.stateCode === 100) {
                                        that.$message({
                                            showClose: true,
                                            message: "新增成功",
                                            duration: 2000
                                        });
                                        that.search();
                                        that.$refs["ruleForm"].resetFields();
                                        that.dialogVisible = false;
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
                            var params = {
                                productID: para.productID,
                                barCode: para.barCode,
                                unit: para.unit,
                                amount: para.amount,
                                pattribute: para.pattribute,
                                barDefult: para.barDefult,
                            };
                            API.editBarCode(params)
                                .then(function (res) {
                                    if (res.stateCode === 100) {
                                        that.$message({
                                            showClose: true,
                                            message: "编辑成功",
                                            duration: 2000
                                        });
                                        that.$refs["ruleForm"].resetFields();
                                        that.search();
                                        that.dialogVisible = false;
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
            that.handleSearch();
            that.productData();
            that.unitData()
        }
    };
</script>


<style scoped lang="scss">
    .capion{
        margin: 15px 0 0 30px;
        color: #f70c2c;
    }
</style>
