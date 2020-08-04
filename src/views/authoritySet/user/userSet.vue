<template>
    <div v-loading="loading">
        <div>
            <Header></Header>
        </div>
        <div class="pad_15 backfff content">
            <div class="pad_15 nav_header border_bottom">
                <el-row>
                    <el-col :span="12">
                        <div class="pad_0_15 font_16 font_weight_600 color_blue">{{title}}</div>
                    </el-col>
                    <el-col :span="12" class="text_right">
                        <el-button type="primary" size="mini" @click="saveClick">保存</el-button>
                        <el-button type="primary" plain size="mini" v-loading="modalLoading" @click="cancleClick">取消</el-button>
                    </el-col>
                </el-row>
            </div>
            <div class="content">
                <el-tree
                        :data="data"
                        :props="props"
                        show-checkbox
                        node-key="ID"
                        ref="tree"
                        :default-checked-keys="defaultChecked"
                        highlight-current
                >
                </el-tree>
            </div>
        </div>


    </div>
</template>

<script>
    import Header from "@/components/common/Header1.vue";
    import API from "@/api/authoritySet";

    export default {
        components: {
            Header
        },
        data() {
            return {
                loading: false,
                modalLoading:false,
                empID:"",
                title:"财务总监",
                data: [],
                defaultChecked:[],
                props: {
                    label: 'Name',
                    children: 'children'
                },
            };
        },
        methods: {
            // 取消
            cancleClick:function(){
                var that = this;
                that.$router.go(-1)
            },

            // 数据显示
            handleSearch: function () {
                let that = this;
                that.loading = true;
                API.getAuthorityScope()
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.data = res.data
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

            // 数据选中
            authorityData:function(){
                let that = this;
                that.loading = true;
                var params = {
                    empID:that.empID,
                }
                API.getAuthorityScopeFind(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                             console.log(res)
                            var defaultChecked = []
                            res.data.forEach(function (item) {
                                defaultChecked.push(item.WarehouseID)
                            })
                            that.defaultChecked = defaultChecked;
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

            // 保存
            saveClick:function () {
                var that = this;
                var liIDberty = that.$refs.tree.getCheckedKeys();
                if(liIDberty.length==0){
                    that.$message.error({
                        message: "请选择权限",
                        duration: 2000
                    });
                    return false;
                }
                that.modalLoading = true;
                var params = {
                    empID:that.empID,
                    IDs:liIDberty
                }
                API.addAuthorityScope(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.$message({
                                message: "保存成功",
                            })
                            that.$router.go(-1)
                        } else {
                            that.$message.error({
                                message: res.message,
                                duration: 2000
                            });
                        }
                    })
                    .finally(function () {
                        that.modalLoading = false;
                    });
            }


        },
        mounted() {
            var that = this;
            that.empID = that.$route.query.empID;
            that.title = that.$route.query.name;
            that.handleSearch();
            that.authorityData();
        }
    };
</script>


<style scoped lang="scss">
    .content{
        width: 80%;
        margin: 0 auto;
    }
</style>
