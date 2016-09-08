/**
 * Created by yangw on 2016/8/23.
 */
var dbAction = require('./db.js');
var settings = require('../settings.js');

//构造函数
function Musics(music){
    this.title = music.title;
    this.date = new Date();
    this.source = music.source;
    this.author = music.author;
}

//存储一条视频数据
Musics.prototype.save = function (callback) {
    //存储的视频数据
    var music = {
        title: this.title,
        date: this.date,
        source: this.source,
        author: this.author
    };
    dbAction.dbInit(function (err,db) {
        if(err){
            return callback(err,"抱歉,数据库发生内部错误!");
        }
        db.collection('QMUSIC', function (err,collection) {
            if(err){
                dbAction.dbLogout(db);
                return callback(err,"抱歉,数据库发生内部错误!");
            }
            collection.insert(music, function (err,results) {
                dbAction.dbLogout(db);
                if(err){
                    return callback(err,"抱歉,数据库发生内部错误!");
                }
                callback(null,null);
            });
        });
    });
};

//获取预览数据
Musics.getPreviewData = function (author,callback) {
    dbAction.dbInit(function (err,db) {
        if(err){
            return callback(err,"抱歉,数据库发生严重错误!");
        }
        db.collection('QMUSIC', function (err,collection) {
            if(err){
                dbAction.dbLogout(db);
                return callback(err,"抱歉,数据库发生严重错误!");
            }
            collection.find({author:author}, function (err,cursor) {
                if(err){
                    dbAction.dbLogout(db);
                    return callback(err);
                }
                var musics = [];
                cursor.each(function (err,item) {
                    if(err){
                        cursor.close();
                        dbAction.dbLogout(db);
                        return callback(err,"抱歉,数据库发生错误!");
                    }
                    if(item){
                        musics.push(item);
                    }else {
                        //正确返回数据
                        cursor.close();
                        dbAction.dbLogout(db);
                        return callback(null,musics);
                    }
                });
            });
        });
    });
}

module.exports = Musics;