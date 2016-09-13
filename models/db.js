/**
 * Created by yangw on 2016/8/13.
 */
var settings = require('../settings.js'),
    Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server;

/* db操作对象 */
var dbAction = {};

/* 数据库初始化 */
dbAction.dbInit = function(callback){

    MongoClient.connect("mongodb://Johnson:yangwei020154@localhost:27017/Qwaii", {
        db : {w : 1, native_parser : false},
        server : {
            poolSize : 4,
            socketOptions : {connectTimeoutMS : 500},
            auto_reconnect : true
        },
        replSet : {},
        mongos : {},
        uri_decode_auth : true
    },function(err, db){
        if(err){
            console.log(err);
            callback(err, null);
        }else{
            callback(null, db);
        }
    });
}

/* 数据库注销 */
dbAction.dbLogout = function(db){

    db.logout(function (err, result) {
        if(!err){
            console.log("Logged out Via Connection String . . .");
        }
        db.close();
        console.log("Connection closed . . .");
    });
}

module.exports = dbAction;