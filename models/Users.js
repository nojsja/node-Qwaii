/**
 * Created by yangw on 2016/8/23.
 */
var mongoClient = require("./db");
var settings = require("../settings.js");

//模块构造函数
function Users(user){
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
}

//数据库对象
var Mongodb = {};

//注册新用户
Users.prototype.save = function (callback) {
    //要存入数据库的用户文档
    var user = {
        name:this.name,
        email:this.email,
        password:this.password
    };

    //数据库初始化
    if(!Mongodb.client){
        mongoClient.open(function (err,client) {
            if(err){
                console.error("Connection Failed Via Client Object!");
                //返回查询状态exit:是否存在,error:是否发生数据库错误
                return callback({
                    exit:null,
                    error:true
                });
            }else {
                Mongodb.client = client;
                checkSameUser();
            }
        });
    }else {
        checkSameUser();
    }

    //查询用户信息是否冲突
    function checkSameUser(){
        Users.findSameUser({name:user.name}, function (nameStatus) {
            if (nameStatus.error){
                return callback(true,"数据库发生了内部错误!");
            }else {
                if(nameStatus.exit == true){
                    return callback(null,"抱歉,你的用户名已经被占用了!");
                }else {
                    Users.findSameUser({email:user.email},function(emailStatus){
                        if(emailStatus.error){
                            return callback(true,"数据库发生了内部错误!");
                        }else {
                            if(emailStatus.exit == true){
                                return callback(null,"抱歉,你的邮箱已经被占用了!");
                            }else {
                                console.log("start insert.");
                                //插入用户注册数据
                                insertUser();
                            }
                        }
                    });
                }
            }
        });
    }

    //插入用户数据函数
    function insertUser(){
                console.log("start insert.");
                var db = Mongodb.client.db("Qwaii");
                if(db){
                    console.log("Connected Via Client Object!");
                    //验证用户
                    db.authenticate(settings.user,settings.password, function (err,results) {
                        if(err){
                            console.log("Authentication failed...");
                            Mongodb.client.close();
                            delete Mongodb.client;
                            console.log("Connection closed...");
                            //发生错误返回出错信息
                            return callback(err,"Sorry,发生了数据库内部错误!");
                        }else {
                            console.log("Authenticated Via Client Object...");
                            //逻辑操作
                            //读取数据库
                            db.collection("QUSER", function (err,collection) {
                                if (err){
                                    dbLogout(db,Mongodb.client);
                                    callback(err,"Sorry,发生了数据库内部错误!");
                                }else {
                                    console.log("a");

                                    //插入用户数据
                                    collection.insert(user,function(err,results){
                                        if(err){
                                            console.log(3);
                                            dbLogout(db,Mongodb.client);
                                            callback(err,"Sorry,发生了数据库内部错误!");
                                        }else {
                                            console.log(4);
                                            //注销用户连接
                                            dbLogout(db,Mongodb.client);
                                            console.log(5);
                                            callback(null,"恭喜你,已经成为Q站的一员了!");
                                            console.log(6);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
    }
};


//查找相同的用户
Users.findSameUser = function (userInfo,callback) {

    var db = Mongodb.client.db("Qwaii");
    if(db){
        console.log("Connected Via Client Object!");
        //验证用户
        db.authenticate(settings.user,settings.password, function (err,results) {
            if(err){
                console.log("Authentication failed...");
                Mongodb.client.close();
                delete Mongodb.client;
                console.log("Connection closed...");
                //发生错误返回出错信息
                console.error("Sorry,发生了数据库内部错误!");
                return callback({
                    exit:null,
                    error:true
                });
            }else {
                console.log("Authenticated Via Client Object...");
                db.collection("QUSER", function (err,collection) {
                    if (err){
                        dbLogout(db,Mongodb.client);
                        console.log("Sorry,发生了数据库内部错误!");
                        return callback({
                            exit:null,
                            error:true
                        });
                    }else {

                        collection.find(userInfo,function (err,cursor) {
                            cursor.count(function (err,count) {
                                if(err){
                                    if(!cursor.isClosed()){
                                        cursor.close();
                                    }
                                    dbLogout(db,Mongodb.client);
                                    console.error("Sorry,发生了数据库内部错误!");
                                    return callback({
                                        exit:null,
                                        error:true
                                    });
                                }else {
                                    if(!cursor.isClosed()){
                                        cursor.close();
                                    }
                                    db.logout(function (err,result) {
                                        if(err){
                                            console.log("db close error.");
                                        }
                                    });
                                    console.log(count);
                                    if(count > 0){
                                        return callback({
                                            exit:true,
                                            error:false
                                        });
                                    }else {
                                        return callback({
                                            exit:false,
                                            error:false
                                        });
                                    }
                                }
                            });
                        })
                    }
                });
            }
        });
    }
}

//用户登录
Users.login = function (userInfo,callback) {
    //数据库初始化
    if(!Mongodb.client){
        mongoClient.open(function (err,client) {
            if(err){
                console.error("Connection Failed Via Client Object!");
                //返回查询状态exit:是否存在,error:是否发生数据库错误
                return callback(err,"抱歉,数据库发生错误!");
            }else {
                Mongodb.client = client;
                Users.loginCheck(userInfo,callback);
            }
        });
    }else {
        Users.loginCheck(userInfo,callback);
    }
};

//检查账户和密码是否匹配
Users.loginCheck = function (userInfo,callback) {
    var db = Mongodb.client.db("Qwaii");
    if(db){
        console.log("Connected Via Client Object!");
        //验证用户
        db.authenticate(settings.user,settings.password, function (err,results) {
            if(err){
                console.log("Authentication failed...");
                Mongodb.client.close();
                delete Mongodb.client;
                console.log("Connection closed...");
                //发生错误返回出错信息
                console.error("Sorry,发生了数据库内部错误!");
                return callback(err,"抱歉,数据库发生了错误!");
            }else {
                console.log("Authenticated Via Client Object...");
                db.collection("QUSER", function (err,collection) {
                    if (err){
                        dbLogout(db,Mongodb.client);
                        console.log("Sorry,发生了数据库内部错误!");
                        return callback(err,"抱歉,数据库发生了错误!");
                    }else {
                        collection.find(userInfo,function (err,cursor) {
                            cursor.count(function (err,count) {
                                if(err){
                                    if(!cursor.isClosed()){
                                        cursor.close();
                                    }
                                    dbLogout(db,Mongodb.client);
                                    console.error("Sorry,发生了数据库内部错误!");
                                    return callback(err,"抱歉,数据库发生了错误!");
                                }else {
                                    if(count > 0) {
                                        var userName = " 游客 ";
                                        cursor.nextObject(function (err,item) {
                                            if(err){
                                                console.error(err);
                                            }else {
                                                console.log("name:" + item.name);
                                                userName = item.name;
                                            }
                                            if(!cursor.isClosed()){
                                                cursor.close();
                                            }
                                            dbLogout(db,Mongodb.client);
                                            console.log(count);
                                            //登录成功
                                            return callback(null,{
                                                userName:userName,
                                                url:"/"
                                            });
                                        });
                                    }else {
                                        return callback(true,"用户名或是密码填写错误!");
                                    }

                                }
                            });
                        })
                    }
                });
            }
        });
    }
}

//注销数据库连接函数
var dbLogout = function (db,client) {
    //关闭连接操作
    db.logout(function (err,result) {
        if(err){
            client.close();
            delete Mongodb.client;
            console.log("err!Connection closed...");
            /*操作出错*/
            return;
        }
        console.log("Logged out Via Client Object...");
        client.close();
        delete Mongodb.client;
        console.log("Connection closed...");
    });
}

module.exports = Users;