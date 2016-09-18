/**
 * Created by yangw on 2016/9/9.
 */
//RequireJs配置文件
requirejs.config({
    baseUrl: '/javascripts/lib',
    //会自动下载依赖
    paths: {
        jquery: './jquery-3.1.0.min',
        bootstrap: './bootstrap.min',
        header: '../header',
        index: '../index'
    },
    shim: {
        bootstrap: {deps: ['jquery']}
    }
});

requirejs(['index', 'header', 'bootstrap'], function (index, header) {
    //初始化页面
    //三个函数是异步执行的,互相不影响
    index.indexInit();
    index.readArticleList();
    //背景图片很大,单独载入
    index.getBackgroundImg();

    header.headerInit();
});