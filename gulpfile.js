/**
 * Created by yangw on 2016/9/13.
 */
var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint');

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