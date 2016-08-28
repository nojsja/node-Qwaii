module.exports = function(app){
    /*获取主页*/
    app.get('/',function(req,res){
        res.render('index',{title:'Q站:)可爱的小站'});
    });

    //处理事务
    app.post('/',function(req,res){

    });

};
