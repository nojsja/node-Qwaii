/**
 * Created by yangw on 2016/8/19.
 */
//限定作用域
$(function () {

    /*初始化编辑器*/
    pageAction.ueditorInit();
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
        content:null
    }
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
        //发表文章
        sendPost();
    }
};

//发表文章
pageAction.sendPost = function () {
    $.post('/post',{
        //发送json对象
       jsonArticle: JSON.stringify(pageAction.article),
    }, function (JSONdata) {
        JSONdata.status ? pageAction.modalWindow(JSONdata.statusText): pageAction.modalWindow("出错啦!code: " + JSONdata.statusText);
    },
    "JSON");
};