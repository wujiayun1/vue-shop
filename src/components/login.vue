<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/tianshi.gif" alt />
      </div>
      <el-form ref="loginFormRef" :rules="LoginFormRules" class="login_form" :model="LoginForm">
        <el-form-item prop="username">
          <el-input v-model="LoginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="LoginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //表单文本框绑定的数据
      LoginForm: {
        username: 'admin',
        password: '123456'
      },
      //表单验证规则
      LoginFormRules: {
        //用户名验证规则
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        //用户密码验证规则
        password: [
          { required: true, message: '请输入登陆密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    //点击按钮重置表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },

    login() {
      //表单登陆之前验证
      this.$refs.loginFormRef.validate(async val => {
        //val是一个布尔值，如果为true则表示验证通过，反之则没有通过
        if (!val) {
          return
        }
        //发送登陆请求
        const { data: res } = await this.$http.post('login', this.LoginForm)
        if (res.meta.status !== 200)
          return this.$message({
            message: '登陆失败',
            type: 'error',
            duration: 2000
          })
        this.$message({
          message: '登陆成功',
          type: 'success',
          duration: 2000
        })
        console.log(res)
        //登陆成功过后需要将token存储到sessionStorage中，因为项目中除了登陆页面其余的页面必须
        //在登陆之后才能访问
        window.sessionStorage.setItem('token', res.data.token)
        //通过编程式导航跳转到后台主页，路由地址是/home
        this.$router.push('/home')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  width: 100%;
  height: 100%;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .avatar_box {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>