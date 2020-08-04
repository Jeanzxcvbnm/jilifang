<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="6">
                <div class="backfff pad_15">
                    <div class="pad_0_15 padbm_15 border_bottom  dis_flex flex_x_between flex_y_center">
                        <span class="font_weight_600 font_14">各门店销售总计</span>
                        <el-select v-model="dateValue" placeholder="请选择" style="width: 120px" size="mini" @change="dataChange">
                            <el-option label="昨天" value="1"> </el-option>
                            <el-option label="近7天" value="2"> </el-option>
                            <el-option label="近30天" value="3"> </el-option>
                        </el-select>
                    </div>
                    <div class="contet">
                        <div class="dis_flex flex_x_around pad_15_0">
                            <div>数量</div>
                            <div class="numColor">148</div>
                        </div>
                        <div class="dis_flex flex_x_around pad_15_0">
                            <div>金额（元）</div>
                            <div class="moneyColor">283,016.98</div>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="backfff pad_15">
                    <div class="pad_0_15 padbm_15 border_bottom font_weight_600 font_14">仓库实时库存</div>
                    <div class="contet">
                        <div class="dis_flex flex_x_around pad_15_0">
                            <div>数量</div>
                            <div class="numColor">1036</div>
                        </div>
                        <div class="dis_flex flex_x_around pad_15_0">
                            <div>金额（元）</div>
                            <div class="moneyColor">981,248.36</div>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="backfff pad_15">
                    <div class="pad_0_15 padbm_15 border_bottom font_weight_600 font_14">门店实时库存</div>
                    <div class="contet">
                        <div class="dis_flex flex_x_around pad_15_0">
                            <div>数量</div>
                            <div class="numColor">102</div>
                        </div>
                        <div class="dis_flex flex_x_around pad_15_0">
                            <div>金额（元）</div>
                            <div class="moneyColor">126,231.00</div>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="backfff pad_15">
                    <div class="pad_0_15 padbm_15 border_bottom font_weight_600 font_14">统计配置</div>
                    <div class="pad_0_15 contet">
                        <div class="dis_flex flex_x_between border_bottom pad_10_0" @click="warehouseModal">
                            <div>仓库选择</div>
                            <div> <i class="el-icon-arrow-right"></i></div>
                        </div>
                        <div class="dis_flex flex_x_between border_bottom pad_10_0" @click="storeModal">
                            <div>门店选择</div>
                            <div> <i class="el-icon-arrow-right"></i> </div>
                        </div>
                        <div class="dis_flex flex_x_between border_bottom pad_10_0" @click="categoryModal">
                            <div>品类选择</div>
                            <div> <i class="el-icon-arrow-right"></i> </div>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <div class="backfff">
                    <div class="pad_20 titles">总库存各类别金额占比（仓库+门店）</div>
                    <div id="myChart" :style="{width: '100%', height: '400px'}"></div>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="backfff">
                    <div class="pad_20 titles">近30天门店各类别销售金额占比</div>
                    <div id="myChart2" :style="{width: '100%', height: '400px'}"></div>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="24">
                <!--<el-card shadow="hover">-->
                <!--<schart ref="bar" class="schart" canvasId="bar" :data="data" type="bar" :options="options"></schart>-->
                <!--</el-card>-->
            </el-col>
        </el-row>


        <!-- 仓库弹窗 -->
        <el-dialog class="modal" title="仓库选择" :visible.sync="dialogVisible" width="30%">
            <div>
                <el-col :span="24" class="text_center search_header">
                    <el-input placeholder="输入编号或名称或缩写搜索" v-model="name" class="input-with-select">
                        <el-button slot="append" type="primary" @click="warehouseData">查询</el-button>
                    </el-input>
                </el-col>
                <el-table
                        :data="warehouseList"
                        border
                        highlight-current-row
                        @selection-change="warehouseChange"
                        max-height="300"
                        style="width: 100%"
                >
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column prop="warehouseID" label="编号"></el-table-column>
                    <el-table-column prop="name" label="名称"></el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" :loading="Loading" @click="warehouseSubmit">保 存</el-button>
            </div>
        </el-dialog>

        <!-- 门店弹窗 -->
        <el-dialog class="modal" title="门店选择" :visible.sync="storeVisible" width="30%">
            <div>
                <el-col :span="24" class="text_center search_header">
                    <el-input placeholder="输入编号或名称或缩写搜索" v-model="name" class="input-with-select">
                        <el-button slot="append" type="primary" @click="storeData">查询</el-button>
                    </el-input>
                </el-col>
                <el-table
                        :data="storeList"
                        border
                        highlight-current-row
                        @selection-change="warehouseChange"
                        max-height="300"
                        style="width: 100%"
                >
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column prop="entityID" label="编号"></el-table-column>
                    <el-table-column prop="name" label="名称"></el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="storeVisible = false">取 消</el-button>
                <el-button type="primary" :loading="Loading" @click="storeSubmit">保 存</el-button>
            </div>
        </el-dialog>

        <!-- 类别弹窗 -->
        <el-dialog class="modal" title="品类选择" :visible.sync="categoryVisible" width="30%">
            <div>
                <el-col :span="24" class="text_center search_header">
                    <el-input placeholder="输入编号或名称或缩写搜索" v-model="name" class="input-with-select">
                        <el-button slot="append" type="primary" @click="categoryData">查询</el-button>
                    </el-input>
                </el-col>
                <el-table
                        :data="categoryList"
                        border
                        highlight-current-row
                        @selection-change="warehouseChange"
                        max-height="300"
                        style="width: 100%"
                >
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column prop="pcategory" label="编号"></el-table-column>
                    <el-table-column prop="name" label="名称"></el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="categoryVisible = false">取 消</el-button>
                <el-button type="primary" :loading="Loading" @click="categorySubmit">保 存</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import bus from '@/components/js/bus';
    import API from "@/api/login";

    export default {
        name: 'dashboard',
        components: {

        },
        data() {
            return {
                dateValue:"3", //日期
                Loading:false,
                dialogVisible: false,
                storeVisible: false,
                categoryVisible: false,
                name:"",
                storeDetail:"", //各门店销售总计
                warehouseInventory:"", //仓库实时库存
                storeInventory:"", //门店实时库存
                categoryAmount:"", // 类别金额占比
                storeAmount:"", // 门店金额占比
                multipleSelection:[],
                tkEntityList:[],  //选择门店
                warehouseEntityList:[], //选择仓库
                productEntityList:[],  //选择品类
                storeList:[], //门店列表
                warehouseList:[], //仓库列表
                categoryList:[], //类别列表
                orgOptions: {},
            }
        },

        methods: {

            drawLine(){
                var option ={
                    tooltip : {
                        trigger: 'item',
                        formatter: "{b} : {c} <br/>" +"销售占比 : "+"{d}%"
                    },
                    color: ['#2EC7C9','#B6A2DE','#5AB1EF','#FFB980','#D87A80','#8D98B3','#E5CF0D','#97B552'],
                    legend: {
                        bottom : '10',
                        // data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
                    },
                    series : [
                        {
                            name: '',
                            type: 'pie',
                            radius: [0, '60%'],
                            center: ['50%', '40%'],
                            data:[
                                {value:146, name:'身材管理'},
                                {value:243, name:'扶阳养生'},
                                {value:230, name:'富爱'},
                                {value:136, name:'基础'},
                                {value:153, name:'面部保养'},
                                {value:357, name:'四维'},
                                {value:132, name:'瑶浴'}
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.10)'
                                }
                            }
                        }
                    ]
                }
                var option2 ={
                    tooltip : {
                        trigger: 'item',
                        formatter: "{b} : {c} <br/>" +"销售占比 : "+"{d}%"
                    },
                    color: ['#2EC7C9','#B6A2DE','#5AB1EF','#FFB980','#D87A80','#8D98B3','#E5CF0D','#97B552'],
                    legend: {
                        bottom : '10',
                        // data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
                    },
                    series : [
                        {
                            name: '',
                            type: 'pie',
                            radius: [0, '60%'],
                            center: ['50%', '40%'],
                            data:[
                                {value:410, name:'身材管理'},
                                {value:253, name:'扶阳养生'},
                                {value:158, name:'富爱'},
                                {value:146, name:'基础'},
                                {value:153, name:'面部保养'},
                                {value:357, name:'四维'},
                                {value:53, name:'瑶浴'}
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.10)'
                                }
                            }
                        }
                    ]
                }
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('myChart'))
                let myChart2 = this.$echarts.init(document.getElementById('myChart2'))
                // 绘制图表
                myChart.setOption(option);
                myChart2.setOption(option2);

            },

            // 日期改变
            dataChange:function(){
                var that = this;
                that.storeSellData();
            },
            // 仓库列表
            warehouseData:function () {
                var that = this;
                API.getInventory()
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
            // 多选选择
            warehouseChange(val) {
                this.multipleSelection = val;
            },
            // 仓库保存
            warehouseSubmit:function(){
                var that = this;
                that.warehouseEntityList = [];
                if(that.multipleSelection.length==0){
                    that.$message.error({
                        message: "请选择",
                        duration: 2000
                    });
                    return false;
                }
                that.multipleSelection.forEach(function (item) {
                    that.warehouseEntityList.push({warehouseID:item.warehouseID})
                })
                that.dialogVisible = false;
                that.storeSellData();
                that.entrepotData();
                that.storeInventoryData();
            },
            // 门店列表
            storeData:function () {
                var that = this;
                API.getEntityList()
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.storeList = res.data;
                        } else {
                            that.$message.error({
                                message: res.message,
                                duration: 2000
                            });
                        }
                    })
            },
            // 门店保存
            storeSubmit:function(){
                var that = this;
                that.tkEntityList = [];
                if(that.multipleSelection.length==0){
                    that.$message.error({
                        message: "请选择",
                        duration: 2000
                    });
                    return false;
                }
                that.multipleSelection.forEach(function (item) {
                    that.tkEntityList.push({entityID:item.entityID})
                })
                that.storeVisible = false;
                that.storeSellData();
                that.entrepotData();
                that.storeInventoryData();
            },
            // 类别列表
            categoryData:function () {
                var that = this;
                API.getCategory()
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
            // 类别保存
            categorySubmit:function(){
                var that = this;
                that.productEntityList = [];
                if(that.multipleSelection.length==0){
                    that.$message.error({
                        message: "请选择",
                        duration: 2000
                    });
                    return false;
                }
                that.multipleSelection.forEach(function (item) {
                    that.productEntityList.push({pCategory:item.pcategory})
                })
                that.categoryVisible = false;
                that.storeSellData();
                that.entrepotData();
                that.storeInventoryData();
            },
            // 各门店销售统计
            storeSellData:function () {
                var that = this;
                var params = {
                    dateValue:that.dateValue,
                    warehouseEntityList:that.warehouseEntityList,
                    tkEntityList: that.tkEntityList,
                    productEntityList: that.productEntityList
                }
                API.getStore(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.storeDetail= res.data;
                        } else {
                            that.$message.error({
                                message: res.message,
                                duration: 2000
                            });
                        }
                    })

            },
            // 仓库实时库存
            entrepotData:function () {
                var that = this;
                var params = {
                    warehouseEntityList:that.warehouseEntityList,
                    tkEntityList: that.tkEntityList,
                    productEntityList: that.productEntityList
                }
                API.getStoreRole(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.warehouseInventory= res.data;
                        } else {
                            that.$message.error({
                                message: res.message,
                                duration: 2000
                            });
                        }
                    })

            },
            // 门店实时库存
            storeInventoryData:function () {
                var that = this;
                var params = {
                    warehouseEntityList:that.warehouseEntityList,
                    tkEntityList: that.tkEntityList,
                    productEntityList: that.productEntityList
                }
                API.getStockRole(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.storeInventory= res.data;
                        } else {
                            that.$message.error({
                                message: res.message,
                                duration: 2000
                            });
                        }
                    })

            },

            // 总库存各类别金额占比
            InventoryAmountData:function () {
                var that = this;
                var params = {
                    warehouseEntityList:that.warehouseEntityList,
                    tkEntityList: that.tkEntityList,
                    productEntityList: that.productEntityList
                }
                API.getInventoryAmount(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.categoryAmount= res.data;
                        } else {
                            that.$message.error({
                                message: res.message,
                                duration: 2000
                            });
                        }
                    })

            },
            // 近30天门店各类别销售金额占比
            inventoryData:function () {
                var that = this;
                var params = {
                    warehouseEntityList:that.warehouseEntityList,
                    tkEntityList: that.tkEntityList,
                    productEntityList: that.productEntityList
                }
                API.getStoreInventory(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.storeAmount= res.data;
                        } else {
                            that.$message.error({
                                message: res.message,
                                duration: 2000
                            });
                        }
                    })

            },
            // 仓库弹窗
            warehouseModal:function(){
                var that = this;
                that.multipleSelection =[];
                that.dialogVisible = true;
            },
            // 门店弹窗
            storeModal:function(){
                var that = this;
                that.multipleSelection =[];
                that.storeVisible = true;
            },
            // 类别弹窗
            categoryModal:function(){
                var that = this;
                that.multipleSelection =[];
                that.categoryVisible = true;
            },

        },
        mounted(){
            var that = this;
            that.drawLine();
            that.warehouseData();
            that.categoryData();
            that.storeData();
            that.storeSellData();
            that.entrepotData();
            that.storeInventoryData();
            that.InventoryAmountData();
            that.inventoryData();

        }
    }

</script>


<style scoped lang="scss">
    .el-row {
        margin-bottom: 20px;
        .contet{
            height: 150px;
        }
    }

    .schart {
        width: 100%;
        height: 300px;
    }
    .modal {
        .search_header {
            padding: 0 0 15px 0;
            .input-with-select {
                width: 50%;
            }
        }
    }
    .numColor{
        color:#3296FA;
        font-size: 18px;
        font-weight: bold;
    }
    .moneyColor{
        color:#F48F91;
        font-size: 17px;
        font-weight: bold;
    }
    .titles{
        font-weight: 600;
        font-size: 14px;
    }
</style>
