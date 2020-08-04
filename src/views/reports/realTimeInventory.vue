<template>
    <div v-loading="loading">
        <div class="pad_5 backfff">
            <div class="pad_5 nav_header">
                <el-row>
                    <el-col :span="24">
                        <el-form :inline="true" class="demo-form-inline">

                            <el-form-item label="仓库">
                                <el-select v-model="warehouseID" placeholder="请选择" filterable clearable size="mini">
                                    <el-option
                                            v-for="item in warehouseList"
                                            :key="item.warehouseID"
                                            :label="item.name"
                                            :value="item.warehouseID">
                                    </el-option>
                                </el-select>
                            </el-form-item>


                            <el-form-item>
                                <el-button type="primary" size="mini" @click="handleSearch">搜索</el-button>
                            </el-form-item>
                            <!--<el-form-item style="margin-left:30px;">-->
                            <!--<el-button type="primary" size="mini" @click="exportClick">导出</el-button>-->
                            <!--</el-form-item>-->
                        </el-form>
                    </el-col>
                </el-row>
            </div>
            <div>

                <el-table :data="tableData" style="width: 100%;margin-bottom: 20px;">
                    <el-table-column prop="name" label="仓库"></el-table-column>
                    <el-table-column prop="sumAmount" label="仓库剩余货品数量合计（最小单位）"></el-table-column>
                    <el-table-column label="操作" width="300">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" @click="showDetailDialog(scope.row)">详情
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

    </div>
</template>

<script>
    import API from "@/api/reports";
    import util from "@/components/js/util"

    export default {

        data() {
            return {
                loading: false,
                warehouseID: "", // 仓库
                warehouseList: [], //仓库列表
                tableData: [],
                //需要给分页组件传的信息
                paginations: {
                    page: 1, // 当前位于哪页
                    total: 0, // 总数
                    page_size: 10, // 1页显示多少条
                    layout: "total,sizes, prev, pager, next,jumper" // 翻页属性
                }
            };
        },
        methods: {

            // 仓库列表
            warehouseData: function () {
                var that = this;
                API.warehouseList()
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
                 
            },
            // 导出
            exportClick: function () {
                var that = this;
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
                    warehouseID:that.warehouseID,
                    pageNum: that.paginations.page,
                    pageSize: that.paginations.page_size
                }
                API.reportWarehouseList(params)
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
            // 详情
            showDetailDialog:function (row) {
                 var that = this;
                 that.$router.push({path:"/reports/reportDetail",query:{warehouse:row}})
            }
        },
        mounted() {
            var that = this;
            that.warehouseData();
            that.handleSearch();
        }
    };
</script>


<style scoped lang="scss">
</style>
