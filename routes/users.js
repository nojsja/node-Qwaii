//检查用户登录状态的路由
module.exports = function (app) {
    app.post('/user', function (req,res) {
        if(req.body.action == "getName"){
            res.json({
                userName:req.session.userName
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

};
