<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<!-- <el-input v-model="filters.name" placeholder="姓名"></el-input> -->
					<el-button @click="getCourse">Refresh List</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="create">Create Course</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="courses" highlight-current-row v-loading="loading" style="width: 100%;">
				<el-table-column type="index" width="60">
				</el-table-column>
				<el-table-column type="expand" label="Details">
					<template scope="props">

						<!--列表-->
						<el-table :data="props.row.item" highlight-current-row style="width: 100%;">
							<el-table-column type="index" width="60">
							</el-table-column>
							<el-table-column prop="title" label="Video Title" width="150"/>
							<el-table-column label="Video Cover" width="300" >
								<template scope="scope">
									<div class="imgdiv">
										<img :src="scope.row.img" style="height: 80px;margin: 5px;" />
									</div>
								</template>
							</el-table-column>

							<el-table-column prop="video" label="Video URL"/>
						</el-table>

					</template>
				</el-table-column>

				<el-table-column prop="title" label="Title" sortable/>
				<el-table-column prop="level" label="Level"  width="300" >
					<template scope ="scope">
						<p v-if="scope.row.level==0">初级</p>
						<p v-else-if="scope.row.level==1">中级</p>
						<p v-else>高级</p>
					</template>
				</el-table-column>
				
				<el-table-column prop="img" label="Cover"  width="300" >
					<template scope ="scope">
						<div class="imgdiv">
							<img :src="scope.row.img" style="height: 80px;margin: 5px;" />
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="order" label="Order" width="100" sortable>
					<template scope ="scope">
						<el-select
						value-key="order"
						v-model="scope.row.order"
						@change = "(select) => {onSeletct(scope.row, select)}"
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
				<el-table-column label="Action" width="150">
					<template scope="scope">
						<el-button type="info" style="margin: 3px auto;" size="small" @click="onEditor(scope.$index, scope.row)">Editor</el-button>
						<el-button type="danger" style="margin: 3px auto;" size="small" :disabled="scope.row.audit" @click="handleDel(scope.$index, scope.row)">Delete</el-button>
					</template>
				</el-table-column>
			</el-table>

			<!--新增界面-->
			<el-dialog title="Edit Course Details" v-model="addFormVisible" :close-on-click-modal="false">
				<!-- 产品详情编辑 -->
				<el-row>
					<el-col :span="24"><div class="grid-content bg-purple"><h1>Course Details</h1></div></el-col>
				</el-row>
				<el-card class="box-card">
					<el-row>
						<el-col :span="12">
							<el-row>
								<el-col :span="6"><div class="grid-content bg-purple"><p>Title</p></div></el-col>
								<el-col :span="16">
									<el-input v-model="form.title"></el-input>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="6"><div class="grid-content bg-purple"><p>Desc:</p></div></el-col>
								<el-col :span="16">
									<el-input v-model="form.desc"></el-input>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="6"><div class="grid-content bg-purple"><p>Level:</p></div></el-col>
								<el-col :span="16">
									<el-select
									value-key="level"
									v-model="form.level"
									placeholder="Please select a">
										<el-option
										v-for="item in levels"
										:key="item.value"
										:label="item.label"
										:value="item.value">
										</el-option>
									</el-select>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="6"><div class="grid-content bg-purple"><p>Order:</p></div></el-col>
								<el-col :span="16">
									<el-select
									value-key="order"
									v-model="form.order"
									placeholder="Please select a">
										<el-option
										v-for="item in orders"
										:key="item"
										:label="item"
										:value="item">
										</el-option>
									</el-select>
								</el-col>
							</el-row>
						</el-col>
						<el-col :span="12">
							<el-col :span="8"><div class="grid-content bg-purple"><p>Course Cover</p></div></el-col>
							<el-col :span="16">
								<v-upload :src="form.img" :onSubmit="onSubmit"/>
							</el-col>
						</el-col>
					</el-row>					
				</el-card>

				<el-row>
					<el-col :span="24"><div class="grid-content bg-purple"><h1>Course Video</h1></div></el-col>
				</el-row>
				
				
				<v-course-item v-for="(item, index) in form.item" :key="index" :index="index" :item="item" :onSubmit="onSubmitItem" :onCancel="onCancel"/>

				<el-card>
					<el-row>
						<el-col :span="24">
							<div @click="addItem" class="grid-content bg-purple-dark">
								<i class="el-icon-plus">Add Video</i>
							</div>
						</el-col>
					</el-row>
				</el-card>

				<div slot="footer" class="dialog-footer">
					<el-button @click.native="addFormVisible = false">Cancel</el-button>
					<el-button type="primary" @click.native="addSubmit" :loading="addLoading">Submit</el-button>
				</div>
			</el-dialog>

		</template>

	</section>
</template>
<script>
	import Vue         from 'vue';
	import querystring from 'querystring';
	import {mapState, mapActions} from 'vuex'
	import Upload from '../../components/product_upload'
	import CourseItem from '../../components/course_item'
	import axios from 'axios';
	export default {
		data() {
			return {
				_id : null,
				form : {
					title : '',
					desc  : '',
					img   : '',
					level  : 0,
					order : 10,
					item  : []
				},
				uploadUrl      : Vue.config.uploadUrl,
				loading        : false,
				total          : 0,
				addFormVisible : false,
				addLoading     : false,
				filters        : {},
				fileList       : [],
				courses       : [],
				orders         : [0, 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
				levels      : [{
					value: 0,
					label: '初级'
				},{
					value: 1,
					label: '中级'
				},{
					value: 2,
					label: '高级'
				}]
			}
		},
		components: {
			'v-upload'      : Upload,
			'v-course-item' : CourseItem
		},
		computed : mapState({
			token : state => state.User.token
		}),
		methods: {
			onSubmit(index, data) {
				this.form.img = data
			},
			addItem() {
				console.log('item', this.form);
				this.form.item.push({
					title : '',
					desc  : '',
					img   : '',
					video : '',
					item  : [],
					type  : 0,
					order : 20
				})
			},
			onSubmitItem(index, data) {
				console.log('onSubmitItem', index, data)
				this.form.item.splice(index, 1, data);
			},
			onCancel(index) {
				console.log('取消', index)
				this.form.item.splice(index, 1);
			},
			onSeletct(item, order) {
				if(this.loading) return;
				let body = querystring.stringify(Object.assign(item, {order}));
				fetch(Vue.config.apiUrl + '/course',{
						method         : 'put',
						headers        : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					},
					body
				})
				.then(response     => response.json())
				.then(result       => {
					this.$message({
						type    : 'success',
						message : 'Success'
					});
				})
				.catch(err => {
					this.$message({
							type    : 'error',
							message : 'Failure'
						});
				});
			},
			getCourse() {
				let para = {
					page: this.page
				};
				this.loading = true;
				fetch(Vue.config.apiUrl + '/course/all',{
			        method : 'get',
			        headers : {
			          'Content-Type' : 'application/x-www-form-urlencoded'
			        }
			      })
			      .then(response => response.json())
			      .then(result => {
					return new Promise((resolve, reject) => {
						this.total    = result.total;
						console.log('result.data', result.data)
						this.courses = result.data;
						this.loading  = false;
					}, 5000);
			      })
			      .catch(err => {
			      	this.loading  = false;
			      	console.log('获取商品出错', err)
			      });
			},
			editCourse(obj, method) {
				console.log('obj', obj)
				this.addLoading = true;
				// const body = querystring.stringify(obj);

				axios({
					method : method,
					url    : Vue.config.apiUrl + '/course',
					data   : obj
				})
				.then((response) => {
					this.addLoading = false;
					this.$message({
						type    : 'success',
						message : 'Success'
					});
					this._id = null;
					this.addFormVisible = false;
					this.getCourse();
					
				})
				.catch(err => {
					this.loading  = false;
					this.$message({
						type    : 'error',
						message : 'Failure'
					});
				});

				// fetch(Vue.config.apiUrl + '/course',{
			 //        method : method,
			 //        headers : {
			 //          'Content-Type' : 'application/x-www-form-urlencoded'
			 //        },
			 //        body : body
				// })
				// .then(response => response.json())
				// .then(result => {
					
				// })
				// .catch(err => {
				// 	this.loading  = false;
				// 	this.$message({
				// 		type    : 'error',
				// 		message : 'Failure'
				// 	});
				// })
			},
			addSubmit() {
				let method = 'post';
				let data = {...this.form};
				if(this._id) {
					data._id = this._id;
					method = 'put';
				};
				this.editCourse(data, method)
			},
			onEditor(index, row) {
				this._id = row._id;
				console.log('onEditor', row)
				this.form = row;
				this.addFormVisible = true;
			},
			handleDel(index, row) {
				this.loading = true;
				const body = querystring.stringify({_id : row._id});
				fetch(Vue.config.apiUrl + '/course',{
			        method : 'delete',
			        headers : {
			          'Content-Type' : 'application/x-www-form-urlencoded'
			        },
			        body : body
				})
				.then(response => response.json())
				.then(result => {
					this.$message({
						type    : 'success',
						message : 'Success'
					});
					this.getProduct();
				})
				.catch(err => {
					console.log('err', err)
					this.loading = false;
					this.$message({
						type    : 'error',
						message : 'Failure'
					});
				})
			},
			handleRemove(file, fileList) {
				this.fileList = fileList;
			},
			create() {
				this.addFormVisible = true;
				this._id = null;
				this.form = {
					title : '',
					desc  : '',
					img   : '',
					level : 0,
					item  : [],
					order : 10,
				};
			}
		},
		mounted() {
			this.getCourse();
		}
	};

</script>

<style scoped>
.imgdiv{
	position : relative;
	overflow : hidden;
}
.defimg {
	position      : absolute;
	right         : -15px;
	top           : -6px;
	width         : 40px;
	height        : 24px;
	background    : #13ce66;
	text-align    : center;
	-ms-transform : rotate(45deg);
	transform     : rotate(45deg);
	box-shadow    : 0 0 1pc 1px rgba(0,0,0,.2);
}
.defimg i {
	color         : #fff;
	font-size     : 11px;
	margin-top    : 11px;
	-ms-transform : rotate(-45deg) scale(.8);
	transform     : rotate(-45deg) scale(.8);
}
.add_dev{border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;}
.add_icon{
	font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
</style>

