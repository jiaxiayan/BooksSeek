import Vue from 'vue'
var Fly=require("flyio/dist/npm/wx.js")
var fly=new Fly();

fly.interceptors.request.use((config,promise)=>{

    config.headers["X-Tag"]="flyio";
    return config;
})

Vue.prototype.$http=fly
fly.config.baseURL="https://leopord.cn/"

export default fly
