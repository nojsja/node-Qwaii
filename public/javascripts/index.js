/**
 * Created by yangw on 2016/8/17.
 */
//限定作用域
$(function () {
    pageAction.readArticleList();
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
        number : 15
    }, function (JSONdata) {
        that.updatePage(JSONdata);
    },
    "JSON");

    /*//文章伪造数据
    var JSONdata = {
        status: true,
        articleData : {
            articles:[
                {
                    title: "标题",
                    author: "作者",
                    date: "时间",
                    abstract: "摘要",
                    tags: [
                        {tag: "御宅"},
                        {tag: "激萌"}
                    ],
                    readNumer: 0,
                    commentNumber: 0,
                },
                {
                    title: "标题2",
                    author: "作者2",
                    date: "时间2",
                    abstract: "摘要2",
                    tags: [
                        {tag: "御宅"},
                        {tag: "激萌"}
                    ],
                    readNumer: 0,
                    commentNumber: 0,
                }
            ]
        }
    };*/

};

//更新页面
pageAction.updatePage = function (JSONdata) {

    if(JSONdata.status){
        //读取成功,一次读取15条
        var Articles = JSON.parse(JSONdata.articleData);
        //文章父组件
        var $articleList = $('#articleList');
        $.each(Articles.articles, function (index, article) {
            //jQuery动态操作DOM
            var $container = $('<div class="container opacityAlmost" ></div>');
            var $row = $('<div class="row articleView">');

            //文章主要内容
            var $article = $('<div class="col-md-10"></div>');
            var $title = $('<div class="col-md-12 h3 articleTitle"></div>');
            $title.text(article.title).appendTo($article);
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

    }else {
        //发生错误
        this.modalWindow("服务器发生错误,请刷新重试!");
    }
};
