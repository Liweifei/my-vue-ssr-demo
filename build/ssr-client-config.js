'use strict'
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const baseConfig = require('./ssr-base-config')
const ssrClientPlugin = require("vue-server-renderer/client-plugin")

const config=merge(baseConfig,{
  plugins:[
    // 全局变量
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name:"manifest",
    }),
    // 此插件在输出目录中
    // 生成 `vue-ssr-client-manifest.json`。
    new ssrClientPlugin(),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: "static",
        ignore: ['.*']
      }
    ])
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