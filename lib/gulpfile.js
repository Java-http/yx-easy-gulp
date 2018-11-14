// 获取依赖
var gulp = require('gulp');

var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var autoprefix = require('gulp-autoprefixer');
var mergeStream = require('merge-stream');
var runSequence = require('run-sequence');
var clean = require('gulp-clean')
var rev  = require('gulp-rev-append-all')
var useref = require('gulp-useref')
var RevAll = require('gulp-rev-all')
var babel = require('gulp-babel');
var revdel = require('gulp-rev-delete-original');
var minifyCss = require('gulp-clean-css');
var gulpif = require('gulp-if')
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify'); 
var htmlmin = require('gulp-htmlmin');
var plumber = require('gulp-plumber');
var connect = require('gulp-connect');
var proxy = require('http-proxy-middleware');
var sh = require('shelljs');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
// task 任务

/* 处理sass */
gulp.task('sass', function(cb){
  /**
   * 嵌套输出方式 nested
   * 展开输出方式 expanded 
   * 紧凑输出方式 compact 
   * 压缩输出方式 compressed
   */
  gulp.src(['./src/scss/*.scss','./src/sass/*.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(plumber())
    .pipe(autoprefix({ //通过autoprefix自动添加兼容各大浏览器的样式前缀，例如-webkit-，-o-
      browsers: ['last 2 versions','> 5%'], //兼容最新2个版本
      cascade: false
    }))
    .pipe(sourcemaps.write('./map'))
    .pipe(gulp.dest('./css'))
  
});

/* 处理js */
gulp.task('js',function(cb){
  // 各个页面js文件
  gulp.src('./src/script/*.js')
  .pipe(plumber())
  .pipe(babel({
      presets: ['@babel/env']
  }))
  .pipe(uglify())
  .pipe(gulp.dest('./script'))
  cb();
})

/* 拷贝文件 */
gulp.task('copy',function(cb){
  // 拷贝 公用库
  gulp.src('./src/utils/**/*')
  .pipe(gulp.dest('./utils'))
  // 拷贝图片
  gulp.src('./src/images/**/*')
    .pipe(gulp.dest('./images'));

  cb();
})

/* dev 环境清除 src下js/css 目录 */
gulp.task('clean',function(cb){
  return gulp.src(['./css','./utils','./images','./script'])
    .pipe(clean());
})

gulp.task('build',function(cb){
  runSequence(
    'clean',
    ['sass','js','copy'],
    cb
  );
})

/* 监控文件的变动 */
gulp.task('watch',function(){
  gulp.watch(['./src/scss/*.scss','./src/sass/*.scss'],['sass']);
  gulp.watch('./src/script/*.js',['js']);
})

//运行Gulp时,默认的Task
gulp.task('server', ['build'],function () {
  
});