/**
 * Created by yangw on 2016/8/23.
 */
var MongoClient = require('./db.js');
var settings = require('../settings.js');

function Articles(article){
    //文章属性
    this.title = article.title;
    this.author = article.author;
    this.abstract = article.abstract;
    this.tags = article.tags;
    this.type = article.type;
    this.content = article.content;
    this.date = new Date();
}

//数据库对象
var Mongodb = {};

Articles.prototype.save = function (callback) {
    //要存入的文章对象
    var article = {
        title:this.title,
        author:this.author,
        type : this.type,
        date : this.date,
        tags: this.tags,
        abstract: this.abstract,
        content : this.content,
        readNumber: 0,
        commentNumber:0
    };

    //数据库初始化
    if(!Mongodb.client){
        MongoClient.open(function (err,client) {
            if(err){
                console.error("Connection Failed Via Client Object!");
                //返回查询状态exit:是否存在,error:是否发生数据库错误
                return callback(err,"数据库发生错误!");
            }else {
                Mongodb.client = client;
                insertArticle();
            }
        });
    }else {
        insertArticle();
    }

    //插入贴文数据
    function insertArticle() {
        var db = Mongodb.client.db("Qwaii");
        if(db){
            console.log("insert action.");
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
                    db.collection("QARTICLE", function (err,collection) {
                        if (err){
                            dbLogout(db,Mongodb.client);
                            callback(err,"Sorry,发生了数据库内部错误!");
                        }else {
                            //插入用户数据
                            collection.insert(article,function(err,results){
                                if(err){
                                    dbLogout(db,Mongodb.client);
                                    callback(err,"Sorry,发生了数据库内部错误!");
                                }else {
                                    //注销用户连接
                                    dbLogout(db,Mongodb.client);
                                    callback(null,"贴文发表成功!");
                                }
                            });
                        }
                    });
                }
            });
        }
    }

};

//查找
Articles.findSome = function (condition,callback) {
    //数据库初始化
    if(!Mongodb.client){
        MongoClient.open(function (err,client) {
            if(err){
                console.error("Connection Failed Via Client Object!");
                //返回查询状态exit:是否存在,error:是否发生数据库错误
                return callback(err,null);
            }else {
                Mongodb.client = client;
                findArticle();
            }
        });
    }else {
        findArticle();
    }

    //查找文章
    function findArticle() {
        var db = Mongodb.client.db("Qwaii");
        if(db){
            console.log('find Article.');
            db.authenticate(settings.user,settings.password,function(err,results){
                if(err){
                    console.log('Authentication Failed.');
                    Mongodb.client.close();
                    delete  Mongodb.client;
                    console.log('Connection closed.');
                    return callback(err,null);
                }else {
                    console.log('Authentication success.')
                    db.collection('QARTICLE', function (err,collection) {
                        if(err){
                            dbLogout(db,Mongodb.client);
                            return callback(err,null);
                        }else {
                            /*返回的文章列表json数据*/
                            var articleData = {articles:[]};
                            //查询条件
                            var findCondition = {};
                            if(condition.type != "All"){
                                findCondition.type = condition.type;
                            }
                            collection.find(findCondition, function (err,cursor) {
                                if(err){
                                    return callback(err,null);
                                }else {
                                    //遍历查询到的文档
                                    cursor.count(function (err,count) {
                                        console.log("总条数: " + count);
                                    });
                                    cursor.each(function (err, item) {
                                        if(err){
                                            dbLogout(db,Mongodb.client);
                                            return callback(err,"抱歉,服务器发生内部错误!");
                                        }else {
                                            if(item && condition.number != 0){
                                                articleData.articles.push(item);
                                                condition.number --;
                                            }else {
                                                cursor.close();
                                                dbLogout(db, Mongodb.client);
                                                return callback(null,articleData);
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }else {callback(true, null);}
    };
};



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

module.exports = Articles;