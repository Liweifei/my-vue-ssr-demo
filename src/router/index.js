import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const createRoute = function () {
  return new Router({
    routes: [
      {
        path: '/',
        name: 'HelloWorld',
        component: ()=>import("@/components/HelloWorld")
      },
      {
        path: '/ssr',
        name: 'ssr',
        component: ()=>import("@/components/ssr")
      },
      {
        path: '*',
        name: 'notFind',
        component: ()=>import("@/components/notFind")
      }
    ]
  })
}

export default createRoute

