/**
 * Created by yangw on 2016/8/13.
 */
var settings = require('../settings.js'),
    Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server;

var client = new MongoClient(new Server(settings.host,settings.port, {
        socketOptions: {
            connectTimeoutMS:500
        },
        poolSize:50,
        auto_reconnect:true
        },{
            numberOfRetries:3,
            retryMilliSeconds:500
        }
));

module.exports = client;