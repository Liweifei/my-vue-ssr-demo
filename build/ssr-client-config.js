'use strict'
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./ssr-base-config')
const ssrClientPlugin = require("vue-server-renderer/client-plugin")

const config=merge(baseConfig,{
  plugins:[
    new webpack.optimize.CommonsChunkPlugin({
      name:"manifest",
    }),
    // 此插件在输出目录中
    // 生成 `vue-ssr-client-manifest.json`。
    new ssrClientPlugin()
  ]
})
if(process.env.NODE_ENV=="production"){
  //生产环境下执行 js压缩
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      parallel:true,//多线程进行,提升构建速度
      compress:{
        warnings:false//不启用   删除无用代码时的警告
      }
    })
  )
}
module.exports=config;