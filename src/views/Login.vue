<template>
  <div class="login">
  <!--登录页-->
    <div class="box">
      <div class="logo">
        <img src="../assets/logo.png" alt="" />
      </div>
      <el-form :model="from" :rules="rules" ref="ruleform">
        <el-form-item prop="username">
          <el-input
            type="text"
            prefix-icon="el-icon-user-solid"
            v-model="from.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            prefix-icon="el-icon-lock"
            v-model="from.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login()">登录</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      from: {
        username: "admin",
        password: "123456",
      },
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { min: 3, max: 7, message: "用户名不合格", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 3, max: 6, message: "密码输入有误", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    login() {
      var obj = { username: this.from.username, password: this.from.password };
      this.$axios.post("/login", obj).then((res) => {
        console.log(res);
        if (res.data.meta.status == 200 && res.statusText == "OK") {
          this.$message.success(res.data.meta.msg);
          sessionStorage.setItem("token", res.data.data.token);
          this.$router.push("/home");
          
        } else {
          this.$message.warning(res.data.meta.msg);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  background-color:#2b4b6b;
  display: flex;
  align-items: center;
  justify-content: center;
  & > .box {
    width: 450px;
    height: 220px;
    background-color: rgb(237, 245, 241);
    padding: 90px 10px 0 10px;
    position: relative;
    box-shadow: 0 0 10px #fff;
    border-radius: 15px;
    .logo {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #fff;
      box-shadow: 0 0 15px rgb(206, 183, 183);
      position: absolute;
      top: -80px;
      left: 36%;
      & > img {
        width: 120px;
        background-color: rgb(209, 204, 204);
        border-radius: 50%;
      }
    }
    .el-form-item {
      text-align: right;
    }
  }
}
</style>