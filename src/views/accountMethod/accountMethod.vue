<template>
    <div v-loading="loading">
        <div class="pad_5 backfff martp_15">
            <div class="border_bottom pad_20">
                <div class="nav_header">
                    <span class="font_14 marrt_20">核算方式</span>
                </div>
            </div>
            <div class="pad_20 backfff">
                <el-row >
                    <el-col :span="6" class="el-cols">
                        <div class="grid-content">
                            <div class="text">按存货核算</div>
                        </div>
                        <div class="grid-header">核算方式</div>
                    </el-col>
                    <el-col :span="6"  class="el-cols">
                        <div class="grid-content">
                            <div class="text">销售出库单</div>
                        </div>
                        <div class="grid-header">销售成本核算方式</div>
                    </el-col>
                    <el-col :span="6"  class="el-cols">
                        <div class="grid-content">
                            <div class="text">全月平均</div>
                        </div>
                        <div class="grid-header">计价方式</div>
                    </el-col>
                    <el-col :span="6"  class="el-cols">
                        <div class="grid-content">
                            <div class="text">异价调拨</div>
                        </div>
                        <div class="grid-header">调拨方式</div>
                    </el-col>
                    <el-col :span="6"  class="el-cols">
                        <div class="grid-content">
                            <div class="text">销售业务</div>
                            <div class="text">采购业务</div>
                            <div class="text">调拨业务</div>
                        </div>
                        <div class="grid-header">允许负数出库</div>
                    </el-col>
                    <el-col :span="6"  class="el-cols">
                        <div class="grid-content">
                            <div class="text">账套成本价</div>
                        </div>
                        <div class="grid-header">成本结算规则</div>
                    </el-col>
                    <el-col :span="6"  class="el-cols">
                        <div class="grid-content">
                            <div class="text">仓库成本价</div>
                        </div>
                        <div class="grid-header">成本结算规则</div>
                    </el-col>
                    <el-col :span="6"  class="el-cols">
                        <div class="grid-content">
                            <div class="text">异价</div>
                        </div>
                        <div class="grid-header">调拨方式</div>
                    </el-col>
                </el-row>
            </div>
        </div>

    </div>
</template>

<script>
    import API from "@/api/allot";

    export default {
        data() {
            return {
                loading: false,
                content:[

                ],
            };
        },
        methods: {

        },
        mounted() {
            var that = this;
        }
    };
</script>


<style scoped lang="scss">
    .el-row {
        &:last-child {
            margin-top:80px;
        }
    }
    .el-cols {
        border-radius: 8px;
        width: 200px;
        margin-right: 150px;
        margin-bottom:200px;
    }
    .grid-content {
        border:1px dashed #ccc;
        border-radius: 4px;
        min-height: 150px;
    }
    .text{
        font-size: 13px;
        text-align:center;
        margin-top:22px;
    }
    .grid-header{
        width:130px;
        font-size:16px;
        margin-left: 19%;
        margin-top:-160px;
        background: white;
        text-align:center;
    }



</style>

