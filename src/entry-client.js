// 客户端入口文件
//生成vue-ssr-client-manifest.json
//构建打包信息
//处理store状态同步
//将返回字符串挂载到app上面
import Vue from 'vue'
import createApp from "./main"

const {app,router,store}=createApp();

//客户端数据预取
//全局混入beforeRouteEnter方法去查看是否取药预取
Vue.mixin({
  beforeRouteEnter (to, from, next) {
    console.log('beforeRouteEnter')
	next((vm)=>{
	    const { asyncGetData } = vm.$options
	    if (asyncGetData) {
			asyncGetData(vm.$store, vm.$route).then(next).catch(next)
	    } else {
			next()
	    }
	})

  }
})

if(window.__INITIAL_STATE__)store.replaceState(window.__INITIAL_STATE__);//同步vuex状态
//为防止异步组件未加载完全，需要放在ready后执行
router.onReady(() => {
  app.$mount("#app")
})
