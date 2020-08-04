<template>
    <div class="wrapper">
        <div class="login_content">
             <div class="header_nav">
                 <div>找回密码</div>
                 <div @click="loginClick">返回登录</div>
             </div>
            <el-row>

                <el-col :span="24">
                    <el-form
                            ref="ruleForm"
                            :model="ruleForm"
                            :rules="rules"
                            class="demo-ruleForm login-container"
                    >
                        <div class="login_logo">
                            <img class="login_img" src="../assets/img/logo1_yishi.png" alt="">
                        </div>
                        <el-form-item prop="empID" class="padbm_20 resetPassword">
                            <el-input v-model="ruleForm.empID" placeholder="请输入员工ID号"
                                      prefix-icon="el-icon-user-solid" ></el-input>
                            <el-button :type="typeCode" @click.native.prevent="codeClick" :disabled="disabled"
                            >{{codeTitle}} </el-button>
                        </el-form-item>
                        <el-form-item prop="verificationCode" class="padbm_20">
                            <el-input v-model="ruleForm.verificationCode" placeholder="短信验证码"
                                      prefix-icon="el-icon-s-finance"></el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input type="password" v-model="ruleForm.password" placeholder="请输入密码"
                                      prefix-icon="el-icon-s-goods"></el-input>
                        </el-form-item>
                        <el-form-item prop="password">

                        </el-form-item>

                        <el-form-item class="pad_15_0">
                            <el-button
                                    type="primary"
                                    style="width:100%;"
                                    @click.native.prevent="handleLogin"
                                    :loading="loading"
                            >确认
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
    export default {
        data() {
            return {
                loading: false,
                typeCode:"primary",
                disabled:false,
                codeTitle:"获取验证码",
                ruleForm: {
                    empID: "",
                    verificationCode:"",
                    password: ""
                },
                rules: {
                    empID: [{required: true, message: "请输入工号", trigger: "blur"}],
                    verificationCode: [{required: true, message: "请输入验证码", trigger: "blur"}],
                    password: [{required: true, message: "请输入密码", trigger: "blur"}]
                }
            };
        },
        methods: {

            loginClick:function(){
               var that = this;
                that.$router.replace('/login')
            },
             // 获取验证码
            codeClick:function(){
                 var that = this;
                var waitTime = 60;
                if(that.ruleForm.empID == "" || that.ruleForm.empID == null){
                     that.$message.error({
                         showClose: true,
                         message: "请输入员工ID号",
                     });
                     return false;
                 }

                var params = {
                    empID: that.ruleForm.empID
                }
                API.getCode(params)
                    .then(function (res) {
                        if (res.stateCode == 100) {
                            that.disabled = true;
                            that.typeCode="info";
                                that.$message({
                                showClose: true,
                                message: "验证码获取成功",
                            });
                            var timer = setInterval(function () {
                                waitTime--;
                                that.codeTitle = waitTime + "S";
                                if (waitTime < 1) {
                                    clearInterval(timer);
                                    that.codeTitle = '获取验证码';
                                    that.disabled = false;
                                    that.typeCode="primary";
                                }
                            }, 1000)
                        } else {
                            that.$message.error({
                                showClose: true,
                                message: res.message,
                            });
                        }
                    })
                 

            },
            // 登录
            handleLogin() {
                let that = this;
                that.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        this.loading = true;
                        API.resetPassword(that.ruleForm)
                            .then(function (res) {
                                if (res.stateCode == 100) {
                                    that.$message({
                                        message: "重置成功",
                                        duration: 2000
                                    });
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
            background-color: #fff;
             .header_nav{
                 display: flex;
                 justify-content: space-between;
                 background-color: #3e96fb;
                 color: #fff;
                 padding: 0 15px;
                 height: 50px;
                 line-height: 50px;
             }
            .login-container {
                /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/

                margin: 100px auto;
                width: 400px;
                padding: 35px 35px 15px 35px;
                .login_logo {
                    text-align: center;
                    padding: 30px;
                     .login_img{
                        width: 200px;
                    }
                }
                .resetPassword{
                    .el-form-item__content{
                        .el-input{
                            width: 285px;
                        }
                    }
                }
                .remember {
                    margin: 0px 0px 35px 0px;
                }
            }
        }
    }


</style>

