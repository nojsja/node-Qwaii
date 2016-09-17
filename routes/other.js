/**
 * Created by yangw on 2016/9/17.
 */
module.exports = function (app) {

    /* 获取关于页面 */
    app.get('/other/about', function (req, res) {
        res.render('other', {
            title : "关于网站",
            content : "about"
        });
    });

    /* 获取联系页面 */
    app.get('/other/contact', function (req, res) {
        res.render('other', {
            title : "联系合作",
            content : "contact"
        });
    });

    /* 获取关注页面 */
    app.get('/other/follow', function (req, res) {
        res.render('other', {
           title : "关注我们",
            content : "follow"
        });
    });
};