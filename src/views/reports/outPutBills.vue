<template>
    <div v-loading="loading">
        <div class="pad_5 backfff">
            <div class="pad_5 nav_header">
                <el-row>
                    <el-col :span="24">
                        <el-form :inline="true" class="demo-form-inline">
                            <el-form-item label="单据日期">
                                <el-date-picker
                                        size="mini"
                                        v-model="start_end_data"
                                        type="daterange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                                </el-date-picker>
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
                            <el-form-item label="仓库">
                                <el-select v-model="warehouseID" placeholder="请选择" multiple filterable clearable
                                           size="mini">
                                    <el-option
                                            v-for="item in warehouseList"
                                            :key="item.warehouseID"
                                            :label="item.name"
                                            :value="item.warehouseID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="出入类型">
                                <el-select v-model="stockIOType" placeholder="请选择" multiple filterable clearable
                                           size="mini">
                                    <el-option
                                            v-for="item in typeList"
                                            :key="item.stockIOType"
                                            :label="item.stockIOTypeName"
                                            :value="item.stockIOType">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="单据编号">
                                <el-input type="text" v-model="billNum" placeholder="请输入" clearable
                                          size="mini"></el-input>
                            </el-form-item>

                            <el-form-item>
                                <el-button type="primary" size="mini" @click="handleSearch">搜索</el-button>
                            </el-form-item>
                            <el-form-item style="margin-left:30px;">
                                <el-button type="primary" size="mini" icon="el-icon-download"
                                           v-loading="downloadLoading" @click="billDownload">全部导出
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
            <div>
                <el-table :data="tableData" style="width: 100%" highlight-current-row @current-change="detailClick">
                    <el-table-column prop="warehouseIDName" label="原仓库名称"></el-table-column>
                    <el-table-column prop="stockDestName" label="目标仓库名称"></el-table-column>
                    <el-table-column prop="stockIOTypeName" label="单据类型"></el-table-column>
                    <el-table-column prop="billDate" label="开单日期"></el-table-column>
                    <el-table-column prop="verifyDate" label="审核日期"></el-table-column>
                    <el-table-column prop="billID" label="单据编号"></el-table-column>
                    <el-table-column prop="sourceBillID" label="对应来源单据号"></el-table-column>
                    <el-table-column prop="TIBillID" label="对应调拨入库号"></el-table-column>
                    <el-table-column prop="isConfirm" label="审核标志" :formatter="formatStatus"
                                     width="80px"></el-table-column>
                    <el-table-column prop="Money" label="金额（元）" width="80px"></el-table-column>
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
                <span class="font_14 marrt_20">入库明细</span>
                <!--<el-button type="primary" size="mini" icon="el-icon-download" v-loading="downloadLoading" @click="handleDownload">导出-->
                <!--</el-button>-->
            </div>
            <div>
                <el-table :data="orderDetail" show-summary :summary-method="getSummaries" max-height="400"
                          style="width: 100%">
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column prop="productName" label="商品名称"></el-table-column>
                    <el-table-column prop="productID" label="商品编号"></el-table-column>
                    <el-table-column prop="inUnit" label="默认单位"></el-table-column>
                    <el-table-column prop="pattributeName" label="用途"></el-table-column>
                    <el-table-column prop="specification" label="规格"></el-table-column>
                    <el-table-column prop="maxPrice" label="默认单价（元）"></el-table-column>
                    <el-table-column prop="inAmount" label="默认数量"></el-table-column>
                    <el-table-column prop="unit" label="最小单位"></el-table-column>
                    <el-table-column prop="amount" label="最小数量"></el-table-column>
                    <el-table-column prop="price" label="最小单价（元）"></el-table-column>
                    <el-table-column prop="Money" label="金额（元）"></el-table-column>
                </el-table>
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
                downloadLoading: false,
                dialogVisible: false,
                start_end_data: "", //时间
                warehouseID: "", // 仓库
                entityID: "",  // 经手单位
                stockIOType: "", //出入库类型
                billNum: "",
                billID: "", //单据编号
                warehouseList: [], //仓库列表
                entityList: [], //经手单位
                typeList: [],//出入类型
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
            // 审核状态
            formatStatus: function (row) {
                if (row.stockIOType == "II" && row.isConfirm == 0) {
                    return "未审核";
                } else if (row.stockIOType == "II" && row.isConfirm == 3) {
                    return "已审核";
                } else if (row.stockIOType == "UO" && row.isConfirm == 3) {
                    return "已完成";
                } else if (row.stockIOType == "DO" && row.isConfirm == 0) {
                    return "盘点中";
                } else if (row.stockIOType == "DO" && row.isConfirm == 1) {
                    return "已完成";
                } else if (row.stockIOType == "PD" && row.isConfirm == 0) {
                    return "盘点中";
                } else if (row.stockIOType == "PD" && row.isConfirm == 1) {
                    return "已完成";
                } else if (row.stockIOType == "PI" && row.isConfirm == 0) {
                    return "未入库";
                } else if (row.stockIOType == "PI" && row.isConfirm == 1) {
                    return "已入库";
                } else if (row.stockIOType == "PI" && row.isConfirm == 3) {
                    return "已完成";
                } else if (row.stockIOType == "DI" && row.isConfirm == 0) {
                    return "盘点中";
                } else if (row.stockIOType == "DI" && row.isConfirm == 1) {
                    return "已完成";
                } else if (row.stockIOType == "SO" && row.isConfirm == 0) {
                    return "待发货";
                } else if (row.stockIOType == "SO" && row.isConfirm == 1) {
                    return "已发货";
                } else if (row.stockIOType == "SO" && row.isConfirm == 3) {
                    return "已完成";
                } else if (row.stockIOType == "SI" && row.isConfirm == 0) {
                    return "未审核";
                } else if (row.stockIOType == "SI" && row.isConfirm == 1) {
                    return "已审核";
                } else if (row.stockIOType == "SI" && row.isConfirm == 3) {
                    return "已收货";
                } else if (row.stockIOType == "PO" && row.isConfirm == 0) {
                    return "未发送";
                } else if (row.stockIOType == "PO" && row.isConfirm == 1) {
                    return "已发送";
                } else if (row.stockIOType == "PO" && row.isConfirm == 3) {
                    return "已审核";
                } else if (row.stockIOType == "PO" && row.isConfirm == 4) {
                    return "已退回";
                } else if (row.stockIOType == "RP" && row.isConfirm == 0) {
                    return "未审核";
                } else if (row.stockIOType == "RP" && row.isConfirm == 1) {
                    return "已审核";
                } else if (row.stockIOType == "RP" && row.isConfirm == 2) {
                    return "已作废";
                } else if (row.stockIOType == "TI" && row.isConfirm == 1) {
                    return "待收货";
                } else if (row.stockIOType == "TI" && row.isConfirm == 3) {
                    return "已收货";
                } else if (row.stockIOType == "TO" && row.isConfirm == 1) {
                    return "待发货";
                } else if (row.stockIOType == "TO" && row.isConfirm == 3) {
                    return "已发货";
                }
            },
            getSummaries(param) {
                const {columns, data} = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计';
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
            // 导出
            billDownload() {
                var that = this;
                this.downloadLoading = true
                var start = "";
                var end = "";
                if (that.start_end_data != "" && that.start_end_data != null) {
                    start = util.formatDate.format(that.start_end_data[0], "Y-MM-DD");
                    end = util.formatDate.format(that.start_end_data[1], "Y-MM-DD");
                }
                var warehouseEntityList = [];

                that.warehouseID.forEach(function (item) {
                    if (item != "") {
                        warehouseEntityList.push({warehouseID: item})
                    }
                })
                var stockIOTypeList = [];
                that.stockIOType.forEach(function (item) {
                    if (item != "") {
                        stockIOTypeList.push({stockIOType: item})
                    }

                })
                let params = {
                    siteID:localStorage.getItem('siteID'),
                    empID:JSON.parse(localStorage.getItem('access-user')).empID,
                    start: start,
                    end: end,
                    entityID: that.entityID,
                    warehouseEntityList:warehouseEntityList,
                    stockIOTypeList: stockIOTypeList,
                    billID: that.billNum,
                };
                API.exportIOWarehouse(params).then(res => {
                    this.$message.success({
                        message: '正在导出',
                        duration: '4000'
                    })
                    const link = document.createElement("a");
                    let blob = new Blob([res], {type: 'application/octet-stream'});
                    link.style.display = "none";
                    link.href = URL.createObjectURL(blob);
                    // link.download = res.headers['content-disposition'] //下载后文件名
                    link.download = '单据出入库报表.xlsx'; //下载的文件名
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }).finally(()=>{
                    this.downloadLoading = false
                })
            },
            // handleDownload() {
            //     this.downloadLoading = true
            //     import('@/vendor/Export2Excel').then(excel => {
            //         const tHeader = ['原仓库名称', '目标仓库名称', '单据编号', '单据类型', '操作员编号', '操作员姓名', '开始日期', '审核日期', '商品名称', '商品编号', '默认单位', '用途', '规格', '默认单价（元）', '默认数量', '最小单位', '最小数量', '最小单价（元）', '金额（元）']
            //         const filterVal = ['warehouseIDName', 'stockDestName', 'billID', 'stockIOTypeName', 'verifyID', 'verifyName', 'billDate', 'verifyDate', 'productName', 'productID', 'inUnit', 'pattributeName', 'specification', 'maxPrice', 'inAmount', 'unit', 'amount', 'price', 'Money']
            //         const data = this.formatJson(filterVal, this.orderDetail)
            //         excel.export_json_to_excel({
            //             header: tHeader,
            //             data,
            //             filename: '单据出入库报表明细'
            //         })
            //         this.downloadLoading = false
            //     })
            // },
            // formatJson(filterVal, jsonData) {
            //     return jsonData.map(v => filterVal.map(j => {
            //         if (j === 'timestamp') {
            //             return parseTime(v[j])
            //         } else {
            //             return v[j]
            //         }
            //     }))
            // },
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
            // 出入类型
            typeData: function () {
                var that = this;
                API.getType()
                    .then(res => {
                        if (res.stateCode == 100) {
                            res.data.unshift({
                                stockIOTypeName: "全部",
                                stockIOType: ""
                            })
                            that.typeList = res.data;
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
                that.billID = "";
                that.orderDetail = [];
                // if (that.start_end_data == "" && that.entityID == "" && that.warehouseID == "" && that.stockIOType == "" && that.billNum == "") {
                //     that.$message.error({
                //         message: '请筛选条件',
                //         duration: 2000
                //     })
                //     that.tableData = [];
                //     return false;
                // }
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
                var warehouseEntityList = [];

                that.warehouseID.forEach(function (item) {
                    if (item != "") {
                        warehouseEntityList.push({warehouseID: item})
                    }
                })
                var stockIOTypeList = [];
                that.stockIOType.forEach(function (item) {
                    if (item != "") {
                        stockIOTypeList.push({stockIOType: item})
                    }

                })
                var params = {
                    start: start,
                    end: end,
                    entityID: that.entityID,
                    warehouseEntityList: warehouseEntityList,
                    stockIOTypeList: stockIOTypeList,
                    billID: that.billNum,
                    pageNum: that.paginations.page,
                    pageSize: that.paginations.page_size
                }
                API.getDocuments(params)
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
            // 明细
            orderDetailData: function () {
                var that = this;
                that.loading = true;
                var params = {
                    billID: that.billID
                }
                API.documentsDetails(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            res.data.forEach(function (item) {
                                item.Money = (item.amount * item.price).toFixed(2);
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
            that.entityData();
            that.typeData();
        }
    };
</script>


<style scoped lang="scss">
</style>
