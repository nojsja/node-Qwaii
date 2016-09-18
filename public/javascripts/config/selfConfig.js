/**
 * Created by yangw on 2016/9/18.
 */

/* RequireJs配置文件 */
requirejs.config({
    baseUrl: '/javascripts/lib',
    //会自动下载依赖
    paths: {
        jquery: './jquery-3.1.0.min',
        bootstrap: './bootstrap.min',
        header: '../header',
        selfInfo: '../selfInfo',
        croppic: './croppic.min'
    },
    shim: {
        bootstrap: {deps: ['jquery']},
        croppic: {deps: ['jquery']}
    }
});

/* RequireJs方法异步调用 */
requirejs(["selfInfo", "header", "bootstrap", "croppic"], function (self, header) {

    //self页面初始化
    self.selfInit();
    //获取背景图片
    self.getBackgroundImg();
    //header初始化
    header.headerInit();
});
