// 服务端配置入口文件
//构建生成ssr所需要的vue-ssr-server-bundle.json
//处理数据预取
//根据访问路径匹配出所需要展示的html字符串
import createApp from "./main"

export default context => {
  // 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
  // 以便服务器能够等待所有的内容在渲染前，
  // 就已经准备就绪。
  return new Promise((resolve,reject)=>{
    const {app,router,store}=createApp();

    let url=context.url;//获取访问url
    router.push(url);//push对应访问路径 更新路由url

    router.onReady(()=>{
      let matchComponents=router.getMatchedComponents();//获取匹配的路由
      if(!matchComponents){//如果没有匹配的路由
        reject({code:404})
      }
      
      //如果有匹配的路由,则查看是否需要数据预取
      //注意，客户端数据预取只会匹配首路由，也就是/，也就是正常来说都是首页或者登录页啥的，其它界面的数据预取都是要靠客户端预取做的
      Promise.all(matchComponents.map(c=>{
        // 如果存在需要数据预取的fucntion则执行调用
        console.log("预取匹配:")
        console.log(c.asyncGetData);
        return c.asyncGetData && c.asyncGetData(store,router);
      })).then(()=>{
        context.state=store.state;//数据预取传送到客户端进行同步;vue-ssr-server-render 会占用state给window.__INITIAL_STATE__

        resolve(app)
      }).catch(()=>{
        reject
      })
    })
  })
}