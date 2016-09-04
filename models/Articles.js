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
        commentNumber:0
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
                                console.log("目标文章: " + count);
                            });
                            //评论数据
                            var commentsData = {comments:[]};
                            commentsData.up = 0;
                            commentsData.down = 0;
                            cursor.nextObject(function (err,item) {
                                if(err){
                                    cursor.close();
                                    dbAction.dbLogout(db);
                                    return callback(err,null);
                                }else {
                                    if(item){
                                        commentsData.comments = item.comments;
                                        commentsData.up = item.up.length;
                                        commentsData.down = item.down.length;
                                    }
                                    console.log('up length:' + commentsData.up);
                                    console.log('down length:' + commentsData.down);
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
Articles.saveComment = function (condition,callback) {
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
                    collection.find({
                        articleTitle: condition.articleTitle,
                        articleAuthor: condition.articleAuthor
                    }, function (err,cursor) {
                        if(err){
                            dbAction.dbLogout(db);
                            return callback(err, "Sorry,数据库发生内部错误!");
                        }else {
                            cursor.count(function (err,count) {
                               if(err){
                                   cursor.close();
                                   dbAction.dbLogout(db);
                                   return callback(err,"Sorry,数据库发生内部错误!");
                               }else {
                                   console.log(3);
                                   if(count == 0){
                                       console.log(1);
                                       collection.insert({
                                           articleAuthor: condition.articleAuthor,
                                           articleTitle: condition.articleTitle,
                                           comments: [{
                                               commentator: condition.commentator,
                                               content: condition.content,
                                               date: condition.date
                                           }],
                                           up:[],
                                           down:[]
                                       }, function (err,results) {
                                           if(err){
                                               cursor.close();
                                               dbAction.dbLogout(db);
                                               return callback(err,"数据库发生内部错误!");
                                           }else{
                                               cursor.close();
                                               dbAction.dbLogout(db);
                                               return callback(null,null);
                                           }
                                       });
                                   }else {
                                       cursor.close();
                                       console.log(2);
                                       //添加一条新评论
                                       insert(collection);
                                   }
                               }
                            });
                        }
                    });
                }
            });
        }
        //添加一条评论数据
        function insert(collection){
            console.log('4');
            collection.update({
                articleTitle: condition.articleTitle,
                articleAuthor: condition.articleAuthor
     /*           $ioslated: 1*/
            },{$push:{
                comments:{
                    commentator: condition.commentator,
                    content: condition.content,
                    date: condition.date
                }
            }},{
                upsert:false,
                multi:true,
                w:1
            }, function (err,results) {
                if(err){
                    dbAction.dbLogout(db);
                    return callback(err,"Sorry,数据库发生错误!");
                }else {
                     console.log(5);
                    dbAction.dbLogout(db);
                    return callback(null,null);
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

//赞成或反对
Articles.upOrDown = function (condition,callback) {
    dbAction.dbInit(function (err,db) {
        if(err){
            return callback(err, "抱歉,数据库发生错误!");
        }else {
            db.collection('QCOMMENTS', function (err,collection) {
               if(err){
                   dbAction.dbLogout(db);
                   return callback(err, "抱歉,数据库发生错误!");
               }else {
                   collection.find({
                       articleTitle: condition.articleTitle,
                       articleAuthor: condition.articleAuthor
                   }, function (err,cursor) {
                       if(err){
                           dbAction.dbLogout(db);
                           return callback(err,"抱歉,数据库发生错误!");
                       }else {
                           cursor.count(function (err,count) {
                               if(err){
                                   cursor.close();
                                   dbAction.dbLogout(db);
                                   return callback(err, "抱歉数据库发生错误!");
                               }else{
                                   cursor.close();
                                   console.log("count: " + count);
                                   if(count == 0){
                                       collection.insert({
                                           articleTitle: condition.articleTitle,
                                           articleAuthor: condition.articleAuthor,
                                           comments: [],
                                           up: (condition.action == "up") ? [condition.commentator] : [],
                                           down: (condition.action == "down") ? [condition.commentator] : []
                                       }, function (err,results) {
                                           if(err){
                                               dbAction.dbLogout(db);
                                               return callback(err,"抱歉数据库发生错误");
                                           }else{
                                               dbAction.dbLogout(db);
                                               //插入成功
                                               return callback(false,null);
                                           }
                                       });
                                   }else {
                                       updateUpOrDown(collection);
                                   }
                               }
                           });
                       }
                   });
               }
            });
        }
        function updateUpOrDown(collection){

            var action;
            //定义更新动作
            (condition.action == "up") ? action = {$addToSet:{up:condition.commentator}} :
                action = {$addToSet:{down:condition.commentator}};

            console.log('action:' + action);
            collection.update({
                articleTitle:condition.articleTitle,
                articleAuthor:condition.articleAuthor,
                $isolated:1
            },action,{
                upsert:false,multi:true, w:1
            }, function (err,results) {
                if(err){
                    dbAction.dbLogout(db);
                    return callback(err,"Sorry, 数据库发生了内部错误!");
                }else {
                    dbAction.dbLogout(db);
                    //数据更新成功
                    callback(false,null);
                }
            });
        }
    });
};

//读取文章的赞成数和反对数
Articles.readUpAndDown = function (condition,callback) {
    dbAction.dbInit(function (err,db) {
       db.collection("QCOMMENTS", function (err,collection) {
          if(err){
              dbAction.dbLogout(db);
              return callback(err,"抱歉,数据库发生内部错误!");
          }else {
              collection.find({
                  articleTitle: condition.articleTitle,
                  articleAuthor: condition.articleAuthor
              }, function (err,cursor) {
                  if(err){
                      dbAction.dbLogout(db);
                      return callback(err,"抱歉,数据库发生错误!");s
                  }else{
                      cursor.nextObject(function (err,item) {
                         if(err){
                             cursor.close();
                             dbAction.dbLogout(db);
                             return callback(err,"抱歉数据库发生错误");
                         }else {
                             if(item){
                                 var isUp = false;
                                 var isDown = false;
                                 for(var i = 0; item.up[i]; i++){
                                     if(item.up[i] == condition.userName){
                                         isUp = true;
                                         callback(null,{
                                             isUp: isUp,
                                             isDown: isDown,
                                             up: item.up.length,
                                             down: item.down.length
                                         });
                                         cursor.close();
                                         dbAction.dbLogout(db);
                                         return;
                                     }
                                     if(item.down[i] == condition.userName){
                                         isDown = true;
                                         callback(null,{
                                             isUp: isUp,
                                             isDown: isDown,
                                             up: item.up.length,
                                             down: item.down.length
                                         });
                                         cursor.close();
                                         dbAction.dbLogout(db);
                                         return;
                                     }
                                 }
                                 //未投票
                                 callback(null,{
                                     isUp: isUp,
                                     isDown: isDown,
                                     up: item.up.length,
                                     down: item.down.length
                                 });
                                 cursor.close();
                                 dbAction.dbLogout(db);
                             }else {
                                 //未投票
                                 callback(null,{
                                     isVoted: false,
                                     up: 0,
                                     down: 0
                                 });
                                 cursor.close();
                                 dbAction.dbLogout(db);
                             }
                         }
                      });
                  }
              });
          }
       });
    });
};

//更新热门内容列表
Articles.updateHot = function (type,callback) {
    dbAction.dbInit(function (err,db) {
       if(err){
           console.log(1);
           return callback(err,null);
       }else {
           console.log(2);
           db.collection('QPOPULAR', function (err,collection) {
               if(err){
                   console.log(3);
                   dbAction.dbLogout(db);
                   return callback(err,null);
               }else {
                   console.log(4);
                   collection.find(type, function (err,cursor) {
                       if(err){
                           console.log(5);
                           dbAction.dbLogout(db);
                           return callback(err,null);
                       }
                       //热门内容列表
                       var hotList = [];
                       cursor.each(function (err,item) {
                           if(err){
                               cursor.close();
                               dbAction.dbLogout(db);
                               return callback(err,hotList);
                           }
                           if(!item){
                               cursor.close();
                               dbAction.dbLogout(db);
                               return callback(null,hotList);
                           }
                           hotList.push({
                               title: item.title,
                               author: item.author,
                               date: item.date
                           });
                       });
                   });
               }
           });
       }
    });
};

module.exports = Articles;