<template>
    <div>
        <el-header class="header">
            <div class="header_nav">
                <div class="dis_flex align_tems">
                    <div class="header_logo">
                        <img class="logo_img" src="@/assets/img/yishi-icon2.png">
                    </div>
                    <div :class="[onRoutes == nav.controlCode?'nev_select':'', 'marlt_20  font_14 nav_li']"
                         v-for="(nav,index) in select" :key="index">
                        <router-link class="nav_name" :to="nav.controlCode">{{nav.libertyName}}</router-link>
                    </div>

                </div>

                <div>
                    <el-button size="mini" @click="loginClick">进入业务系统</el-button>
                </div>
            </div>
        </el-header>
    </div>
</template>
<script>

    import API from "@/api/header";
    import APISet from "@/api/authoritySet"

    export default {
        data() {
            return {
                select:[],
                navList: [
                    {controlCode: "/account", libertyName: "账套管理",code:'1101'},
                    {controlCode: "/setDate", libertyName: "结账日期",code:'1102'},
                    {controlCode: "/authoritySet/roleList", libertyName: "角色权限",code:'1103'},
                    {controlCode: "/authoritySet/userList", libertyName: "用户权限",code:'1104'},
                ],
            };
        },
        computed: {
            onRoutes() {
                var that = this;
                if (that.$route.meta.supPath) {
                    return that.$route.meta.supPath.replace("#", "");
                } else {
                    return that.$route.path.replace("#", "");
                }
            },
        },
        methods: {
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
            loginClick: function () {
                var that = this;
                that.$router.replace("/homePage")
            },

        },
        mounted() {
            var that = this;
            that.jurisdictionData();
        }
    };
</script>
<style scoped lang="scss">
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 50px !important;
        font-size: 22px;
        color: #fff;
        background-color: #409eff;
        .header_nav {
            height: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .nav_name {
            color: #fff;
        }

        .nav_li {
            height: 40px;
            line-height: 40px;
        }
        .nev_select {
            border-bottom: 2px solid #ffffff;
            font-size: 14px;
        }
    }
</style>
