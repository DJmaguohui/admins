<template>
  <div class="home">
    <el-container>
      <!-- 头部 -->
      <el-header>
        <div class="left">
          <img src="../assets/logo.png" alt="" />
          <h2>电商后台管理系统</h2>
        </div>

        <el-button @click="Quit()">退出</el-button>
      </el-header>
      <!-- 内容 -->
      <el-container>
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#00b2b2"
            router
            :collapse-transition="false"
            :collapse="isCollapse"
            :unique-opened="true"
          >
            <span v-show="!isCollapse" @click="shrink()"
              ><i class="el-icon-s-fold"></i
            ></span>
            <span v-show="isCollapse" @click="shrink()"
              ><i class="el-icon-s-unfold"></i
            ></span>
            <el-submenu
              :index="item.path"
              v-for="(item, index) in list"
              :key="index"
            >
              <template slot="title">
                <i :class="icon[item.id]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <el-menu-item
                :index="it.path"
                v-for="(it, ind) in item.children"
                :key="ind"
              >
                <i class="el-icon-menu"></i>
                <span>{{ it.authName }}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 右侧内容 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 侧边栏数据
      list: [],
      icon:{
      125:"iconfont icon-users",
      103:"iconfont icon-tijikongjian",
      101:"iconfont icon-shangpin",
      102:"iconfont icon-danju",
      145:"iconfont icon-baobiao"
      },
      //左侧菜单栏显示隐藏
      isCollapse: false,
    };
  },
  mounted() {
    this.$axios.get("menus").then((res) => {
      console.log(res);
      if (res.status == 200 && res.statusText == "OK") {
        this.list = res.data.data;
      }
    });
  },
  methods: {
    //退出登录
    Quit() {
      this.$confirm("此操作将退出该页面, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          sessionStorage.removeItem("token");
          this.$router.push("/");
          this.$message.success("退出成功");
        })
        .catch(() => {
          this.$message.error("你已取消登录");
        });
    },
    //左侧菜单栏显示隐藏
    shrink() {
      this.isCollapse = !this.isCollapse;
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  & > .el-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    & > .el-header {
      width: 100%;
      height: 10%;
      background-color: #333;
      display: flex;
      align-items: center;
      justify-content: space-between;
      & > .left {
        width: 30%;
        height: 100%;
        display: flex;
        &>img{
          width: 18%;
          border-radius: 50%;
        }
        & > h2 {
          font-weight: 100;
          color: #fff;
          margin-left: 10px;
        }
      }
    }
    & > .el-container {
      width: 100%;
      background-color: #999;
      flex: 1;
      & > .el-aside {
        height: 100%;
        display: flex;
        flex-direction: column;
        & > .el-menu > span {
          display: block;
          width: 100%;
          height: 20px;
          background-color: #7b72e9;
          text-align: center;
        }
        i {
          font-size: 18px;
          margin-right: 10px;
        }

        & > .el-menu {
          height: 100%;
        }
        .el-menu-vertical-demo {
          border: none;
        }
      }
      & > .el-main {
        width: 100%;
        padding: 20px;
      }
    }
  }
}
</style>
