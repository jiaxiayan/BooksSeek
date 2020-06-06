import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store =new Vuex.Store({      //需要随时改变的值就用Vuex存储，不然就可以直接用setStorageSync存储
    state:{
        position:'定位中',
        storeData:{}
    },
    mutations:{
        update(state,config){
            Object.keys(config).map((item,key)=>{
                state[item] = config[item]
            })
        }
    }
})

export default store;