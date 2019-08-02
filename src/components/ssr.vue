<template>
  <div class="hello">
    <h1>*注意:这里我们进行了数据预取,data原数据为hello,预取后变成了ssr-lwf</h1>
    <img :src="head">
    <h1>{{ msg }}{{userName}}</h1>
  </div>
</template>

<script>
export default {
  name: 'hello',
  asyncGetData(store,router){//预取数据，这里模拟实现=>设置userName
    return store.dispatch("setInfo","ssr-lwf")
  },
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
