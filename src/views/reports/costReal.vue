
<template>
    <div v-loading="loading">
        <div class="pad_15 backfff">
            <div class="pad_15 nav_header">
                <el-row>
                    <el-col :span="20">
                        <el-form :inline="true" class="demo-form-inline">
                            <el-form-item label="日期">
                                <el-date-picker
                                        v-model="value1"
                                        type="daterange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="账套单位">
                                <el-select v-model="accountValue" placeholder="请选择">
                                    <el-option
                                            v-for="item in accountList"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="仓库">
                                <el-select v-model="warehouseValue" placeholder="请选择">
                                    <el-option
                                            v-for="item in warehouseList"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="货品用途">
                                <el-select v-model="goodsuseValue" placeholder="请选择">
                                    <el-option
                                            v-for="item in goodsuseList"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="货品名称">
                                <el-input v-model="name" placeholder="请输入"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :span="4" class="text_right">
                        <el-button type="primary" size="mini">搜索</el-button>
                        <el-button type="primary" size="mini">导出</el-button>
                    </el-col>
                </el-row>
            </div>
            <div>
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column prop="job_number" label="仓库"></el-table-column>
                    <el-table-column prop="job_number" label="货品编码"></el-table-column>
                    <el-table-column prop="job_number" label="货品名称"></el-table-column>
                    <el-table-column prop="job_number" label="货品用途"></el-table-column>
                    <el-table-column prop="job_number" label="默认单位"></el-table-column>
                    <el-table-column prop="job_number" label="初期数量"></el-table-column>
                    <el-table-column prop="job_number" label="平均单价"></el-table-column>
                    <el-table-column prop="job_number" label="初期金额"></el-table-column>
                    <el-table-column prop="job_number" label="入库数量"></el-table-column>
                    <el-table-column prop="job_number" label="平均单价"></el-table-column>
                    <el-table-column prop="job_number" label="入库金额"></el-table-column>
                    <el-table-column prop="name" label="出库数量"></el-table-column>
                    <el-table-column prop="name" label="平均单价"></el-table-column>
                    <el-table-column prop="name" label="出库金额"></el-table-column>
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
    export default {
        data() {
            return {
                loading: false,
                dialogVisible: false,
                name: "",
                accountValue:"",
                warehouseValue:"",
                goodsuseValue:"",
                value1:"",
                //货品用途列表
                goodsuseList:[
                    {
                        value:"全部",
                    },
                    {
                        value:"有效",
                    },
                    {
                        value:"无效",
                    }

                ],
                //账套单位列表
                accountList:[
                    {
                        value: "全部",
                    },
                    {
                        value: "凯迪拉克",
                    }
                ],
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },

              //仓库列表
                warehouseList:[
                    {
                        value:"1",
                        label:"直营公司",
                    },
                    {
                        value:"2",
                        label:"加盟商",
                    },
                    {
                        value:"3",
                        label:"合作店",
                    },
                ],
                tableData: [
                    {
                        job_number:'001',
                        name:"肯定不是方便大家拜年的空间拜访客户上班看到就发给v看到就回宾馆",
                        status:"1"
                    },
                    {
                        job_number:'001',
                        name:"rhdsef",
                        status:"1"
                    },
                    {
                        job_number:'001',
                        name:"rhdsef",
                        status:"1"
                    }
                ],
                //需要给分页组件传的信息
                paginations: {
                    page: 1, // 当前位于哪页
                    total: 100, // 总数
                    page_size: 10, // 1页显示多少条
                    layout: "total,sizes, prev, pager, next,jumper" // 翻页属性
                },
            };
        },
        methods: {
            // 数据显示
            handleSearch: function() {
                let that = this;
                that.paginations.page = 1;
                that.search();
            },
            // 数据显示
            search: function() {
                let that = this;
                that.loading = true;
            },
            //编辑
            showEditDialog: function(index, row) {
                var that = this;
            },
            // 上下分页
            handleCurrentChange(page) {
                this.name = "";
            },
            //每页条数
            handleSizeChange(val){
                console.log(`$(val)条`);
            }
        },
        mounted() {}
    };
</script>


<style scoped lang="scss">
</style>
