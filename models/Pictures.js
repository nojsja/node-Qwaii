/**
 * Created by yangw on 2016/8/23.
 */
var dbAction = require('./db.js');
var settings = require('../settings.js');

/* 构造函数 */
function Pictures(picture){
    this.title = picture.title;
    this.date = new Date();
    this.source = picture.source;
    this.author = picture.author;
}

/* 存储一条视频数据 */
Pictures.prototype.save = function (callback) {

    //存储的视频数据
    var picture = {
        title : this.title,
        date : this.date,
        source : this.source,
        author : this.author
    };
    dbAction.dbInit(function (err, db) {
        if(err){
            return callback(err, "抱歉,数据库发生内部错误!");
        }
        db.collection('QPICTURE', function (err, collection) {
            if(err){
                dbAction.dbLogout(db);
                return callback(err, "抱歉,数据库发生内部错误!");
            }
            collection.insert(picture, function (err, results) {
                dbAction.dbLogout(db);
                if(err){
                    return callback(err, "抱歉,数据库发生内部错误!");
                }
                callback(null, null);
            });
        });
    });
};

/* 存储头像 */
Pictures.prototype.saveAsHead = function (callback) {

    //存储头像的地址
    var headImg = {
        source : this.source,
        userName : this.author
    }

    dbAction.dbInit(function (err, db) {
        if(err){
            return callback(err, "抱歉,数据库发生内部错误!");
        }
        db.collection('QUSER', function (err, collection) {
            if(err){
                dbAction.dbLogout(db);
                return callback(err, "抱歉,数据库发生内部错误!");
            }
            collection.update({
                name : headImg.userName
            }, {
                $set : {headImg : headImg.source}
            }, {
               upsert : false, multi : false, w : 1 
            }, function (err, results) {
                if(err){
                    dbAction.dbLogout(db);
                    return callback(err, "抱歉,数据库发生内部错误!");
                }
                callback(null, headImg.source);
            });
        });
    });
};

/* 获取预览数据 */
Pictures.getPreviewData = function (author, callback) {
    dbAction.dbInit(function (err, db) {
       if(err){
           return callback(err, "抱歉,数据库发生严重错误!");
       }
        db.collection('QPICTURE', function (err, collection) {
           if(err){
               dbAction.dbLogout(db);
               return callback(err, "抱歉,数据库发生严重错误!");
           }
            collection.find({author : author}, function (err, cursor) {
                if(err){
                    dbAction.dbLogout(db);
                    return callback(err);
                }
                var pictures = [];
                cursor.each(function (err, item) {
                    if(err){
                        cursor.close();
                        dbAction.dbLogout(db);
                        return callback(err, "抱歉,数据库发生错误!");
                    }
                    if(item){
                        pictures.push(item);
                    }else {
                        //正确返回数据
                        cursor.close();
                        dbAction.dbLogout(db);
                        return callback(null, pictures);
                    }
                });
            });
        });
    });
}

module.exports = Pictures;