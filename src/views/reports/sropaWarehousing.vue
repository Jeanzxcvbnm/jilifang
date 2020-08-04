
<template>
    <div v-loading="loading">
        <div class="pad_15 backfff">
            <div class="pad_15 nav_header">
                <el-row>
                    <el-col :span="22">
                        <el-form :inline="true" class="demo-form-inline">
                            <el-form-item label="单据日期">
                                <el-date-picker
                                        v-model="value1"
                                        type="daterange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="货品类别">
                                <el-select v-model="typeValue" placeholder="请选择">
                                    <el-option
                                            v-for="item in typeList"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="仓库">
                                <el-select v-model="unitWarehouseuValue" placeholder="请选择">
                                    <el-option
                                            v-for="item in unitWarehouseuList"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="经手单位">
                                <el-select v-model="handlingUnitValue" filterable clearable placeholder="请选择">
                                    <el-option
                                            v-for="item in handlingUnitList"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :span="2" class="text_right">
                        <el-button type="primary" size="mini">搜索</el-button>
                        <el-button type="primary" size="mini">导出</el-button>
                    </el-col>
                </el-row>
            </div>
            <div>
                <el-table :data="tableData" style="width: 100%"  >
                    <el-table-column prop="job_number" label="货品编码" align="center"></el-table-column>
                    <el-table-column prop="job_number" label="货品名称" align="center"></el-table-column>
                    <el-table-column prop="job_number" label="规格" align="center"></el-table-column>
                    <el-table-column prop="job_number" label="货品类别" align="center"></el-table-column>
                    <el-table-column prop="job_number" label="单位" align="center"></el-table-column>
                    <el-table-column prop="job_number" label="数量" align="center"></el-table-column>
                    <el-table-column prop="job_number" label="单价" align="center"></el-table-column>
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
        <el-dialog title="单据明细" :visible.sync="dialogVisible" width="50%">

            <div>
                <el-table :data="moreData" style="width: 100%">
                    <el-table-column prop="serialNumber" label="序号">
                    </el-table-column>
                    <el-table-column prop="serialNumber" label="商品编号">
                    </el-table-column>
                    <el-table-column prop="name" label="名称"></el-table-column>
                    <el-table-column prop="name" label="默认单位"></el-table-column>
                    <el-table-column prop="name" label="类别"></el-table-column>
                    <el-table-column prop="name" label="用途"></el-table-column>
                    <el-table-column prop="name" label="规格"></el-table-column>
                    <el-table-column prop="name" label="批次号"></el-table-column>
                    <el-table-column prop="price" label="生产日期"></el-table-column>
                    <el-table-column prop="price" label="失效日期"></el-table-column>
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">保 存</el-button>
      </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                loading: false,
                dialogVisible: false,
                name: "",
                unitWarehouseuValue:"",
                typeValue:"",
                handlingUnitValue:"",
                value1:"",
                //经手单位列表
                handlingUnitList:[
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
                //货品类别列表
                typeList:[
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
                unitWarehouseuList:[
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
                moreData: [{
                    serialNumber:"1",
                    price:"1",
                    name: '1',

                },
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
                that.dialogVisible = true;

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
