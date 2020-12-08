<template>
  <div class="orders">
    <el-card>
      <!--搜索区域-->
      <el-input
        placeholder="请输入内容"
        class="input-with-select"
        style="width: 50%"
        v-model="query"
        clearable
      >
        <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
      </el-input>
      <!--表格区域-->
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="100px"></el-table-column>
        <el-table-column prop="order_pay" label="是否付款" width="100px">
          <template slot-scope="scope">
            <el-tag effect="dark" type="danger" v-if="scope.row.order_pay === '0'"
              >未付款</el-tag
            >
            <el-tag effect="dark" v-else-if="scope.row.order_pay === '1'">支付宝</el-tag>
            <el-tag effect="dark" type="success" v-else-if="scope.row.order_pay === '2'">&nbsp;&nbsp;微信&nbsp;&nbsp;</el-tag>
            <el-tag effect="dark" type="warning" v-else>银行卡</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="100px"></el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | fool }}
          </template>
        </el-table-column>
        <el-table-column label="操作"  width="120px">
          <template>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="show=true"
            ></el-button>
            <el-button
              type="success"
              size="mini"
              icon="el-icon-location-outline"
              @click="getOrders"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页器-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tatols"
      >
      </el-pagination>
    </el-card>
    <!--修改信息-->
    <el-dialog
  title="修改信息"
  :visible.sync="show">
  <el-form :model="form" :rules="rules">
    <el-form-item label="地址" prop="orders">
     <el-cascader
     v-model="form.orders"
    :options="city"
    expandTrigger="hover"
    :props="list"></el-cascader>
    </el-form-item>
    <el-form-item label="详细信息" prop="name">
     <el-input v-model="form.name"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="show=false">取 消</el-button>
    <el-button type="primary" @click="show=false">确 定</el-button>
  </div> 
</el-dialog>
    <!--物流框-->
    <el-dialog
      title="物流信息"
      :visible.sync="flag"
      width="50%">
     <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in ordersList"
          :key="index"
          type="success"
          :timestamp="activity.ftime">
          {{activity.context}}
        </el-timeline-item>
     </el-timeline>
   </el-dialog>
  </div>
</template>

<script>
import city from '@/http/citydata.js'
export default {
  data() {
    return {
      tableData: [],
      pagesize: 10,
      pagenum: 1,
      tatols: 0,
      query: "",
      //显示物流框
      flag:false,
      ordersList:[],
      //修改信息
      city:city,
      
      show:false,
      list:{
        value:"value",
        label:"label",
        children:"children"
      },
      form:{
        orders:"",
        name:""
      },
      rules:{
        orders:[
          {required: true, message:'请输入', trigger: 'blur'}
        ],
        name:[
          {required: false, message:'请输入', trigger: 'blur'}
        ]
      }
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    //获取数据
    getData() {
      this.$axios
        .get(
          `orders?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
        )
        .then((res) => {
          console.log(res);
          if (res.data.meta.status == 200) {
            this.$message.success(res.data.meta.msg);
            this.tableData = res.data.data.goods;
            this.tatols = res.data.data.total;
          }
        });
    },
    //点击每页条数
    handleSizeChange(i){
        this.pagesize=i;
         this.getData();
    },
    //点击页码
    handleCurrentChange(i){
        this.pagenum=i;
        this.getData();
    },
    //物流信息
    getOrders(){
      this.flag=true
      this.$axios.get("/kuaidi/804909574412544580").then(res=>{
        console.log(res)
        if(res.data.meta.status==200){
          this.ordersList=res.data.data
          this.$message.success(res.data.meta.msg)
        }else{
          this.$message.error(res.data.meta.msg)
        }
      })
    },
    // 修改信息
    upOrders(){

    }
  },
};
</script>

<style lang="scss" scoped>
.el-input{
    margin-bottom: 20px;
}

</style>