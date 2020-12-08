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
            v-model="addForm.goods_cat"
            :options="goodsList"
            expandTrigger="hover"
            :props="listForm"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <el-tabs
        type="border-card"
        v-model="activeName"
        @tab-click="getGoodsList"
      >
        <el-tab-pane label="动态参数" name="0">
        <!--按钮-->
        <el-button type="primary">添加分类</el-button>
          <!--参数渲染-->
          <el-table :data="addlist" style="width: 100%">
            <el-table-column type="expand">
              <template>
                <div></div>
              </template>
            </el-table-column>
            <el-table-column label="#" prop="attr_id"> </el-table-column>
            <el-table-column label="参数名称" prop="attr_name"> </el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  circle
                ></el-button>
                <el-button type="danger" icon="el-icon-edit" circle></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="1">
        <!--按钮-->
        <el-button type="primary">添加分类</el-button>
          <!--参数渲染-->
          <el-table :data="addGoods" style="width: 100%">
            <el-table-column type="expand">
              <template>
                <div></div>
              </template>
            </el-table-column>
            <el-table-column label="#" prop="attr_id"> </el-table-column>
            <el-table-column label="参数名称" prop="attr_name"> </el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  circle
                ></el-button>
                <el-button type="danger" icon="el-icon-edit" circle></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data(){
    return {
      activeName:"0",
      addForm: {},
      //分类数据
      goodsList: [],
      listForm: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //动态参数
      addlist: [],
      //静态属性
      addGoods: [],
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    //获取分类列表
    getList() {
      this.$axios.get("categories").then((res) => {
        console.log(res);
        if (res.data.meta.status !== 200) {
          this.$message.erroe(res.data.meta.msg);
          return false;
        }
        this.goodsList = res.data.data;
      });
    },
    //获取商品参数
    getGoodsList(tab, event) {
      console.log(tab, event);
      //证明商品参数列表
      // if (this.activeName === "0") {
        
      // }
      // //证明商品属性列表
      // if (this.activeIndex === "1") {
        
      // }
    },
  },
  computed: {
   
  },
};
</script>

<style lang="scss" scoped>
.el-alert {
  margin-bottom: 15px;
}
</style>