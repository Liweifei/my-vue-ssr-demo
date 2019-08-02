// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import createRoute from './router'
import createStore from "./store"

Vue.config.productionTip = false

/* eslint-disable no-new */

const createApp=function(){
  //每次请求都获取新实例route
  const router=createRoute();
  const store=createStore();

  const app=new Vue({
    // el: '#app',//记住这里不需要绑,我们是拿到html字符串后手动挂载的
    router,
    store,
    components: { App },
    template: '<App/>'
  })
  return {app,router,store}
}
export default createApp;