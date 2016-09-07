var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var format = require('util').format;
var ueditor = require("ueditor");
var schedule = require('node-schedule');
//持久化session信息
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
//路由
var index = require('./routes/index');
var login = require('./routes/login');
var article = require('./routes/article');
var post = require('./routes/post');
var search = require('./routes/search');
var settings =require('./settings.js');
var users = require('./routes/users');
var upload = require('./routes/upload');

//数据库定时器
var MongoSchedule = require('./models/MongoSchedule.js');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//设置body的最长限制
app.use(bodyParser.json({limit:"50mb"}));
app.use(bodyParser.urlencoded({ limit: "50mb" ,extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//session持久化
app.use(session({
        secret: settings.cookieSecret,
        key:settings.db,
        cookie:{
            maxAge:1000*60*60*24*7,
            secure: false
        },
        store: new MongoStore(
            {url:format("mongodb://%s:%s@%s:%s/%s",settings.user, settings.password, settings.host, settings.port, settings.db)}
        ),
        resave: false,
        saveUninitialized: true
    }
));

//处理上传图片
app.use("/ueditor/ue", ueditor(path.join(__dirname, 'public'), function(req, res, next) {
    // ueditor 客户发起上传图片请求
    if(req.query.action === 'uploadimage'){
        // 这里你可以获得上传图片的信息
        var foo = req.ueditor;
        console.log(foo.filename); // exp.png
        console.log(foo.encoding); // 7bit
        console.log(foo.mimetype); // image/png

        // 下面填写你要把图片保存到的路径 （ 以 path.join(__dirname, 'public') 作为根路径）

        var img_url = '/images/users';
        res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage'){
        var dir_url = '/images/users'; // 要展示给客户端的文件夹路径
        res.ue_list(dir_url) // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        res.setHeader('Content-Type', 'application/json');
        // 这里填写 ueditor.config.json 这个文件的路径
        res.redirect('/Ueditor/nodejs/config.json')
    }
}));

//建立路由规则
index(app);
login(app);
post(app);
article(app);
search(app);
users(app);
upload(app);

//node-schedule定时执行任务,更新popolar表,每天的凌晨零点
var rule = new schedule.RecurrenceRule()
rule.dayOfWeek = new schedule.Range(0,6);
rule.hour = 0;
rule.minute = 0;
var scheduleJob = schedule.scheduleJob(rule, MongoSchedule);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
