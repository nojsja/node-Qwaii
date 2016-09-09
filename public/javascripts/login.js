/**
 * Created by yangw on 2016/8/18.
 */
//定义RequireJs模块
define('login',['jquery'], function () {
    return {
        loginInit:loginInit,
        getBackgroundImg: function () {
            $('#backgroundImg').prop('class','backgroundImg');
        },
        //载入头像
        getHeadImg: function () {
            pageAction.loadHeadImg();
        }
    }
});

//初始化操作
function loginInit() {
    $('#nameCheck').toggle("fast");
    $('#pswCheckGroup').toggle("fast");
    //绑定事件
    $('#rememberPsw').click(function () {
        if ($('#rememberPsw').prop("checked") == true){
            pageAction.rememberPsw = true;
        }else {
            pageAction.rememberPsw = false;
        }
    });
    $('#signupTitle').click(function () {
        $('#action').text("用户注册")
        $('#nameCheck').slideDown("slow");
        $('#pswCheckGroup').slideDown("slow");
        pageAction.state = "signup";
    });

    $('#loginTitle').click(function () {
        $('#action').text("用户登录")
        $('#nameCheck').slideUp("slow");
        $('#pswCheckGroup').slideUp("slow");
        pageAction.state = "login";
    });

    //绑定检查的事件
    check();
    $('#ok').click(function () {
        if(!pageAction.emailStatus){
            pageAction.modalWindow("邮箱格式不对额!");
            return;
        }
        if(!pageAction.pswStatus){
            pageAction.modalWindow("密码格式有错额!");
            return;
        }
        if(!pageAction.RePswStatus && pageAction.state == "signup"){
            pageAction.modalWindow("两次填写的密码不同额!");
            return;
        }
        if($('#name').val() == "" && pageAction.state == "signup"){
            pageAction.modalWindow("至少要填一下你的昵称吧!");
            return;
        }
        pageAction.state == "login" ? pageAction.loginAction() : pageAction.signupAction();
    });
};

//页面state对象
var pageAction = {
    urlLogin : "/login",
    state: "login",
    email:"",
    name:"",
    password:"",
    emailStatus:false,
    pswStatus:false,
    RePswStatus:false,
    rememberPsw:false
};
//字符检测对象
var charaAction = {};

//加载头像请求
pageAction.loadHeadImg = function () {
    $.post(pageAction.urlLogin,
        {
            action:"loadHeadImg"
        },
        function (JSONdata) {
            pageAction.loadImgAction(JSONdata);
        },
        "JSON"
    )
};

//模态弹窗
pageAction.modalWindow = function (text) {
    $('.modal-body').text(text);
    $('#modalWindow').modal("show",{
        backdrop:true,
        keyboard:true
    });
};

//加载头像操作
pageAction.loadImgAction = function (JSONdata) {
    var baseUrl = JSONdata.baseUrl;
    if (JSONdata.images == null){
        pageAction.modalWindow("服务器错误!请刷新..");
        return;
    }
    var images = JSONdata.images;
    for (var i = 0; images[i] != null && images[i] != undefined; i++){
        (function (){
            var image = images[i];
            var $imgDiv = $("<div></div>");
            var $img = $("<img>");
            $img.attr({
               "src":baseUrl + image,
                "class":"loginIcon"
            });
            $imgDiv.append($img);
            $('.iconDiv').append($imgDiv);
        })();
    }
};

//登录操作
pageAction.loginAction = function () {
    $.post(pageAction.urlLogin,
        {
            action:pageAction.state,
            email:pageAction.email,
            password:pageAction.password,
            isRemember:pageAction.rememberPsw
        },
        function (JSONdata) {
            if(JSONdata.status != "ok"){
                pageAction.modalWindow(JSONdata.statusText);
            }else {
                /*跳转到主页*/
                window.location.href = JSONdata.url;
            }

        },
        "JSON"
    )
};

//注册操作
pageAction.signupAction = function () {
    $.post(pageAction.urlLogin,
        {
            action:pageAction.state,
            email:pageAction.email,
            password:pageAction.password,
            name:pageAction.name,
            isRemember:pageAction.rememberPsw
        },
        function (JSONdata) {
            if(JSONdata.status != "ok"){
                pageAction.modalWindow(JSONdata.statusText);
            }else {
                pageAction.modalWindow(JSONdata.statusText);
            }
        },
        "JSON"
    )
};

//格式检测函数
var check = function(){

    //邮箱检测
    $('#email').blur(function () {
        if(charaAction.emailCheck($('#email').val())){
            $('#emailStatus').attr({
               "class":"glyphicon glyphicon-ok"
            });
            pageAction.emailStatus = true;
            pageAction.email = $('#email').val();
        }else {
            $('#emailStatus').attr({
                "class":"glyphicon glyphicon-remove"
            });
            pageAction.emailStatus = false;
        }
    })

    //非法字符检测
    $('#password').blur(function(){
        if(charaAction.charaCheck($('#password').val())){
            $('#pwdStatus').attr({
                "class":"glyphicon glyphicon-ok"
            });
            pageAction.pswStatus = true;
            pageAction.password = $('#password').val();
        }else {
            $('#pwdStatus').attr({
                "class":"glyphicon glyphicon-remove"
            });
            pageAction.pswStatus = false;
        }
    })

    $('#name').blur(function () {
        pageAction.name = $('#name').val();
    });

    $('#pswCheck').blur(function () {
      if($('#password').val() == $('#pswCheck').val() && ($('#password').val() != "")){
          $('#rePswStatus').attr({
              "class":"glyphicon glyphicon-ok"
          });
          pageAction.RePswStatus = true;
      }else {
          $('#rePswStatus').attr({
              "class":"glyphicon glyphicon-remove"
          });
          pageAction.RePswStatus = true;
      }
    })
}

//非法字符检测
charaAction.charaCheck = function(text){
    if(text == ""){
        return false;
    }
    var pattern = /[\\*@$%^#/]/;
    if(pattern.test(text)){
        //含有非法字符
        return false;
    }else {
        return true;
    }
};

//邮箱格式检测
charaAction.emailCheck = function (text) {
    var pattern = /[0-9a-zA-Z]+@[0-9a-zA-Z]+.\w+/;
    if(pattern.test(text)){
        //邮箱格式正确
        return true;
    }else {
        return false;
    }
};