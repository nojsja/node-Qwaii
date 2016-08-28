/**
 * Created by yangw on 2016/8/22.
 */
module.exports = function (app) {
    //处理事务
    app.post('/Ueditor/ue' ,function (req,res) {
        /*ueditor发起穿图片请求*/
        if(req.query.action == 'uploadimage'){
            var foo = req.ueditor;
            var date = new Date();
            var imaName = req.ueditor.filename;
            var imgUrl = "/images/pictures/";
            res.ue_up(imgUrl);
        }else
        /*发起图片列表请求*/
        if(req.query.action == 'listimage'){
            var dir_url = '/images/pictures/';
            res.ue_list(dir_url);
        }
    });
};
