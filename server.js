//开服务
//加工返回页面的html字符串
const express=require("express");
const compression = require('compression') // 开启gzip压缩
const fs=require("fs")
const LRU=require("lru-cache")
const { createBundleRenderer } = require('vue-server-renderer')
const porfinder=require("portfinder")

const server=express();
server.use(compression({ threshold: 0 })) // gzip压缩 threshold:针对响应考虑压缩前响应主体大小的字节阈值，默认为1kb。这是字节模块接受的字节数或字符串数。
server.use('/dist', express.static('dist')); // 管理静态资源，避免资源访问不到的情况
const ssrtemplate=fs.readFileSync("./src/ssrtemplate/index.html","utf-8");//读取ssr 渲染的template

function createRender(bundle,manifest){//获取server-render的实例
  return createBundleRenderer(bundle,{
    runInNewContext: false,//建议false，bundle 代码将与服务器进程在同一个 global 上下文中运行，所以请留意在应用程序代码中尽量避免修改 global
    template:ssrtemplate,
    clientManifest:manifest,
    cache:new LRU({
      max: 1000,//最大缓存
      maxAge: 1000 * 60 * 15//缓存时间
    })
  })
}

let renderer;
const isPro=process.env.NODE_ENV=="production";
if(isPro){
  renderer=createRender(require("./dist/vue-ssr-server-bundle.json"),require("./dist/vue-ssr-client-manifest.json"))
}else{
  require("./build/setup-dev-server")(server,(bundle,clientmanifest)=>{
    renderer=createRender(bundle,clientmanifest)
  })
}
function renderToString(context) {
  return new Promise((resolve, reject) => {
    renderer.renderToString(context, (err, html) => {
      err ? reject(err) : resolve(html)
    })
  })
}

server.get("*",(request,response)=>{
  if(!renderer){
    return response.end('正在构建中...')
  }
  renderToString({ url: request.url }).then(html => {
    response.send(html)
  })
})

const port=8086;
porfinder.basePort=port;
porfinder.getPort((err,port)=>{
  if(err)throw err;
  serverPort=port;
  server.listen(serverPort)
  console.log("服务端口为："+serverPort)
})