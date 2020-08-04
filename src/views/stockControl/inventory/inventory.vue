<template>
    <div v-loading="loading">
        <div class="pad_5 backfff">
            <div class="pad_5 nav_header">
                <el-row>
                    <el-col :span="24">
                        <el-form :inline="true" class="demo-form-inline">
                            <el-form-item label="盘点日期">
                                <el-date-picker
                                        size="mini"
                                        v-model="start_end_data"
                                        type="daterange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="盘点仓库">
                                <el-select v-model="warehouseID" placeholder="请选择" clearable size="mini">
                                    <el-option
                                            v-for="item in warehouseList"
                                            :key="item.warehouseID"
                                            :label="item.name"
                                            :value="item.warehouseID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="盘点状态">
                                <el-select v-model="inventoryStatus" placeholder="请选择" clearable size="mini">
                                    <el-option
                                            v-for="item in inventoryStatusData"
                                            :key="item.value"
                                            :label="item.name"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="盘点人员">
                                <el-select v-model="empID" placeholder="请选择" clearable filterable size="mini">
                                    <el-option
                                            v-for="item in inventoryPersonnelList"
                                            :key="item.empID"
                                            :label="item.name"
                                            :value="item.empID">
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
                                <el-button type="primary" size="mini" @click="handleDownload"
                                           :loading="downloadLoading">导出
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
            <div>
                <el-table :data="tableData" style="width: 100%" highlight-current-row @current-change="detailClick">
                    <el-table-column prop="billID" label="订单编号">
                        <!--<template slot-scope="scope">-->
                        <!--<el-tooltip class="item" effect="dark" :content="scope.row.billID" placement="top-start">-->
                        <!--<div class="text_nowarp">{{scope.row.billID}}</div>-->
                        <!--</el-tooltip>-->
                        <!--</template>-->
                    </el-table-column>
                    <el-table-column prop="warehouseName" label="盘点仓库"></el-table-column>
                    <el-table-column prop="billDate" label="盘点日期"></el-table-column>
                    <el-table-column prop="isStatus" label="盘点状态" :formatter="formatStatus"></el-table-column>
                    <el-table-column prop="empIDName" label="操作人"></el-table-column>
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
                    <el-table-column label="操作" width="150">
                        <template slot-scope="scope">
                            <el-button
                                    type="primary"
                                    size="mini"
                                    @click="showEditDialog(scope.row)"
                                    v-if="scope.row.isStatus==1"
                            >详情
                            </el-button>
                            <el-button
                                    type="primary"
                                    size="mini"
                                    @click="showEditDialog(scope.row)"
                                    v-if="scope.row.isStatus==0"
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

        <div class="pad_10 backfff martp_15">
            <div class="pad_10 nav_header">
                <span class="font_14 marrt_20">盘点明细</span>
                <!--<el-button type="primary" size="mini" icon="el-icon-document">打印</el-button>-->
            </div>
            <div>
                <el-table :data="orderDetail" show-summary :summary-method="getSummaries" max-height="680"
                          style="width: 100%">
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column prop="name" label="名称"></el-table-column>
                    <el-table-column prop="productID" label="货品编号"></el-table-column>
                    <el-table-column prop="Unit" label="默认单位"></el-table-column>
                    <el-table-column prop="oldBalance" label="盘点数量"></el-table-column>
                    <el-table-column prop="amount" label="库存数量"></el-table-column>
                    <el-table-column prop="plAmount" label="盈亏"></el-table-column>
                    <el-table-column prop="stockIOType" label="处理类型" :formatter="formatType"></el-table-column>
                    <el-table-column prop="isStatus" label="处理状态" :formatter="formatState"></el-table-column>
                    <el-table-column prop="remark" label="处理说明"></el-table-column>
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
                excelData: [],
                modalLoading: false,
                downloadLoading:false,
                start_end_data: "", //时间
                warehouseID: "", // 仓库
                warehouseIDs: '',
                billID: "",
                modalTitle: "",
                checked: false,
                inventoryPersonnelList: [],
                empID: "", //盘点人员
                warehouseList: [], //盘点仓库列表
                inventoryStatusData: [
                    {
                        value: '0',
                        name: '盘点中'
                    },
                    {
                        value: '1',
                        name: '已完成'
                    },
                    {
                        value: "",
                        name: '全部'
                    }
                ], //盘点状态
                inventoryStatus: "全部",  // 盘点状态
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

            formatStatus: function (row) {
                if (row.isStatus == 0) {
                    return "盘点中";
                } else {
                    return "已完成";
                }
            },
            formatState: function (row) {
                if (row.isStatus == 0) {
                    return "未处理";
                } else if (row.isStatus == 1) {
                    return "处理中 ";
                } else {
                    return '正常';
                }
            },
            formatType: function (row) {
                if (row.stockIOType == 0) {
                    return "平仓";
                } else if (row.stockIOType == 1) {
                    return "入库 ";
                } else {
                    return '出库';
                }
            },
            handleDownload() {
                var that = this;
                var start = "";
                var end = "";
                if (that.start_end_data != "" && that.start_end_data != null) {
                    start = util.formatDate.format(that.start_end_data[0], "Y-MM-DD");
                    end = util.formatDate.format(that.start_end_data[1], "Y-MM-DD");
                }
                let params = {
                    start: start,
                    end: end,
                    warehouseID: that.warehouseID,
                    isStatus: that.inventoryStatus,
                    empID: that.empID,
                }
                that.downloadLoading = true
                API.exportPD(params)
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
                        link.download = '库存盘点.xlsx'; //下载的文件名
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
                    if (column.property === "stockIOType") {
                        sums[index] = '';
                        return;
                    }
                    if (column.property === "isStatus") {
                        sums[index] = '';
                        return;
                    }
                    if (index === 2) {
                        sums[index] = '';
                        return;
                    }
                    const values = data.map(item => Number(item[column.property]));
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return parseFloat((prev + curr).toFixed(2));
                            } else {
                                return prev;
                            }
                        }, 0);
                        // sums[index] += ' 元';
                    } else {
                        // sums[index] = 'N/A';
                    }
                });

                return sums;
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
            //员工列表
            inventoryPersonnelData: function () {
                var that = this;
                API.empList()
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.inventoryPersonnelList = res.data;
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
                that.$router.push("/stockControl/inventory/addinventory")
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
                if (that.inventoryStatus == "全部") {
                    that.inventoryStatus = "";
                }
                var start = "";
                var end = "";
                if (that.start_end_data != "" && that.start_end_data != null) {
                    start = util.formatDate.format(that.start_end_data[0], "Y-MM-DD");
                    end = util.formatDate.format(that.start_end_data[1], "Y-MM-DD");
                }
                var params = {
                    pageNum: that.paginations.page,
                    pageSize: that.paginations.page_size,
                    start: start,
                    end: end,
                    warehouseID: that.warehouseID,
                    isStatus: that.inventoryStatus,
                    empID: that.empID,
                }
                API.inventoryList(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.tableData = res.data.list;
                            that.paginations.total = res.data.total;

                            if (res.data.list.length > 0) {
                                that.billID = res.data.list[0].billID;
                                that.warehouseIDs = res.data.list[0].warehouseID;
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
                if (row.isStatus == 1) {
                    that.$router.push({path: "/stockControl/inventory/inventoryDetail", query: {detail: row}})
                } else {
                    that.$router.push({path: "/stockControl/inventory/editInventory", query: {detail: row}})
                }

            },
            // 明细
            orderDetailData: function () {
                var that = this;
                that.loading = true;
                var params = {
                    billID: that.billID
                }
                API.selectNumberByList(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            // res.data.forEach(function (item) {
                            //     item.totalPrice = (item.amount * item.price).toFixed(2);
                            // })
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
                that.warehouseIDs = row.warehouseID;
                that.orderDetailData()
            },

        },
        mounted() {
            var that = this;
            that.warehouseData();
            that.inventoryPersonnelData();
            that.handleSearch();
        }
    };
</script>


<style scoped lang="scss">
</style>
