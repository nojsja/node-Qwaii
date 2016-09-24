/**
 * Created by yangw on 2016/8/17.
 */

/* 定义RequireJs模块 */
define('index', ['jquery'], function() {

    return {
        indexInit : indexInit,
        readArticleList : function () {
            pageAction.readArticleList();
        },
        getBackgroundImg : function () {
            $('#backgroundImg').prop('class', 'background-img');
        }
    };
});

/* 初始化函数 */
function indexInit() {

    $('.page-number:eq(0)').prop('class', 'active page-number');
    //动画效果触发
    $('#iconPopover').popover();
    $('.nav-content').click(function () {
        pageAction.article.type = $(this).text() == "全部" ? "All" : $(this).text();
        $('.page-number[class="active page-number"]').prop('class', 'page-number');
        $('.page-number:eq(0)').prop('class', 'active page-number');

        $.post('/', {
                action : "readList",
                type : pageAction.article.type,
                number : 15
            }, function (JSONdata) {
                pageAction.updatePage(JSONdata);
            },
            "JSON");
    });
    $('.nav-content').click(function () {
        $('.nav-content').css({
            'box-shadow' : '',
            '-webkit-box-shadow' : '',
            '-moz-box-shadow' : ''
        });
        $(this).css({
            'box-shadow' : '0px 0px 8px grey',
            '-webkit-box-shadow' : '0px 0px 8px grey',
            '-moz-box-shadow' : '0px 0px 8px grey'
        });
    });

    //热门内容获取和刷新
    //注意this的作用域会动态绑定, 绑定对象是调用者的执行环境
    $('#hotArticleSpan').click(pageAction.updateHot);
    $('#hotPictureSpan').click(pageAction.updateHot);
    $('#hotVideoSpan').click(pageAction.updateHot);

    //分页导航事件绑定
    pageAction.pageNavbarAction();
}

/* 页面对象 */
var pageAction = {

    article : {
        type : "All"
    }
};

/* 模态弹窗 */
pageAction.modalWindow = function(text) {

    $('.modal-body').text(text);
    $('#modalWindow').modal("show", {
        backdrop : true,
        keyboard : true
    });
};

/* 请求文章数据 */
pageAction.readArticleList = function () {

    //保存this作用域
    var that = this;
    $.post('/', {
            action : "readList",
            type : "All",
            number : 10,
            start : 0
        }, function (JSONdata) {
            that.updatePage(JSONdata);
        }, "JSON"
    );

};

/* 更新热门内容 */
pageAction.updateHot = function() {

    var actionType = $(this).text();
    $.post('/updateHot', {
            actionType : actionType
        }, function (data) {
            var jsonData = JSON.parse(data);
            if(jsonData.err){
                pageAction.modalWindow(jsonData.statusText);
            }else {
                if(jsonData.hotList){
                    //清空缓存列表
                    if(actionType == "图片"){
                        $('#hotPicture').children().remove();
                    }else if(actionType == "视频"){
                        $('#hotVideo').children().remove();
                    }else if(actionType == "贴文"){
                        $('#hotArticle').children().remove();
                    }
                    $.each(jsonData.hotList, function (index, item) {
                        var $hotDiv = $('<div class="col-md-12"></div>');
                        var $hotP = $('<div class="popu-item"></div>');
                        var $hotContent = $('<a></a>');
                        var hrefArray = [];
                        hrefArray.push('/article/', item.author, '/', item.title, '/', item.date);
                        $hotContent.attr('openHref', hrefArray.join(''));
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
        }, "JSON"
    );
};

/* 更新页面 */
pageAction.updatePage = function(JSONdata) {

    if(JSONdata.status){
        //读取成功,一次读取15条
        var Articles = JSON.parse(JSONdata.articleData);
        if(Articles.articles.length === 0){
            return this.modalWindow("抱歉,没有相关数据!");
        }
        $('#articleList').children().remove();
        //文章父组件
        var $articleList = $('#articleList');
        $.each(Articles.articles, function (index, article) {
            var $row = $('<div>');
            //文章主要内容
            var $article = $('<div class="col-md-12 article-view"></div>');
            var $title = $('<div class="col-md-12 article-title"></div>');
            var $a = $('<a></a>');
            $a.text(article.title + " ");
            if(article.type == "视频"){
                $a.append($('<span class="glyphicon glyphicon-film"></span>'));
            }else if(article.type == "贴文"){
                $a.append($('<span class="glyphicon glyphicon-pencil"></span>'));
            }else if(article.type == "图片"){
                $a.append($('<span class="glyphicon glyphicon-picture"></span>'));
            }else if(article.type == "音乐"){
                $a.append($('<span class="glyphicon glyphicon-headphones"></span>'));
            }else {
                $a.append($('<span class="glyphicon glyphicon-list-alt"></span>'));
            }

            //过多的使用字符串拼接会损耗性能
            var hrefArray = [];
            hrefArray.push("/article/", article.author, "/", article.title, "/", article.date);
            $a.attr({
                'openHref': hrefArray.join('')
            });
            $a.click(function() {
                window.open($(this).attr('openHref'));
            });
            $title.append($a).appendTo($article);
            var $author = $('<div class="col-md-2 article-author"></div>');
            $author.text(article.author).appendTo($article);
            var $date = $('<div class="col-md-6 article-time"></div>');
            $date.text(article.date).appendTo($article);
            var $abstract = $('<div class="col-md-12 article-abstract spacing"></div>');
            $abstract.text(article.abstract).appendTo($article);

            //标签内容
            var $tags = $('<div class="col-md-12"></div>');
            $.each(article.tags, function(index, tag) {
                var $tag = $('<p class="col-md-2 tag"></p>');
                $tag.text(tag.tag).appendTo($tags);
            });
            $tags.appendTo($article);
            $article.appendTo($row);

            //阅读信息
            var $info = $('<div class="col-md-12 article-read"></div>');
            var $readNumber = $('<div class="read-number"></div>');
            $readNumber.text('阅读: ' + article.readNumber).appendTo($info);
            var $commentNumber = $('<div class="comment-number"></div>');
            $commentNumber.text('评论: ' + article.commentNumber).appendTo($info);
            $info.appendTo($row);

            $articleList.append($row);
        });
        //触发点击事件
        $('#hotArticleSpan').click();
    }else {
        this.modalWindow("服务器发生错误,请刷新重试!");
    }
};

/* 分页导航事件 */
pageAction.pageNavbarAction = function() {

    var pageStart = 0;
    var pageLimit = 10;
    var that = this;
    //点击首页按钮
    $('#first').click(function() {
        if($('.page-number:eq(0)').prop('class') == "active page-number"){
            return;
        }
        $('.page-number[class="active page-number"]').prop('class', 'page-number');
        $('.page-number:eq(0)').prop('class', 'active page-number');
        pageStart = 0;
        //读取文章列表
        getList();
    });
    //点击页数按钮
    $('.pageNumber').click(function() {
        if($(this).prop('class') == "active page-number"){
            return;
        }
        $('.pageNumber[class="active page-number"]').prop('class', 'page-Number');
        $(this).prop('class', 'active pageNumber');
        pageStart = ($(this).children(0).text() - 1) * pageLimit;
        getList();
    });

    //点击翻页按钮
    $('#next').click(function() {
        $('.pageNumber[class="active pageNumber"]').prop('class', 'pageNumber');
        var $pageNumber = $('.pageNumber');
        $.each($pageNumber.children(0), function (index, item) {
            $(item).text( parseInt($(item).text()) + 10 );
        });
    });

    $('#last').click(function() {
        $('.pageNumber[class="active page-number"]').prop('class', 'page-number');
        var $pageNumber = $('.page-number');
        $.each($pageNumber.children(0), function (index, item) {
            var $num = parseInt($(item).text());
            $(item).text( ($num-10) > 0 ? ($num-10) : $num );
        });
    });

    //读取文章列表
    function getList(){

        $.post('/', {
                action : "readList",
                type : pageAction.article.type,
                number : pageLimit,
                start: pageStart
            }, function(JSONdata) {
                that.updatePage(JSONdata);
            }, "JSON"
        );
    }
};

