/**
 * Created by yangw on 2016/9/18.
 */

/* RequireJs配置方法 */
define('selfInfo', ['jquery'], function () {

    return {
        getBackgroundImg: function () {

        }
    }
});

/* 页面变量 */
var selfAction = {};

/* 初始化方法 */
$(function () {
    selfAction.uploadInit();
    //绑定事件
    $('#video > h4').click(selfAction.getVideoList);
    $('#picture > h4').click(selfAction.getPictureList);
    $('#article > h4').click(selfAction.getArticleList);
    $('#music > h4').click(selfAction.getMusicList);

});


/* 初始化文件上传模块 */
selfAction.uploadInit = function () {

    var $jqXHR = $('#headUpload').fileupload({
        url : '/selfInfo/headImg?action=uploadHead',
        dataType : 'json',
        //autoUpload: false,
        //acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
        maxFileSize : 2000000000, // 5 MB
        // Enable image resizing, except for Android and Opera,
        // which actually support image resizing, but fail to
        // send Blob objects via XHR requests:
        disableImageResize : /Android(?!.*Chrome)|Opera/
            .test(window.navigator.userAgent),
        previewMaxWidth : 100,
        previewMaxHeight : 100,
        previewCrop : true
        //文件加载
    }).on('fileuploadfail', function (e, data) {
        selfAction.modalWindow("头像上传失败!");
    });
};

/* 得到个人的视频数据 */
selfAction.getVideoList = function () {

    $.post('/preview/video', function(data) {
        var jsonData = JSON.parse(data);
        if(jsonData.err){
            return selfAction.modalWindow(jsonData.statusText);
        }

        var $contentPreview = $('.video-content');
        $contentPreview.children().remove();
        if(!jsonData.data.length){
            return $contentPreview.append($('<p style="text-align: center"></p>').text('你还没有上传任何数据!'));
        }
        $.each(jsonData.data, function(index,video) {
            var $videoPreviewDiv = $('<div></div>');
            $videoPreviewDiv.prop('class','video-preview-div');
            var $p = $('<p></p>');
            $p.text(++index + ". " + video.title + " - " + video.date + " ")
                .append($('<span class="glyphicon glyphicon-film" style="color: red"></span>'))
                .prop({'class' : 'video-preview'});

            $p.isClicked = false;
            $p.click(function() {
                this.isClicked = !this.isClicked;
                if(this.isClicked){
                    $(this).css({"background-color" : 'rgba(57, 89, 128, 0.5)'});
                    //给富文本编辑器追加内容
                    var $video = $('<video>');
                    var $videoP = $('<p></p>');
                    $video.prop({
                        'src' : video.source,
                        'controls' : 'controls'
                    }).css({
                        display : "block",
                        width :"100%",
                        height : "450px"
                    });
                    $videoP.append($video);
                }else {
                    $(this).css({"background-color" : ''});
                    $(this).css({'opacity' : '1'});
                }
            });
            $videoPreviewDiv.append($p);
            $contentPreview.append($videoPreviewDiv);
        });
    }, "JSON");
};

/* 得到个人图片数据 */
selfAction.getPictureList = function () {

    $.post('/preview/picture', function(data) {
        var jsonData = JSON.parse(data);
        if(jsonData.err){
            return selfAction.modalWindow(jsonData.statusText);
        }
        var $contentPreview = $('.picture-content');
        $contentPreview.children().remove();
        if(!jsonData.data.length){
            return $contentPreview.append($('<p style="text-align: center"></p>').text('你还没有上传任何数据!'));
        }
        $.each(jsonData.data, function (index, item) {
            var $picturePreviewDiv = $('<div></div>');
            $picturePreviewDiv.prop('class', 'picture-preview-div');
            var $img = $('<img>');
            $img.prop({
                'src': item.source,
                'alt': item.title,
                'class' : 'picture-preview'
            });
            $img.isClicked = false;
            $img.click(function() {
                this.isClicked = !this.isClicked;
                if(this.isClicked){
                    $picturePreviewDiv.css({
                        "background-color" : 'rgb(157,94,202)'
                    });
                    $(this).css({
                        'opacity' : '0.5'
                    });
                }else {
                    $picturePreviewDiv.css({"background-color" : ''});
                    $(this).css({'opacity' : '1'});
                }
            });
            $picturePreviewDiv.append($img);
            $contentPreview.append($picturePreviewDiv);
        });

    }, "JSON");
};

/* 得到个人贴文数据 */
selfAction.getArticleList = function() {

    $.post('/preview/article', function (data) {
       var jsonData = JSON.parse(data);
        if(jsonData.err){
            return selfAction.modalWindow(jsonData.statusText);
        }

        var $contentPreview = $('.article-content');
        $contentPreview.children().remove();
        if(!jsonData.data.length){
            return $contentPreview.append($('<p style="text-align: center"></p>').text('你还没有上传任何数据!'));
        }
        $.each(jsonData.data, function (index, article) {
            var $articlePreviewDiv = $('<div></div>');
            $articlePreviewDiv.prop('class', 'article-preview-div');
            var $p = $('<a></a>');
            $p.text(++index + ". " + article.title + " - " + article.date + " ")
                .append($('<span class="glyphicon glyphicon-pencil" style="color : red"></span>'))
                .prop({'class' : 'article-preview'});
            //加入超链接
            var hrefArray = [];
            hrefArray.push('/article/', article.author, '/', article.title, '/', article.date);
            $p.prop('openHref', hrefArray.join(''));
            $p.click(function() {
                window.open( $(this).attr('openHref') );
            });
            $articlePreviewDiv.append($p);
            $contentPreview.append($articlePreviewDiv);
        });
    }, "JSON");
};

/* 得到个人音乐数据 */
selfAction.getMusicList = function () {
    
    $.post('/preview/music', function(data) {
        var jsonData = JSON.parse(data);
        if(jsonData.err){
            return selfAction.modalWindow(jsonData.statusText);
        }

        var $contentPreview = $('.music-content');
        $contentPreview.children().remove();
        if(!jsonData.data.length){
            return $contentPreview.append($('<p style="text-align: center"></p>').text('你还没有上传任何数据!'));
        }
        $.each(jsonData.data, function (index, music) {
            var $musicPreviewDiv = $('<div></div>');
            $musicPreviewDiv.prop('class', 'music-preview-div');
            var $p = $('<p></p>');
            $p.text(++index + ". " + music.title + " - " + music.date + " ")
                .append($('<span class="glyphicon glyphicon-music" style="color : red"></span>'))
                .prop({'class' : 'music-preview'});

            $p.isClicked = false;
            $p.click(function() {
                this.isClicked = !this.isClicked;
                if(this.isClicked){
                    $(this).css({"background-color" : 'rgba(57, 89, 128, 0.5)'});
                    //给富文本编辑器追加内容
                    var $audio = $('<audio>');
                    var $audioP = $('<p></p>');
                    $audio.prop({
                        'src' : music.source,
                        'controls' : 'controls'
                    }).css({
                        width : "100%",
                        height : "auto"
                    });
                    $audioP.append($audio);
                }else {
                    $(this).css({"background-color" : ''});
                    $(this).css({'opacity' : '1'});
                }
            });
            $musicPreviewDiv.append($p);
            $contentPreview.append($musicPreviewDiv);
        });
    }, "JSON");
};

/* 模态弹窗 */
selfAction.modalWindow = function(text) {

    $('.modal-body').text(text);
    $('#modalWindow').modal("show", {
        backdrop : true,
        keyboard : true
    });
};



