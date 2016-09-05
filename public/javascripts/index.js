/**
 * Created by yangw on 2016/8/17.
 */
//限定作用域
$(function () {
    pageAction.readArticleList();
    $('.pageNumber:eq(0)').prop('class','active pageNumber');
    //动画效果触发
    $('#iconPopover').popover();
    $('.contentNav').click(function () {
        $.post('/',{
                action : "readList",
                type : $(this).text(),
                number : 15
            }, function (JSONdata) {
                pageAction.updatePage(JSONdata);
            },
            "JSON");
    });
    $('.contentNav').click(function () {
        $('.contentNav').css({'box-shadow':'','-webkit-box-shadow':'','-moz-box-shadow':''});
        $(this).css({'box-shadow':'0px 0px 8px grey','-webkit-box-shadow':'0px 0px 8px grey','-moz-box-shadow':'0px 0px 8px grey'});
    });

    //热门内容获取和刷新
    //注意this的作用域会动态绑定, 绑定对象是调用者的执行环境
    $('#hotArticleSpan').click(pageAction.updateHot);
    $('#hotPictureSpan').click(pageAction.updateHot);
    $('#hotVideoSpan').click(pageAction.updateHot);

    //分页导航事件绑定
    pageAction.pageNavbarAction();

});

//页面对象
var pageAction = {};

//模态弹窗
pageAction.modalWindow = function (text) {
    $('.modal-body').text(text);
    $('#modalWindow').modal("show",{
        backdrop:true,
        keyboard:true
    });
};

//请求文章数据
pageAction.readArticleList = function () {
    //保存this作用域
    var that = this;
    $.post('/',{
        action : "readList",
        type : "All",
        number : 10,
        start: 0
    }, function (JSONdata) {
        that.updatePage(JSONdata);
    },
    "JSON");

};

//更新热门内容
pageAction.updateHot = function () {
    var actionType = $(this).text();
    $.post('/updateHot',{
        actionType: actionType
    }, function (data) {
        var jsonData = JSON.parse(data);
        if(jsonData.err){
            pageAction.modalWindow(jsonData.statusText);
        }else {
            if(jsonData.hotList){
                /*清空缓存列表*/
                if(actionType == "图片"){
                    $('#hotPicture').children().remove();
                }else if(actionType == "视频"){
                    $('#hotVideo').children().remove();
                }else if(actionType == "贴文"){
                    $('#hotArticle').children().remove();
                }
                $.each(jsonData.hotList, function (index,item) {
                    var $hotDiv = $('<div class="col-md-12"></div>');
                    var $hotP = $('<div class="popuItem"></div>');

                    var $hotContent = $('<a></a>');
                    $hotContent.attr('openHref',"/article/"+item.author+"/"+item.title+"/"+item.date);
                    $hotContent.click(function () {
                       window.open($hotContent.attr('openHref'));
                    });
                    $hotContent.text(item.title);
                    $hotContent.appendTo($hotP);
                    $hotP.appendTo($hotDiv);

                    if(actionType == "图片"){
                        $('#hotPicture').append($hotDiv);
                    }else if(actionType == "视频"){
                        $('#hotVideo').append($hotDiv);
                    }else if(actionType == "贴文"){
                        $('#hotArticle').append($hotDiv);
                    }
                });
            }
        }
    },
    "JSON");
};

//更新页面
pageAction.updatePage = function (JSONdata) {

    if(JSONdata.status){
        //读取成功,一次读取15条

        var Articles = JSON.parse(JSONdata.articleData);
        if(Articles.articles.length == 0){
            return this.modalWindow("抱歉,没有相关数据!");
        }
        $('#articleList').children().remove();
        //文章父组件
        var $articleList = $('#articleList');
        $.each(Articles.articles, function (index, article) {
            //jQuery动态操作DOM
            var $container = $('<div class="container" ></div>');
            var $row = $('<div class="row articleView">');

            //文章主要内容
            var $article = $('<div class="col-md-10"></div>');
            var $title = $('<div class="col-md-12 h3 articleTitle"></div>');
            var $a = $('<a></a>');
            $a.text(article.title);
            $a.attr({
                'openHref':"/article/" + article.author + "/" + article.title + "/" + article.date
            });
            $a.click(function () {
                window.open($(this).attr('openHref'));
            });
            $title.append($a).appendTo($article);
            var $author = $('<div class="col-md-2 articleAuthor"></div>');
            $author.text(article.author).appendTo($article);
            var $date = $('<div class="col-md-6 articleTime"></div>');
            $date.text(article.date).appendTo($article);
            var $abstract = $('<div class="col-md-12 articleAbstract spacing"></div>');
            $abstract.text(article.abstract).appendTo($article);
            $article.appendTo($row);

            //标签内容
            var $tags = $('<div class="col-md-2"></div>');
            $.each(article.tags, function (index,tag) {
                var $tag = $('<p class="tag"></p>');
                $tag.text(tag.tag).appendTo($tags);
            });
            $tags.appendTo($row);

            //阅读信息
            var $info = $('<div class="col-md-12 articleRead"></div>');
            var $readNumber = $('<div class="col-md-2 col-md-offset-4"></div>');
            $readNumber.text('阅读: ' + article.readNumber).appendTo($info);
            var $commentNumber = $('<div class="col-md-2"></div>');
            $commentNumber.text('评论: ' + article.commentNumber).appendTo($info);
            $info.appendTo($row);

            $row.appendTo($container);
            $articleList.append($container);
        });
        //触发一次click事件
        $('#hotArticleSpan').click();
    }else {
        //发生错误
        this.modalWindow("服务器发生错误,请刷新重试!");
    }
};

//分页导航事件
pageAction.pageNavbarAction = function () {
    var pageStart = 0;
    var pageLimit = 10;
    var that = this;
    //点击首页按钮
    $('#first').click(function () {
        if($('.pageNumber:eq(0)').prop('class') == "active pageNumber"){
            return;
        }
        $('.pageNumber[class="active pageNumber"]').prop('class','pageNumber');
        $('.pageNumber:eq(0)').prop('class','active pageNumber');
        pageStart = 0;
        //读取文章列表
        getList();
    });
    //点击页数按钮
    $('.pageNumber').click(function () {
        if($(this).prop('class') == "active pageNumber"){
            return;
        };
        $('.pageNumber[class="active pageNumber"]').prop('class','pageNumber');
        $(this).prop('class','active pageNumber');
        pageStart = ($(this).children(0).text() - 1) * pageLimit;
        getList();
    });

    //点击翻页按钮
    $('#next').click(function () {
        $('.pageNumber[class="active pageNumber"]').prop('class','pageNumber');
        var $pageNumber = $('.pageNumber');
        $.each($pageNumber.children(0), function (index,item) {
           $(item).text( parseInt($(item).text()) + 10 );
        });
    });

    $('#last').click(function () {
        $('.pageNumber[class="active pageNumber"]').prop('class','pageNumber');
        var $pageNumber = $('.pageNumber');
        $.each($pageNumber.children(0), function (index,item) {
            var $num = parseInt($(item).text());
            $(item).text( ($num-10) > 0 ? ($num-10) : $num );
        });
    });

    //读取文章列表
    function getList(){
        $.post('/',{
                action : "readList",
                type : "All",
                number : pageLimit,
                start: pageStart
            }, function (JSONdata) {
                that.updatePage(JSONdata);
            },
            "JSON");
    }
};
