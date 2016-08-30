/**
 * Created by yangw on 2016/8/18.
 */
$(function(){
    pageAction.getContent();
});

//页面动作对象
var pageAction = {};

//模态弹窗
pageAction.modalWindow = function (text) {
    $('.modal-body').text(text);
    $('#modalWindow').modal("show",{
        backdrop:true,
        keyboard:true
    });
};

//得到文章数据
pageAction.getContent = function () {
    var author = $('#articleAuthor').text();
    var title = $('#articleTitle').text();

    $.post('/article/' + author + "/" + title, function (JSONdata) {
        if(JSONdata.status){
            //渲染文章
            $('#articleContent').append($(JSONdata.article));
        }else {
            this.modalWindow("读取出错!");
        }
    });
};