/**
 * Created by yangw on 2016/8/18.
 */
//定义RequireJs模块
define('article',['jquery'], function () {
    return {
        articleInit:articleInit,
        getContent: function () {
          pageAction.getContent();
        },
        updateReadNumber: function () {
          pageAction.updateReadNumber();
        },
        getBackgroundImg: function () {
            $('#backgroundImg').prop('class','backgroundImg');
        }
    }
});

//初始化
function articleInit(){
    pageAction.title = $('#articleTitle').text();
    pageAction.author = $('#articleAuthor').text();

    //赞同或反对
    $('#up').click(function () {
        /*保存作用域*/
        var that = this;
        pageAction.upOrDown(that);
    });
    $('#down').click(function () {
        var that = this;
        pageAction.upOrDown(that);
    });
    //插入评论
    $('#makeComment span').click(function(){
        pageAction.insertComment();
    });
    //滚动侦测动态加载
    $(window).scroll(scrollCheck);
    //3秒后进行检测,防止页面卡住的情况
    setTimeout(scrollCheck,3000);
    function scrollCheck() {
        //滚动的Y轴距离
        var scrollTop = $(this).scrollTop();
        //文档总长度
        var scrollHeight = $(document).height();
        //可视化窗口高度
        var windowHeight = $(this).height();
        if((scrollHeight == scrollTop + windowHeight) && (!pageAction.commentLoaded)){
            pageAction.commentLoaded = true;
            //更新点赞情况
            pageAction.getUpAndDown();
            //获取文章评论
            pageAction.getArticleInfo();
        }
    }
};

//页面动作对象
var pageAction = {
    title: null,
    author: null,
    commentLoaded:false
};

//模态弹窗
pageAction.modalWindow = function (text) {
    $('.modal-body').text(text);
    $('#modalWindow').modal("show",{
        backdrop:true,
        keyboard:true
    });
};

//赞同或反对
pageAction.upOrDown = function (object){
    var action;
    if(object == document.getElementById('up')){
        action = "up";
    }else {
        action = "down";
    }

    $.post('/article/upOrDown',{
            action: action,
            title: $('#articleTitle').text(),
            author: $('#articleAuthor').text()
        },
        function (status) {
            if(status.err){
                pageAction.modalWindow(status.statusText);
            }else {
                //读取一篇文章的赞同和反对数
                pageAction.getUpAndDown();
            }

        }, "JSON");
}

//得到一篇文章的赞同数和反对数
pageAction.getUpAndDown = function () {
    $.post('/article/readUpAndDown',{
            title: $('#articleTitle').text(),
            author: $('#articleAuthor').text()
        }, function (status) {
            if(status.err){
                pageAction.commentLoaded = false;
                pageAction.modalWindow(status.statusText);
            }else {
                //更新赞同数和反对数
                $('#up span').text(status.up);
                $('#down span').text(status.down);
                if(status.isUp && status.isUp != null){
                    $('#up .badge').css({
                       'background-color':"green"
                    });
                }else if(status.isDown && status.isDown != null){
                    alert(status.isDown);
                    $('#down .badge').css({
                        'background-color':"green"
                    });
                }
            }
        },
        "JSON");
};


//得到文章数据
pageAction.getContent = function () {
    var author = this.author;
    var title = this.title;

    $.post('/article/' + author + "/" + title,{action:"getContent"}, function (JSONdata) {
        if(JSONdata.status){
            //渲染文章
            $('#articleContent').append($(JSONdata.article.content));
            /*判断是否包含b站资源*/
            if(JSONdata.article.from == "bilibili"){
                var src = "http://www.bilibili.com/html/player.html?aid=" + JSONdata.article.source;
                $('#articleContent').append($('<iframe class="biliVideo" ' +
                    'frameborder="0" allowfullscreen="" ' +
                    'scrolling="no"></iframe>').prop('src',src));
            }
            $("img").lazyload({effect: "fadeIn"});
        }else {
            pageAction.commentLoaded = false;
            pageAction.modalWindow("读取出错!");
        }
    }, "JSON");
};

//得到一篇文章的评论
pageAction.getArticleInfo = function () {
    var author = this.author;
    var title = this.title;

    $.post('/article/' + author + "/" + title,{action:"getInfo"}, function (JSONdata) {
        if(JSONdata.status){
            //删除所有子节点
            $('.comments-wrapper').children('div[class!="comment-label"]').remove();
            var commentsData = JSON.parse(JSONdata.commentsData);
            $('#up > span').text(commentsData.up);
            $('#down > span').text(commentsData.down);
            $.each(commentsData.comments, function (index,comment) {
                var $comment = $('<div class="entry-comments"></div>');

                var $nameLabel = $('<label></label>');
                $nameLabel.text(comment.commentator + ":");
                $nameLabel.appendTo($comment);

                var $contentLabel = $('<label></label></br>');
                $contentLabel.text(comment.content);
                $contentLabel.appendTo($comment);

                var $dateLabel = $('<label></label>');
                $dateLabel.text(comment.date);
                $dateLabel.appendTo($comment);
                $comment.appendTo($('.comments-wrapper'));
            });
        }else {
            pageAction.modalWindow("读取评论出错!");
        }
    },"JSON");
};

//插入一条评论
pageAction.insertComment = function () {
    var content = $('#makeComment input').val();
    var title = this.title;
    var author = this.author;
    if(!content){
        return this.modalWindow("你还没有输入评论内容!");
    }
    $.post('/article/makeComment',{
        content: content,
        articleTitle: title,
        articleAuthor: author
    }, function (status) {
        if(status.err){
            pageAction.modalWindow(status.statusText);
        }else {
            pageAction.getArticleInfo();
        }
    },"JSON");
};

//更新阅读量
pageAction.updateReadNumber = function () {
    var title = this.title;
    var author = this.author;

    $.post('/article/' + author + "/" + title,{
        action: "updateRead"
    });
};