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
                        article: articleData.content
                    });
                }
            }
        });

    });
};
