<template>
    <div>
          <!-- 面包屑导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
     <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
     <el-breadcrumb-item>用户管理</el-breadcrumb-item>
     <el-breadcrumb-item>角色列表</el-breadcrumb-item>

     </el-breadcrumb>
        <!-- 卡片视图区域 -->
     <el-card>
         <!-- 添加角色按钮 -->
         <el-row>
             <el-col>
                 <el-button type="primary">添加按钮</el-button>
             </el-col>
         </el-row>
         <!-- 角色列表区域 -->
         <el-table :data="rolesList" border stripe>
             <!-- 展开列 -->
            <el-table-column type="expand">
               <template slot-scope="scope">
                 
                    <el-row :class="['bdtottom',i1===0?'bdtop':'','vcenter']" v-for="(item,i1) in scope.row.children" :key="item.id">
                      <!-- 一级权限 -->
                    <el-col :span="5">
                      <el-tag closable @close="removeRightById(scope.row,item.id)">
                            {{item.authName}}
                      </el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                      <!-- 二,三级权限 -->
                    <el-col :span="19">
                       <el-row :class="[i2===0?'':'bdtop','vcenter']" v-for="(item2,i2) in item.children" :key="item2.id">
                           <el-col :span="6">
                             <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)" >
                                   {{item2.authName}}
                             </el-tag>
                              <i class="el-icon-caret-right"></i>
                           </el-col>
                           <el-col :span="18">
                               <el-tag  closable @close="removeRightById(scope.row,item3.id)" type='warning' v-for="(item3) in item2.children" :key="item3.id">
                                   {{item3.authName}}
                               </el-tag>
                           </el-col>
                       </el-row>
                    </el-col>
                    
                </el-row>
               </template>
            </el-table-column>
            <!-- 索引列 -->
           <el-table-column
            type="index">
          </el-table-column>
           <el-table-column
            label="角色名称"
            prop="roleName">
          </el-table-column>
           <el-table-column
             label="角色描述"
            prop="roleDesc">
          </el-table-column>
           <el-table-column
             label="操作"
             width="300px"
            >
            <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                 <el-button type="danger" size="mini"  icon="el-icon-delete">删除</el-button>
                  <el-button type="warning" size="mini"  icon="el-icon-setting" @click="showSetRigthDialog(scope.row)">分配权限
                    
                  </el-button>
                
            </template>
          </el-table-column>
         </el-table>
     </el-card>
     <!-- 分配权限对话框 -->
     <el-dialog
  title="分配权限"
  :visible.sync="setRightDialogVisible"
  width="40%"
  @close="setRigthsClosed"
  >
  <el-tree 
  ref="treeRef" :data="rightslist" :props="treeProps" show-checkbox node-key='id' default-expand-all :default-checked-keys="defKeys"></el-tree>
  
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
           rolesList:[] ,
           //控制分配权限对话框的显示与隐藏
           setRightDialogVisible:false,
          // 权限数据
           rightslist:[],
           treeProps:{
               children:'children',
               label:'authName'
           },
           //保存三级节点下的ID值
           defKeys:[],
           roleId:''
        }
    },
    methods: {
        //获取所有角色列表
        async getRolesList(){
            const {data:res}=await this.$http.get('roles')
            if(res.meta.status!==200){
                return this.$message.error('获取角色列表失败')
            }
            this.rolesList=res.data
       
        },
        //根据id删除对应权限
        async removeRightById(role,rightId){
         const confirmResult=await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>{
             return err
             console.log(err)
        })
        if(confirmResult!=="confirm"){
            return this.$message.info('取消了删除')

            }
            console.log('确认了删除')
            const {data:res}=await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            console.log(res)
           if(res.meta.status!==200){
               return this.$message.error('删除权限失败')
           }
            role.children=res.data
        },
        //点击弹出分配权限对话框
        async showSetRigthDialog(role){
            this.roleId=role.id
           const{data:res}=await this.$http.get('rights/tree')
           if(res.meta.status!==200){
               return this.$message.error('获取数据失败')
           }
           this.rightslist=res.data
          
           //调用getLeafKeys函数
           this.getLeafKeys(role,this.defKeys)
            this.setRightDialogVisible=true
        },
        //通过递归的形式，获取角色下所有三级权限的Id,并保存到defKeys数组中
        getLeafKeys(node,arr){
           
            if(!node.children){
                return arr.push(node.id)
               
            }
            node.children.forEach(item=>
            this.getLeafKeys(item,arr))
        },
        //关闭分配角色对话框触发的事件
        setRigthsClosed(){
            this.defKeys=[]
        },
        //点击确定为角色分配权限
       async allotRights(){
            const keys=[
                ...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            const idStr=keys.join(',')
            const {data:res}= await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
            if(res.meta.status!==200){
                return this.$message.error('分配权限失败')
            }
            this.$message.success('分配角色成功')
            this.getRolesList()
            this.setRightDialogVisible=false
        }
        }
    ,
    created() {
        this.getRolesList()
    },
}
</script>
<style lang="less" scoped>
    .el-tag{
        margin: 7px;
    }
    .bdtottom{
        border-bottom: 1px solid #eee
    }
    .bdtop{
        border-top: 1px solid #eee
    }
    .vcenter{
        display: flex;
        align-items: center;
    }
</style>