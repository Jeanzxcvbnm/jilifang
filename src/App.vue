<template>
  <div id="app">
      <router-view/>
  </div>
</template>

<script>


export default {
  name: 'app',
}
</script>

<style lang="scss">
 @import "./assets/css/main.css";

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 12px;
}
 .el-submenu {
     .el-submenu__title {
         color: #000 !important;
     }
 }
 .sidebar-el-menu {
     .is-opened {
         .el-submenu__title {
             background-color: #F4FBFF;
         }

     }
 }
 .header{
     .el-select{
         .el-input{
             .el-input__inner{
                 background-color: #409eff !important;
                 color: #fff !important;
                 border-color: #fff;
             }
         }
     }
 }
 .login_content{
 .el-form-item{
     .el-form-item__content{
         .el-input__prefix{
             color: #409eff !important;
         }
     }
 }
 }
.content{
  .nav_header{
    .el-form-item{
      margin-bottom: 10px
    }
  }
  .el-table__header{
    .has-gutter{
        tr{
          th{
            background-color: #f8f8f8
          }
        }
    }
  }
    .el-dialog{

        .el-dialog__body{
            border-top: 1px solid #ddd;
            border-bottom: 1px solid #ddd;
        }

    }
}
 .text_nowarp {
     width: 155px;
     white-space: nowrap;
     overflow: hidden;
     text-overflow: ellipsis;
 }

</style>
