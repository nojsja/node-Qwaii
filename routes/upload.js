/**
 * Created by yangw on 2016/8/22.
 */

//表单处理
var Upload = require('../models/Upload.js');

module.exports = function (app) {
    //上传音乐页面
    app.get('/upload/music', function (req,res) {
        res.render('upload',{title:"音乐"});
    });
    //上传视频页面
    app.get('/upload/video', function (req,res) {
        res.render('upload',{title:"视频"});
    });
    //上传图片页面
    app.get('/upload/picture', function (req,res) {
        res.render('upload',{title:"图片"});
    });
    //上传资源
    app.post('/upload', function (req,res) {
        Upload(req,res);
    });
};
