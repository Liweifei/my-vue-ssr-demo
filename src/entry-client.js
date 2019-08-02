// 客户端入口文件
//生成vue-ssr-client-manifest.json
//构建打包信息
//处理store状态同步
//将返回字符串挂载到app上面
import createApp from "./main"

const {app,router,store}=createApp();

if(window.__INITTAL_STATE__)store.replaceState(window.__INITTAL_STATE__);//同步vuex状态
//为防止异步组件未加载完全，需要放在ready后执行
router.onReady(() => {
  app.$mount("#app")
})
