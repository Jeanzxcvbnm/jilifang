<template>
    <div class="wrapper">
        <div class="login_content">
            <el-row>
                <el-col :span="24">
                    <div class="left_content">
                        <div class="title">PSI系统</div>
                        <div class="subhead">欢迎使用艺施美业库存管理系统</div>
                        <div class="div_img">
                            <img src="../assets/img/page.png" alt="" class="img">
                        </div>
                    </div>

                </el-col>

            </el-row>

        </div>
    </div>
</template>

<script>

    export default {
        data() {
            return {
            };
        },
        methods: {

        },
        mounted() {

        }
    };
</script>
<style scoped lang="scss">

    .wrapper {
        width: 100%;
        overflow-x: auto;
        .login_content {
            background-color: #fff;
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
                    font-size:35px;
                    padding: 0px 0 20px 0;
                }
                .div_img{
                    text-align: right;
                    padding-right: 100px;
                }
                .img {
                    /*width: 400px;*/
                }
            }

        }
    }


</style>

