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
    dbAction.dbInit(function (err,db) {
        if(err){
            console.log("读取文章错误!");
            return callback(err,null);
        }else {
            db.collection("QARTICLE", function (err,collection) {
                if(err){
                    dbAction.dbLogout(db);
                    console.log("读取文章错误!");
                    return callback(err,null);
                }else {
                    collection.find(condition, function (err,cursor) {
                       if(err){
                           dbAction.dbLogout(db);
                           console.log("读取文章错误!");
                           return callback(err,null);
                       }else {
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

//查找一篇文章的所有评论
Articles.findComments = function (condition,callback) {
    //数据库初始化
    dbAction.dbInit(function (err,db) {
        if(err){
            console.log("读取评论错误!");
            return callback(err,null);
        }else {
            db.collection("QCOMMENTS", function (err,collection) {
                if(err){
                    dbAction.dbLogout(db);
                    console.log("读取评论错误!");
                    return callback(err,null);
                }else {
                    collection.find(condition, function (err,cursor) {
                        if(err){
                            dbAction.dbLogout(db);
                            console.log("读取评论错误!");
                            return callback(err,null);
                        }else {
                            cursor.count(function (err,count) {
                                if(err){
                                    console.log(err);
                                }
                                console.log("评论数量: " + count);
                            });
                            //评论数据
                            var commentsData = {comments:[]};
                            cursor.each(function (err,item) {
                                if(err){
                                    cursor.close();
                                    dbAction.dbLogout(db);
                                    return callback(err,null);
                                }
                                if(item){
                                    commentsData.comments.push({
                                        commentator: item.commentator,
                                        content: item.content,
                                        date: item.date
                                    });
                                }else {
                                    cursor.close();
                                    dbAction.dbLogout(db);
                                    callback(null, commentsData);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};

//给一篇文章插入评论
Articles.saveComment = function (conditon,callback) {
    //数据库初始化
    dbAction.dbInit(function insertComment(err,db) {
        if(err){
            return callback(err,"Sorry,数据库发生了内部错误!");
        }else {
            console.log("insert comment action.");
            //读取数据库
            db.collection("QCOMMENTS", function (err,collection) {
                if (err){
                    dbAction.dbLogout(db);
                    callback(err,"Sorry,发生了数据库内部错误!");
                }else {
                    //插入用户数据
                    collection.insert(conditon,function(err,results){
                        if(err){
                            dbAction.dbLogout(db);
                            callback(err,"Sorry,发生了数据库内部错误!");
                        }else {
                            //注销用户连接
                            dbAction.dbLogout(db);
                            callback(null,null);
                        }
                    });
                }
            });
        }
    });
};

//增加阅读量
Articles.updateRead = function (condition,callback) {
    //数据库初始化
    dbAction.dbInit(function updateRead(err,db) {
        if(err){
            return callback(err,"Sorry,数据库发生了内部错误!");
        }else {
            //读取数据库
            db.collection("QARTICLE", function (err,collection) {
                if (err){
                    dbAction.dbLogout(db);
                    callback(err,"Sorry,发生了数据库内部错误!");
                }else {
                    //更新数据
                    collection.update({
                        title:condition.title,
                        author:condition.author,
                        $isolated:1
                    },{
                        $inc:{readNumber:1}
                    },{
                        upsert:false,multi:true, w:1
                    }, function (err,results) {
                        if(err){
                            dbAction.dbLogout(db);
                            return callback(err,"Sorry, 数据库发生了内部错误!");
                        }else {
                            dbAction.dbLogout(db);
                            callback(null,null);
                        }
                    });
                }
            });
        }
    });
};

//更新评论数
Articles.updateComment = function (condition,callback) {
    dbAction.dbInit(function updateRead(err,db) {
        if(err){
            return callback(err,"Sorry,数据库发生了内部错误!");
        }else {
            //读取数据库
            db.collection("QARTICLE", function (err,collection) {
                if (err){
                    dbAction.dbLogout(db);
                    callback(err,"Sorry,发生了数据库内部错误!");
                }else {
                    //更新数据
                    collection.update({
                        title:condition.title,
                        author:condition.author,
                        $isolated:1
                    },{
                        $inc:{commentNumber:1}
                    },{
                        upsert:false,multi:true, w:1
                    }, function (err,results) {
                        if(err){
                            dbAction.dbLogout(db);
                            return callback(err,"Sorry, 数据库发生了内部错误!");
                        }else {
                            dbAction.dbLogout(db);
                            callback(null,null);
                        }
                    });
                }
            });
        }
    });
};

module.exports = Articles;