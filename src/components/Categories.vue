<template>
  <div class="box">
    <el-card>
      <el-button class="btn" type="primary">添加分类</el-button>
      <!-- 表格部分 -->
      <el-table :data="tableData" style="width: 100%" align="center">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column type="expand" width="20px">
        <!-- 二级表格 -->
          <template slot-scope="scope">
            <el-table :data="scope.row.children" :show-header="false">
              <el-table-column type="expand" width="20px">
              <!-- 三级表格 -->
                <template slot-scope="scd">
                  <el-table :data="scd.row.children" :show-header="false">
                    <el-table-column prop="cat_name" width="140px"> </el-table-column>
                    <el-table-column prop="cat_deleted" width="255px">
                      <i class="el-icon-success"></i>
                    </el-table-column>
                    <el-table-column prop="cat_level">
                        <el-tag type="success">三级</el-tag>
                    </el-table-column>
                    <el-table-column>
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
                  <el-button type="danger" size="mini" icon="el-icon-delete" @click="del(scope.row.cat_id)"></el-button>
                </template>
              </el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column prop="cat_name" width="150px"> </el-table-column>
              <el-table-column prop="cat_deleted">
                <i class="el-icon-success"></i>
              </el-table-column>
              <el-table-column prop="cat_level">
                  <el-tag type="success">二级</el-tag>
              </el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
                  <el-button type="danger" size="mini" icon="el-icon-delete" @click="del(scope.row.cat_id)"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          label="分类名称"
          prop="cat_name"
          width="150px"
        ></el-table-column>
        <el-table-column label="是否有效" prop="cat_deleted">
          <i class="el-icon-success"></i>
        </el-table-column>
        <el-table-column label="排序" prop="cat_level">
          <el-tag type="success">一级</el-tag>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="del(scope.row.cat_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tatol"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      pagenum: 1,
      pagesize: 5,
      tatol:0,
      defaultProps: {
        label: "cat_name",
        children: "children",
      },
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
      //获取分类数据
    getData() {
      this.$axios
        .get(
          `categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
        )
        .then((res) => {
          console.log(res);
          if (res.data.meta.status == 200) {
            this.tableData = res.data.data.result;
            this.tatol=res.data.data.total
          }
        });
    },
    //删除
    del(id){
        this.$axios.delete(`categories/${id}`).then(res=>{
            console.log(res)
            if(res.data.meta.status==200){
                this.$message.success(res.data.meta.msg)
                this.getData();
            }else{
                this.$message.error(res.data.meta.msg)
            }
        })
    },
    //点击条数
    handleSizeChange(val){
        this.pagesize=val
         this.getData();
    },
    handleCurrentChange(val){
        this.pagenum=val
        this.getData();
    }
  },
};
</script>

<style lang="scss" scoped>
i {
  color: #008800;
}
.box {
  width: 100%;
.btn{
  margin-bottom:15px;
}
.el-table{
  width:100%;
}
}
.el-table__expanded-cell[class*=cell]{
  padding:0px 0px 0px 0px;
}

</style>