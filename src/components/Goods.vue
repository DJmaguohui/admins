<template>
  <div class="goods">
    <!-- 添加搜索 -->
    <div class="head">
      <el-input
        placeholder="请输入内容"
        v-model="query"
        class="input-with-select"
        clearable
        @clear="getData"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="getData"
        ></el-button>
      </el-input>
      <el-button type="primary" @click="$router.push('/goodsadd')">添加用户</el-button>
    </div>
    <!-- 表格部分 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="goods_id" label="#" width="50px">
      </el-table-column>
      <el-table-column prop="goods_name" label="商品名"> </el-table-column>
      <el-table-column prop="goods_price" label="商品价格" width="80px"> </el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="80px"> </el-table-column>
      <el-table-column prop="add_time" label="创建时间" width="160px">
      <template slot-scope="scope">
        {{scope.row.add_time|fool}}
      </template>
       </el-table-column>
      <el-table-column label="操作" width="120px">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            @click="del(scope.row.goods_id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      @size-change="pageSize"
      @current-change="pageNum"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totals"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      query: "",
      pagenum: 1,
      pagesize: 10,
      totals: 0,
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
          `/goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
        )
        .then((res) => {
          console.log(res);
          if (res.status == 200) {
            this.tableData = res.data.data.goods;
            this.totals = res.data.data.total;
          }
        });
    },
    // 点击每页显示条数
    pageSize(i) {
      this.pagesize = i;
      this.getData();
    },
    //点击页码
    pageNum(i) {
      this.pagenum = i;
      this.getData();
    },
    // 删除商品
    del(id) {
      this.$axios.delete(`goods/${id}`).then((res) => {
        console.log(res);
        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            if (res.data.meta.status == 200) {
              this.$message.success(res.data.meta.msg);
              this.getData();
            } else {
              this.$message.error(res.data.meta.msg);
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      });
    },
  },
 
};
</script>

<style lang="scss" scoped>
.goods {
  width: 100%;
  padding: 20px;
  background-color: #fff;
  & > .head {
    width: 100%;
    height: 80px;
    & > .el-input {
      width: 40%;
    }
    & > .el-button {
      margin-left: 20px;
    }
  }
}
</style>