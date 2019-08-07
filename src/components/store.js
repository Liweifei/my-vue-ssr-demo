import axios from "../../tools/axiosTool"

export default {
  namespaced: true,//使用方法需要带上路径，如appAddItem/getList
  // 重要信息：state 必须是一个函数，
  // 因此可以创建多个实例化该模块
  state: {
    list: [],
  },
  getters:{
  },
  mutations: {
    getList(state) {
      //获取饭店列表
      axios
      .get("/restaurant/list")
      .then(function(response) {
        if (response.data.type) {
          state.list = response.data.data.map(item => {
            item.selected = false;
            return item;
          });
        } else {
          self.$message({
            type: "error",
            message: response.data.msg
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
    }
  },
  actions: {
    getList({ commit }) {
      commit("getList")
    }
  }
}