<template>
  <div class="params">
    <el-card>
      <!--警告提示框-->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        :closable="false"
        type="warning"
        effect="dark"
        show-icon
      >
      </el-alert>
      <!--选择分类区域-->
      <el-form>
        <el-form-item label="选择商品分类：">
          <el-cascader
            v-model="addForm"
            :options="goodsList"
            expandTrigger="hover"
            :props="listForm"
            @change="getData"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 标签页部分 -->
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <!-- 添加动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 按钮区域 -->
          <el-button type="primary" size="mini" :disabled="isBtn" @click="show = true"
            >添加参数</el-button
          >
          <!-- 动态参数渲染数据区域 -->
          <el-table :data="addGoods" style="width: 100%" border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  size="small"
                  @close="handleClose(item)"
                  >{{ item }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"> </el-table-column>
            <el-table-column label="参数名称" prop="attr_name"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="updataManyOne(scope.row)">修改</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="delMany(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 静态属性按钮 -->
          <el-button type="primary" size="mini" :disabled="isBtn" @click="flag = true"
            >添加属性</el-button
          >
          <!-- 静态属性渲染静态属性区域 -->
          <el-table :data="addGoods" style="width: 100%" border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  size="small"
                  @close="handleClose(item)"
                  >{{ item }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"> </el-table-column>
            <el-table-column label="参数名称" prop="attr_name"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="updataOnlyone(scope.row)">修改</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="delMany(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加动态参数的对话框 -->
    <el-dialog title="添加动态参数" :visible.sync="show">
      <el-form :model="onlyMany" ref="onlyMany" :rules="rules">
        <el-form-item label="动态参数" prop="many">
          <el-input v-model="onlyMany.many"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show = false">取 消</el-button>
        <el-button type="primary" @click="addMany">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加静态属性的对话框 -->
    <el-dialog title="添加静态属性" :visible.sync="flag">
      <el-form :model="onlyMany" ref="onlyMany" :rules="rules">
        <el-form-item label="动态参数" prop="only">
          <el-input v-model="onlyMany.only"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show = false">取 消</el-button>
        <el-button type="primary" @click="addOnly">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑动态参数的对话框 -->
    <el-dialog title="修改动态参数" :visible.sync="updataShow">
      <el-form :model="updataMany" ref="updataMany" :rules="rulesMany">
        <el-form-item label="动态参数" prop="attr_name">
          <el-input v-model="updataMany.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updataShow = false">取 消</el-button>
        <el-button type="primary" @click="updataManyTwo">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加静态属性的对话框 -->
    <el-dialog title="修改静态属性" :visible.sync="updataFlag">
      <el-form :model="updataOnly" ref="updataOnly" :rules="rulesMany">
        <el-form-item label="动态参数" prop="attr_name">
          <el-input v-model="updataOnly.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updataFlag = false">取 消</el-button>
        <el-button type="primary" @click="updataOnlytwo">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      //级联选择框双向绑定的数组
      addForm: [],
      //分类数据
      goodsList: [],
      //级联选择器配置对象
      listForm: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //标签页激活名称
      activeName: "many",
      //获取表格的渲染数据
      addGoods: [],
      //定义添加的参数和属性的对象
      onlyMany: {
        only: "",
        many: "",
      },
      //验证添加的分类和属性
      rules: {
        many: [
          { required: true, message: "请输入动态参数", trigger: "blur" },
          { min: 3, max: 8, message: "请输入3-8个字符", trigger: "blur" },
        ],
        only: [
          { required: true, message: "请输入静态属性", trigger: "blur" },
          { min: 3, max: 8, message: "请输入3-8个字符", trigger: "blur" },
        ],
      },
      //动态参数弹框的显示隐藏
      show: false,
      //添加静态属性弹框的显示隐藏
      flag: false,
      //动态参数编辑弹框显示隐藏
      updataShow:false,
      updataMany:{},
      //验证修改动态参数
      rulesMany: {
        attr_name: [
          { required: true, message: "请输入动态参数", trigger: "blur" },
          { min: 3, max: 8, message: "请输入3-8个字符", trigger: "blur" },
        ]
      },
      //静态属性编辑弹框显示隐藏
      updataFlag:false,
      updataOnly:{},
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    //获取分类列表
    getList() {
      this.$axios.get("categories").then((res) => {
        //console.log(res);
        if (res.data.meta.status !== 200) {
          this.$message.erroe(res.data.meta.msg);
          return false;
        }
        this.goodsList = res.data.data;
      });
    },
    //通过change事件监听选中数组的变化
    getData() {
      //console.log(this.addForm)
      if (this.addForm.length !== 3) {
        this.addForm = [];
        return;
      }
      this.getCatid();
    },
    //监听标签页的事件
    handleClick() {
      // console.log(this.activeName)
      this.getCatid();
    },
    //获取参数列表数据
    getCatid() {
      //获取对应三级分类的数据
      this.$axios
        .get(`categories/${this.catId}/attributes`, { params: { sel: this.activeName } })
        .then((res) => {
          console.log(res);
          if (res.data.meta.status == 200) {
            this.$message.success(res.data.meta.msg);
            //循环数据将attr_vals转化为数组
            res.data.data.forEach((item) => {
              item.attr_vals =
                item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
            });
            this.addGoods = res.data.data;
          } else {
            this.$message.error(res.data.meta.msg);
          }
        });
    },
    //删除三级分类的数据
    handleClose(item) {
      this.addGoods.forEach((it) => {
        it.attr_vals.splice(it.attr_vals.indexOf(item), 1);
      });
    },
    //添加动态参数
    addMany() {
      var obj = { attr_name: this.onlyMany.many, attr_sel: "many", attr_vals: "," };
      this.$axios.post(`categories/${this.catId}/attributes`, obj).then((res) => {
        if (res.data.meta.status == 201) {
          this.$message.success(res.data.meta.msg);
          this.getCatid();
          this.show = false;
        } else {
          this.$message.error(res.data.meta.msg);
        }
      });
    },
    //添加静态属性
    addOnly() {
      var obj = { attr_name: this.onlyMany.only, attr_sel: "only" };
      this.$axios.post(`categories/${this.catId}/attributes`, obj).then((res) => {
        if (res.data.meta.status == 201) {
          this.$message.success(res.data.meta.msg);
          this.getCatid();
          this.flag = false;
        } else {
          this.$message.error(res.data.meta.msg);
        }
      });
    },
    //删除分类参数
    delMany(attrid) {
      this.$axios.delete(`categories/${this.catId}/attributes/${attrid}`).then((res) => {
        if (res.data.meta.status == 200) {
          this.$message.success(res.data.meta.msg);
          this.getCatid();
        } else {
          this.$message.error(res.data.meta.msg);
        }
      });
    },
    //修改动态参数分类参数
    updataManyOne(row){
      this.updataMany=row;
      this.updataShow=true
    },
    updataManyTwo(){
      var obj={attr_name:this.updataMany.attr_name,attr_sel:'many',attr_vals:this.updataMany.attr_vale}
      this.$axios.put(`categories/${this.catId}/attributes/${this.updataMany.attr_id}`,obj).then(res=>{
        console.log(res)
        if(res.data.meta.status==200){
          this.$message.success(res.data.meta.msg)
          this.getCatid();
          this.updataShow=false;
        }else{
          this.$message.error(res.data.meta.msg)
        }
      })
    },
    //修改静态属性
    updataOnlyone(row){
      this.updataOnly=row
      this.updataFlag=true
    },
    updataOnlytwo(){
      var obj={attr_name:this.updataOnly.attr_name,attr_sel:'only',attr_vals:','}
       this.$axios.put(`categories/${this.catId}/attributes/${this.updataOnly.attr_id}`,obj).then(res=>{
        console.log(res)
        if(res.data.meta.status==200){
          this.$message.success(res.data.meta.msg)
          this.getCatid();
          this.updataFlag=false;
        }else{
          this.$message.error(res.data.meta.msg)
        }
      })
    }
  },
  computed: {
    //设置按钮是否禁用
    isBtn() {
      if (this.addForm.length !== 3) {
        return true;
      } else {
        return false;
      }
    },
    //获取三级分类的id值
    catId() {
      if (this.addForm.length == 3) {
        return this.addForm[2];
      }
      return null;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-alert {
  margin-bottom: 15px;
}
.el-table {
  margin-top: 15px;
}
</style>
