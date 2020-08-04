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

                            <el-form-item label="仓库">
                                <el-select size="mini" v-model="warehouseID" placeholder="请选择" filterable multiple clearable>
                                    <el-option
                                            v-for="item in warehouseList"
                                            :key="item.warehouseID"
                                            :label="item.name"
                                            :value="item.warehouseID">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="订单编号" >
                                <el-input type="text" v-model="billID" placeholder="请输入" clearable
                                          size="mini" style="width: 220px"></el-input>
                            </el-form-item>
                            <el-form-item label="货品名称">
                                <el-input type="text" v-model="name" placeholder="请输入货品名称或编号" clearable
                                          size="mini"></el-input>
                            </el-form-item>

                            <el-form-item>
                                <el-button type="primary" size="mini" @click="handleSearch">搜索</el-button>
                            </el-form-item>
                            <el-form-item style="margin-left:30px;">
                                <el-button type="primary" size="mini" icon="el-icon-download" @click="handleDownload" v-loading="downloadLoading">全部导出</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
            <div>
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column prop="billID" label="订单编号">
                    </el-table-column>
                    <el-table-column prop="warehouseIDName" label="仓库"></el-table-column>
                    <el-table-column prop="productID" label="货品编号"></el-table-column>
                    <el-table-column prop="productIDName" label="货品名称"></el-table-column>
                    <el-table-column prop="pCategoryName" label="货品类别"></el-table-column>
                    <el-table-column prop="inUnit" label="默认单位"></el-table-column>
                    <el-table-column prop="inAmount" label="默认数量"></el-table-column>
                    <el-table-column prop="unit" label="最小单位"></el-table-column>
                    <el-table-column prop="amount" label="最小数量"></el-table-column>
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
                downloadLoading:false,
                dialogVisible: false,
                name: "",
                start_end_data: "", //时间
                warehouseID: "", // 仓库
                billID: "", //订单编号
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
            handleDownload() {
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
                let params = {
                    start: start,
                    end: end,
                    warehouseEntityList: warehouseEntityList,
                    billID: that.billID,
                    keyword: that.name,
                };
                API.exportRPDetail(params).then(res=>{
                    this.$message.success({
                        message: '正在导出',
                        duration: '4000'
                    })
                    const link = document.createElement("a");
                    let blob = new Blob([res], {type: 'application/octet-stream'});
                    link.style.display = "none";
                    link.href = URL.createObjectURL(blob);
                    // link.download = res.headers['content-disposition'] //下载后文件名
                    link.download = '调拨申请明细表.xlsx'; //下载的文件名
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }).finally(()=>{
                    this.downloadLoading = false
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
                var start = "";
                var end = "";
                if (that.start_end_data != "" && that.start_end_data != null) {
                    start = util.formatDate.format(that.start_end_data[0], "Y-MM-DD");
                    end = util.formatDate.format(that.start_end_data[1], "Y-MM-DD");
                }
                var warehouseEntityList = [];

                that.warehouseID.forEach(function (item) {
                    warehouseEntityList.push({warehouseID: item})
                })
                var params = {
                    start: start,
                    end: end,
                    warehouseEntityList: warehouseEntityList,
                    billID: that.billID,
                    keyword: that.name,
                    pageNum: that.paginations.page,
                    pageSize: that.paginations.page_size
                }
                API.getReplenishment(params)
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
