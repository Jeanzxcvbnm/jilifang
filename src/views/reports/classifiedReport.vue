<template>
    <div v-loading="loading">
        <div class="pad_15 backfff">
            <div class="pad_15 nav_header">
                <el-row>
                    <el-col :span="24">
                        <el-form :inline="true" class="demo-form-inline">
                            <el-form-item label="月结批次">
                                <el-select v-model="settleValue" placeholder="请选择" clearable size="mini">
                                    <el-option
                                            v-for="item in settleList"
                                            :key="item"
                                            :label="item"
                                            :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="货品">
                                <el-input type="text" v-model="name" placeholder="请输入名称或编号" clearable
                                          size="mini"></el-input>
                            </el-form-item>
                            <el-form-item label="货品用途">
                                <el-select v-model="pattribute" placeholder="请选择" clearable size="mini">
                                    <el-option
                                            v-for="item in useList"
                                            :key="item.pattribute"
                                            :label="item.name"
                                            :value="item.pattribute">
                                    </el-option>
                                </el-select>
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
                                <el-checkbox v-model="checked">0库存不显示</el-checkbox>
                            </el-form-item>
                            <el-form-item style="margin-left: 30px;">
                                <el-button type="primary" size="mini" @click="handleSearch">搜索</el-button>
                            </el-form-item>
                            <el-form-item style="margin-left: 30px;">
                                <el-button type="primary" size="mini" icon="el-icon-download"
                                           v-loading="downloadLoading" @click="handleDownload">全部导出
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
            <div style="width:100%;over-flow-x:auto;">
                <el-table :data="tableData" show-summary :summary-method="getSummaries" style="width: 100%;"
                          max-height="600">
                    <el-table-column prop="batchID" label="月结批次" align="center" width="90px"></el-table-column>
                    <el-table-column prop="warehouseName" label="仓库" align="center" width="150px"></el-table-column>
                    <el-table-column prop="productID" label="货品编码" align="center" width="100px"></el-table-column>
                    <el-table-column prop="productName" label="货品名称" align="center" width="200px"></el-table-column>
                    <el-table-column prop="pCategoryName" label="类别" align="center"></el-table-column>
                    <el-table-column prop="pattributeName" label="用途" align="center"></el-table-column>
                    <el-table-column prop="specification" label="规格" align="center"></el-table-column>
                    <el-table-column prop="unit" label="单位" align="center"></el-table-column>
                    <el-table-column label="期初库存" align="center">
                        <el-table-column
                                prop="inAmount1"
                                label="数量"
                                align="center">
                        </el-table-column>
                        <el-table-column
                                prop="oldPrice"
                                label="单价（元）"
                                align="center">
                        </el-table-column>
                        <el-table-column
                                prop="oneNum"
                                label="金额（元）"
                                align="center">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="采购入库" align="center">
                        <el-table-column
                                prop="inAmount2"
                                label="数量"
                                align="center">
                        </el-table-column>
                        <el-table-column
                                prop="inPrice"
                                label="单价（元）"
                                align="center">
                        </el-table-column>
                        <el-table-column
                                prop="twoNum"
                                label="金额（元）"
                                align="center">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="采购退货" align="center">
                        <el-table-column
                                prop="inAmount3"
                                label="数量"
                                align="center">
                        </el-table-column>
                        <el-table-column
                                prop="inPrice"
                                label="单价（元）"
                                align="center">
                        </el-table-column>
                        <el-table-column
                                prop="threeNum"
                                label="金额（元）"
                                align="center">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="盘点入库" align="center">
                        <el-table-column
                                prop="inAmount4"
                                label="数量"
                                align="center">
                        </el-table-column>
                        <el-table-column
                                prop="outPrice"
                                label="单价（元）"
                                align="center">
                        </el-table-column>
                        <el-table-column
                                prop="fourNum"
                                label="金额（元）"
                                align="center">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="盘点出库" align="center">
                        <el-table-column
                                prop="inAmount5"
                                label="数量"
                                align="center">
                        </el-table-column>
                        <el-table-column
                                prop="outPrice"
                                label="单价（元）"
                                align="center">
                        </el-table-column>
                        <el-table-column
                                prop="fiveNum"
                                label="金额（元）"
                                align="center">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="调拨入库" align="center">
                        <el-table-column
                                prop="inAmount6"
                                label="数量"
                                align="center">
                        </el-table-column>
                        <el-table-column
                                prop="outPrice"
                                label="单价（元）"
                                align="center">
                        </el-table-column>
                        <el-table-column
                                prop="sixNum"
                                label="金额（元）"
                                align="center">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="调拨出库" align="center">
                        <el-table-column
                                prop="inAmount7"
                                label="数量"
                                align="center">
                        </el-table-column>
                        <el-table-column
                                prop="outPrice"
                                label="单价（元）"
                                align="center">
                        </el-table-column>
                        <el-table-column
                                prop="sevenNum"
                                label="金额（元）"
                                align="center">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="销售出库" align="center">
                        <el-table-column
                                prop="inAmount8"
                                label="数量"
                                align="center">
                        </el-table-column>
                        <el-table-column
                                prop="outPrice"
                                label="单价（元）"
                                align="center">
                        </el-table-column>
                        <el-table-column
                                prop="eightNum"
                                label="金额（元）"
                                align="center">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="销售退货" align="center">
                        <el-table-column
                                prop="inAmount9"
                                label="数量"
                                align="center">
                        </el-table-column>
                        <el-table-column
                                prop="outPrice"
                                label="单价（元）"
                                align="center">
                        </el-table-column>
                        <el-table-column
                                prop="nineNum"
                                label="金额（元）"
                                align="center">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="消耗出库" align="center">
                        <el-table-column
                                prop="inAmount10"
                                label="数量"
                                align="center">
                        </el-table-column>
                        <el-table-column
                                prop="outPrice"
                                label="单价（元）"
                                align="center">
                        </el-table-column>
                        <el-table-column
                                prop="tenNum"
                                label="金额（元）"
                                align="center">
                        </el-table-column>
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
                downloadLoading: false,
                dialogVisible: false,
                name: "",
                checked: false,
                settleValue: '',
                settleList: [],//月结批次
                start_end_data: "",
                useList: [],//货品用途,
                categoryList: [],//货品类别
                pattribute: "", //用途,
                categoryValue: "", //类别
                warehouseList: [], //仓库列表
                warehouseID: "",
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
            getSummaries(param) {
                const {columns, data} = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计';
                        return;
                    }
                    if (column.property === "a") {
                        sums[index] = '';
                        return;
                    }
                    if (index==2 ||index==9 || index==12 || index==15 ||index==18||index==21 ||index==24 ||index==27 ||index==30 ||index==33 ||index==36){
                        sums[index] = '';
                        return;
                    }
                    // if (column.property === "isStatus") {
                    //     sums[index] = '';
                    //     return;
                    // }
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
            handleDownload() {
                var that = this;
                this.downloadLoading = true
                let params = {
                    siteID: localStorage.getItem('siteID'),
                    empID: JSON.parse(localStorage.getItem('access-user')).empID,
                    settleValue: that.settleValue,
                    keyword: that.name,
                    warehouseID: that.warehouseID,
                    pattribute: that.pattribute,
                    pcategory: that.categoryValue,
                    checked: that.checked == true ? 1 : 0,
                };
                API.exportOutInType(params).then(res => {
                    this.$message.success({
                        message: '正在导出',
                        duration: '4000'
                    })
                    const link = document.createElement("a");
                    let blob = new Blob([res], {type: 'application/octet-stream'});
                    link.style.display = "none";
                    link.href = URL.createObjectURL(blob);
                    // link.download = res.headers['content-disposition'] //下载后文件名
                    link.download = '出入库成分类型表.xlsx'; //下载的文件名
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }).finally(() => {
                    this.downloadLoading = false
                })
            },
            // // 获取类别
            categoryData: function () {
                var that = this;
                var params = {
                    active: true
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
            // // 获取用途
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
            //月结批次
            settleData: function () {
                var that = this;
                API.settleList()
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.settleList = res.data;
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
                    settleValue: that.settleValue,
                    keyword: that.name,
                    warehouseID: that.warehouseID,
                    pattribute: that.pattribute,
                    pcategory: that.categoryValue,
                    checked: that.checked == true ? 1 : 0,
                    pageNum: that.paginations.page,
                    pageSize: that.paginations.page_size
                }

                API.findOutInDataTypeList(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            res.data.list.forEach(function (item) {
                                item.oneNum = (item.inAmount1 * item.oldPrice).toFixed(2);
                                item.twoNum = (item.inAmount2 * item.inPrice).toFixed(2);
                                item.threeNum = (item.inAmount3 * item.inPrice).toFixed(2);
                                item.fourNum = (item.inAmount4 * item.outPrice).toFixed(2);
                                item.fiveNum = (item.inAmount5 * item.outPrice).toFixed(2);
                                item.sixNum = (item.inAmount6 * item.outPrice).toFixed(2);
                                item.sevenNum = (item.inAmount7 * item.outPrice).toFixed(2);
                                item.eightNum = (item.inAmount8 * item.outPrice).toFixed(2);
                                item.nineNum = (item.inAmount9 * item.outPrice).toFixed(2);
                                item.tenNum = (item.inAmount10 * item.outPrice).toFixed(2);
                            })
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
        },
        mounted() {
            var that = this;
            that.warehouseData();
            that.categoryData();
            that.useData();
            that.handleSearch();
            that.settleData();
        }
    };
</script>


<style scoped lang="scss">

</style>
