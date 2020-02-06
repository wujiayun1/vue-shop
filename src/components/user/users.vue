<template>
  <div>
        <!-- 面包屑导航区域 -->
<el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
 
</el-breadcrumb>
<!-- 卡片视图区域 -->
<el-card>
   <el-row :gutter="20">
  <el-col :span="8">
      <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
          <el-button  slot="append" icon="el-icon-search" @click="getUserList"></el-button>
      </el-input>
  </el-col>
  <el-col :span='4'></el-col>
    <el-button type="primary"  @click="dialogVisible = true">添加用户</el-button>
</el-row>
<el-table :data="userList" border :stripe="true">
  <el-table-column type="index"></el-table-column>
  <el-table-column label="姓名" prop="username"></el-table-column>
  <el-table-column label="邮箱" prop="email"></el-table-column>
  <el-table-column label="电话" prop="mobile"></el-table-column>
  <el-table-column label="角色" prop="role_name"></el-table-column>
  <el-table-column label="状态" >
      <template slot-scope="scope">
       <el-switch
        v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
        </el-switch>
      </template>
  </el-table-column>
  <el-table-column label="操作"  width="180px">
  <template slot-scope='scope'>
       <!-- 修改按钮 -->
       <!-- 根据用户id查询信息,通过scope.row.id可以拿到用户id -->
      <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
       <!-- 删除按钮 -->
      <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUser(scope.row.id)"></el-button>
       <!-- 分配角色按钮 -->
    <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false" >
      <el-button type="warning" icon="el-icon-setting" @click="setRole(scope.row)"
      size="mini"></el-button>
    </el-tooltip>
  </template>    
      
  </el-table-column>      
</el-table>
 <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10 ]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>
<!-- 添加用户弹出层 -->
    <el-dialog
  title="添加用户"
  :visible.sync="dialogVisible"
  width="35%"
  @close="addDialogClosed"
 >
  <el-form :model="ruleForm" :rules="addrules" ref="ruleForm" label-width="70px" >
  <el-form-item label="用户名" prop="username">
    <el-input v-model="ruleForm.username"></el-input>
  </el-form-item>
   <el-form-item label="密码" prop="password">
    <el-input v-model="ruleForm.password"></el-input>
  </el-form-item>
   <el-form-item label="邮箱" prop="email">
    <el-input v-model="ruleForm.email"></el-input>
  </el-form-item>
   <el-form-item label="手机" prop="mobile">
    <el-input v-model="ruleForm.mobile"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary"  @click="addUser">确 定</el-button>
  </span>
</el-dialog>
<!-- 修改用户信息对话框 -->
<el-dialog
  title="修改用户"
  :visible.sync="editDialogVisible"
  width="30%"
  >
  <el-form :model="editForm" :rules="editFormrules" ref="editFormRefs" label-width="100px">
  <el-form-item label="用户名" >
    <el-input v-model="editForm.username" disabled></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="editForm.email" ></el-input>
  </el-form-item>
  <el-form-item label="手机号" prop="mobile">
    <el-input v-model="editForm.mobile" ></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click='editUserInfo'>确 定</el-button>
  </span>
</el-dialog>
<!-- 分配角色对话框 -->
<el-dialog
  title="分配角色"
  :visible.sync="setRoleDialogVisible"
  width="40%"
  @close="editDialogClosed"
  >
  <div>
    <p>点前的用户:{{userInfo.username}}</p>
    <p>当前的角色:{{userInfo.role_name}}</p>
    <p>分配新角色: <el-select v-model="setRoles" placeholder="请选择">
    <el-option
      v-for="item in rolesList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select></p>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
  </span>
</el-dialog>
</div>
 
</template>
<script>
export default {
   data() {
       return {
          //请求用户数据列表需要携带的参数
          queryInfo:{
              //搜索关键字
              query:'',
              //当前页码数
              pagenum:1,
              //每一页显示几条数据
              pagesize:2,
            
          } ,
          //用来保存所有的用户数据
          userList:[],
          //总条数
          total:0,
          //控制用户对话框的显示与隐藏
          dialogVisible: false,
          //添加用户的表单数据对象
          ruleForm:{
            username:"",
            password:"",
            email:"",
            mobile:""
          },
          //添加用户的表单验证规则对象
          addrules:{
              username:[
                    { required: true, message: '请输入用户名称', trigger: 'blur' },
                   { min: 3, max: 10, message: '用户名长度在 3 到 5 个字符', trigger: 'blur' }
              ],
              password:[
                   { required: true, message: '请输入密码', trigger: 'blur' },
                   { min: 3, max: 10, message: '密码长度在 3 到 6 个字符', trigger: 'blur' }
              ],
              email:[  { required: true, message: '请输入邮箱', trigger: 'blur' }],
              mobile:[  { required: true, message: '请输入手机号码', trigger: 'blur' },
               { min: 11, max: 11, message: '请输入正确手机号码', trigger: 'blur' }]
          },
          //修改用户的表单验证规则
          editFormrules:{
            email:[
                { required: true, message: '请输入邮箱', trigger: 'blur' },
                // {validator:checkEmail,trigger:'blur'}
                
            ],
            mobile:[
                { required: true, message: '请输入手机号码', trigger: 'blur' },
              //  {validator:checkMobile,trigger:'blur'} 
               { min: 11, max: 11, message: '请输入正确手机号码', trigger: 'blur' }
            ]
          },
          //控制用户对话框的显示与隐藏
          editDialogVisible:false,
          //查询到的用户信息对象
          editForm:{},
          //隐藏分配角色对话框
          setRoleDialogVisible:false,
          // 需要被分配角色的用户信息
          userInfo:{},
          //所有角色的数据列表
          rolesList:[],
          //已选中的角色ID值
          setRoles:''
       }
   }, 
   methods: {
      async getUserList(){
         const {data:res}=await this.$http.get('users',{params:this.queryInfo})
       
          if(res.meta.status!==200){
              return this.$message.error('获取用户列表失败!')
          }
          this.userList=res.data.users
          this.total=res.data.total
      },
      //当前页有多少条数据
      handleSizeChange(size){
         
          this.queryInfo.pagesize=size;
          this.getUserList()
      },
      //监听页码值改变的事件，当前处于第几页
      handleCurrentChange(pagesnum){
        
          this.queryInfo.pagenum=pagesnum
          this.getUserList()
      },
      //监听用户对话框关闭事件
      addDialogClosed(){
          this.$refs.ruleForm.resetFields()
      },
      //监听用户状态改变的事件
     async userStateChanged(info){

          const {data:res}=await this.$http.put(`users/${info.id}/state/${info.mg_state}`)
        
          if(res.meta.status!==200){
              info.mg_state=!info.mg_state
             return  this.$message.error('更改用户状态失败')
          }
           
        
          this.$message.success('更改用户状态成功')
      },
      //点击按钮添加新用户
      addUser(){

         this.$refs.ruleForm.validate(async valid=>{
             if(!valid) return
            //如果预校验通过，就可以发送添加用户的网络请求
            const {data:res}= await this.$http.post('users',this.ruleForm)
          
            if(res.meta.status!==201){
                return this.$messnpage.error('添加用户失败')
            }
            this.$message.success('添加用户成功')
            this.dialogVisible=false;
            //重新获取用户列表数据
            this.getUserList()
         }) 
      },
      //修改用户对话框
      async showEditDialog(id){
          
        this.editDialogVisible=true;
        const {data:res} =await this.$http.get('users/'+id)
        if(res.meta.status!==200){
            return this.$message.error('查询用户信息失败')
        }
        this.editForm=res.data

      
      },
      //点击修改用户信息并且提交
      editUserInfo(){
        
        this.$refs.editFormRefs.validate(async valid=>{
          console.log(valid)
          if(!valid){
            return
          }
          const {data:res}=await this.$http.put('users/'+this.editForm.id,{email:this.editForm.email,mobile:this.editForm.mobile})
        console.log(res)
         if(res.meta.status!==200){
          return this.$message.error('更新用户信息失败')
        }
        //如果用户数据更改成功，关闭对话框，刷新列表，给用户提示数据修改成功
          this.editDialogVisible=false;
          this.getUserList();
          this.$message.success('修改用户信息成功')
        })
      },  
      //根据用户id删除数据
      async removeUser(id){
         const confirmResult= await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        //如果用户确认删除，则返回值为字符串confirm
        //如果用户取消了删除，则返回值为字符串cancel
        // console.log(confirmResult)
        if(confirmResult!=='confirm'){
          return this.$message.info('已取消删除')
        }
         const {data:res}=await this.$http.delete(`users/${id}`)
        console.log(res)
        if(res.meta.status!==200){
         return this.$message.error('删除用户失败')
         }
         this.$message.success('删除用户成功')
          this.getUserList()
      },
      //分配角色对话框
     async setRole(userInfo){
       this.userInfo=userInfo
       //在展示对话框之前，获取所有角色列表
       const {data:res}=await this.$http.get('roles')
       if(res.meta.status!==200){
         return this.$message.error("获取角色列表失败")
       }
       this.rolesList=res.data
        this.setRoleDialogVisible=true


      },
      //点击确定按钮分配角色
     async saveRoleInfo(){
       if(!this.setRoles){
         return this.$message.error('请选择要分配的角色')
       }
      const{data:res}=await this.$http.put(`users/${this.userInfo.id}/role`,{
         rid:this.setRoles
       })
       if(res.meta.status!==200){
         return this.$message.error('更新角色失败')
       }
       this.$message.success('更新角色成功')
       this.getUserList()
       this.setRoleDialogVisible=false

      },
      //监听分配角色关闭对话框事件
      editDialogClosed(){
       this.setRoles=""
       this.userInfo={}
      }


   },
   created() {
    
       this.getUserList()
   },
}
</script>
<style lang="less" scoped>
  
</style>