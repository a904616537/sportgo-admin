<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<!-- <el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item> -->
				<el-form-item>
					<el-button @click="getUsers">Refresh List</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="nickname" label="Nickname" sortable/>
			<el-table-column prop="openid" label="Openid" width="200" sortable/>
			
			<el-table-column label="Sex" min-width="100">
				<template scope="scope">
					<div class="grid-content bg-purple">
						<span>{{ onSex(scope.row.sex) }}</span>
					</div>
				</template>
			</el-table-column>
			
			<el-table-column label="Address" min-width="180">
				<template scope ="scope">
					<div class="grid-content bg-purple">
						<span>{{ scope.row.country + ' , ' + scope.row.province + ' , ' + scope.row.city }}</span>
					</div>
				</template>
			</el-table-column>
			
			<!-- <el-table-column label="Action" width="300">
				<template scope="scope">
					<el-button type="danger" size="small" :disabled="scope.row.audit" @click="handleDel(scope.$index, scope.row)">Delete</el-button>
				</template>
			</el-table-column> -->
		</el-table>

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
				filters     : {},
				users       : [],
				total       : 0,
				page        : 1,
				sels        : [],//列表选中列
				listLoading : false,

				addLoading: false,
			}
		},
		computed : mapState({
			token   : state => state.User.token
		}),
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			onSex(sex) {
				switch(sex) {
					case 0:
					return 'Unknown'
					break;
					case 1:
					return 'Male'
					break;
					case 2:
					return 'Female'
					break;
				}
			},
			//获取用户列表
			getUsers() {
				this.listLoading = true;
				console.log('this.token', this.token)
				fetch(Vue.config.apiUrl + '/user?page='+this.page +'&per_page=1000',{
			        method : 'get',
			        headers : {
						'Content-Type' : 'application/x-www-form-urlencoded',
						'token'          : this.token
			        }
			      })
			      .then(response => response.json())
			      .then(result => {
					return new Promise((resolve, reject) => {
						console.log('result user', result)
						this.total       = result.total;
						this.users       = result.data;
						this.listLoading = false;
					}, 1000);
			      })
			      .catch(err => {});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
		},
		beforeMount() {
			this.getUsers();
		}
	}

</script>

<style scoped>

</style>