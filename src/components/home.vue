<template>
  <el-container class="home-container">
      <!-- //头部区域 -->
    <el-header>
     <div>
         <img src="../assets/hot.png" alt="">
         <span>电商后台管理系统</span>
     </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- //页面主体区域 -->
    <el-container>
        <!-- //侧边栏 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-button" @click="toggleClass">|||</div>
        <el-menu
      
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409EFF" :collapse='isCollapse' :collapse-transition='false' :default-active='activePath' unique-opened router>
      <!-- 一级菜单 -->
      <el-submenu :index="item.id+''" v-for="item in menuList" :key='item.id'>
        <template slot="title">
          <i :class="iconsObj[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
       <el-menu-item :index="'/'+items.path" v-for="items in item.children" :key="items.id" @click="saveNavState('/'+items.path)">
         <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{items.authName}}</span>
        </template>
       </el-menu-item>
       </el-submenu>
      
    </el-menu>
      </el-aside>
      <!-- //右侧内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data(){
    return {
      menuList:[],
      //字体图标对象
      iconsObj:{
        '125':'iconfont icon-user',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao'

      },
      isCollapse:false,
      //被激活的链接地址
      activePath:''
    }
  },
  methods:{
    //退出登录
    logout(){
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    //请求侧边栏数据
    async getMenuList(){
        const {data:res}= await this.$http.get('menus')
        if(res.meta.status!==200) return this.$message.error('请求数据失败')
        this.menuList=res.data
        // console.log(res)
    },
    // 是否折叠侧边栏
    toggleClass(){
      this.isCollapse=!this.isCollapse
    },
    //保存链接激活的状态
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath=activePath
    }
  },
  created() {
    this.getMenuList()
    this.activePath=window.sessionStorage.getItem('activePath')
    
  },
}
</script>
<style lang="less" scoped>
    .home-container{
        height: 100%;
    }
    .el-header{
        background-color: #373d41;
        display: flex;
        justify-content: space-between;
        padding-left: 0;
        align-items: center;
        color: #fff;
        font-size: 20px;
        >div{
            display: flex;
            align-items: center;
        img{
            width: 50px;
            height: 40px;
        }
        span{
            padding-left: 15px;
        }
    }
        

    }
    .el-aside{
        background-color: #333744;
        .el-menu{
          border-right: none
        }
    }
    .el-main{
        background-color: #eaedf1;
    }
   .iconfont {
      margin-right: 10px;
    }
    .toggle-button{
      background-color: #4A5064;
      font-size: 10px;
      line-height:24px;
      cursor: pointer;
      color: #fff;
      text-align: center;
      letter-spacing: 0.2em;

    }
</style>