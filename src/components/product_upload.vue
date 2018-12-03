<template>
	<el-col :span="8" class="col">
		<el-upload
		class     = "upload-demo"
		list-type = "picture-card"
		:limit     = "1"
		:action    = "uploadUrl"
		:multiple  = "false"
		:show-file-list="false"
		:on-success= "onSuccess">
			<img v-if="img" :src="img" class="avatar">
			<i v-else class="el-icon-plus add_icon"></i>
		</el-upload>
	</el-col>
</template>
<script>
	import Vue from 'vue';
	export default {
		data() {
			return {
				disabled   : false,
				addLoading : false,
				uploadUrl  : Vue.config.uploadUrl,
				img        : this.src
			}
		},
		props : {
			index : {
				type    : Number,
				default : 0
			},
			src : {
				type    : String,
				default : ''
			},
			onRemove : {
				type    : Function,
				default : () => {console.log('delete')}
			},
			onSubmit : {
				type : Function,
				default : () => {console.log('on submit')}
			}
		},
		watch: {
		    src: function (val, oldVal) {
		    	console.log('属性变更')
		    	this.img = val;
		    },
		},
		methods: {
			onSuccess(data, file) {
				this.img = data.msg
				this.onSubmit(this.index, this.img)
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

