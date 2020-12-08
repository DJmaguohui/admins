<template>
  <div>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column type="index" label="#"> </el-table-column>
      <el-table-column prop="authName" label="权限名称"> </el-table-column>
      <el-table-column prop="path" label="路径"> </el-table-column>
      <el-table-column prop="level" label="权限层级">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level==='0'">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.level==='1'">二级</el-tag>
          <el-tag type="danger" v-else>三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.$axios.get("rights/list").then((res) => {
        console.log(res);
        if (res.data.meta.status == 200) {
          this.tableData = res.data.data;
        }
      });
    },
  },
};
</script>

<style scoped>
</style>