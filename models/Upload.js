/**
 * Created by yangw on 2016/9/8.
 */
var formidable = require('formidable');
var fs = require('fs');

module.exports = function (req,res) {

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
        //判断文件类型
        var types = file.name.split('.')[1];
        console.log(types);
        if(regVideo.test(types)){
            prePath = "./public/videos/users/" + req.session.userName;
        }else if(regMusic.test(types)){
            prePath = "./public/music/users/" + req.session.userName;
        }else if(regPicture.test(types)){
            prePath = "./public/images/users/" + req.session.userName;
        }else {
            prePath = "./public/files/users/" + req.session.userName;
        }
        var date = new Date();
        var ms = Date.parse(date);
        try{
            if(!fs.existsSync(prePath)){
                fs.mkdirSync(prePath);
            }
            /*文件上传到临时文件目录下，我们还要将临时文件， 移到我们的上传目录中*/
            fs.rename(file.path, prePath + "/" + file.name, function (err) {
                if(err){
                    console.log(err);
                }
                //删除文件
                fs.readdir("./temp", function (err,files) {
                    for(var i = 0; files[i];i++){
                        fs.unlink("./temp/" + files[i], function (err) {
                            if(err){
                                console.log(err);
                            }
                        });
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