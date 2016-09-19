/**
 * Created by yangw on 2016/8/22.
 */

/* 表单处理 */
var Upload = require('../models/Upload.js');

module.exports = function (app) {

    /* 获取页面 */
    app.get('/upload/:type', function (req, res) {
        if(!req.session.userName || req.session.userName == "游客"){
            return res.render('login', {title : "登录或注册"});
        }
        if(req.params.type == "music"){
            res.render('upload', {title : "音乐"});
        }else if(req.params.type == "video"){
            res.render('upload', {title : "视频"});
        }else if(req.params.type == "picture"){
            res.render('upload', {title : "图片"});
        }else {
            res.status(404);
            res.end('404 not found!');
        }
    });

    /* 上传资源 */
    app.post('/upload', function (req, res) {
        Upload(req,res);
    });

    /* 预览资源 */
    app.post('/preview/:type', function (req, res) {

        //预览条件
        var conditon = {
            author : req.session.userName,
            type : null
        };

       if(req.params.type){
           conditon.type = req.params.type;
       }else {
           res.status(404);
           return res.end('404 not found!');
       }
        
        Upload.preview(conditon, function (err, data) {
            if(err){
                return res.json({
                    err : err,
                    statusText : data
                });
            }
            //成功返回json数据
            res.json(JSON.stringify({
                err : null,
                data : data
            }));
        });
    });
};
