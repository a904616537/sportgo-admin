import Dropzone from 'vue2-dropzone'


export default {
	name : 'v-upload',
	data() {
		return {
			showRemoveLink : true,
			uploadMultiple : true,
			language       : {
				dictDefaultMessage           : '将文件拖拽到此处上传！',
				dictFallbackMessage          : '你到浏览器不支持拖拽上传！',
				dictFallbackText             : '请使用下面的形式上传您的文件',
				dictInvalidFileType          : '你到文件格式不正确',
				dictFileTooBig               : '这个文件大小为{{filesize}}, 最大{{maxFilesize}}',
				dictResponseError            : '{{statusCode}}: 服务器响应错误',
				dictCancelUpload             : '取消上传',
				dictCancelUploadConfirmation : '已取消',
				dictRemoveFile               : '移除',
				dictMaxFilesExceeded         : '超出最大上传数'
			}
		}
	},
	components : {
		Dropzone
	},
	props : {
		uri : {
			type    : String,
			default : 'http://localhost:8082/upload'
		},
		thumbnailWidth : {
			type    : Number,
			default : 200
		},
		thumbnailHeight : {
			type    : Number,
			default : 200
		},
		// 最大文件数
		maxNumberOfFiles: {
			type    : Number,
			default : 5
		},
		// 自动上传
		autoProcessQueue : {
			type    : Boolean,
			default : true
		},
		showSuccess : {
			type    : Function,
			default : function(file, result) {
			}
		},
		addfiles : {
			type    : Function,
			default : function(files) {
			}
		},
		successfiles : {
			type    : Function,
			default : function(files, response) {
			}
		},
		sendingfile : {
			type    : Function,
			default : function(files, xhr, formData) {
			}
		},
		errorfile : {
			type    : Function,
			default : function(file) {
			}
		}
	},
	methods : {
		removeAllFiles() {
			console.log('removeAllFiles')
            this.$refs.myVueDropzone.removeAllFiles()
        },
        addFile(file) {
        },
        setOption(optionname, value) {
			this.$refs.myVueDropzone.setOption(optionname, value)
		}
	}
}