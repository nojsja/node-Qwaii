/**
 * Created by yangw on 2016/8/22.
 */
module.exports = function(app) {

    /*搜索页*/
    app.get('/search', function(req, res) {
        res.render('search', {title : '搜索'});
    });

    /* 处理事务 */
    app.post('/search', function(req, res) {

    });
};