/**
 * Created by yangw on 2016/8/19.
 */
//限定作用域
$(function () {

    /*初始化编辑器*/
    pageAction.ueditorInit();
    //预览动作绑定
    $('#musicSelect').click(function () {
        $('.contentPreview').slideDown();
        pageAction.contentPreview("music");
    });
    $('#videoSelect').click(function () {
        $('.contentPreview').slideDown();
        pageAction.contentPreview("video");
    });
    $('#pictureSelect').click(function () {
        $('.contentPreview').slideDown();
        pageAction.contentPreview("picture");
    });

    //标签选定检测
    $('.tag').click(function () {
        pageAction.tagCheck();
    });
    //发表文章
    $('#sendArticle').click(function () {
        pageAction.postCheck();
    });
    //颜色变化
    $('.type > div').click(function () {
        pageAction.article.type = $(this).text();
        $('.type > div').css({"background-color":"rgba(0,0,0,0)"});
        $(this).css({"background-color":"#b5dccc"});
    });
    //初始化
    $('.type > div:eq(1)').css({"background-color":"#b5dccc"});

    //判断文章是转载的还是原创的
    pageAction.article.from = ($('#bilibiliAV').length > 0) ? "bilibili" : "Qwaii";
    //刷新事件绑定
    /*window.addEventListener("beforeunload", function(event) {
        event.returnValue = "警告";
    });*/
});

//页面动作
var pageAction = {
    //两个编辑器
    ueAbstract:null,
    ueContent:null,
    /*文章属性*/
    article:{
        title:null,
        type:"贴文",
        tags:[{tag:null}],
        abstract:null,
        content:null,
        from:"Qwaii",
        source:null
    },
    //原创文章是origin,转载B站的话是bilibili
};

//模态弹窗
pageAction.modalWindow = function (text) {
    $('.modal-body').text(text);
    $('#modalWindow').modal("show",{
        backdrop:true,
        keyboard:true
    });
};

//初始化编辑器
pageAction.ueditorInit = function () {
    /*摘要编辑器*/
    this.ueAbstract = UE.getEditor('editorAbstract',{
        toolbars: [[
            "fullscreen","source","undo","redo","insertunorderedlist",
            "insertorderedlist","link","unlink","help","emotion","pagebreak","date","bold","italic",
            "fontborder","strikethrough","underline","forecolor",
            "justifyleft","justifycenter","justifyright","justifyjustify",
            "paragraph","rowspacingbottom","rowspacingtop","lineheight"]],
        autoHeightEnabled: true,
        autoFloatEnabled: true
    });

    /*正文编辑器*/
    this.ueContent = UE.getEditor('editorContent',{
        autoHeightEnabled: true,
        autoFloatEnabled: true
    });
};

//预览个人数据
pageAction.contentPreview = function (type) {
    $.post('/preview/'+type, function (data) {
        var jsonData = JSON.parse(data);
        if(jsonData.err){
            return pageAction.modalWindow(jsonData.statusText);
        }
        if(type == "music"){
            musicPreview(jsonData.data);
        }else if(type == "video"){
            videoPreview(jsonData.data);
        }else if(type == "picture"){
            picturePreview(jsonData.data);
        }
    },
    "JSON");

    //照片预览
    function picturePreview(pictures){
        var $contentPreview = $('.contentPreview');
        $contentPreview.children().remove();
        $.each(pictures, function (index,item) {
            var $picturePreviewDiv = $('<div></div>');
            $picturePreviewDiv.prop('class','picturePreviewDiv');
            var $img = $('<img>');
            $img.prop({
                'src':item.source,
                'alt':item.title,
                'class':'picturePreview'
            });
            $img.isClicked = false;
            $img.click(function () {
                this.isClicked = !this.isClicked;
                if(this.isClicked){
                    $picturePreviewDiv.css({
                        "background-color": 'rgb(157,94,202)'
                    });
                    $(this).css({
                        'opacity':'0.5'
                    });
                    //给富文本编辑器追加内容
                    pageAction.ueContent.setContent($('<p></p>')
                        .append($('<img>')
                            .prop({
                                'src':item.source,
                                'alt':item.title,
                                'class':'picturePreview'})
                        ).html(), true);
                }else {
                    $picturePreviewDiv.css({
                        "background-color": ''
                    });
                    $(this).css({
                        'opacity':'1'
                    });
                }
            });
            $picturePreviewDiv.append($img);
            $contentPreview.append($picturePreviewDiv);
        });
    }
    //视频预览
    function videoPreview(videos){
        var $contentPreview = $('.contentPreview');
        $contentPreview.children().remove();
        $.each(videos, function (index,video) {
            var $videoPreviewDiv = $('<div></div>');
            $videoPreviewDiv.prop('class','videoPreviewDiv');
            var $p = $('<p></p>');
            $p.text(++index + ". " + video.title + " - " + video.date + " ")
                .append($('<span class="glyphicon glyphicon-film" style="color: red"></span>'))
                .prop({'class':'videoPreview'})

            $p.isClicked = false;
            $p.click(function () {
                this.isClicked = !this.isClicked;
                if(this.isClicked){
                    $(this).css({
                        "background-color": 'rgba(57, 89, 128, 0.5)'
                    });
                    //给富文本编辑器追加内容
                    var $video = $('<video>');
                    var $videoP = $('<p></p>');
                    $video.prop({
                       'src':video.source,
                        'controls':'controls'
                    }).css({
                        display: "block",
                        width:"100%",
                        height: "450px"
                    });
                    $videoP.append($video);
                    pageAction.ueContent.setContent($videoP.html(), true);
                }else {
                    $(this).css({
                        "background-color": ''
                    });
                    $(this).css({
                        'opacity':'1'
                    });
                }
            });
            $videoPreviewDiv.append($p);
            $contentPreview.append($videoPreviewDiv);
        });
    }
    //音乐预览
    function musicPreview(musics){
        var $contentPreview = $('.contentPreview');
        $contentPreview.children().remove();
        $.each(musics, function (index,music) {
            
        });
    }
};

//文章标签选定检测
pageAction.tagCheck = function () {
    var tags = [];
    $.each($('.tag'), function (i,obj) {
        if($(obj).prop("checked")){
            tags.push({tag:obj.value});
        }
    });
    if(tags.length > 4){
        tags.pop();
        pageAction.article.tags = tags;
        pageAction.modalWindow("文章标签最多选4个额!");
    }else if(tags.length < 1){
        pageAction.article.tags = tags;
        pageAction.modalWindow("给你的文章贴上标签吧!");
    }else {
        pageAction.article.tags = tags;
    }
};

//文章编辑检测
pageAction.postCheck = function(){

    if(!$('#bilibiliAV').val() && ($('#bilibiliAV').length > 0)){
        headerAction.modalWindow("填写bilibili AV号才能成功转载额!");
        return;
    }
    if(!$('#articleTitle').val()){
        headerAction.modalWindow("至少要填写文章标题吧!");
        return;
    }
    if(pageAction.article.tags.length < 1){
        headerAction.modalWindow("给你的文章贴上标签吧!");
        return;
    }
    if(!pageAction.ueAbstract.hasContents()){
        headerAction.modalWindow("贴文摘要是必须要写的!");
        return;
    }
    if(!pageAction.ueContent.hasContents()){
        headerAction.modalWindow("正文怎么能不写呢!");
        return;
    }
    with(pageAction){
        article.title = "[" + article.type + "]" + $('#articleTitle').val();
        article.abstract = ueAbstract.getPlainTxt();
        article.content = ueContent.getContent();
        article.source = $('#bilibiliAV').val();
        //发表文章
        sendPost();
    }
};

//发表文章
pageAction.sendPost = function () {
    $.post('/post',{
        //发送json对象
       jsonArticle: JSON.stringify(pageAction.article)
    }, function (JSONdata) {
        JSONdata.status ? pageAction.modalWindow(JSONdata.statusText): pageAction.modalWindow("出错啦!code: " + JSONdata.statusText);
    },
    "JSON");
};