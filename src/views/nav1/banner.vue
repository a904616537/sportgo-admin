<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-button @click="getBanner">Refresh List</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="createBanner">Create Banner</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="banners" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="img" label="Banner Image" >
				<template scope ="scope">
					<div class="imgdiv">
						<img :src="scope.row.img"/>
					</div>
				</template>
			</el-table-column>

			<el-table-column prop="order" label="Order" width="100" sortable>
				<template scope ="scope">
					<el-select
					value-key="order"
					v-model="scope.row.order"
					@change = "(select) => {onChange(scope.row, select)}"
					placeholder="Please select a">
						<el-option
						v-for="item in orders"
						:key="item"
						:label="item"
						:value="item">
						</el-option>
					</el-select>
				</template>
			</el-table-column>
			
			<el-table-column label="Action" width="300">
				<template scope="scope">
					<el-button type="info" size="small" @click="onEditor(scope.$index, scope.row)">Upload</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">Delete</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--新增界面-->
		<el-dialog title="Banner Details" v-model="addBannerVisible" :close-on-click-modal="false">
			<!-- 产品详情编辑 -->
			<el-row>
				<el-col :span="24"><div class="grid-content bg-purple"><h1>Banner Upload</h1></div></el-col>
			</el-row>
			<el-card>
				<el-row>
					<v-upload ref="upload" :src="form.img" :onSubmit="onSubmit"/>
				</el-row>
			</el-card>
			
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addBannerVisible = false">Cancel</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">Submit</el-button>
			</div>
		</el-dialog>


	</section>
</template>

<script>
	import Vue                    from 'vue';
	import querystring            from 'querystring';
	import {mapState, mapActions} from 'vuex';
	import Upload                 from '../../components/product_upload';

	export default {
		data() {
			return {
				_id         : null,
				filters     : {},
				banners     : [],
				page        : 1,
				listLoading : false,
				addLoading  : false,
				form        : {
					img   : '',
					order : 10
				},
				orders           : [0, 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
				addBannerVisible : false,
			}
		},
		components: {
			'v-upload' : Upload
		},
		computed : mapState({
			token   : state => state.User.token
		}),
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.getBanner();
			},
			onSubmit(index, data) {
				this.form.img = data;
			},
			onEditor(index, row) {
				this._id = row._id;
				this.form = row;
				this.addBannerVisible = true;
			},
			addSubmit() {
				let method = 'post';
				let data = {...this.form};
				if(this._id) {
					data._id = this._id;
					method = 'put';
				};
				this.onEdit(data, method)
			},
			onChange(data, select) {
				console.log('select', select);
				data.order = select;
				this.onEdit(data, 'put')
			},
			onEdit(obj, method) {
				this.addLoading = true;
				const body = querystring.stringify(obj);
				fetch(Vue.config.apiUrl + '/banner',{
			        method : method,
			        headers : {
			          'Content-Type' : 'application/x-www-form-urlencoded'
			        },
			        body : body
				})
				.then(response => response.json())
				.then(result => {
					this.addLoading = false;
					this.$message({
						type    : 'success',
						message : 'Success'
					});
					this._id = null;
					this.addBannerVisible = false;
					this.getBanner();
				})
				.catch(err => {
					this.loading  = false;
					this.$message({
						type    : 'error',
						message : 'Failure'
					});
				})
			},
			//获取管理员列表
			getBanner() {
				this.listLoading = true;
				fetch(Vue.config.apiUrl + '/banner?page='+this.page +'&per_page=1000',{
			        method : 'get',
			        headers : {
						'Content-Type' : 'application/x-www-form-urlencoded',
						'token'        : this.token
			        }
			      })
			      .then(response => response.json())
			      .then(result => {
					return new Promise((resolve, reject) => {
						this.banners     = result.data;
						this.listLoading = false;
					}, 1000);
			      })
			      .catch(err => {});
			},
			handleAdd() {
				const body = querystring.stringify(this.from);
				fetch(Vue.config.apiUrl + '/banner',{
					method  : 'post',
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded',
						'token'        : this.token
					},
					body
				})
				.then(response => response.json())
				.then(result => {
					this.addBannerVisible = false;
					this.getBanner()
				})
				.catch(err => {console.log('error', err)});
			},
			handleDel(index, row) {
				this.loading = true;
				const body = querystring.stringify({_id : row._id});
				fetch(Vue.config.apiUrl + '/banner',{
			        method : 'delete',
			        headers : {
						'Content-Type' : 'application/x-www-form-urlencoded',
						token          : this.token
			        },
			        body : body
				})
				.then(response => response.json())
				.then(result => {
					console.log('result', result)
					if(result.status) {
						this.$message({
							type    : 'success',
							message : 'Success'
						});
						this.getBanner();
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
			createBanner() {
				this.form.img = '';
				this.addBannerVisible = true;
			}
		},
		beforeMount() {
			this.getBanner();
		}
	}

</script>

<style scoped>
.imgdiv {

}
.imgdiv img {
	width: auto;
	height: 100px;
}
</style>