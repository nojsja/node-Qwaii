/**
 * Created by yangw on 2016/9/8.
 */
var formidable = require('formidable');
var fs = require('fs');
//保存到数据库
var Videos = require('./Video.js');
var Musics = require('./Musics.js');
var Pictures = require('./Pictures.js');

function Upload(req,res) {

    console.log('Upload..');
    //存放表单域和文件
    var form = new formidable.IncomingForm(),files=[],fields=[],docs=[];
    console.log('start upload');

    //临时存放目录
    var tempPath = './temp/';
    //正则匹配
    var regVideo = /(mp4|flv|rmvb|wmv|mkv)/i;
    var regMusic = /(mp3|ape|wav|ogg|wma)/i;
    var regPicture = /(bmp|jpg|jpeg|svg|png|gif)/i;
    form.uploadDir = tempPath;

    //处理普通的表单域
    form.on('field', function(field, value) {
        //console.log(field, value);
        fields.push([field, value]);
        /*处理文件*/
    }).on('file', function(field, file) {
        /* console.log(field, file);*/
        files.push([field, file]);
        docs.push(file);
        //前缀路径
        var prePath;
        //访问路径
        var visitPath;
        //判断文件类型
        var types = file.name.split('.')[1];
        //文件类型s
        var type;

        if(regVideo.test(types)){
            prePath = "./public/videos/users/" + req.session.userName;
            visitPath = "/videos/users/" + req.session.userName;
            type = "video";
        }else if(regMusic.test(types)){
            prePath = "./public/music/users/" + req.session.userName;
            visitPath = "/music/users/" + req.session.userName;
            type = "music";
        }else if(regPicture.test(types)){
            prePath = "./public/images/users/" + req.session.userName;
            visitPath = "/images/users/" + req.session.userName;
            type = "picture";
        }else {
            prePath = "./public/files/users/" + req.session.userName;
            visitPath = "/files/users/" + req.session.userName;
            type = "file";
        }

        try{
            if(!fs.existsSync(prePath)){
                fs.mkdirSync(prePath);
            }
            /*文件上传到临时文件目录下，我们还要将临时文件， 移到我们的上传目录中*/
            fs.rename(file.path, prePath + "/" + file.name, function (err) {
                if(err){
                    console.log(err);
                }else {
                    /*存储信息*/
                    var info = {
                      title:file.name,
                        author: req.session.userName,
                        source: visitPath + "/" + file.name
                    };
                    //将上传的文件信息存进数据库
                    if(type == "music"){
                        var music = new Musics(info);
                        music.save(function (err) {
                           if(err){
                               console.log(err);
                           }
                        });
                    }else if(type == "video"){
                        var video = new Videos(info);
                        video.save(function (err) {
                            if(err){
                                console.log(err);
                            }
                        });
                    }else if(type == "picture"){
                        var picture = new Pictures(info);
                        picture.save(function (err) {
                            if(err){
                                console.log(err);
                            }
                        });
                    }

                }
                //删除文件
                fs.readdir("./temp", function (err,files) {
                    for(var i = 0; files[i];i++){
                        if(files[i] == file.name){
                            fs.unlink("./temp/" + files[i], function (err) {
                                if(err){
                                    console.log(err);
                                }
                            });
                        }
                    }
                });
            });
        }catch(e){
            console.log(e);
        }

    }).on('end', function() {
        console.log('-> upload done');
        res.writeHead(200, {
            'content-type': 'text/plain'
        });
        var out={Resopnse:{
            'result-code':0,
            timeStamp:new Date(),
        },
            files:docs
        };
        var sout=JSON.stringify(out);
        res.end(sout);
    });

    form.parse(req, function(err, fields, files) {
        err && console.log('formidabel error : ' + err);

        console.log('parsing done');
    });

}

//预览资源
Upload.preview = function (condition,callback) {
    if(condition.type == "music"){
        Musics.getPreviewData(condition.author,callback);
    }else if(condition.type == "video"){
        Videos.getPreviewData(condition.author,callback);
    }else if(condition.type == "picture"){
        Pictures.getPreviewData(condition.author,callback);
    }
};

module.exports = Upload;