/**
 * Created by yangw on 2016/8/23.
 */
var dbAction = require("./db");

//模块构造函数
function Users(user){
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
}

/* 数据库对象 */
var Mongodb = {};

/* 注册新用户 */
Users.prototype.save = function (callback) {
    //要存入数据库的用户文档
    var user = {
        name : this.name,
        email : this.email,
        password : this.password
    };

    //数据库初始化
    dbAction.dbInit(function (err, db) {
       if(err){
           return callback(err,"抱歉,数据库发生错误!");
       }else {
           Users.findSameUser(db, {
               '$or' : [
                   {name : user.name},
                   {email : user.email}

               ]}, function (nameStatus) {
               if (nameStatus.error){
                   dbAction.dbLogout(db);
                   return callback(true, "数据库发生了内部错误!");
               }else {
                   if(nameStatus.exit == true){
                       dbAction.dbLogout(db);
                       return callback(null, "抱歉,你已经注册过了!");
                   }else {
                       console.log("start insert.");
                       //插入用户注册数据
                       insertUser(db);
                   }
               }
           });
       }
    });

    //插入用户数据函数
    function insertUser(db){
        console.log("start insert.");
        //读取数据库
        db.collection("QUSER", function (err, collection) {
            if (err){
                dbAction.dbLogout(db);
                callback(err, "Sorry,发生了数据库内部错误!");
            }else {
                console.log("a");
                //插入用户数据
                collection.insert(user, function(err, results){
                    if(err){
                        console.log(err);
                        dbAction.dbLogout(db);
                        callback(err, "Sorry,发生了数据库内部错误!");
                    }else {
                        console.log(4);
                        //注销数据库连接
                        dbAction.dbLogout(db);
                        console.log(5);
                        callback(null, "恭喜你,已经成为Q站的一员了!");
                    }
                });
            }
        });
    }
};


/* 查找相同的用户 */
Users.findSameUser = function (db, userInfo, callback) {
    db.collection("QUSER", function (err, collection) {
        if (err){
            dbAction.dbLogout(db);
            console.log("Sorry,发生了数据库内部错误!");
            return callback({
                exit : null,
                error : true
            });
        }else {
            collection.find(userInfo, function (err, cursor) {
                cursor.count(function (err, count) {
                    if(err){
                        if(!cursor.isClosed()){
                            cursor.close();
                        }
                        dbAction.dbLogout(db);
                        console.error("Sorry,发生了数据库内部错误!");
                        return callback({
                            exit : null,
                            error : true
                        });
                    }else {
                        if(!cursor.isClosed()){
                            cursor.close();
                        }
                        db.logout(function (err, result) {
                            if(err){
                                console.log("db close error.");
                            }
                        });
                        console.log(count);
                        if(count > 0){
                            return callback({
                                exit : true,
                                error : false
                            });
                        }else {
                            return callback({
                                exit : false,
                                error : false
                            });
                        }
                    }
                });
            })
        }
    });
};

/* 用户登录 */
Users.login = function (userInfo, callback) {
    //数据库初始化
    dbAction.dbInit(function (err, db) {
        if(err){
            return callback(err, "抱歉,数据库发生了内部错误!");
        }else{
            Users.loginCheck(db, userInfo, callback);
        }
    });
};

/* 检查账户和密码是否匹配 */
Users.loginCheck = function (db, userInfo, callback) {
    db.collection("QUSER", function (err, collection) {
        if (err){
            dbAction.dbLogout(db);
            console.log("Sorry,发生了数据库内部错误!");
            return callback(err, "抱歉,数据库发生了错误!");
        }else {
            collection.find(userInfo, function (err, cursor) {
                cursor.count(function (err, count) {
                    if(err){
                        if(!cursor.isClosed()){
                            cursor.close();
                        }
                        dbAction.dbLogout(db);
                        console.error("Sorry,发生了数据库内部错误!");
                        return callback(err, "抱歉,数据库发生了错误!");
                    }else {
                        if(count > 0) {
                            var userName = " 游客 ";
                            cursor.nextObject(function (err, item) {
                                if(err){
                                    console.error(err);
                                }else {
                                    console.log("name:" + item.name);
                                    userName = item.name;
                                }
                                if(!cursor.isClosed()){
                                    cursor.close();
                                }
                                dbAction.dbLogout(db);
                                console.log(count);
                                //登录成功
                                return callback(null,{
                                    userName : userName,
                                    url : "/"
                                });
                            });
                        }else {
                            return callback(true, "邮箱或是密码填写错误!");
                        }

                    }
                });
            });
        }
    });
};

module.exports = Users;