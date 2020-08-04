<template>
    <div v-loading="loading">
        <div class="pad_5 backfff">
            <div class="pad_5 nav_header">
                <el-row>
                    <el-col :span="24">
                        <el-form :inline="true" class="demo-form-inline">
                            <el-form-item label="货品">
                                <el-input v-model="name" placeholder="请输入名称或编号" size="mini"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" size="mini" @click="handleSearch">搜索</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
            <div>
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column prop="productId" label="货品编号" width="150"></el-table-column>
                    <el-table-column prop="name" label="货品名称" width="300"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" @click="showEditDialog(scope.row)">调拨单价
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
                <el-row>
                    <el-col :span="16">
                        <el-form :inline="true" class="demo-form-inline">
                            <el-form-item label="名称">
                                <el-input v-model="warehouseName" placeholder="请输入"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" size="mini" @click="warehouseData">搜索</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
            <div>
                <el-table :data="warehouseList" style="width: 100%" height="400">
                    <el-table-column prop="warehouseID" label="仓库编号"></el-table-column>
                    <el-table-column prop="warehouseName" label="仓库名称"></el-table-column>
                    <el-table-column prop="name" label="调拨出库单价(最小单位单价)（元）">
                        <template slot-scope="scope">
                            <div>
                                <el-input v-model="scope.row.transPrice" min="0" type="number" v-enter-number2  @focus="focusPrice(scope.row)" size="mini" ></el-input>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
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
                dialogVisible: false,
                modalLoading: false,
                modalTitle: "",
                name: "",
                productId: "",
                tableData: [],
                warehouseList: [],
                warehouseName: "",
                //需要给分页组件传的信息
                paginations: {
                    page: 1, // 当前位于哪页
                    total: 0, // 总数
                    page_size: 10, // 1页显示多少条
                    layout: "total,sizes, prev, pager, next,jumper" // 翻页属性
                },
            };
        },
        methods: {

            // 仓库列表
            warehouseData: function () {
                var that = this;
                that.loading = true;
                var params = {
                    productId: that.productId,
                    keyword: that.warehouseName
                }
                API.getWarehousePrice(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.warehouseList = res.data;
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
                    pageNum: that.paginations.page,
                    pageSize: that.paginations.page_size
                }
                API.getProduct(params)
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
            //编辑
            showEditDialog: function (row) {
                var that = this;
                that.modalTitle = row.name;
                that.productId = row.productId
                that.dialogVisible = true;
                that.warehouseName ="";
                that.warehouseData();
            },
            // 价格
            focusPrice:function(item){
                var that = this;
                if(item.transPrice ==0){
                   item.transPrice = ""
                }


            },
            priceChange:function(item){
                var that = this;
                if(!(/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/).test(item.transPrice)){
                    item.transPrice = "";
                    that.$message({
                        message: "请输入有效数字",
                    })
                }
            },
            // 保存
            addSubmit: function () {
                let that = this;
                that.modalLoading = true;
                var list = [];
                that.warehouseList.forEach(function (item) {
                    list.push({warehouseID: item.warehouseID, transPrice: item.transPrice})
                })
                var params = {
                    productId: that.productId,
                    list: list
                }
                API.addWarehousePrice(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.$message({
                                message: "保存成功",
                            })
                            that.dialogVisible = false;
                        } else {
                            that.$message.error({
                                message: res.message,
                                duration: 2000
                            });
                        }
                    })
                    .finally(function () {
                        that.modalLoading = false;
                    });
            }
        },
        mounted() {
            var that = this;
            that.handleSearch();
        }
    };
</script>


<style scoped lang="scss">
</style>
