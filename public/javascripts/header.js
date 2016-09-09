/**
 * Created by yangw on 2016/8/26.
 */
//定义RequireJs模块
define('header',['jquery'], function () {
   return {
       headerInit: headerInit
   }
});

//初始化函数
function headerInit() {
    headerAction.updateUser();
    $('#loginLi').click(function () {
        if($('#loginLi').attr('class') == "disabled"){
            headerAction.modalWindow("要想登录其它账户必须注销当前账户!");
        } else {
            window.location.href = "/login";
        }
    });

    $('#logoutLi').click(function () {
       if($('#logoutLi').attr('class') == "disabled"){
           headerAction.modalWindow("你还未登录任何账户!");
       } else {
           //注销动作绑定
           $.post('/user',{
                   action:"logout"
               }, function (JSONdata) {
                   if(JSONdata.logout){
                       headerAction.modalWindow("注销成功!");
                       headerAction.updateUser();
                   }else {
                       headerAction.modalWindow("服务器发生错误,注销失败!");
                   }
               },
               "JSON");
       }
    });

    $('#searchSpan').click(function () {
        window.location.href = "/search";
    });

};

//页面动作对象
var headerAction = {};

//模态弹窗
headerAction.modalWindow = function (text) {
    $('.modal-body').text(text);
    $('#modalWindow').modal("show",{
        backdrop:true,
        keyboard:true
    });
};

//更新用户
headerAction.updateUser = function () {
    $.post("/user",{
            action:"getName"
        },
        function (JSONdata) {
            if(JSONdata.userName == (undefined || null)){
                $('#userName').text(" 游客 ");
                $('#userName').append($('<span class="caret"></span>'));
                $('#loginLi').attr({
                    "class":"enabled"
                });
                $('#logoutLi').attr({
                    "class":"disabled"
                });
            }else {
                $('#userName').text(" " + JSONdata.userName + " ");
                $('#userName').append($('<span class="caret"></span>'));
                $('#loginLi').attr({
                    "class":"disabled"
                });
                $('#logoutLi').attr({
                    "class":"enabled"
                });
            }
        },
        "JSON");
};