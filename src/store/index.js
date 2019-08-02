import Vuex from "vuex"
import Vue from "vue"

Vue.use(Vuex);

const createStore=function(){
    let userInfo={
        state:{
            userName:"lwf"
        },
        mutations:{
            setInfo(state,name){
                state.userName=name
            }
        },
        actions:{
            setInfo({commit},name){
                commit("setInfo",name)
            }
        }
    }
    return new Vuex.Store({
        modules:{
            userInfo:userInfo
        }
    })
}

export default createStore;