<template>
    <div v-loading="loading">
        <div class="pad_15">
            <el-row>
                <el-col :span="12" >
                  <div class="font_weight_600 font_16 color_blue">{{title}}</div>
                </el-col>
                <el-col :span="12" class="text_right">
                    <el-button type="primary" size="mini" plain @click="cancelClick">返回</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="pad_5 backfff">

            <div class="pad_5 nav_header">
                <el-row>
                    <el-col :span="24">
                        <el-form :inline="true" class="demo-form-inline">
                            <el-form-item label="货品类别">
                                <el-select v-model="pCategory" placeholder="请选择" clearable size="mini">
                                    <el-option
                                            v-for="item in categoryList"
                                            :key="item.pcategory"
                                            :label="item.name"
                                            :value="item.pcategory">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="货品">
                                <el-input type="text" v-model="name" placeholder="请输入" clearable size="mini"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" size="mini" @click="handleSearch">搜索</el-button>
                            </el-form-item>
                            <el-form-item style="margin-left:30px;">
                                <el-button type="primary" size="mini" icon="el-icon-download" v-loading="downloadLoading" @click="handleDownload">全部导出</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </div>

            <div>
                <el-table :data="tableData" style="width: 100%" >
                    <el-table-column prop="productIDName" label="货品名称"></el-table-column>
                    <el-table-column prop="productID" label="货品编码"></el-table-column>
                    <el-table-column prop="specification" label="规格"></el-table-column>
                    <el-table-column prop="pCategory" label="货品类别"></el-table-column>
                    <el-table-column prop="Unit" label="默认单位"></el-table-column>
                    <el-table-column prop="amount" label="剩余数量" ></el-table-column>
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


    export default {
       data(){
           return{
               loading:false,
               downloadLoading:false,
               title:"",
               warehouseID:"",
               pCategory:"",
               name:"",
               categoryList:[],
               tableData:[],
               //需要给分页组件传的信息
               paginations: {
                   page: 1, // 当前位于哪页
                   total: 0, // 总数
                   page_size: 10, // 1页显示多少条
                   layout: "total,sizes, prev, pager, next,jumper" // 翻页属性
               },
           }
       },
        methods:{
            // 取消
            cancelClick: function () {
                var that = this;
                that.$router.go(-1);
            },

            // 导出
            handleDownload() {
                this.downloadLoading = true
                let params = {
                    warehouseID: this.warehouseID,
                };
                API.exportGood(params).then(res=>{
                    this.$message.success({
                        message: '正在导出',
                        duration: '4000'
                    })
                    const link = document.createElement("a");
                    let blob = new Blob([res], {type: 'application/octet-stream'});
                    link.style.display = "none";
                    link.href = URL.createObjectURL(blob);
                    // link.download = res.headers['content-disposition'] //下载后文件名
                    link.download = '货品实时库存报表.xlsx'; //下载的文件名
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }).finally(()=>{
                    this.downloadLoading = false
                })
            },
            // 获取类别
            categoryData: function () {
                var that = this;
                var params = {
                    active:true
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
                    keyword:that.name,
                    pCategory:that.pCategory,
                    warehouseID: that.warehouseID,
                    pageNum: that.paginations.page,
                    pageSize: that.paginations.page_size
                }
                API.getWarehouseDdetail(params)
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
        mounted(){
           var that = this;
           that.title = that.$route.query.warehouse.name;
           that.warehouseID = that.$route.query.warehouse.warehouseID;
           that.categoryData();
           that.handleSearch();
        }
    }
</script>

<style scoped>

</style>