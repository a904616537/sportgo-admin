<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<!-- <el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getAdmins">查询</el-button>
				</el-form-item> -->
				<el-form-item>
					<el-button @click="getAdmins">Refresh List</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="createAdmin">Create Admin</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="admins" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="username" label="User Name" sortable/>
			
			<el-table-column label="Action" width="300">
				<template scope="scope">
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">Delete</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 新增管理员 -->
		<el-dialog title="Create Admin" v-model="addAdminVisible" :close-on-click-modal="false">
			<el-form :model="form" ref="adminform" :rules="rules">
				<el-form-item label="UserName">
					<el-input v-model="form.name" auto-complete="off" label-width="120px"></el-input>
				</el-form-item>
				<el-form-item label="Password">
					<el-input type="password" v-model="form.password" auto-complete="off" label-width="120px"></el-input>
				</el-form-item>
			</el-form>
				
			<div slot="footer" class="dialog-footer">
				<el-button @click="addAdminVisible = false">Close</el-button>
				<el-button type="primary" @click="handleAdd">Submit</el-button>
			</div>
		</el-dialog>

	</section>
</template>

<script>
	import Vue from 'vue';
	import util from '../../common/js/util'
	import querystring from 'querystring';
	import {mapState, mapActions} from 'vuex'
	//import NProgress from 'nprogress'

	export default {
		data() {
			return {
				addAdminVisible : false,
				form        : { name : '', password : '' },
				rules: {
					name: [
						{ required: true, message: '请输入账号', trigger: 'blur' },
					],
					password: [
						{ required: true, message: '请输入密码', trigger: 'blur' },
					]
				},
				filters     : {},
				admins      : [],
				total       : 0,
				page        : 1,
				sels        : [],//列表选中列
				listLoading : false,
				addLoading  : false,
			}
		},
		computed : mapState({
			token   : state => state.User.token
		}),
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.getAdmins();
			},
			//获取管理员列表
			getAdmins() {
				this.listLoading = true;
				fetch(Vue.config.apiUrl + '/admin?page='+this.page +'&per_page=1000',{
			        method : 'get',
			        headers : {
						'Content-Type' : 'application/x-www-form-urlencoded',
						'token'        : this.token
			        }
			      })
			      .then(response => response.json())
			      .then(result => {
					return new Promise((resolve, reject) => {
						this.total       = result.total;
						this.admins      = result.data;
						this.listLoading = false;
					}, 1000);
			      })
			      .catch(err => {});
			},
			handleAdd() {
				this.$refs.adminform.validate((valid) => {
					if (valid) {
						const body = querystring.stringify({username : this.form.name, password : this.form.password});
						fetch(Vue.config.apiUrl + '/admin',{
					        method : 'post',
					        headers : {
								'Content-Type' : 'application/x-www-form-urlencoded',
								'token'        : this.token
					        },
					        body
					      })
					      .then(response => response.json())
					      .then(result => {
					      	this.addAdminVisible = false;
					      	this.getAdmins()
					      })
					      .catch(err => {console.log('error', err)});
					} else {
						console.log('error submit!!');
						return false;
					}
				});


				

			},
			handleDel(index, row) {
				this.loading = true;
				const body = querystring.stringify({_id : row._id});
				fetch(Vue.config.apiUrl + '/admin',{
			        method : 'delete',
			        headers : {
						'Content-Type' : 'application/x-www-form-urlencoded',
						token          : this.token
			        },
			        body : body
				})
				.then(response => response.json())
				.then(result => {
					if(result.status) {
						this.$message({
							type    : 'success',
							message : 'Success'
						});
						this.getAdmins();
					} else this.$message({
						type    : 'error',
						message : 'Failure'
					});
				})
				.catch(err => {
					this.$message({
						type    : 'error',
						message : 'Failure'
					});
				})
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			createAdmin() {
				this.addAdminVisible = true;
			}
		},
		beforeMount() {
			this.getAdmins();
		}
	}

</script>

<style scoped>

</style>