/**
 * Created by yangw on 2016/8/22.
 */
var path = require("path");
var Articles = require("../models/Articles.js");

module.exports = function (app) {
    /*发布贴文页*/
    app.get('/post', function (req,res) {
        //没有登录跳转到登录页面
        if(!req.session.userName){
            res.render('login',{title:"登录或注册"});
        }else {
            res.render('post',{title:'我要投稿'});
        }

    });

    //处理发表贴文逻辑
    app.post('/post', function (req,res) {

        var article = JSON.parse(req.body.jsonArticle);
        article.author = req.session.userName;
        article.date = new Date().toLocaleDateString();

        //数据存储
        var newArticle = new Articles(article);
        newArticle.save(function (err, responseText) {
            if(err){
                res.json({
                    status: false,
                    statusText: responseText
                });
            }else {
                res.json({
                    status: true,
                    statusText: responseText
                });
            }
        });
    });

};
