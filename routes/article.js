/**
 * Created by yangw on 2016/8/22.
 */

var Articles = require("../models/Articles.js");

module.exports = function (app) {

    /* 跳转到指定文章页面 */
    app.get('/article/:author/:title/:date', function(req, res){

        res.render('article', {
            Title : req.params.title,
            Author : req.params.author,
            Date : req.params.date,
            title : "文章详情"
        });
    });

    app.get('/test', function(req, res) {
       res.render('test');
    });
    
    /* 渲染内容 */
    app.post('/article/:author/:title', function(req, res){

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
        }
    });

    /* 发布评论 */
    app.post('/article/makeComment', function(req, res) {

        console.log('make comment.' + req.session.userName);
        if(!req.session.userName){
            return res.json({
               err:true,
                statusText:"登录后才可以评论额!"
            });
        }
        var comment = {
            content : req.body.content,
            date : new Date().toLocaleDateString(),
            commentator : req.session.userName,
            articleTitle : req.body.articleTitle,
            articleAuthor : req.body.articleAuthor
        };

        Articles.saveComment(comment, function(err, statusText) {
            if(err){
                res.json({
                    err: err,
                    statusText: statusText
                });
            }else {
                var condition = {
                    title : comment.articleTitle,
                    author : comment.articleAuthor
                };
                res.json({
                    err: null
                });
                Articles.updateComment(condition, function(err, statusText) {
                    if(err){
                        console.log("ERR: " + statusText);
                    }
                });
            }
        });
    });

    /* 读取点赞和反对 */
    app.post('/article/readUpAndDown', function (req, res) {

        console.log('read up and down');
        var condition = {
            articleTitle : req.body.title,
            articleAuthor : req.body.author,
            userName : req.session.userName
        };
        Articles.readUpAndDown(condition, function (err, status) {
           if(err){
               return res.json({
                   err : err,
                   statusText : status
               });
           }else {
               return res.json({
                   up : status.up,
                   down : status.down,
                   isUp : status.isUp,
                   isDown : status.isDown
               });
           }
        });
    });

    /* 点赞或差评 */
    app.post('/article/upOrDown', function(req, res) {

        console.log('up or down');
        console.log(req.session.userName);
        if(!req.session.userName || req.session.userName == "游客"){
            return res.json({
                err : true,
                statusText : "游客不能投票!"
            });
        }
        var condition = {
            articleTitle : req.body.title,
            articleAuthor : req.body.author,
            action : req.body.action,
            commentator : req.session.userName
        };
        Articles.upOrDown(condition, function(err, status) {
            res.json({
                err : err,
                statusText : status
            });
        });
    });

    //更新阅读量
    function updateRead(req, res){

        console.log("update read.");
        var articleCondition = {
            title : req.params.title,
            author : req.params.author
        };
        Articles.updateRead(articleCondition, function(err, statusText) {
            if(err){
                console.log("updateRead ERR: " + statusText);
                return res.json({
                    err : err,
                    statusText : "抱歉,数据库发生错误!"
                });
            }
            return res.json({
                err : null,
                statusText : "ok"
            });
        });
    }

    //得到文章内容
    function getContent(req, res){

        console.log('getcontent');
        //查询条件
        var articleCondition = {
            title : req.params.title,
            author : req.params.author
        };
        //执行查询
        Articles.findOne(articleCondition, function(err, articleData) {
            if(err){
                res.render('error', {
                    message : "抱歉,读取文章数据错误,请刷新重试...",
                    error : err
                });
            }else {
                if(!articleData){
                    res.json({
                        status : false,
                        article : null
                    });
                }else {
                    res.json({
                        status : true,
                        article : {
                            content : articleData.content,
                            from : articleData.from,
                            source : articleData.source
                        }
                    });
                }
            }
        });
    }

    //得到文章评论
    function getInfo(req, res){

        console.log('getInfo.');
        //查询条件
        var articleCondition = {
            articleTitle : req.params.title,
            articleAuthor : req.params.author
        };
        //执行查询
        Articles.findComments(articleCondition, function(err, commentsData) {
            if(err){
                res.render('error', {
                    message : "抱歉,读取评论数据错误,请刷新重试...",
                    error : err
                });
            }else {
                if(!commentsData){
                    res.json({
                        status : false,
                        article : null
                    });
                }else {
                    res.json({
                        status : true,
                        commentsData : JSON.stringify(commentsData)
                    });
                }
            }
        });
    }
};
