
<template>
  <div v-loading="loading">
    <div class="pad_15 backfff">
      <div class="pad_15 nav_header">
        <el-row>
          <el-col :span="22">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="名称">
                <el-input v-model="name" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini">查询</el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="2" class="text_right">
            <el-button type="primary" size="mini" @click="showAddDialog">新增</el-button>
          </el-col>
        </el-row>
      </div>
      <div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="index" label="编号" width="70"></el-table-column>
          <el-table-column prop="job_number" label="名称"></el-table-column>
          <el-table-column prop="name" label="价格类型"></el-table-column>
          <el-table-column prop="status" label="有效性" :formatter="formatStatus"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="showEditDialog(scope.$index,scope.row)"
              >编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 弹窗 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="40%">
      <div>
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
          <el-form-item label="编号" prop="serialNumber">
            <el-input v-model="ruleForm.serialNumber" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input  v-model="ruleForm.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="价格类型" prop="pricetypeValue">
            <el-select v-model="ruleForm.pricetypeValue" placeholder="请选择" class="width__fill_available">
              <el-option
                      v-for="item in pricetypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="有效性" prop="status">
            <el-radio-group v-model="ruleForm.status">
              <el-radio label="0">是</el-radio>
              <el-radio label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      dialogVisible: false,
      name: "",
      tableData: [
          {
              serialNumber:"123",
              pricetypeValue:"zx",
              name: 'zx',
              status: '0',
          },
          {
              serialNumber:"123",
              pricetypeValue:"zx",
              name: 'zx',
              status: '0',
          }
      ],
        pricetypeList:[
            {
                value:"凯迪拉克"
            }
        ],
         ruleForm: {
          serialNumber:"",
             pricetypeValue:"",
          name: '',
          status: '0',
         
        },
        rules: {
          serialNumber: [{ required: true, message: '请输入编号', trigger: 'blur' }],
          name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
          status: [{required: true, message: '请选择有效性', trigger: 'change' }]
        }
    };
  },
  methods: {
    //状态显示转换
    formatStatus: function(row, column) {
      return row.status == "1" ? "有效" : "无效";
    },

    // 数据显示
    handleSearch: function() {
      let that = this;
      that.paginations.page = 1;
      that.search();
    },
    // 数据显示
    search: function() {
      let that = this;
      that.loading = true;
    },
    // 新增
    showAddDialog: function() {
      var that = this;
      that.dialogVisible = true;
    },
    //编辑
    showEditDialog: function(index, row) {
      var that = this;
        that.dialogVisible = true;
        that.ruleForm=row;
    },
  },
  mounted() {}
};
</script>


<style scoped lang="scss">
</style>
