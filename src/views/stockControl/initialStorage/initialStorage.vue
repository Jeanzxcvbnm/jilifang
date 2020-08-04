<template>
    <div v-loading="loading">
        <div class="pad_5 backfff">
            <div class="pad_5 nav_header">
                <el-row>
                    <el-col :span="24">
                        <el-form :inline="true" class="demo-form-inline">
                            <el-form-item label="开单日期">
                                <el-date-picker
                                        size="mini"
                                        v-model="start_end_data"
                                        type="daterange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="入库仓库">
                                <el-select v-model="warehouseID" placeholder="请选择" clearable size="mini">
                                    <el-option
                                            v-for="item in warehouseList"
                                            :key="item.warehouseID"
                                            :label="item.name"
                                            :value="item.warehouseID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="经手单位">
                                <el-select v-model="entityID" placeholder="请选择" filterable clearable size="mini">
                                    <el-option
                                            v-for="item in entityList"
                                            :key="item.entityID"
                                            :label="item.name"
                                            :value="item.entityID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" size="mini" @click="handleSearch">搜索</el-button>
                            </el-form-item>
                            <el-form-item style="margin-left: 30px;">
                                <el-button type="primary" size="mini" @click="showAddDialog">新增</el-button>
                            </el-form-item>
                            <el-form-item style="margin-left: 30px;">
                                <el-button type="primary" size="mini" :loading="downloadLoading" @click="handleDownload">导出</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
            <div>
                <el-table :data="tableData" style="width: 100%" highlight-current-row @current-change="detailClick">
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column prop="billID" label="订单编号">
                        <!--<template slot-scope="scope">-->
                        <!--<el-tooltip class="item" effect="dark" :content="scope.row.billID" placement="top-start">-->
                        <!--<div class="text_nowarp">{{scope.row.billID}}</div>-->
                        <!--</el-tooltip>-->
                        <!--</template>-->
                    </el-table-column>
                    <el-table-column prop="warehouseName" label="入库仓库"></el-table-column>
                    <el-table-column prop="entityName" label="经手单位"></el-table-column>
                    <el-table-column prop="billDate" label="开单日期"></el-table-column>
                    <el-table-column prop="isConfirm" label="单据状态" :formatter="formatStatus"></el-table-column>
                    <el-table-column prop="empName" label="操作人"></el-table-column>
                    <el-table-column prop="remark" label="备注">
                        <template slot-scope="scope">
                            <el-popover
                                    placement="top-start"
                                    title=""
                                    width="200"
                                    trigger="hover"
                                    :content="scope.row.remark">
                                <div class="text_nowarp" slot="reference">{{scope.row.remark}}</div>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="180">
                        <template slot-scope="scope">
                            <el-button
                                    type="primary"
                                    size="mini"
                                    @click="showEditDialog(scope.row)"
                            >详情
                            </el-button>
                            <el-button
                                    v-if="scope.row.isConfirm==0"
                                    type="primary"
                                    size="mini"
                                    @click.stop="affirmClick(scope.row)"
                            >确认审核
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
        <div class="pad_10 backfff martp_15">
            <div class="pad_10 nav_header">
                <span class="font_14 marrt_20">期初明细</span>
                <!--<el-button type="primary" size="mini" icon="el-icon-document">打印</el-button>-->
            </div>
            <div>
                <el-table :data="orderDetail" show-summary :summary-method="getSummaries" max-height="400"
                          style="width: 100%">
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column prop="productName" label="名称"></el-table-column>
                    <el-table-column prop="productID" label="货品编号"></el-table-column>
                    <el-table-column prop="inAmount" label="输入数量"></el-table-column>
                    <el-table-column prop="inUnit" label="选择单位"></el-table-column>
                    <el-table-column prop="maxPrice" label="选择单位单价（元）"></el-table-column>
                    <el-table-column prop="unit" label="最小单位"></el-table-column>
                    <el-table-column prop="price" label="最小单价（元）"></el-table-column>
                    <el-table-column prop="amount" label="最小单位数量合计"></el-table-column>
                    <el-table-column prop="totalPrice" label="合计金额（元）"></el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
    import API from "@/api/stockControl";
    import util from "@/components/js/util"

    export default {
        data() {
            return {
                loading: false,
                dialogVisible: false,
                downloadLoading:false,
                start_end_data: "", //时间
                warehouseID: "", // 入库仓库
                entityID: "",  // 经手单位
                billID: "",
                warehouseList: [], //仓库列表
                entityList: [], //经手单位
                tableData: [],
                orderDetail: [],
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
            //导出
            handleDownload(){
                var that=this;
                var start = "";
                var end = "";
                if (that.start_end_data != "" && that.start_end_data != null) {
                    start = util.formatDate.format(that.start_end_data[0], "Y-MM-DD");
                    end = util.formatDate.format(that.start_end_data[1], "Y-MM-DD");
                }
                let params={
                    start: start,
                    end: end,
                    entityID: that.entityID,
                    warehouseID: that.warehouseID,
                }
                that.downloadLoading=true
                API.exportII(params)
                    .then(res => {
                        this.$message.success({
                            message: '正在导出',
                            duration: '4000'
                        })
                        const link = document.createElement("a");
                        let blob = new Blob([res], {type: 'application/octet-stream'});
                        link.style.display = "none";
                        link.href = URL.createObjectURL(blob);
                        // link.download = res.headers['content-disposition'] //下载后文件名
                        link.download = '期初结存.xlsx'; //下载的文件名
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    })
                    .finally(function () {
                        that.downloadLoading = false;
                    });
            },
            getSummaries(param) {
                const {columns, data} = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计';
                        return;
                    }
                    if (index === 2 || index === 3 || index === 5 || index === 7) {
                        sums[index] = '';
                        return;
                    }
                    const values = data.map(item => Number(item[column.property]));
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr
                            } else {
                                return prev;
                            }
                        }, 0);
                        if (index === 9) {
                            sums[index] = sums[index].toFixed(2)
                        }
                        // sums[index] += ' 元';
                    } else {
                        // sums[index] = 'N/A';
                    }
                });

                return sums;
            },
            formatStatus: function (row) {
                if (row.isConfirm == 0) {
                    return "未审核";
                } else {
                    return "已审核";
                }
            },
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

            // 单位列表
            entityData: function () {
                var that = this;
                API.entityList()
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.entityList = res.data;
                        } else {
                            that.$message.error({
                                message: res.message,
                                duration: 2000
                            });
                        }
                    })

            },
            // 新增
            showAddDialog: function () {
                var that = this;
                that.$router.push("/stockControl/initialStorage/addinitialStorage")
            },
            // 数据显示
            handleSearch: function () {
                let that = this;
                that.paginations.page = 1;
                that.billID = "";
                that.orderDetail = [];
                that.search();
            },
            // 数据显示
            search: function () {
                let that = this;
                that.loading = true;
                var start = "";
                var end = "";
                if (that.start_end_data != "" && that.start_end_data != null) {
                    start = util.formatDate.format(that.start_end_data[0], "Y-MM-DD");
                    end = util.formatDate.format(that.start_end_data[1], "Y-MM-DD");
                }
                var params = {
                    start: start,
                    end: end,
                    entityID: that.entityID,
                    warehouseID: that.warehouseID,
                    pageNum: that.paginations.page,
                    pageSize: that.paginations.page_size
                }
                API.getOrders(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.tableData = res.data.list;
                            that.paginations.total = res.data.total;
                            if (res.data.list.length > 0) {
                                that.billID = res.data.list[0].billID || "";
                                that.orderDetailData()
                            }
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
            //详情
            showEditDialog: function (row) {
                var that = this;
                if (row.isConfirm == 0) {
                    that.$router.push({
                        path: "/stockControl/initialStorage/initialStorageDetails",
                        query: {detail: row}
                    })
                } else {
                    that.$router.push({path: "/stockControl/initialStorage/details", query: {detail: row}})
                }
            },
            // 明细
            orderDetailData: function () {
                var that = this;
                that.loading = true;
                var params = {
                    billID: that.billID
                }
                API.getOrdersDetails(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            res.data.forEach(function (item) {
                                item.totalPrice = (item.inAmount * item.maxPrice).toFixed(2);
                            })
                            that.orderDetail = res.data;
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
            // 仓库明细
            detailClick: function (row, event) {
                var that = this;
                that.billID = row.billID;
                that.orderDetailData()
            },
            //确认审核
            affirmClick: function (row) {
                var that = this;
                var params = {
                    billID: row.billID
                }
                API.getOrdersDetails(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.$confirm('确认审核此订单？', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                var params = {
                                    billID: row.billID,
                                    isConfirm: "0",
                                    productList: res.data,
                                }
                                that.loading = true;
                                API.ConfirmationReview(params)
                                    .then(res => {
                                        if (res.stateCode == 100) {
                                            that.$message({
                                                message: "审核成功",
                                            })
                                            that.search();
                                        } else {
                                            that.message.error({
                                                message: res.message,
                                                duration: 2000
                                            })
                                        }
                                    })
                                    .finally(function () {
                                        that.loading = false;
                                    })
                            }).catch(() => {
                                    that.$message({
                                        type: 'info',
                                        message: '已取消审核'
                                    });
                                });
                        } else {
                            that.$message.error({
                                message: res.message,
                                duration: 2000
                            });
                        }
                    })
            }
        },
        mounted() {
            var that = this;
            that.warehouseData();
            that.entityData();
            that.handleSearch();
        }
    };
</script>


<style scoped lang="scss">
</style>
