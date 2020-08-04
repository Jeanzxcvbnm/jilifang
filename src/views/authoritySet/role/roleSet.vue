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
                        node-key="id"
                        ref="tree"
                        :check-strictly="true"
                        :default-checked-keys="defaultChecked"
                        highlight-current
                        @check-change="handleCheckChange"
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
                jobTitleID:"",
                title:"财务总监",
                data: [],
                defaultChecked:[], //默认选中
                props: {
                    label: 'text',
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
                API.getAuthority()
                    .then(res => {
                        if (res.stateCode == 100) {
                           that.data = res.data.children
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
                     jobTitleID:that.jobTitleID
                 }
                 API.getAuthorityFind(params)
                     .then(res => {
                         if (res.stateCode == 100) {
                             var defaultChecked = []
                             res.data.forEach(function (item) {
                                 defaultChecked.push(item.LibertyID)
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
            // 选择
            handleCheckChange(data, checked, indeterminate) {
                var that = this;
                var defaultChecked = that.defaultChecked;
                console.log(data, checked, indeterminate);

                if(checked){
                    defaultChecked.push(data.id)
                     if(data.last != null){
                         defaultChecked.push(data.last)
                     }
                }else {
                   var index =  defaultChecked.indexOf(data.id);
                    defaultChecked.splice(index,1);
                    if(data.last != null){
                         var lastIndex = defaultChecked.indexOf(data.last);
                        defaultChecked.splice(lastIndex,1)
                    }

                }
                console.log(defaultChecked)
                that.defaultChecked = defaultChecked;
            },

             // 保存
            saveClick:function () {
                var that = this;

                var liIDberty = that.defaultChecked;
                console.log(liIDberty)
                liIDberty = [...new Set(liIDberty )];
                if(liIDberty.length==0){
                    that.$message.error({
                        message: "请选择权限",
                        duration: 2000
                    });
                    return false;
                }
                that.modalLoading = true;
                 var params = {
                     jobTitle:that.jobTitleID,
                     libertyIDs:liIDberty
                 }
                API.addRoleAuthority(params)
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
            that.jobTitleID = that.$route.query.jobTitleID;
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
