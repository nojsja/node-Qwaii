/**
 * Created by yangw on 2016/8/23.
 */
var dbAction = require('./db.js');
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

Articles.prototype.save = function (callback) {
    //要存入的文章对象
    var article = {
        title:this.title, author:this.author,
        type : this.type, date : this.date,
        tags: this.tags, abstract: this.abstract,
        content : this.content, readNumber: 0,
        commentNumber:0,up:0,down:0
    };

    //数据库初始化
    dbAction.dbInit(function insertArticle(err,db) {
        if(err){
            return callback(err,"Sorry,数据库发生了内部错误!");
        }else {
            console.log("insert action.");
            //读取数据库
            db.collection("QARTICLE", function (err,collection) {
                if (err){
                    dbAction.dbLogout(db);
                    callback(err,"Sorry,发生了数据库内部错误!");
                }else {
                    //插入用户数据
                    collection.insert(article,function(err,results){
                        if(err){
                            dbAction.dbLogout(db);
                            callback(err,"Sorry,发生了数据库内部错误!");
                        }else {
                            //注销用户连接
                            dbAction.dbLogout(db);
                            callback(null,"贴文发表成功!");
                        }
                    });
                }
            });
        }
    });
};

//查找
Articles.findSome = function (condition,callback) {
    //数据库初始化
    dbAction.dbInit(function findArticle(err,db) {
        if(err){
            return callback(err,null);
        }else {
            db.collection('QARTICLE', function (err,collection) {
                if(err){
                    dbAction.dbLogout(db);
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
                            dbAction.dbLogout(db);
                            return callback(err,null);
                        }else {
                            //遍历查询到的文档
                            cursor.count(function (err,count) {
                                console.log("总条数: " + count);
                            });
                            cursor.each(function (err, item) {
                                if(err){
                                    dbAction.dbLogout(db);
                                    return callback(err,"抱歉,服务器发生内部错误!");
                                }else {
                                    if(item && condition.number != 0){
                                        articleData.articles.push(item);
                                        condition.number --;
                                    }else {
                                        cursor.close();
                                        dbAction.dbLogout(db);
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
};

//查找一篇文章
Articles.findOne = function (condition,callback) {
    //数据库初始化
    console.log(0);
    dbAction.dbInit(function (err,db) {
        console.log(1);
        if(err){
            console.log("读取文章错误!");
            return callback(err,null);
        }else {
            console.log(2);
            db.collection("QARTICLE", function (err,collection) {
                if(err){
                    dbAction.dbLogout(db);
                    console.log("读取文章错误!");
                    return callback(err,null);
                }else {
                    console.log(3);
                    collection.find(condition, function (err,cursor) {
                       if(err){
                           dbAction.dbLogout(db);
                           console.log("读取文章错误!");
                           return callback(err,null);
                       }else {
                           console.log(4);
                           cursor.count(function (err,count) {
                               if(err){
                                   console.log(err);
                               }
                              console.log("文章数量: " + count);
                           });
                           cursor.nextObject(function (err,item) {
                              if(err){
                                  dbAction.dbLogout(db);
                                  return callback(err,null);
                              }else {
                                  console.log(5);
                                  dbAction.dbLogout(db);
                                  callback(null,item);
                              }
                           });
                       }
                    });
                }
            });
        }
    });
};

module.exports = Articles;