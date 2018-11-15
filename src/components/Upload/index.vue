<template>
	<div id="fileinput">
		<dropzone
		id     = "myVueDropzone"
		ref    = "myVueDropzone"
		method = "post"
		:uploadMultiple    = "uploadMultiple"
		:url               = "uri"
		:thumbnailWidth    = 'thumbnailWidth'
		:thumbnailHeight   = 'thumbnailHeight'
		:maxNumberOfFiles  = 'maxNumberOfFiles'
		:autoProcessQueue  = 'autoProcessQueue'
		:language 		   = 'language'
		:showRemoveLink    = 'showRemoveLink'
		@vdropzone-success          = "showSuccess"
		@vdropzone-file-added       = "addFile"
		@vdropzone-files-added      = "addfiles"
		@vdropzone-success-multiple = "successfiles"
		@vdropzone-sending-multiple = "sendingfile"
		@vdropzone-error            = "errorfile">
		</dropzone>
		<!-- <button v-on:click="removeAllFiles">移除所有文件</button> -->
    </div>
</template>

<script>
	import vue from './vue'
    export default vue
</script>