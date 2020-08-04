<template>
    <div v-loading="loading">
        <div>
            <Header></Header>
        </div>
        <div class="pad_5 backfff martp_15 content_div">
            <div class="border_bottom pad_10">
                <el-row>
                    <el-col :span="4" >
                        <div class="font_16 font_weight_600 color_blue">结账日期设置</div>
                    </el-col>
                    <el-col :span="20" class="text_right">
                        <el-button type="primary" size="mini" @click="" v-if="cancel == true" >取消</el-button>
                        <el-button type="primary" size="mini" @click="savaClick" v-if="saveChange == true">保存变更</el-button>
                    </el-col>
                </el-row>
            </div>
            <div class="pad_20 backfff">
                <div>
                    <el-form :model="ruleForm"  ref="ruleForm" :inline="true" class="demo-form-inline marlt_20">
                        <el-form-item  prop="active">
                            <el-radio v-model="active" :label=true>自然月结账</el-radio>
                        </el-form-item>
                        <el-form-item label="上月结账日期">
                            <el-date-picker
                                    size="mini"
                                    v-model="ruleForm.accountDate"
                                    align="right"
                                    type="date"
                                    placeholder="选择日期"
                            >
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="最大输单日期">
                            <el-date-picker
                                    size="mini"
                                    v-model="ruleForm.maxDate"
                                    align="right"
                                    type="date"
                                    placeholder="选择日期"
                            >
                            </el-date-picker>
                        </el-form-item>

                    </el-form>
                    <el-form :model="ruleForm2"  ref="ruleForm2"  :inline="true" class="demo-form-inline marlt_20">
                        <el-form-item  prop="active">
                            <el-radio v-model="active" :label=false>自定义结账</el-radio>
                        </el-form-item>
                        <el-form-item label="上月结账日期">
                            <el-date-picker
                                    size="mini"
                                    v-model="ruleForm2.accountDate"
                                    align="right"
                                    type="date"
                                    placeholder="选择日期"
                            >
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="最大输单日期">
                            <el-date-picker
                                    size="mini"
                                    v-model="ruleForm2.maxDate"
                                    align="right"
                                    type="date"
                                    placeholder="选择日期"
                            >
                            </el-date-picker>
                        </el-form-item>

                    </el-form>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import Header from "@/components/common/Header1.vue";
    import API from "@/api/accountMethod";

    export default {
        components: {
            Header
        },
        data() {
            return {
                loading: false,
                active:false,
                isChoose:false,
                cancel:true,
                saveChange:true,
                ruleForm:{
                    accountDate:"",
                    maxDate:"",
                },
                ruleForm2:{
                    accountDate:'',
                    maxDate:'',
                },

            };
        },
        methods: {
            loginClick:function(){
                var that = this;
                that.$router.replace("/login")
            },
            timeFormat:function(date,num) {
                if (!date || typeof(date) === "string") {
                    this.error("参数异常，请检查...");
                }
                var y = date.getFullYear(); //年
                if(num==1){
                    var m = date.getMonth() + 2; //月
                }else{
                    var m = date.getMonth() + 3; //月
                }
                var d = date.getDate(); //日

                return y + "-" + m + "-" + d;
            },
            // 数据显示
            search: function () {
                var that = this;
                that.loading = true;
                API.closeDayList()
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.active = res.data.naturalMonth;
                             if(that.active==false){
                                 that.ruleForm2.accountDate=res.data.accountDate;
                                 that.ruleForm2.maxDate=res.data.maxDate;
                             }else{
                                 that.ruleForm.accountDate=res.data.accountDate;
                                 that.ruleForm.maxDate=res.data.maxDate;
                                 that.isChoose=true;
                             }
                            if(that.ruleForm2.accountDate =="" && that.ruleForm.accountDate == ""){
                                that.saveChange = true;
                                that.cancel = true;
                            }else{
                                that.saveChange = false;
                                that.cancel = false;
                            }
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
            savaClick:function(){
                var that = this;
                var params="";
                if(that.active==true){
                    params={
                        naturalMonth:1,
                        accountDate:that.ruleForm.accountDate,
                        maxDate:that.ruleForm.maxDate,
                    }
                }else{
                    if(that.ruleForm2.accountDate>that.ruleForm2.maxDate){
                        that.$message.error({
                            message:'最大输单日期不能小于上月结账日期',
                            duration:2000
                        })
                        return false;
                    }
                    params={
                        naturalMonth:0,
                        accountDate:that.ruleForm2.accountDate,
                        maxDate:that.ruleForm2.maxDate,
                    }
                }


                API.updateCloseDay(params)
                    .then(res => {
                        if (res.stateCode == 100) {
                            that.$message({
                                message:res.message,
                            })
                                that.cancel = false;
                                that.saveChange = false;
                        } else {
                            that.$message.error({
                                message: res.message,
                                duration: 2000
                            });
                        }
                    })
                    .finally(function () {
                        that.search();
                    });
            },
            getFirstDayOfMonth:function(date,num){
                date.setDate(1);
                if(num==1){
                    return this.timeFormat(date,1);
                }else{
                    return this.timeFormat(date,2);
                }

            },
            GetPrevDay:function(str){
                var year = str.substring(0,4);
                var month = str.substring(5,7);
                var day = str.substring(8,10);
                var today=new Date(year, month-1 ,day);
                var yesterday_milliseconds=today.getTime()-1000*60*60*24;
                var yesterday=new Date();
                yesterday.setTime(yesterday_milliseconds);
                var strYear=yesterday.getFullYear();
                var strDay=yesterday.getDate();
                var strMonth=yesterday.getMonth()+1;
                if(strMonth<10) {
                    strMonth="0"+strMonth;
                }
                if(strDay<10) {
                    strDay="0"+strDay;
                }
                return strYear+"-"+strMonth+"-"+strDay;
            }
        },
        mounted() {
            var that = this;
            var data= new Date();
            that.search();
        }
    };
</script>


<style scoped lang="scss">

    .content_div{
        width: 80%;
        margin: 0 auto;
    }

</style>
