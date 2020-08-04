<template>
    <div>
        <el-header class="header">
            <el-row :gutter="20" class="row">
                <el-col :span="12">
                    <div class="header_left">
                        <div class="header_logo">
                            <img class="logo_img" src="@/assets/img/yishi-icon2.png">
                        </div>
                        <!--展开折叠开关-->
                        <div class="menu_toggle" @click.prevent="collapseChage">
                            <i class="el-icon-s-fold" v-show="!collapse"></i>
                            <i class="el-icon-s-unfold" v-show="collapse"></i>
                        </div>
                        <div class="header_title">
                            <!--<span>后台管理系统</span>-->
                        </div>
                        <div class="header_title">
                            <el-button class="btn_type btn_select" plain size="small">
                                <router-link to="">PSI系统</router-link>
                            </el-button>
                            <el-button class="btn_type white"  @click="quanxianClick" plain size="small" v-if="isInitial">初始化系统</el-button>
                        </div>

                        <!-- 消息中心 -->
                        <div class="btn-bell">
                            <el-dropdown>
                                <el-badge :value="message.noticeAmount" :max="99" class="item_icon">
                                <div class="el-dropdown-link">
                                    <i class="el-icon-bell"></i>
                                </div>
                                </el-badge>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item v-for="(msg,index) in message.notices" :key="index" @click.native.prevent="msgClick(msg)" v-if="msg.amount>0"><span>{{msg.Name}}</span> <span class="msg_num">{{msg.amount}}</span></el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>

                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="header_right">
                        <!--<div class="marrt_20 font_14">{{siteName}}</div>-->
                        <el-select class="width__fill_available" v-model="siteID"
                                   filterable
                                   placeholder="请选择" @change="productChange" size="small"
                        >
                            <el-option
                                    v-for="item in billList"
                                    :key="item.siteID"
                                    :label="item.name"
                                    :value="item.siteID">
                            </el-option>
                        </el-select>


                        <div class="font_14 marlt_15">{{empName}}</div>
                        <!-- 退出 -->
                        <div class="user-avator" @click="handleCommand">
                            <img src="@/assets/img/quit.png">
                        </div>

                        <!-- 全屏显示 -->
                        <div class="btn-fullscreen" @click="handleFullScreen">
                            <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                                <i class="el-icon-rank"></i>
                            </el-tooltip>
                        </div>

                    </div>
                </el-col>
            </el-row>
        </el-header>
    </div>
</template>
<script>
    import bus from "@/components/js/bus";
    import axios from 'axios'
    import API from "@/api/header";
    import APISet from "@/api/authoritySet"

    export default {
        data() {
            return {
                collapse: false,
                fullscreen: false,
                isInitial:false,
                empName: "",
                siteID: "",
                selectPage: 1,
                selectName: "",
                selectTotal: 0,
                billList: [],
                message: [],
                select:[],
                navList: [
                    {controlCode: "/account", libertyName: "账套管理",code:'1101'},
                    {controlCode: "/setDate", libertyName: "结账日期",code:'1102'},
                    {controlCode: "/authoritySet/roleList", libertyName: "角色权限",code:'1103'},
                    {controlCode: "/authoritySet/userList", libertyName: "用户权限",code:'1104'},
                ],
            };
        },
        methods: {
            // 初始化
            initialData: function () {
                var that = this;
                API.getInitial()
                    .then(res => {
                        if (res.stateCode == 100) {
                           that.isInitial = res.data.CanInit;
                        } else {
                            that.$message.error({
                                message: res.message,
                                duration: 2000
                            });
                        }
                    })
            },
            // 数据显示
            billData: function () {
                var that = this;
                var params = {
                    pageNum: that.selectPage,
                    name: that.selectName
                }
                API.accoutSetList(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.billList.push.apply(that.billList, res.data.list)
                            that.selectTotal = res.data.total;
                        } else {
                            that.$message.error({
                                message: res.message,
                                duration: 2000
                            });
                        }
                    })
            },
            quanxianClick(){
                var that=this;
                that.$router.push(that.select[0].controlCode)
            },
            // 消息提醒
            msgData: function () {
                var that = this;
                API.getMessage()
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.message = res.data;
                        } else {
                            that.$message.error({
                                message: res.message,
                                duration: 2000
                            });
                        }
                    })
            },

            // 账套
            productChange: function () {
                var that = this;
                var params = {
                    siteID: that.siteID
                }
                API.editSite(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            localStorage.setItem("access-user", JSON.stringify(res.data));
                            localStorage.setItem("siteID", res.data.siteID);
                            localStorage.setItem("siteIDName", res.data.siteName);
                            axios.defaults.headers.common['Authorization'] = 'Basic ' + res.data.authToken;
                            that.$router.go(0)
                        } else {
                            that.$message.error({
                                message: res.message,
                                duration: 2000
                            });
                        }
                    })
            },
            // 消息提醒跳转
            msgClick(item){
                 var that = this;
                  that.$router.push(item.ControlCode)
            },
            // 用户名下拉菜单选择事件
            handleCommand() {
                localStorage.removeItem("ms_username");
                localStorage.removeItem("access-user");
                localStorage.removeItem("siteID");
                axios.defaults.headers.common['Authorization'] = "";

                this.$router.push("/login");
            },
            // 侧边栏折叠
            collapseChage() {
                this.collapse = !this.collapse;
                bus.$emit("collapse", this.collapse);
            },
            // 全屏事件
            handleFullScreen() {
                let element = document.documentElement;
                if (this.fullscreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                } else {
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.msRequestFullscreen) {
                        // IE11
                        element.msRequestFullscreen();
                    }
                }
                this.fullscreen = !this.fullscreen;
            },
            jurisdictionData: function () {
                var that = this;
                let params={
                    jobTitles:JSON.parse(localStorage.getItem('access-user')).jobTitleID
                }
                APISet.getInitiaFind(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            res.data.forEach(p=>{
                                that.navList.forEach(s=>{
                                    if (s.code==p){
                                        that.select.push(s)
                                    }
                                })
                            })
                        } else {
                            that.$message.error({
                                message: res.message,
                                duration: 2000
                            });
                        }
                    })
            },
        },
        mounted() {
            var that = this;
            that.initialData();
            that.billData();
            that.msgData();
            that.jurisdictionData();
            that.siteID = localStorage.getItem('siteID');
            if(localStorage.getItem('access-user')){
                that.empName = JSON.parse(localStorage.getItem('access-user')).empName;
            }
        }
    };
</script>
<style  lang="scss">
    .msg_num{
        color: #f56c6c;
        margin-left: 30px;
    }

    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 50px !important;
        font-size: 22px;
        color: #fff;
        background-color: #409eff;
        .row {
            height: 100%;
            .el-col {
                height: 100%;
                .header_left {
                    height: 100%;
                    display: flex;
                    justify-content: flex-start;

                    .menu_toggle {
                        line-height: 50px;
                    }
                    .header_title {
                        line-height: 50px;
                        font-size: 18px;
                        margin-left: 25px;
                        .white{
                            background-color: #fff !important;
                            color: #409eff !important;
                        }
                        .btn_type {
                            background-color: #409eff;
                            span {
                                a {
                                    color: #fff;
                                }
                            }
                        }
                        .btn_select {
                            background-color: #ffffff;
                            span {
                                a {
                                    color: #409eff !important;
                                }
                            }

                        }
                    }
                    .btn-bell {
                        height: 50px;
                        line-height: 60px;
                        cursor: pointer;
                        margin-left: 30px;
                        .el-dropdown{
                            .item_icon{
                                .is-fixed{
                                    top: 15px;
                                    right: 15px;
                                }
                            }
                        }
                        .el-icon-bell {
                            color: #fff;
                            font-size: 30px;
                        }

                    }
                }
                .header_right {
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    height: 50px;
                    .width__fill_available {
                        width: 200px;
                        margin-right: 20px;
                    }
                    .btn-fullscreen {
                        transform: rotate(45deg);
                        margin-right: 5px;
                        font-size: 24px;
                    }

                    .user-avator {
                        margin-left: 20px;
                        margin-right: 20px;
                        img {
                            display: block;
                            width: 30px;
                            height: 30px;
                            border-radius: 50%;
                        }
                    }
                    .user-name {
                        margin-left: 10px;
                        .el-dropdown-link {
                            color: #fff;
                            cursor: pointer;
                        }
                    }
                }
            }
        }
    }
</style>
