//配置ssr开发环境配置
//动态打包出vue-ssr-server-bundle.json 和 vue-ssr-client-manifest.json
const devMiddleWare = require("webpack-dev-middleware");
//webpack-dev-middleware,作用就是，生成一个与webpack的compiler绑定的中间件，然后在express启动的服务app中调用这个中间件。
//这个中间件的作用呢，简单总结为以下三点：通过watch mode，监听资源的变更，然后自动打包（如何实现，见下文详解);快速编译，走内存；
//返回中间件，支持express的use格式
const hotMiddleWare = require("webpack-hot-middleware");
const MFS = require("memory-fs");
const webpack = require("webpack");
const path = require("path");
const clientConfig = require("./ssr-client-config");
const serverConfig = require("./ssr-server-config");


module.exports = function (server, cb) {
  let bundle;//热重载的bundle=>也就是解决热重载问题api(createBundleRenderer)所需要的serverBundle.json（即vue-ssr-server-bundle.json）
  let clientManifest;//热重载需要的客户端打包信息json，也就是vue-ssr-client-mainfest.json(包含了 webpack 整个构建过程的信息，从而可以让 bundle renderer 自动推导需要在 HTML 模板中注入的内容,帮助解析用的)

  function update() {//定义返回函数
    if (bundle && clientManifest) {
      cb(bundle, clientManifest)
    }
  }

  //编译生成vue-ssr-client-manifest.json
  // 修改客户端配置添加 热更新中间件
  clientConfig.entry.app = ["webpack-hot-middleware/client", clientConfig.entry.app];
  clientConfig.output.filename = '[name].js'
  clientConfig.plugins.push(//加入热替换插件
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )

  //dev-middleware
  const clientCompiler = webpack(clientConfig);
  const devMiddleWarer = devMiddleWare(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    stats: {
      colors: true,
      chunks: false
    }
  })
  server.use(devMiddleWarer);

  //监听热更新=>设置在控制台输出日志
  const hotMiddlewarer = hotMiddleWare(clientCompiler, {
    heartbeat: 5000
  })
  server.use(hotMiddlewarer)

  clientCompiler.plugin("done", () => {//客户端包编译完成后=>可拿到vue-ssr-client-manifest.json
    const middlewareFs = devMiddleWarer.fileSystem;//中间件的文件系统;功能就行fs一样
    const filePath = clientConfig.output.path
    if (middlewareFs.existsSync(filePath)) {//node方法 如果存在该目录则返回true/ 否则false
      clientManifest = JSON.parse(middlewareFs.readFileSync(path.join(filePath, "vue-ssr-client-manifest.json"), "utf-8"));//记得parse
      update();
    }
  })

  //编译生成vue-ssr-server-bundle.json
  const serverCompiler = webpack(serverConfig);
  const mfs = new MFS()// 内存文件系统，在JavaScript对象中保存数据,比fs的更快，写在内存中
  serverCompiler.outputFileSystem = mfs;//设置serverCompiler的文件系统由mfs来接管处理（更快，写在内存中）

  // watch的好处：类似于webpack-dev-server一样，每次修改了一个文件，它都会重新执行一次打包，然后拿到新的文件
  serverCompiler.watch({}, (err, stats) => {
    // 第一个参数是一个空对象
    // 第二个参数是一个回调，有两个参数，err, stats

    // 如果遇到了错误，直接抛出，eslint 的错误是不会在 err里面出现的
    if (err) throw err
    // eslint 错误要在 stats里面去发现
    stats = stats.toJson()
    stats.errors.forEach(err => console.log(err))
    stats.warnings.forEach(warn => console.warn(warn))

    // 读取生成的bundle文件
    const bundlePath = path.join(
      serverConfig.output.path,
      // 这里vue-ssr-server-bundle.json是使用 VueServerPlugin插件时输出的文件名，可以使用默认的，也可以在使用VueServerPlugin插件时自定义
      'vue-ssr-server-bundle.json'
    )
    // 我们这里不是使用output时的filename,因为我们使用了 VueServerPlugin 这个插件，
    // 这个插件可以帮我们做很多服务端渲染相关的事情
    bundle = JSON.parse(mfs.readFileSync(bundlePath, 'utf-8'))
    update();
  })
}
