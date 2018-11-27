# AS镜子项目前端页面

```
├── builddir                   // 生成的最终前端项目，最终发给后端的项目（文件名带hash值，解决缓存问题）
|
├── dist                       // 生成的前端项目（不带hash）
|
├── src                        // 开发环境下的主目录
│   ├── css                    // css目录
│   ├── img                    // 图片目录
│   ├── js                     // js目录
│   ├── sass                   // sass文件编译后生成到 css目录
│   ├── script                 // script文件编译后生成到 js目录，可写es6代码
│   └── index.html             // html文件
│   └── xx.html                // xx.html文件
|
├── gulpfile.js                // gulp 配置任务的文件（gulp的主要文件）
├── Jenkinsfile                // jenkins自动化配置流水线任务
├── favicon.ico                // favicon ico
└── package.json               // package.json
```

目前已将生成后的dist目录，部署在nginx服务器上，
访问地址 [http://172.16.1.153:8001/](http://172.16.1.153:8001/)

## 1.使用gulp优点

针对传统前端项目（不需要MVVM，spa的项目）做了一个简单的优化配置，如下：
- 代码压缩
- 代码合并
- 版本管理
- 可使用scss编译css
- 可使用es6代码，方便开发（babel编译）
- 开发环境下做了跨域处理，可脱离后端独立开发

## 2.jenkins自动化部署

> 点击查看 [jenkins自动化教程](https://java-http.github.io/2018/07/06/09-%E8%87%AA%E5%8A%A8%E5%8C%96%E9%83%A8%E7%BD%B2/),由子健编写
