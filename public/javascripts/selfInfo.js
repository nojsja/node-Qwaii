/**
 * Created by yangw on 2016/9/18.
 */

/* RequireJs配置方法 */
define('selfInfo', ['jquery', 'croppic'], function () {

    return {
        selfInit: init,
        getBackgroundImg: function () {

        }
    }
});

/* 初始化方法 */
function init () {

    //创建图片裁剪插件
    //图片上传的地址信息

    var cropperOptions = {
        uploadUrl:'/selfInfo/headImg',
        uploadData: {
            "action": "imgInfo"
        },
        customUploadButtonId: 'uploadImg',
        onBeforeImgUpload: function(){ console.log('onBeforeImgUpload') },
        onAfterImgUpload: function(){ console.log('onAfterImgUpload') },
        onImgDrag: function(){ console.log('onImgDrag') },
        onImgZoom: function(){ console.log('onImgZoom') },
        onBeforeImgCrop: function(){ console.log('onBeforeImgCrop') },
        onAfterImgCrop:	function(){ console.log('onAfterImgCrop') },
        onReset: function(){ console.log('onReset') },
        onError: function(errormsg){ console.log('onError:' + errormsg) }

    }
    var cropperHeader = new Croppic('croppic', cropperOptions);

}