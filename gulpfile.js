/**
 * Created by yangw on 2016/9/13.
 */
var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant');

/* 默认任务 */
gulp.task('default', ['minify-js','minify-css']);

/* 压缩js任务 */
gulp.task('minify-js', function () {
    gulp.src("public/javascripts/*.js").
        pipe(uglify()).
        pipe(gulp.dest('./public/javascripts/dist'));
});

/* 压缩css任务 */
gulp.task('minify-css', function () {
    gulp.src("public/stylesheets/*.css").
        pipe(minifycss()).
        pipe(gulp.dest('./public/stylesheets/dist'));
});

/* JS检查 */
gulp.task('jshint', function () {
    gulp.src("public/javascripts/*.js").
        pipe(jshint()).
        pipe(jshint.reporter());
});

/* 压缩图片 */
gulp.task('imagemin', function () {
   gulp.src("public/images/head/*.*").
       pipe(imagemin({
            progressive : true,
            use : [pngquant()]
        })).
       pipe(gulp.dest('./public/images/head/dist'));

    gulp.src("public/images/pictures/*.*").
        pipe(imagemin({
            progressive : true,
            user : [pngquant()]
        })).
        pipe(gulp.dest('./public/images/pictures/dist'));

    gulp.src("public/images/icon/*.*").
    pipe(imagemin({
        progressive : true,
        user : [pngquant()]
    })).
    pipe(gulp.dest('./public/images/icon/dist'));

    gulp.src("public/images/links/*.*").
    pipe(imagemin({
        progressive : true,
        user : [pngquant()]
    })).
    pipe(gulp.dest('./public/images/links/dist'));
});
