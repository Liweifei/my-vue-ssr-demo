<template>
  <div class="hello">
    <h1>*注意:这里我们进行了数据预取,data原数据为hello,预取后变成了ssr-lwf</h1>
    <img :src="head">
    <h1>{{ msg }}{{userName}}</h1>
  </div>
</template>

<script>
// 动态注册vuex应该这样写
// import { mapState } from "vuex"; // 引入mapState
// import appMainModule from "./store.js";


export default {
  name: 'hello',
  asyncGetData(store,router){//预取数据，这里模拟实现=>设置userName
    return store.dispatch("setInfo","ssr-lwf")
  },

  // 动态注册vuex应该这样写
  // asyncGetData(store, router) {
  //   //注册vuexmodule
  //   return store.dispatch("appMain/getList");
  //   // return store.dispatch('getList')
  // },
  // computed: mapState({
  //   list: state => state.appMain.list // 组件内的每一个属性函数都会获得一个默认参数state, 然后通过state 直接获取它的属性更简洁
  // }),
  // beforeCreate(){//重点，注册vuex时候一定要先于computed完成之前注册（beforeCreate之前），不然找不到这些方法
  //   this.$store.registerModule("appMain", appMainModule);
  // },
  // // 重要信息：当多次访问路由时，
  // // 避免在客户端重复注册模块。
  // destroyed() {
  //   this.$store.unregisterModule("appMain");
  // },
  data () {
    return {
      msg: 'hello',
      head:require("@/assets/headprotrait.jpg")
    }
  },
  computed:{
    //获取预取数据，这里模拟随便设了个name
    userName(){
      return this.$store.state.userInfo.userName
    }
  },
  mounted(){
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
img{
  max-width: 300px;
  display: block;
  margin: auto;
}
</style>
