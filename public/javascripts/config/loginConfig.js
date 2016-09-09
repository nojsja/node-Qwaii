/**
 * Created by yangw on 2016/9/9.
 */
//RequireJs配置文件
requirejs.config({
    baseUrl:'/javascripts/lib',
    //会自动下载依赖
    paths:{
        jquery: './jquery-3.1.0.min',
        bootstrap:'./bootstrap.min',
        header:'../header',
        login:'../login'
    },
    shim:{
        bootstrap:{deps:['jquery']}
    }
});

requirejs(['login','header','bootstrap'], function (login,header) {
    //初始化页面
    //三个函数是异步执行的,互相不影响
    login.loginInit();
    //异步载入头像
    login.getHeadImg();
    //背景图片很大,单独载入
    login.getBackgroundImg();

    header.headerInit();
});