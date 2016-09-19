/* 表单处理 */
var Upload = require('../models/Upload.js');

/* 检查用户登录状态和个人信息查询的路由 */
module.exports = function (app) {

    /* 得到用户信息和注销 */
    app.post('/user', function (req, res) {
        if(req.body.action == "getName"){
            res.json({
                userName : req.session.userName
            });
            return;
        }

        if(req.body.action == "logout"){
            req.session.userName = null;
            res.json({
                logout:true
            });
            return;
        }
    });
    
    /* 得到个人信息界面 */
    app.get('/selfInfo', function (req, res) {
       res.render('selfInfo', {
           title : "个人信息"
       });
    });

    /* 个人信息页面逻辑处理 */
    app.post('/selfInfo/headImg', function (req, res) {
        console.log('headImg....');
        if(req.query.action == "uploadHead"){
            Upload(req, res, function (err, source) {
                if(err){
                    res.json(JSON.stringify({
                        "status" : "error",
                        "message" : "数据库发生内部错误!"
                    }));
                }
                console.log('callback to browser.');
                res.json(JSON.stringify({
                    "status" : "success",
                    "url" : source
                }));
            });
        }
    });
};
