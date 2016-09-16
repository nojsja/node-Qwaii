/**
 * Created by yangw on 2016/8/22.
 */
/*引入数据模型*/
var Users = require("../models/Users.js");
var crypto = require("crypto");

module.exports = function (app) {

    /* 获取页面 */
    app.get('/login', function(req,res){
        res.render('login', {
            title : "登录或注册"
        });
    });

    /* 处理事务 */
    app.post('/login', function(req, res){

        console.log(req.body);
        if(req.body.action == "loadHeadImg"){
            loadHeadImg(req,res);
            return;
        }
        if(req.body.action == "login"){
            login(req,res);
            return;
        }
        if(req.body.action == "signup"){
            signup(req,res);
            return;
        }
    });

    /* 载入图片 */
    function loadHeadImg(req, res){

        var fs = require('fs'),
            path = require('path'),
            baseUrl = "/images/head/origin/";
        fs.readdir(path.join(__dirname, '../public/images/head/origin'), function(err, files) {
            if (err){
                console.log(err);
                res.type("text/plain");
                res.json({
                        baseUrl : baseUrl,
                        images : null
                    });
                return;
            }
            res.json({
                    baseUrl : baseUrl,
                    images : files,
                    status : "ok"
                });
        });
    }

    /* 处理登录逻辑 */
    function login(req, res){

        console.log("login!!");
        //md5散列值加密
        var md5 = crypto.createHash("md5");
        var password = md5.update(req.body.password).digest("hex");
        var user = {
            email : req.body.email,
            password : password
        }
        Users.login(user, function (err, status) {
            console.log("回调发生!!");
            if(err){
                res.json({
                    status : "fail",
                    statusText : status
                });
            }else {
                req.session.userName = status.userName;
                //登录成功后跳转页面
                res.json({
                    status : "ok",
                    url : status.url
                });
            }
        });
    }

    /* 处理注册逻辑 */
    function signup(req,res){

        console.log("signup!!");
        //md5散列值加密
        var md5 = crypto.createHash("md5");
        var password = md5.update(req.body.password).digest("hex");
        //获取请求数据
        var user = {
            name : req.body.name,
            password : password,
            email : req.body.email
        }
        var newUser = new Users(user);
        newUser.save(function(err, statusText) {
            console.log("回调发生!");
            if(err){
                res.json({
                    status : "fail",
                    statusText : statusText
                });
            }else {
                res.json({
                    status : "ok",
                    statusText : statusText
                });
            }
        });
    }
};