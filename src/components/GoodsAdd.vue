<template>
  <div>
    <!--卡片-->
    <el-card>
      <!--提示文字-->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        :closable="false"
        show-icon
      >
      </el-alert>
      <!--步骤条-->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        align-center
        finish-status="success"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!--侧边栏-->

      <el-form :model="addForm" :rules="rules" label-position="top">
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeLeave"
          @tab-click="getGoodsList"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <!--三级联动-->
            <el-form-item label="商品分类">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="goodsList"
                expandTrigger="hover"
                :props="listForm"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in this.addlist"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="it"
                  border
                  v-for="(it, ind) in item.attr_vals"
                  :key="ind"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="(item, index) in this.addGoods"
              :key="index"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-form-item>
              <el-upload
                class="upload-demo"
                :action="src"
                :on-preview="addHeadler"
                :on-remove="removeHandle"
                list-type="picture"
                :headers="headersObj"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">定时任务补偿</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //对应下标
      activeIndex: "0",
      //绑定的值
      addForm: {
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_cat: "",
      },
      //表单验证
      rules: {
        goods_name: {
          required: true,
          message: "请输入商品名称",
          trigger: "blur",
        },
        goods_price: {
          required: true,
          message: "请输入商品价格",
          trigger: "blur",
        },
        goods_number: {
          required: true,
          message: "请输入商品数量",
          trigger: "blur",
        },
        goods_weight: {
          required: true,
          message: "请输入商品重量",
          trigger: "blur",
        },
      },
      //分类数据
      goodsList: [],
      listForm: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //商品参数
      addlist: [],
      //商品属性
      addGoods: [],
      //上传图片的url
      src:"https://www.liulongbin.top:8888/api/private/v1/upload",
      headersObj:{
        Authorization:window.sessionStorage.getItem("token")
      }
    };
  },
  mounted() {
    //获取分类列表
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
    //左侧ui事件
    beforeLeave(activeName, oldActiveName) {
      // console.log(activeName);
      // console.log(oldActiveName);
      if (this.addForm.goods_cat.length !== 3 && oldActiveName == "0") {
        this.$message.error("请选择商品分类好吗？");
        return false;
      }
    },
    //获取商品参数
    getGoodsList() {
      //证明商品参数列表
      if (this.activeIndex === "1") {
        this.$axios
          .get("categories/" + this.getId + "/attributes?sel=many")
          .then((res) => {
            console.log(res, "商品参数");
            res.data.data.forEach((item) => {
              item.attr_vals =
                item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
            });
            this.addlist = res.data.data;
          });
      }
      //证明商品属性列表
      if (this.activeIndex === "2") {
        this.$axios
          .get("categories/" + this.getId + "/attributes?sel=only")
          .then((res) => {
            console.log(res, "商品属性");

            this.addGoods = res.data.data;
          });
      }
    },
    //上传图片的函数
    addHeadler(){
      
    },
    //删除图片的钩子
    removeHandle(){
     
    },
  },
  computed: {
    getId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-alert {
  margin-bottom: 20px;
}
.el-tabs {
  margin-top: 20px;
}
</style>