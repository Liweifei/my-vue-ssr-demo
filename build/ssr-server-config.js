'use strict'
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./ssr-base-config')
const ssrServerPlugin = require("vue-server-renderer/server-plugin")
const nodeExternals = require('webpack-node-externals')

baseConfig.module.rules[0].options = ''// 服务端去除打包css的配置
const config=merge(baseConfig,{
  entry:{
    app:"./src/entry-server.js"
  },
  output:{
    libraryTarget: 'commonjs2'//大致意思就是，在打包后生成文件的时候以commonJs的格式写入写出（比如，定义了个访问，打包之后的写法是exports aaa;require("aaa")()）
  },
  // 这允许 webpack 以 Node 适用方式(Node-appropriate fashion)处理动态导入(dynamic import)，
  // 并且还会在编译 Vue 组件时，
  // 告知 `vue-loader` 输送面向服务器代码(server-oriented code)。
  // 重点就是告诉用于服务端的
  // https://webpack.js.org/configuration/externals/#function
  // https://github.com/liady/webpack-node-externals
  // 外置化应用程序依赖模块。可以使服务器构建速度更快，
  // 并生成较小的 bundle 文件。
  target:"node",
  externals: nodeExternals({
    // 这个库为所有node_modules名称扫描node_modules文件夹，并且构建扩展函数，告诉web pack不要捆绑这些模块或它们的任何子模块
    // 不要外置化 webpack 需要处理的依赖模块。
    // 你可以在这里添加更多的文件类型。例如，未处理 *.vue 原始文件，
    // 你还应该将修改 `global`（例如 polyfill）的依赖模块列入白名单
    // 我们将 CSS 文件列入白名单。这是因为从依赖模块导入的 CSS 还应该由 webpack 处理。
    // 如果你导入依赖于 webpack 的任何其他类型的文件（例如 *.vue, *.sass），那么你也应该将它们添加到白名单中
    whitelist: /\.css$/
  }),
  devtool:"source-map",
  plugins:[
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    // 这是将服务器的整个输出
    // 构建为单个 JSON 文件的插件。
    // 默认文件名为 `vue-ssr-server-bundle.json`
    new ssrServerPlugin()
  ]
})
module.exports=config;