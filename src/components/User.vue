<template>
  <div class="users">
    <!--用户列表页-->
    <!-- 搜索添加部分 -->
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
      <el-button type="primary" @click="flag = true">添加用户</el-button>
    </div>
    <!-- 表格部分 -->
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="id" label="#"> </el-table-column>
      <el-table-column prop="username" label="姓名"> </el-table-column>
      <el-table-column prop="email" label="邮箱"> </el-table-column>
      <el-table-column prop="mobile" label="电话"> </el-table-column>
      <el-table-column prop="role_name" label="角色"> </el-table-column>
      <el-table-column prop="mg_state" label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="updataState(scope.row.id, scope.row.mg_state)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            @click="UPd(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            @click="del(scope.row.id)"
          ></el-button>
          <el-button
            type="warning"
            icon="el-icon-setting"
            circle
            @click="UpdataRoles(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      @size-change="pageSize"
      @current-change="pageNum"
      :current-page="pagenum"
      :page-sizes="[3, 5, 8, 10]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totals"
    >
    </el-pagination>
    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="flag">
      <el-form :model="form" :rules="rules" ref="ruleform">
        <el-form-item label="用户名" label-width="80px" prop="username">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="80px" prop="password">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="80px" prop="email">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="80px" prop="mobile">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="flag = false">取 消</el-button>
        <el-button type="primary" @click="add()">确 定</el-button>
      </div>
    </el-dialog>
    <!--修改用户信息-->
    <el-dialog title="添加用户" :visible.sync="show">
      <el-form :model="Updata" :rules="rules" ref="ruleUpdata">
        <el-form-item label="用户名" label-width="80px" prop="username">
          <el-input
            v-model="Updata.username"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="80px" prop="email">
          <el-input v-model="Updata.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="80px" prop="mobile">
          <el-input v-model="Updata.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show = false">取 消</el-button>
        <el-button type="primary" @click="Updatas()">确 定</el-button>
      </div>
    </el-dialog>
    <!--分配权限-->
    <el-dialog title="分配权限" :visible.sync="roles">
      <p>当前用户：{{ updataRoles.username }}</p>
      <p>当前的角色：{{ updataRoles.role_name }}</p>
      <el-form>
        <el-form-item label="活动区域">
          <el-select
            v-model="updataRoles.role_name"
            placeholder="请选择活动区域"
          >
            <el-option label="管理员" value="管理员"></el-option>
            <el-option label="商户" value="商户"></el-option>
            <el-option label="产品经理" value="产品经理"></el-option>
            <el-option label="项目经理" value="项目经理"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roles = false">取 消</el-button>
        <el-button type="primary" @click="Confirms()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 初始渲染
      tableData: [],
      pagenum: 1,
      pagesize: 3,
      totals: 0,
      query: "",
      //   添加用户
      flag: false,
      form: {
        username: "",
        email: "",
        mobile: "",
        password: "",
      },
      // 添加的验证
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 6, max: 15, message: "长度在6-15个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在6-15个字符" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { min: 6, max: 15, message: "长度在6-15个字符" },
        ],
        mobile: [
          { required: true, message: "请输入电话", trigger: "blur" },
          { min: 6, max: 11, message: "长度在6-11个字符" },
        ],
      },
      //修改用户
      show: false,
      Updata: {
        id: "",
      },
      //修改权限
      roles: false,
      updataRoles: {
        id: "",
        username: "",
        role_name: "",
      },
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
          `/users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
        )
        .then((res) => {
          console.log(res);
          if (res.status == 200) {
            this.tableData = res.data.data.users;
            this.totals = res.data.data.total;
          }
        });
    },
    //添加用户
    add() {
      var obj = {
        username: this.form.username,
        password: this.form.password,
        email: this.form.email,
        mobile: this.form.mobile,
      };
      this.$axios.post("users", obj).then((res) => {
        console.log(res);
        if (res.data.meta.status == 201) {
          this.$message.success(res.data.meta.msg);
          this.flag = false;
          this.getData();
        } else {
          this.$message.error(res.data.meta.msg);
        }
      });
    },
    //删除
    del(id) {
      this.$axios.delete(`users/${id}`).then((res) => {
        console.log(res);
        this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
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
            this.$message.error("你已取消删除");
          });
      });
    },
    //点击分页的每页条数
    pageSize(i) {
      //alert(i)
      this.pagesize = i;
      this.getData();
    },
    //点击页码
    pageNum(i) {
      //    alert(i)
      this.pagenum = i;
      this.getData();
    },
    //点击显示修改框
    UPd(arr) {
      this.Updata = arr;
      this.show = true;
    },
    //修改确定按钮
    Updatas() {
      var obj = {
        username: this.Updata.username,
        email: this.Updata.email,
        mobile: this.Updata.mobile,
      };
      this.$axios.put(`users/${this.Updata.id}`, obj).then((res) => {
        console.log(res);
        if (res.data.meta.status == 200) {
          this.$message.success(res.data.meta.msg);
          this.show = false;
          this.getData();
        } else {
          this.$message.error(res.data.meta.msg);
        }
      });
    },
    //修改用户的状态
    updataState(id, flag) {
      this.$axios.put(`users/${id}/state/${flag}`).then((res) => {
        console.log(res);
        if (res.data.meta.status == 200) {
          this.$message.success(res.data.meta.msg);
        } else {
          this.$message.error(res.data.meta.msg);
        }
      });
    },
    //修改权限
    UpdataRoles(row) {
      this.roles = true;
      this.updataRoles = row;
    },
    //确认修改权限
    Confirms() {
      var obj = {
        username: this.updataRoles.username,
        role_name: this.updataRoles.role_name,
      };
      this.$axios.put(`users/${this.updataRoles.id}`, obj).then((res) => {
        console.log;
        if (res.data.meta.status == 200) {
          this.$message.success(res.data.meta.msg);
        } else {
          this.$message.error(res.data.meta.msg);
        }
      });
      this.roles = false;
      this.getData();
    },
  },
};
</script>

<style lang="scss" scoped>
.users {
  box-shadow: 8px 8px 8px #333444;
  background-color: #fff;
  padding: 20px;
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
  & > .el-table {
    width: 100%;
    margin-bottom: 15px;
  }
}
</style>