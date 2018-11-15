<template>
	<el-card class="box-card">
		<el-row>
			<el-col :span="4"><div class="grid-content bg-purple"><p>Title</p></div></el-col>
			<el-col :span="8">
				<el-input v-model="data.title" @blur="onShowConfirm"></el-input>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="4"><div class="grid-content bg-purple"><p>Desc:</p></div></el-col>
			<el-col :span="8">
				<el-input v-model="data.desc" @blur="onShowConfirm"></el-input>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="4"><div class="grid-content bg-purple"><p>Video Type:</p></div></el-col>
			<el-col :span="8">
				<el-select
				value-key="type"
				v-model="data.type"
				@blur="onShowConfirm"
				placeholder="Please select a">
					<el-option
					v-for="item in types"
					:key="item.value"
					:label="item.label"
					:value="item.value">
					</el-option>
				</el-select>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="4"><div class="grid-content bg-purple"><p>Order:</p></div></el-col>
			<el-col :span="8">
				<el-select
				value-key="order"
				v-model="data.order"
				@blur="onShowConfirm"
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
		<el-row>
			<el-col :span="4"><div class="grid-content bg-purple"><p>Video Cover:</p></div></el-col>
			<el-col :span="8" class="col">
				<el-upload
				class     = "upload-demo"
				list-type = "picture-card"
				:limit     = "1"
				:action    = "uploadUrl"
				:multiple  = "false"
				:show-file-list="false"
				:on-success= "onUploadImg">
					<img v-if="data.img" :src="data.img" class="avatar">
					<i v-else class="el-icon-plus add_icon"></i>
				</el-upload>
			</el-col>
			<el-col :span="4"><div class="grid-content bg-purple"><p>Upload Video:</p></div></el-col>
			<el-col :span="8" class="col">
				<el-upload
				class     = "upload-demo"
				list-type = "picture"
				:limit     = "1"
				:action    = "uploadUrl"
				:multiple  = "false"
				:show-file-list="false"
				:on-success= "onSuccess">
					<img v-if="data.video" :src="data.video" class="avatar">
					<i v-else class="el-icon-plus add_icon"></i>
				</el-upload>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="4"><el-button @click.native="onCancel(index)">Remove</el-button></el-col>
			<el-col :span="4"><el-button v-if="show" type="primary" @click.native="submit" :loading="addLoading">Confirm</el-button></el-col>
		</el-row>
	</el-col>
	</el-card>
</template>
<script>
	import Vue from 'vue';
	export default {
		data() {
			return {
				show       : false,
				disabled   : false,
				addLoading : false,
				uploadUrl  : Vue.config.uploadUrl,
				img        : this.src,
				data       : this.item,
				orders     : [0, 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
				types      : [{
					value: 0,
					label: '预视频'
				},{
					value: 1,
					label: '练习视频'
				}]
			}
		},
		props : {
			index : {
				type    : Number,
				default : 0
			},
			item : {
				type    : Object,
				default : () => {return {
					title : '',
					desc  : '',
					img   : '',
					video : '',
					type  : 0,
					order : 20
				}}
			},
			onCancel : {
				type    : Function,
				default : () => {console.log('on onCancel')}
			},
			onSubmit : {
				type    : Function,
				default : () => {console.log('on submit')}
			}
		},
		methods: {
			onShowConfirm() {
				this.show = true;
			},
			onSuccess(data, file) {
				this.show = true;
				this.data.video = data.msg
			},
			onUploadImg(data, file) {
				this.show = true;
				this.data.img = data.msg
			},
			submit() {
				this.show = false;
				this.onSubmit(this.index, this.data);
			}
		}
	};

</script>

<style scoped>
.col {
	margin-bottom: 20px;
}
.add_dev{border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;}
.add_icon{
	font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
}
.avatar {
	width: 150px;
    height: 150px;
    display: block;
}
</style>

