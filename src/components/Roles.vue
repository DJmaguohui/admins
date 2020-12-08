<template>
  <div class="roles">
    <!--角色列表-->
    <el-card>
      <!-- 添加角色 -->
      <el-button type="primary" @click="flag = true">添加角色</el-button>
      <!-- 表格区域 -->
      <el-table :data="tableData" border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item, key) in scope.row.children"
              :key="item.id"
              :class="['bdbottom', key == 0 ? 'bdtop' : '', 'vcenter']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable>{{ item.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限 -->
                <el-row
                  v-for="(it, k) in item.children"
                  :key="it.id"
                  :class="[k == 0 ? '' : 'bdtop', 'vcenter']"
                >
                  <el-col :span="6">
                    <el-tag type="success" closable>
                      {{ it.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(ite, ke) in it.children"
                      :key="ke"
                      closable
                    >
                      {{ ite.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" prop="id"> </el-table-column>
        <el-table-column label="商品名称" prop="roleName"> </el-table-column>
        <el-table-column label="描述" prop="roleDesc"> </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="updata(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="del(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-star-off"
              @click="jurisdiction(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="flag">
      <el-form :model="addData" :rules="rules" ref="ruleaddData">
        <el-form-item label="角色名称" label-width="80px" prop="roleName">
          <el-input v-model="addData.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" label-width="80px" prop="roleDesc">
          <el-input v-model="addData.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="flag = false">取 消</el-button>
        <el-button type="primary" @click="add()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户角色 -->
    <el-dialog title="修改用户" :visible.sync="show">
      <el-form :model="Updata" :rules="rules" ref="ruleUpdata">
        <el-form-item label="角色名称" label-width="80px" prop="roleName">
          <el-input v-model="Updata.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" label-width="80px" prop="roleDesc">
          <el-input v-model="Updata.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show = false">取 消</el-button>
        <el-button type="primary" @click="Updatas()">确 定</el-button>
      </div>
    </el-dialog>
    <!--分配权限-->
    <el-dialog title="分配权限" :visible.sync="isshow" @close="dowm">
      <el-tree
        :data="tree"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="treeId"
        :props="treeProps"
        ref="reftree"
      >
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isshow = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      // 添加角色
      addData: {
        roleName: "",
        roleDesc: "",
      },
      flag: false,
      //添加验证
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 5, max: 15, message: "请输入5-15个字或字符", trigger: "blur" },
        ],
        roleDesc: [
          { required: false, message: "请输入角色名称", trigger: "blur" },
          {
            min: 10,
            max: 20,
            message: "请输入5-15个字或字符",
            trigger: "blur",
          },
        ],
      },
      //修改用户角色
      Updata: {},
      show: false,
      //分配权限
      isshow: false,
      //权限列表
      tree: [],
      //赋值数据
      treeProps: {
        children: "children",
        label: "authName",
      },
      // 选中的权限数组
      treeId: [],
      rowId:"",
    };
  },
  mounted() {
    //获取列表数据
    this.getData();
  },
  methods: {
    //获取数据
    getData() {
      this.$axios.get("roles").then((res) => {
        console.log(res);
        if (res.data.meta.status == 200) {
          this.tableData = res.data.data;
        }
      });
    },
    //添加角色
    add() {
      var obj = {
        roleName: this.addData.roleName,
        roleDesc: this.addData.roleDesc,
      };
      this.$axios.post(`roles`, obj).then((res) => {
        console.log(res);
        if (res.data.meta.status == 201) {
          this.$message.success(res.data.meta.msg);
        } else {
          this.$message.error(res.data.meta.msg);
        }
        this.flag = false;
        this.getData();
      });
    },
    //编辑用户角色
    updata(row) {
      this.show = true;
      this.Updata = row;
    },
    //确认修改用户角色
    Updatas() {
      this.$axios.put(`roles/${this.Updata.id}`, this.Updata).then((res) => {
        console.log(res);
        if (res.data.meta.status == 200) {
          this.$message.success(res.data.meta.msg);
        } else {
          this.$message.error(res.data.meta.msg);
        }
      });
      this.show = false;
      this.getData();
    },
    //删除角色
    del(id) {
      this.$axios.delete(`roles/${id}`).then((res) => {
        console.log(res);
        if (res.data.meta.status == 200) {
          this.$message.success(res.data.meta.msg);
        } else {
          this.$message.error(res.data.meta.msg);
        }
        this.getData();
      });
    },
    //点击分配权限
    jurisdiction(row) {
      this.rowId=row.id
      //获取权限列表数据
      this.$axios.get("rights/tree").then((res) => {
        console.log(res);
        if (res.data.meta.status == 200) {
          this.$message.success(res.data.meta.msg);
          this.tree = res.data.data;
        } else {
          this.$message.error(res.data.meta.msg);
        }
      });
      this.getlistId(row, this.treeId);
      this.isshow = true;
    },
    //递归函数
    getlistId(act, arr) {
      //判断节点中是否是三级权限
      if (!act.children) {
        //将id添加到数组中
        return arr.push(act.id);
      }
      act.children.forEach((item) => {
        this.getlistId(item, arr);
      });
    },
    //清空权限id数组
    dowm() {
      this.treeId=[]
    },
    //确定分配权限
    dialogFormVisible(){
      //获取到分配的权限id
      const keys=[...this.$refs.reftree.getCheckedKeys(),...this.$refs.reftree.getHalfCheckedKeys()];
      const arr=keys.join(",")
      this.$axios.post(`roles/${this.rowId}/rights`,{rids:arr}).then(res=>{
        console.log(res)
      if(res.data.meta.status==200){
        this.$message.success(res.data.meta.msg)
        this.isshow=false;
       }else{
         this.$message.error(res.data.meta.msg)
       }
      })
      
    }
  },
};
</script>

<style lang="scss" scoped>
.el-card {
  padding: 10px;
  box-shadow: 8px 8px 8px #333444;
  .el-table {
    margin-top: 10px;
  }
  .bdtop {
    border-top: 1px solid #eee;
  }
  .bdbottom {
    border-bottom: 1px solid #eee;
  }
  .vcenter {
    display: flex;
    align-items: center;
  }
  .el-tag {
    margin: 7px;
  }
}
</style>