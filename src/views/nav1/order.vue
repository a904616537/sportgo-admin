<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-button @click="getOrder">Refresh List</el-button>
				</el-form-item>
				<el-form-item>
					<el-button @click="onDownload">Download Excel</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="orders" highlight-current-row v-loading="loading" style="width: 100%;">
				<el-table-column type="index" width="60">
				</el-table-column>
				<el-table-column type="expand" label="Products">
					<template scope="props">

						<!--列表-->
						<el-table :data="props.row.order_item" highlight-current-row v-loading="listLoading" style="width: 100%;">
							<el-table-column type="index" width="60">
							</el-table-column>
							<el-table-column prop="name" label="Name" sortable/>
							<el-table-column prop="number" label="Number" width="200" sortable/>
							
							<el-table-column prop="price" label="Price" width="100"/>
							
							<el-table-column label="Subtotal" min-width="180">
								<template scope ="scope">
									<div class="grid-content bg-purple">
										<span>{{ (scope.row.number * scope.row.price).toFixed(1)}}</span>
									</div>
								</template>
							</el-table-column>
							
							<!-- <el-table-column label="Action" width="300">
								<template scope="scope">
									<el-button type="danger" size="small" :disabled="scope.row.audit" @click="handleDel(scope.$index, scope.row)">Delete</el-button>
								</template>
							</el-table-column> -->
						</el-table>

					</template>
				</el-table-column>
				<el-table-column prop="_id" label="Order_Id" width="180" sortable></el-table-column>
				<el-table-column label="Address">
					 <template scope="scope">
						<el-popover trigger="hover" placement="top">
						<p>Recipients: {{ scope.row.address?scope.row.address.recipients:'' }}</p>
						<p>Phone: {{ scope.row.address?scope.row.address.phone:'' }}</p>
						<p>Address: {{ scope.row.address?scope.row.address.address:'' }}</p>
						<div slot="reference" class="name-wrapper">
							<el-tag size="medium">{{scope.row.address?scope.row.address.recipients:''}}</el-tag>
						</div>
						</el-popover>
					</template>
				</el-table-column>
				<el-table-column prop="total" label="Purchase Total" width="180" sortable>
					<template scope="scope">
						<p>¥ {{scope.row.total}}</p>
					</template>
				</el-table-column>
				<el-table-column prop="CreateTime" label="Time" width="120" sortable>
					<template scope="scope">
						<p>{{moment(scope.row.CreateTime)}}</p>
					</template>
				</el-table-column>
				<el-table-column prop="status" label="Status" width="100" sortable>
					<template scope="scope">
						<el-button v-if="scope.row.status == 0" type="danger" size="small" @click="editOrder(scope.row._id, scope.row.status + 1)">Not paying</el-button>
						<el-button v-else-if="scope.row.status == 1" type="warning" size="small" @click="editOrder(scope.row._id, scope.row.status + 1)">Payment</el-button>
						<el-button v-else-if="scope.row.status == 2" type="blue" size="small" @click="editOrder(scope.row._id, scope.row.status + 1)">Processing</el-button>
						<el-button v-else type="success" size="small">Complete</el-button>
						
					</template>
					
				</el-table-column>

				<!-- <el-table-column label="Action" width="150">
					<template scope="scope">
						<el-button type="info" style="margin: 3px auto;" size="small" @click="onEditor(scope.$index, scope.row)">Editor</el-button>
						<el-button type="danger" style="margin: 3px auto;" size="small" :disabled="scope.row.audit" @click="handleDel(scope.$index, scope.row)">Delete</el-button>
					</template>
				</el-table-column> -->
			</el-table>
		</template>

	</section>
</template>
<script>
	import { getUserList } from '../../api/api';
	import Vue         from 'vue';
	import moment      from 'moment';
	import querystring from 'querystring';
	import {mapState, mapActions} from 'vuex'

	export default {
		data() {
			return {
				_id : null,
				listLoading : false,
				form : {
					name  : '',
					price : 0,
					order : 10,
				},
				uploadUrl      : Vue.config.uploadUrl,
				loading        : false,
				total          : 0,
				addFormVisible : false,
				addLoading     : false,
				filters        : {},
				fileList       : [],
				orders       : [],
				orders         : [0, 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
			}
		},
		computed : mapState({
			token : state => state.User.token
		}),
		methods: {
			moment(date) {
				return moment(date).format('YYYY-MM-DD, h:mm:ss');
			},
			getOrder() {
				let para = {
					page: this.page
				};
				this.loading = true;
				fetch(Vue.config.apiUrl + '/order/admin',{
			        method : 'get',
			        headers : {
			          'Content-Type' : 'application/x-www-form-urlencoded',
			          token : this.token
			        }
			      })
			      .then(response => response.json())
			      .then(result => {
			      	console.log('order result', result)
					return new Promise((resolve, reject) => {
						this.orders = result.data;
						this.loading  = false;
					}, 5000);
			      })
			      .catch(err => {console.log('获取订单出错')});
			},
			onEdit(_id, status) {
				this.$confirm('Sure to perform?', 'warning', {
					confirmButtonText : 'OK',
					cancelButtonText  : 'cancel',
					type              : 'warning'
				}).then(() => {
					this.editOrder(_id, status)
				}).catch(() => {});
			},
			editOrder(_id, status) {
				this.addLoading = true;
				const body = querystring.stringify({_id, status});
				fetch(Vue.config.apiUrl + '/order/admin',{
			        method : 'put',
			        headers : {
						'Content-Type' : 'application/x-www-form-urlencoded',
						token          : this.token
			        },
			        body : body
				})
				.then(response => response.json())
				.then(result => {
					this.addLoading = false;
					if(result.status) {
						this.$message({
							type    : 'success',
							message : 'Success'
						});
						this.getOrder();
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
			onDownload() {
				fetch(Vue.config.apiUrl + '/order/excel',{
				method  : 'get',
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded',
						'token'        : this.token
					}
				})
				.then(response => response.json())
				.then(result => {
					console.log('result', result)
					self.location=Vue.config.apiUrl + '/upload/Replacement_order.xlsx';
				})
				.catch(err => {
					console.log('err', err)
				});
			},
			handleRemove(file, fileList) {
				this.fileList = fileList;
			}
		},
		mounted() {
			this.getOrder();
		}
	};

</script>

<style scoped>
</style>

