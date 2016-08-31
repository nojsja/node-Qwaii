/**
 * Created by yangw on 2016/8/22.
 */

var Articles = require("../models/Articles.js");

module.exports = function (app) {
    //跳转到指定文章页面
    app.get('/article/:author/:title/:date',function(req,res){
        res.render('article',{
            Title:req.params.title,
            Author: req.params.author,
            Date: req.params.date,
            title: "文章详情"
        });

    });

    //渲染内容
    app.post('/article/:author/:title',function(req,res){

        console.log(req.body.action);
        if(req.body.action == "getContent"){
            getContent(req,res);
            return;
        }
        if(req.body.action == "getInfo"){
            getInfo(req,res);
            return;
        }
        if(req.body.action == "updateRead"){
            updateRead(req,res);
            return;
        }
    });

    //发布评论
    app.post('/article/makeComment', function (req,res) {
        console.log('make comment.');
        var comment = {
            content : req.body.content,
            date : new Date().toLocaleDateString(),
            commentator : req.session.userName,
            articleTitle: req.body.articleTitle,
            articleAuthor: req.body.articleAuthor
        };

        Articles.saveComment(comment, function (err,statusText) {
            if(err){
                res.json({
                    err: err,
                    statusText: statusText
                });
            }else {
                var condition = {
                    title: comment.articleTitle,
                    author: comment.articleAuthor
                }
                res.json({
                    err: null
                });
                Articles.updateComment(condition, function (err,statusText) {
                    if(err){
                        console.log("ERR: " + statusText);
                    }
                });

            }
        });
    });

    //更新阅读量
    function updateRead(req,res){
        console.log("update read.");
        var articleCondition = {
            title: req.params.title,
            author: req.params.author
        };
        Articles.updateRead(articleCondition, function (err,statusText) {
            if(err){
                console.log("updateRead ERR: " + statusText);
            }
        });
    }

    //得到文章内容
    function getContent(req,res){
        console.log('getcontent');
        //查询条件
        var articleCondition = {
            title: req.params.title,
            author: req.params.author
        };
        //执行查询
        Articles.findOne(articleCondition, function (err, articleData) {
            if(err){
                res.render('error',{
                    message: "抱歉,读取文章数据错误,请刷新重试...",
                    error: err
                });
            }else {
                if(!articleData){
                    res.json({
                        status: false,
                        article: null
                    });
                }else {
                    res.json({
                        status: true,
                        article: {
                            content: articleData.content,
                            up: articleData.up,
                            down: articleData.down
                        }
                    });
                }
            }
        });
    }

    //得到文章评论
    function getInfo(req,res){
        console.log('getInfo.');
        //查询条件
        var articleCondition = {
            articleTitle: req.params.title,
            articleAuthor: req.params.author
        };
        //执行查询
        Articles.findComments(articleCondition, function (err, commentsData) {
            if(err){
                res.render('error',{
                    message: "抱歉,读取评论数据错误,请刷新重试...",
                    error: err
                });
            }else {
                if(!commentsData){
                    res.json({
                        status: false,
                        article: null
                    });
                }else {
                    res.json({
                        status: true,
                        commentsData: JSON.stringify(commentsData)
                    });
                }
            }
        });
    }
};
