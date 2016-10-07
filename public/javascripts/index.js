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
            //首页顶部图片加载
            pageAction.imgLazyload();
        },
        updateHot: function () {
            pageAction.updateHot.call($('#hotArticleSpan'));
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

    //热门内容获取和刷新
    //注意this的作用域会动态绑定, 绑定对象是调用者的执行环境
    $('#hotArticleSpan').click(pageAction.updateHot);
    $('#hotPictureSpan').click(pageAction.updateHot);
    $('#hotVideoSpan').click(pageAction.updateHot);

    //分页导航事件绑定
    pageAction.pageNavbarAction();

    //顶部和底部跳转
    $('#top').click(pageAction.goTop);
    $('#bottom').click(pageAction.goBottom);

    //页面滚动侦测
    $(window).scroll(pageAction.scrollCheck);
}

/* 页面对象 */
var pageAction = {

    article : {
        type : "All"
    },
    //检测是否是pc
    isPc: true,
    //检测页面滚动
    scrollOver: false,
    //检测上次的状态
    lastScrollOver: false
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

/* 检测是否是电脑 */
pageAction.isPc = (function() {

    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
})();

/* 首页图片延迟加载 */
pageAction.imgLazyload = function () {

    var imgSrc = "/images/pictures/Qwaii.png";
    if(!pageAction.isPc) {
        imgSrc = "/images/pictures/Qwaii2-mini.png";
    }
    function imgLoaded() {
        //设置背景图片
        $('.background-img').prop('src', imgSrc).fadeIn('fast');
        $('.icon').fadeIn('slow');
    }

    var img = new Image();
    img.src = imgSrc;
    //加载完成
    img.onload = function (){
        imgLoaded();
    };
};

/* 滚动侦测 */
pageAction.scrollCheck = function () {

    var $this = $(this);
    //可见高度
    var clientHeight = $this.height();
    //总高度,包括不可见高度
    var totalHeight = $(document).height();
    //可滚动高度,只有不可见高度
    var scrollHeight = $this.scrollTop();

    //文档总长度比较短
    if(clientHeight >= totalHeight/2){
        return;
    }

    if(clientHeight + scrollHeight >= totalHeight/2){
        pageAction.scrollOver = true;
        if(pageAction.lastScrollOver !== pageAction.scrollOver){
            $('.page-anchor').fadeIn();
        }
        pageAction.lastScrollOver = pageAction.scrollOver;
    }else {
        pageAction.scrollOver = false;
        if(pageAction.lastScrollOver !== pageAction.scrollOver){
            $('.page-anchor').fadeOut();
        }
        pageAction.lastScrollOver = pageAction.scrollOver;
    }
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
        //触发点击事件,更新热门文章
        /*$('#hotArticleSpan').click();*/
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
    $('.page-number').click(function() {
        if($(this).prop('class') == "active page-number"){
            return;
        }
        $('.page-number[class="active page-number"]').prop('class', 'page-number');
        $(this).prop('class', 'active page-number');
        pageStart = ($(this).children(0).text() - 1) * pageLimit;
        getList();
    });

    //点击翻页按钮
    $('#next').click(function() {
        $('.page-number[class="active page-number"]').prop('class', 'page-number');
        var $pageNumber = $('.page-number');
        $.each($pageNumber.children(0), function (index, item) {
            $(item).text( parseInt($(item).text()) + 10 );
        });
    });

    $('#last').click(function() {
        $('.page-number[class="active page-number"]').prop('class', 'page-number');
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

/* 页面底部和底部跳转 */
pageAction.goTop = function goTop() {
    $('html, body').animate({scrollTop: 0}, 'slow');
};

pageAction.goDiv = function goDiv(div) {
    var a = $("#" + div).offset().top;
    $("html, body").animate({scrollTop: a}, 'slow');
};

pageAction.goBottom = function goBottom() {
    window.scrollTo(0, document.documentElement.scrollHeight - document.documentElement.clientHeight);
};

