/**
 * Created by yangw on 2016/9/4.
 */
var dbAction = require('./db.js');

function MongoSchedule() {

    var popular = [];

    dbAction.dbInit(function (err, db) {
        if(err){
            console.error("数据库定时器发生错误!数据库的定时更新功能可能没法正常运行...");
        }else {
            db.collection('QARTICLE', function (err, collection) {
               if(err){
                   console.error("数据库定时器发生错误!数据库的定时更新功能可能没法正常运行...");
                   return dbAction.dbLogout(db);
               }else {
                   collection.find({},{
                       sort : {readNumber : -1},
                       limit : 15
                   }, function (err, cursor) {
                       if(err){
                           cursor.close();
                           console.error("数据库定时器发生错误!数据库的定时更新功能可能没法正常运行...");
                           return dbAction.dbLogout(db);
                       }else {
                           cursor.each(function (err, item) {
                               if(err){
                                   cursor.close();
                                   console.error("数据库定时器发生错误!数据库的定时更新功能可能没法正常运行...");
                                   return dbAction.dbLogout(db);
                               }else {
                                   if(!item){
                                       cursor.close();
                                       //更新popular表
                                       updatePopular(db);
                                       return;
                                   }else {
                                       popular.push({
                                           title : item.title,
                                           author : item.author,
                                           type : item.type,
                                           date : item.date
                                       });
                                   }
                               }
                           });
                       }
                   });
               }
            });
        }
    });

    /* 更新popular表 */
    function updatePopular(db){
        db.collection('QPOPULAR', function (err, collection) {
            if(err){
                console.log('更新popular表出错,数据库定时更新功能无法正常执行!');
                dbAction.dbLogout(db);
            }else {
                collection.remove({}, function (err, results) {
                    if(err){
                        console.log('更新popular表出错,数据库定时更新功能无法正常执行!');
                        return dbAction.dbLogout(db);
                    }else {
                        for(var i = 0; popular[i]; i++){
                            collection.insert(popular[i], function (err, results) {
                                if(err){
                                    console.log('更新popular表出错,数据库定时更新功能无法正常执行!');
                                    return dbAction.dbLogout(db);
                                }
                            });
                        }
                    }
                });
            }
        });
    }
}

module.exports = MongoSchedule;