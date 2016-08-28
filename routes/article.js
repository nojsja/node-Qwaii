/**
 * Created by yangw on 2016/8/22.
 */
module.exports = function (app) {
    /*获取文章页*/
    app.get('/article', function (req,res) {
        res.render('article',{title:'贴文页'});
    });

//处理事务
    app.post('/article',function(req,res){

    });
};
