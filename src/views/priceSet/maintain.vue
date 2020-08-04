<template>
    <div v-loading="loading">
        <div class="pad_5 backfff">
            <div class="pad_5 nav_header">
                <el-row>
                    <el-col :span="24">
                        <el-form :inline="true" class="demo-form-inline">
                            <el-form-item label="货品">
                                <el-input v-model="name" placeholder="请输入货品名称或编号" size="mini"></el-input>
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
                    <el-table-column prop="productID" label="货品编号"></el-table-column>
                    <el-table-column prop="productName" label="货品名称"></el-table-column>
                    <el-table-column prop="purchasePrice" label="进价（元）"></el-table-column>
                    <el-table-column prop="price" label="售价（元）"></el-table-column>
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
                <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="货品名称" prop="productName">
                        <el-select class="width__fill_available" v-model="ruleForm.productID" v-loadmore="loadMore"
                                   filterable remote reserve-keyword :remote-method="remoteMethod"
                                   clearable placeholder="请选择" :disabled="modalTitle=='编辑'"
                        >
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
                    <el-form-item label="货品编号" prop="productID">
                        <el-input v-model="ruleForm.productID" placeholder="请输入" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="参考进价" prop="purchasePrice">
                        <el-input v-model="ruleForm.purchasePrice" placeholder="请输入" @change="priceChange(0,ruleForm.purchasePrice)" @focus="focusPrice(0,ruleForm.purchasePrice)"></el-input>
                    </el-form-item>
                    <el-form-item label="参考售价" prop="price">
                        <el-input v-model="ruleForm.price" placeholder="请输入" @change="priceChange(1,ruleForm.price)" @focus="focusPrice(1,ruleForm.price)"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit" :loading="modalLoading">保 存</el-button>
      </span>
        </el-dialog>
    </div>
</template>

<script>
    import API from "@/api/priceSet";

    export default {
        data() {
            return {
                loading: false,
                modalLoading: false,
                dialogVisible: false,
                modalTitle: "新增",
                name: "",
                tableData: [],
                productList: [],
                selectLoading: false,
                selectPage: 1,
                selectName: "",
                selectTotal: 0,
                //需要给分页组件传的信息
                paginations: {
                    page: 1, // 当前位于哪页
                    total: 0, // 总数
                    page_size: 10, // 1页显示多少条
                    layout: "total,sizes, prev, pager, next,jumper" // 翻页属性
                },
                ruleForm: {
                    productID: "",
                    productName: "",
                    purchasePrice: '',
                    price: '',
                },
                rules: {
                    productID: [{required: true, message: '请选择商品', trigger: 'change'}],
                    purchasePrice: [{required: true, message: '请输入货品进价', trigger: 'blur'}],
                    price: [{required: true, message: '请输入货品售价', trigger: 'blur'}]
                }
            };
        },
        methods: {
            //状态显示转换
            formatStatus: function (row) {
                return row.status == "1" ? "有效" : "无效";
            },

            // 产品列表
            productData: function () {
                var that = this;
                var params = {
                    pageNum: that.selectPage,
                    keyword: that.selectName
                }
                API.getProduct(params)
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
                    .finally(function () {
                        that.loading = false;
                    });
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
                    pageNum: that.paginations.page,
                    pageSize: that.paginations.page_size
                }
                API.getPDPrice(params)
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
                    productID: "",
                    productName: "",
                    purchasePrice: '',
                    price: '',
                };
            },
            //编辑
            showEditDialog: function (index, row) {
                var that = this;
                that.modalTitle = "编辑";
                that.dialogVisible = true;
                that.ruleForm = Object.assign({}, row);
            },
              // 价格
            focusPrice:function(index,price){
                var that = this;
                if(index ==0){
                    if(price==0){
                        that.ruleForm.purchasePrice=""
                    }
                }else {
                    if(price ==0){
                        that.ruleForm.price=""
                    }
                }
            },
            priceChange:function(index,item){
                var that = this;
                if(index ==0){
                    if(!(/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/).test(item)){
                        that.ruleForm.purchasePrice=""
                        that.$message({
                            message: "请输入有效数字",
                        })
                    }
                }else {
                    if(!(/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/).test(item)){
                        that.ruleForm.price=""
                        that.$message({
                            message: "请输入有效数字",
                        })
                    }
                }

            },

            //模态窗数据
            addSubmit: function () {
                let that = this;
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        that.modalLoading = true;
                        if (that.modalTitle == "新增") {
                            API.addPDPrice(that.ruleForm)
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
                            API.editPDPrice(that.ruleForm)
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
                                .finally(function () {
                                    that.modalLoading = false;
                                });
                        }

                    }
                });
            },
        },
        mounted() {
            var that = this;
            that.productData();
            that.handleSearch();
        }
    };
</script>


<style scoped lang="scss">
</style>
