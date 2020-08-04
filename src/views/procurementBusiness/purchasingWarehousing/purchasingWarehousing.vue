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
                            <el-form-item label="收货仓库">
                                <el-select v-model="warehouseID" placeholder="请选择" clearable size="mini">
                                    <el-option
                                            v-for="item in warehouseList"
                                            :key="item.warehouseID"
                                            :label="item.name"
                                            :value="item.warehouseID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="供应商">
                                <el-select v-model="custID" placeholder="请选择" clearable size="mini">
                                    <el-option
                                            v-for="item in supplierList"
                                            :key="item.custID"
                                            :label="item.name"
                                            :value="item.custID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="单据状态">
                                <el-select v-model="isConfirm" placeholder="请选择" clearable size="mini">
                                    <el-option
                                            v-for="item in status"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" size="mini" @click="handleSearch">搜索</el-button>
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
                    <el-table-column prop="billID" label="订单编号">
                    </el-table-column>
                    <el-table-column prop="custName" label="供应商"></el-table-column>
                    <el-table-column prop="warehouseName" label="收货仓库"></el-table-column>
                    <el-table-column prop="entityName" label="经手单位"></el-table-column>
                    <el-table-column prop="billDate" label="开单日期"></el-table-column>
                    <!--<el-table-column prop="verifyDate" label="审核日期"></el-table-column>-->
                    <el-table-column prop="isConfirm" label="订单状态" :formatter="formatStatus"></el-table-column>
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
                                    type="primary"
                                    size="mini"
                                    v-if="scope.row.isConfirm==0 "
                                    @click.stop="affirmClick(scope.row)"
                            >确认入库
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
                <span class="font_14 marrt_20">采购明细</span>
                <!--<el-button type="primary" size="mini" icon="el-icon-printer">打印</el-button>-->
                <!--<el-button type="primary" size="mini" icon="el-icon-s-unfold">导出</el-button>-->
            </div>
            <div>
                <el-table :data="orderDetail" show-summary :summary-method="getSummaries" max-height="400"
                          style="width: 100%">
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column prop="name" label="名称"></el-table-column>
                    <el-table-column prop="productID" label="货品编号"></el-table-column>
                    <el-table-column prop="inAmount" label="输入数量"></el-table-column>
                    <el-table-column prop="inUnit" label="选择单位"></el-table-column>
                    <el-table-column prop="maxPrice" label="选择单位单价（元）"></el-table-column>
                    <el-table-column prop="unit" label="最小单位"></el-table-column>
                    <el-table-column prop="price" label="最小单价（元）"></el-table-column>
                    <el-table-column prop="amount" label="最小单位数量合计"></el-table-column>
                    <el-table-column prop="cgAmount" label="采购数量"></el-table-column>
                    <el-table-column prop="hasInAmount" label="已入库数量"></el-table-column>
                    <el-table-column prop="totalPrice" label="合计金额（元）"></el-table-column>
                </el-table>
            </div>
        </div>
        <div class="martp_20">
            <img :src="imgUrl">
            <div class="pad_20 backfff">
                <el-row>
                    <el-col :span="3" class="el-cols">
                        <div class="grid-content">
                            <div class="box">1</div>
                            <div class="div1-1">采购订货</div>
                            <div class="div2-1">创建订单</div>
                        </div>
                    </el-col>
                    <el-col :span="3" class="el-cols" :offset="3">
                        <div class="grid-content">
                            <div class="box">2</div>
                            <div class="div1-2">采购审核</div>
                            <div class="div2-2">订单审核</div>
                        </div>
                    </el-col>
                    <el-col :span="3" class="el-cols" :offset="3">
                        <div class="grid-content bg-purple">
                            <div class="box">3</div>
                            <div class="div1-3">采购入库</div>
                            <div class="div2-3">货品入库</div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
    import API from "@/api/procurementBusiness";
    import util from "@/components/js/util"

    export default {
        data() {
            return {
                loading: false,
                dialogVisible: false,
                downloadLoading:false,
                start_end_data: "", //时间
                warehouseID: "", // 入库仓库
                isConfirm: "0",  // 单据状态
                imgUrl: require('../../../assets/img/biaoti.png'),
                billID: "",
                custID: "",
                warehouseList: [], //仓库列表
                supplierList: [],//供应商列表
                status: [
                    {name: "未入库", id: "0"},
                    {name: "已入库", id: "1"},
                    {name: "已完成", id: "3"},
                    {name: "全部", id: ""},
                ],
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
            // 单据状态
            formatStatus: function (row) {
                if (row.isConfirm == 0) {
                    return "未入库";
                } else if (row.isConfirm == 1) {
                    return "已入库";
                } else if (row.isConfirm == 3) {
                    return "已完成";
                } else {
                    return "已发货";
                }
            },
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
                    isConfirm: that.isConfirm,
                    warehouseID: that.warehouseID,
                    custID: that.custID,
                }
                that.downloadLoading=true
                API.exportTPI(params)
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
                        link.download = '采购入库.xlsx'; //下载的文件名
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
                    if (index == 3 || index == 5 || index == 7) {
                        sums[index] = '';
                        return
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
                        if (index===11){
                            sums[index]=sums[index].toFixed(2)
                        }
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
                var params = {
                    Type: 1,
                }
                API.warehouseList(params)
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
            //供应商
            siteCustomerData: function () {
                var that = this;
                API.siteCustomerList()
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.supplierList = res.data;
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
                    isConfirm: that.isConfirm,
                    warehouseID: that.warehouseID,
                    custID: that.custID,
                    pageNum: that.paginations.page,
                    pageSize: that.paginations.page_size
                }
                API.purchaseList(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.tableData = res.data.list;
                            that.paginations.total = res.data.total;
                            if (res.data.list.length > 0) {
                                that.billID = res.data.list[0].billID;
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
                if (row.isConfirm == 0 || row.isConfirm == 1) {
                    that.$router.push({
                        path: "/procurementBusiness/purchasingWarehousing/confirmWarehousing",
                        query: {detail: row}
                    })
                } else {
                    that.$router.push({
                        path: "/procurementBusiness/purchasingWarehousing/purchasingWarehousingDetail",
                        query: {detail: row}
                    })
                }
            },
            // 确认入库
            affirmClick: function (row) {
                var that = this;
                that.loading = true;
                let outParams = {
                    billID: row.billID
                }
                API.purchaseOrderDetails(outParams)
                    .then(res => {
                        if (res.stateCode == 100) {
                            let param = {
                                custID: row.custID,
                                billID: row.billID,
                                warehouseID: row.warehouseID,
                                billDate: row.billDate,
                                purchaseDEntities: res.data
                            }
                            API.purchasePIOrders(param)
                                .then(res => {
                                    if (res.stateCode == 100) {
                                        that.$message({
                                            message: "入库成功",
                                        });
                                        that.search();
                                    } else {
                                        that.$message.error({
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
                                .finally(function () {
                                    that.loading = false;
                                });
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
            // 明细
            orderDetailData: function () {
                var that = this;
                that.loading = true;
                var params = {
                    billID: that.billID
                }
                API.purchaseOrderDetails(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            res.data.forEach(function (item) {
                                item.totalPrice = (item.hasInAmount * item.maxPrice).toFixed(2);
                                item.cgAmount=parseInt(item.cgAmount)
                                item.hasInAmount=parseInt(item.hasInAmount)
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
            detailClick: function (row) {
                var that = this;
                that.billID = row.billID;
                that.orderDetailData()
            }
        },
        mounted() {
            var that = this;
            that.warehouseData();
            that.siteCustomerData();
            that.handleSearch();
        }
    };
</script>


<style scoped lang="scss">
    .el-row {
        margin-bottom: 20px;
        &:last-child {
            margin-bottom: 0;
        }
    }

    .el-cols {
        border-radius: 8px;
        border: 1px solid rgb(238, 238, 238);
    }

    .bg-purple {
        background: rgb(244, 251, 255);
    }

    .bg-purple-light {
        background: white;
    }

    .grid-content {
        border-radius: 4px;
        min-height: 90px;
    }

    .div1-1 {
        margin-left: 30%;
        font-size: 15px
    }

    .div2-1 {
        margin-left: 34%;
        padding-top: 5px;
    }

    .div1-2 {
        margin-left: 30%;
        font-size: 15px
    }

    .div2-2 {
        margin-left: 34%;
        padding-top: 5px;
    }

    .div1-3 {
        margin-left: 30%;
        font-size: 15px
    }

    .div2-3 {
        margin-left: 33%;
        padding-top: 5px;

    }

    .div1-4 {
        margin-left: 30%;
        font-size: 15px
    }

    .div2-4 {
        margin-left: 33%;
        padding-top: 5px;
    }

    .box {
        width: 30px;
        height: 30px;
        line-height: 30px;
        border-radius: 15px;
        font-size: 16px;
        background: hsl(210, 95%, 59%);
        color: white;
        text-align: center;
        margin-left: -15px;
        margin-top: -12px;
    }
</style>
