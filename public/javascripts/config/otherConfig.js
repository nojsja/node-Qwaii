/**
 * Created by yangw on 2016/9/17.
 */
//RequireJs配置文件
requirejs.config({
    baseUrl:'/javascripts/lib',
    //会自动下载依赖
    paths:{
        jquery: './jquery-3.1.0.min',
        header:'../header',
    },
    shim:{
        bootstrap:{deps:['jquery']},
    }
});

requirejs(['header','bootstrap'], function (header) {
    //初始化页面
    //三个函数是异步执行的,互相不影响
    header.headerInit();
});