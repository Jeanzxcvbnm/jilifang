<template>
    <div v-loading="loading">
        <div>
            <Header></Header>
        </div>

        <div class="pad_15 backfff content">
            <div class="pad_15 nav_header">
                <el-row>
                    <el-col :span="24">
                        <el-form :inline="true" class="demo-form-inline">
                            <el-form-item label="名称">
                                <el-input v-model="name" size="mini" placeholder="请输入" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="单位">
                                <el-select v-model="entityID" placeholder="请选择" size="mini" clearable>
                                    <el-option
                                            v-for="item in entityList"
                                            :key="item.entityID"
                                            :label="item.name"
                                            :value="item.entityID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="职务">
                                <el-select v-model="jobTypeID" placeholder="请选择" size="mini" clearable>
                                    <el-option
                                            v-for="item in jobTypeList"
                                            :key="item.jobTypeID"
                                            :label="item.name"
                                            :value="item.jobTypeID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" size="mini" @click="handleSearch">搜索</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>

                </el-row>
            </div>
            <div>
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column prop="empID" label="员工编号"></el-table-column>
                    <el-table-column prop="name" label="姓名"></el-table-column>
                    <el-table-column prop="entityName" label="所属单位"></el-table-column>
                    <el-table-column prop="jobTypeName" label="职务"></el-table-column>
                    <el-table-column prop="statusName" label="在职状态"></el-table-column>
                    <el-table-column prop="name" label="登录权限">
                        <template slot-scope="scope">
                             <span v-if="scope.row.erp">业务系统 / </span>
                            <span v-if="scope.row.init">初始化系统</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="300">
                        <template slot-scope="scope">
                            <el-button
                                    type="primary"
                                    size="mini"
                                    @click="allocationClick(scope.row)"
                            >角色分配
                            </el-button>
                            <el-button
                                    type="primary"
                                    size="mini"
                                    @click="authorityClick(scope.row)"
                            >权限范围
                            </el-button>
                            <el-button
                                    type="primary"
                                    size="mini"
                                    @click="loginClick(scope.row)"
                            >登录权限
                            </el-button>
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


        <!-- 登录权限弹窗 -->
        <el-dialog title="登录权限" :visible.sync="dialogVisible" width="30%">
            <div>
                <div>{{modalTiele}}</div>
                <div class="pad_15_0">
                    <div class="marbm_15">
                        <el-checkbox  v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                    </div>
                    <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                        <el-checkbox v-for="item in loginList" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" :loading="modalLoading" @click="saveClick">保 存</el-button>
            </div>
        </el-dialog>

        <!-- 角色分配弹窗 -->
        <el-dialog title="角色分配" :visible.sync="roleVisible" width="30%">
            <div>
                <div class="font_16 font_weight_600">{{modalTiele}}</div>
                <div class="pad_15_0">

                    <el-checkbox-group v-model="roleCheckList">
                        <el-checkbox v-for="item in roleList" :label="item.id" :key="item.id" style="width: 150px;height: 50px;">{{item.name}}</el-checkbox>
                    </el-checkbox-group>

                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="roleVisible = false">取 消</el-button>
                <el-button type="primary" :loading="modalLoading" @click="saveRoleClick">保 存</el-button>
            </div>
        </el-dialog>

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
                modalLoading: false,
                dialogVisible: false,
                roleVisible:false,
                modalTiele:"",
                empID:"",
                name: "",
                entityID:"", //单位
                jobTypeID:"",
                checkAll:false,
                roleList:[], //角色
                roleCheckList:[], //角色选中
                checkedCities:[], //登录
                entityList:[], //单位
                jobTypeList:[], //职务
                loginList:[
                    {id:0,name:"业务系统"},
                    {id:1,name:"初始化系统"}
                ],
                tableData: [],
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
            //单位列表
            entityData: function () {
                var that = this;
                API.getEntity()
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
            //职务列表
            jobTypeData: function () {
                var that = this;
                API.getJobType()
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.jobTypeList = res.data;
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
                that.search();
            },
            // 数据显示
            search: function () {
                let that = this;
                that.loading = true;
                var params = {
                    keyword:that.name,
                    entityID:that.entityID,
                    jobTypeID:that.jobTypeID,
                    pageNum:that.paginations.page,
                    pageSize: that.paginations.page_size,
                }
                API.getUser(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.tableData = res.data.list;
                            that.paginations.total = res.data.total
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

            // 数据显示
            roleSearch: function () {
                let that = this;
                that.loading = true;
                API.getRoleAllot()
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.roleList = res.data
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
            roleData:function(){
                let that = this;
                that.loading = true;
                var params = {
                    empID:that.empID
                }
                API.getRoleFind(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            var  checkList = [];
                            res.data.forEach(function (item) {
                                checkList.push(item.JobTitleID)
                            })
                            that.roleCheckList = checkList;
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
            handleCheckedCitiesChange:function(value){
               var that = this;
                let checkedCount = value.length;
                that.checkAll = checkedCount === that.loginList.length;
            },
            // 全选
            handleCheckAllChange:function(val){
                var that = this;
                 if(val){
                      that.checkedCities = [0,1];
                 }else {
                     that.checkedCities = [];
                 }
            },
            // 角色分配
            allocationClick:function(item){
               var that  =this;
                that.empID = item.empID;
               that.roleSearch();
               that.roleData();
               that.roleVisible = true;
            },
            // 权限范围
            authorityClick:function(item){
                var that = this;
                that.$router.push({path:"/authoritySet/userSet",query:{empID:item.empID,name:item.name}})
            },
            // 登录权限
            loginClick:function(item){
               var that = this;
               var checkedCities = [];
               that.modalTiele = item.name;
               that.empID  = item.empID;
               if(item.init){
                   checkedCities.push(1)
               };
               if(item.erp){
                   checkedCities.push(0)
               }
               that.checkedCities = checkedCities;
               that.dialogVisible = true;
            },
            // 登录权限保存
            saveClick:function () {
                var that = this;
                var canInit = false;
                var canLoginERP = false;
                that.checkedCities.forEach(function (item) {
                     if(item == 1){
                         canInit = true;
                     }else if (item == 0) {
                         canLoginERP = true;
                     }
                })
                var params = {
                    empID:that.empID,
                    canInit:canInit,
                    canLoginERP:canLoginERP,
                }
                API.loginAuthority(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.$message({
                                message:"保存成功",
                                duration: 2000
                            });
                            that.dialogVisible = false;
                            that.search();
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


            // 角色保存
            saveRoleClick:function () {
                var that = this;
                var liIDberty = that.roleCheckList;
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
                    jobTitleIDs:liIDberty
                }
                API.addRoleAllot(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.$message({
                                message: "保存成功",
                            })
                        } else {
                            that.$message.error({
                                message: res.message,
                                duration: 2000
                            });
                        }
                    })
                    .finally(function () {
                        that.roleVisible = false;
                        that.modalLoading = false;
                    });
            }
        },
        mounted() {
            var that = this;
            that.entityData();
            that.jobTypeData();
            that.handleSearch();
        }
    };
</script>


<style scoped lang="scss">
    .content{
        width: 80%;
        margin: 0 auto;
    }
</style>
