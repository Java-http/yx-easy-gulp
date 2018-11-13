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
// task 任务

/* 处理sass */
gulp.task('sass', function(cb){
  /**
   * 嵌套输出方式 nested
   * 展开输出方式 expanded 
   * 紧凑输出方式 compact 
   * 压缩输出方式 compressed
   */
  gulp.src('./src/sass/*.scss')
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(plumber())
    .pipe(autoprefix({ //通过autoprefix自动添加兼容各大浏览器的样式前缀，例如-webkit-，-o-
      browsers: ['last 2 versions'], //兼容最新2个版本
      cascade: false
    }))
    .pipe(gulp.dest('./src/css'))
  
  // 拷贝 字体文件
  gulp.src('./src/sass/lib/fonts/**/*')
    .pipe(gulp.dest('./src/css/fonts'))

  gulp.src(['./src/sass/lib/normalize.min.css','./src/sass/lib/ele.css'])
    .pipe(concat('lib.min.css')) //合并css
    .pipe(cssmin()) //压缩css
    .pipe(gulp.dest('./src/css')) //输出文件的存放地址
  cb()
});

/* 处理js */
gulp.task('js',function(cb){
  // 公用js库
  gulp.src(['./src/script/lib/polyfill.min.js','./src/script/lib/jquery.min.js','./src/script/lib/vue.min.js','./src/script/lib/ele.js'])
  .pipe(concat('lib.min.js'))
  .pipe(gulp.dest('./src/js'))
  // 各个页面js文件
  gulp.src('./src/script/*.js')
  .pipe(plumber())
  .pipe(babel({
      presets: ['@babel/env']
  }))
  .pipe(gulp.dest('./src/js'))
  cb();
})

/* 拷贝文件 */
gulp.task('copy',function(cb){
  // 拷贝 html
  gulp.src('./src/*.html')
    .pipe(htmlmin({
      removeComments: true,//清除HTML注释
      minifyJS: true,//压缩页面JS
      minifyCSS: true //压缩页面CSS
    }))
    .pipe(gulp.dest('./dist/'));
  // 拷贝图片
  gulp.src('./src/img/**/*')
    .pipe(gulp.dest('./dist/img'));
  // 拷贝css
  gulp.src('./src/css/**/*')
    .pipe(gulp.dest('./dist/css'));
  // 拷贝js
  gulp.src('./src/js/**/*')
    .pipe(uglify())
    .on('error', function (err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    })
    .pipe(gulp.dest('./dist/js'));
  cb()
})

/* 缓存管理 */
gulp.task('rev',function(){
  return gulp.src('./dist/**')
  .pipe(RevAll.revision({
    dontRenameFile:['html']
  }))
  .pipe(gulp.dest('./build'));
})

/* dev 环境清除 src下js/css 目录 */
gulp.task('devClean',function(cb){
  return gulp.src(['./src/css','./src/js'])
    .pipe(clean());
})

/* dist 环境清除 src下js/css 目录 */
gulp.task('distClean', function(){
  return gulp.src('dist')
      .pipe(clean());
});

/* build 环境清除 src下js/css 目录 */
gulp.task('buildClean', function(){
  return gulp.src('builddir')
      .pipe(clean());
});

gulp.task('dev',function(cb){
  runSequence(
    // 'devClean',
    'sass',
    'js',
    cb
  );
})

gulp.task('dist',function(cb){
  runSequence(
    'distClean',
    'copy',
    cb
  );
})

gulp.task('build',function(cb){
  runSequence(
    'buildClean',
    'rev',
    cb
  );
})

/* 监控文件的变动 */
gulp.task('watch',function(){
  gulp.watch('./src/sass/*.scss',['sass']);
  gulp.watch('./src/script/*.js',['js']);
  gulp.watch(watchPath, ['watchCallback']);
})

// 需要监控的路径
var watchPath = ['./src/**/*'];

// 使用connect启动一个Web服务器
gulp.task('connect', function () {
    connect.server({
        root: './src',
        livereload: true,
        port: 9001,
        middleware: function (connect, opt) {
            return [
                proxy("/MirrorApi", {
                    target: 'http://xx.xx.x.x:8998',
                    changeOrigin: true,
                    onProxyReq:function(proxyReq, req, res){
                      // http-proxy-middleware 会改变header头key值的大小写(比如把'Token'变为'token'))，这里需要重新修改header头
                      proxyReq.setHeader('Token', req.headers['token']);
                      // console.log(req.headers)
                    },
                })
            ]
        }
    });
});


// 监控的回调reload
gulp.task('watchCallback', function () {
  gulp.src(watchPath)
      .pipe(plumber())
      .pipe(connect.reload());
});

//运行Gulp时,默认的Task
gulp.task('server', function () {
  runSequence(['connect', 'watch'], function () {
     sh.echo("跨域服务器开启!");
  });
});