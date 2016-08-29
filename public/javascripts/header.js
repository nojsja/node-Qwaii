/**
 * Created by yangw on 2016/8/26.
 */
//限定作用域
$(function () {
    headerAction.updateUser();
    //注销动作绑定
    $('#logoutLi').click(function(){
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
    });
});

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