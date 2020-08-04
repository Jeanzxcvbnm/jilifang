<template>
    <div class="wrapper">
        <div class="login_content">
            <el-row>
                <el-col :span="12">
                    <div class="left_content">
                        <div class="title">PSI平台</div>
                        <div class="subhead">商品库存管理系统</div>
                        <div class="div_img">
                            <img src="../assets/img/login_bj.png" alt="" class="img">
                        </div>
                    </div>

                </el-col>
                <el-col :span="12">
                    <el-form
                            ref="ruleForm"
                            :model="ruleForm"
                            :rules="rules"
                            label-position="left"
                            label-width="0px"
                            class="demo-ruleForm login-container"
                    >
                        <div class="login_logo">
                            <img class="login_img" src="../assets/img/loginlogo.jpg" alt="">
                        </div>
                        <h3 class="title">用户登录</h3>
                        <el-form-item prop="empID" class="padbm_20">
                            <el-input v-model="ruleForm.empID" placeholder="请输入工号"
                                      prefix-icon="el-icon-user-solid"></el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input type="password" v-model="ruleForm.password" placeholder="请输入密码"
                                      prefix-icon="el-icon-s-goods"></el-input>
                        </el-form-item>
                        <el-form-item prop="password">

                        </el-form-item>
                        <div class="pad_15_0">
                            <el-row>
                                <el-col :span="12">
                                    <div>
                                        <el-checkbox v-model="checked">记住密码</el-checkbox>
                                    </div>
                                </el-col>
                                <el-col :span="12" @click.native="resetPassword">
                                    <div class="text_right" >忘记密码?</div>
                                </el-col>
                            </el-row>
                        </div>
                        <el-form-item class="pad_15_0">
                            <el-button
                                    type="primary"
                                    style="width:100%;"
                                    @click.native.prevent="handleLogin"
                                    :loading="loading"
                            >登录
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>

        </div>
    </div>
</template>

<script>
    import API from "@/api/login";
    import axios from 'axios'

    export default {
        data() {
            return {
                loading: false,
                checked: true,
                ruleForm: {
                    empID: "",
                    password: ""
                },
                rules: {
                    empID: [{required: true, message: "请输入工号", trigger: "blur"}],
                    password: [{required: true, message: "请输入密码", trigger: "blur"}]
                }
            };
        },
        methods: {
            // 忘记密码
            resetPassword:function(){
                var that = this;
                that.$router.replace ('/resetPassword')
            },
            // 登录
            handleLogin() {
                let that = this;
                if (that.checked) {
                    localStorage.setItem('login', JSON.stringify(that.ruleForm));
                } else {
                    localStorage.clear('login')
                }
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        this.loading = true;
                        let para = that.ruleForm;

                        API.getlogin(para)
                            .then(function (res) {
                                if (res.stateCode == 100) {
                                    localStorage.setItem(
                                        "access-user",
                                        JSON.stringify(res.data)
                                    );
                                    axios.defaults.headers.common['Authorization'] = 'Basic ' + res.data.authToken;
                                    if(res.data.siteID !=''){
                                        that.$router.push({path: "/account"});
                                    }
                                } else {
                                    that.$message.error({
                                        showClose: true,
                                        message: res.message,
                                        duration: 2000
                                    });
                                }
                            })
                            .finally(function () {
                                that.loading = false;
                            });
                    }
                });
            }
        },
        mounted() {
            var that = this;
            var login_usr = JSON.parse(localStorage.getItem('login'));
            if (login_usr) {
                that.ruleForm = login_usr;
            }
        }
    };
</script>
<style scoped lang="scss">

    .wrapper {
        width: 100%;
        overflow-x: auto;
        .login_content {
            min-width: 1200px;
            overflow-x: auto;
            .left_content {
                padding-left: 80px;
                .title {
                    color: #4684eb;
                    font-weight: 700;
                    font-size: 50px;
                    padding: 50px 0 30px 0;
                }
                .subhead {
                    color: #4684eb;
                    font-size: 40px;
                    padding: 0px 0 20px 0;
                }
                .img {
                    /*width: 400px;*/
                }
            }
            .login-container {
                /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
                -webkit-border-radius: 5px;
                border-radius: 5px;
                -moz-border-radius: 5px;
                background-clip: padding-box;
                margin: 160px auto;
                width: 400px;
                padding: 35px 35px 15px 35px;
                border: 1px solid #eaeaea;
                box-shadow: 0 0 30px #eee;
                background-color: #fff;
                /*height: 400px;*/
                .login_logo {
                    text-align: center;
                    .login_img{
                        width: 200px;
                    }
                }
                .title {
                    margin: 20px auto;
                    text-align: center;
                    color: #666;
                }
                .remember {
                    margin: 0px 0px 35px 0px;
                }
            }
        }
    }


</style>

