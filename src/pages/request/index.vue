<template>
    <div class="my-request">
        <div class="title"><p>我的请求 <span class="request-title">&#xe68c;</span></p></div>
        <div class="request-list" v-if="requestList!=''">
            <div class="request" v-for="item in requestList" :key="item">
                <div class="request-message"><p>内容：{{item.message}}</p></div>
                <div class="request-status"><p>状态：<i class="wancheng" v-if="item.status==1">已完成 √</i><i class="jinxing" v-else>进行中 <span class="iconfont">&#xe615;</span></i></p></div>
                <div class="request-time"><p>{{item.time}}</p></div>
                <div class="btns">
                    <div class="btn-update"><button @click="done(item.msgid)" :class="item.status==1?'done':'undone'" :disabled="item.status==1">完成</button></div>
                    <div class="btn-delete"><button @click="deleteRequest(item.msgid)">删除</button></div>
                </div>
                
            </div>
        </div>
        <div class="none-request" v-else>
            <img src="/static/images/request.jpg" />
        </div>
    </div>
</template>

<script>
import fly from '@/utils/fly'
import {getHM,getMDHM,getTimeDiff} from "@/utils/time" 
export default {
    data(){
        return{
            requestList:[],
            openId:''
        }
    },
    onLoad(){
        var that = this
        that.openId = wx.getStorageSync('openId')
    },
    onShow(){
        this.getMyRequest()
    },
    methods:{
        getMyRequest(){
            fly.post('wx/getmyrequest',{openId:this.openId}).then((res)=>{
                if(res.data.code==1){
                    this.requestList=res.data.data
                    for(let i=0;i<this.requestList.length;i++){
                    let nowtime=getMDHM()
                    let oldtime = this.requestList[i].time
                    let diff = getTimeDiff(oldtime,nowtime)
                    this.requestList[i].time=diff
                }
                }
            }).catch((err)=>{
                console.log(err)
                wx.showToast({
                    title:'未知错误',
                    icon:'none',
                    duration:2000
                })
            })
        },
        deleteRequest(index){
            fly.post('wx/deleterequest',{data:index}).then((res)=>{
                if(res.data.code==1){
                    wx.showToast({
                        title:'删除成功',
                        duration:2000
                    })
                    this.getMyRequest()
                }
            }).catch((err)=>{
                console.log(err)
                wx.showToast({
                    title:'删除出错，请重试',
                    icon:'none',
                    duration:2000
                })
            })
        },
        done(index){
            fly.post('wx/updaterequest',{data:index}).then((res)=>{
                if(res.data.code==1){
                    wx.showToast({
                        title:'已完成',
                        duration:2000
                    })
                    this.getMyRequest()
                }
            }).catch((err)=>{
                console.log(err)
                wx.showToast({
                    title:'更新错误，请重试',
                    icon:'none',
                    duration:2000
                })
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.my-request{
    width: 100%;
    .title{
        width: 100%;
        padding-top: 3%;
        height: 50rpx;
        padding-left: 3%;
        position: relative;
        padding-bottom:2%;
        border-bottom: 1rpx solid #ECECEC;
        p{
            font-size:40rpx;
            color: #6A6A6A;
        }
    }
    .request-list{
        width: 100%;
        position: relative;
        margin-top: 40rpx;
        height: 100%;
        .request{
            padding-top: 25rpx;
            width: 96%;
            min-height: 190rpx;
            margin: 2% 2%;
            position: relative;
            box-shadow:1px 1px 8px 1px rgb(216, 213, 216);
            border-radius: 12rpx;
            font-size: 25rpx;
            color: rgb(117, 117, 117);
            .request-message{
                padding: 5rpx 0 15rpx 20rpx; 
                position: relative;
                height: auto;
                font-size: 35rpx;
                font-weight: 500;
            }
            .request-status{
                padding: 5rpx 0 15rpx 20rpx ;
                position: relative;
                width: 200rpx;
                p{
                    .wancheng{
                        float:right;
                        color: rgb(16, 163, 16);
                    }
                    .jinxing{
                        float: right;
                    }
                }
                
            }
            .request-time{
                padding: 5rpx 0 15rpx 20rpx; 
                position: relative;
                
            }
            .btns{
                position: relative;
                padding: 10rpx 0 10rpx 300rpx;
                height: 70rpx;
                .btn-update{
                    width: 130rpx;
                    height: 30rpx;
                    position: absolute;
                    left: 60%;
                    .undone{
                        font-size: 30rpx;
                        background: rgb(225,113,98);
                        color:white;
                    }
                   .done{
                        font-size: 30rpx;
                    }
                }
                .btn-delete{
                    width: 130prx;
                    height: 30rpx;
                    position: absolute;
                    left: 80%;
                    button{
                        font-size: 30rpx;
                        background: #666; 
                        color:white;
                    }
                }
            }
        }
    }
    .none-request{
        padding-top: 90rpx;
        width: 500rpx;
        padding-left:15%;
        height: 600rpx;
        img{
            width: 100%;
            height: 100%;
        }
    }
}
@font-face {
  font-family: 'iconfont';
  src: url('../../../static/icon/iconfont.eot');
  src: url('../../../static/icon/iconfont.eot?#iefix') format('embedded-opentype'),
      url('../../../static/icon/iconfont.woff2') format('woff2'),
      url('../../../static/icon/iconfont.woff') format('woff'),
      url('../../../static/icon/iconfont.ttf') format('truetype'),
      url('../../../static/icon/iconfont.svg#iconfont') format('svg');
}
.iconfont {
  font-family: "iconfont" !important;
  font-size: 25rpx;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.request-title {
  font-family: "iconfont" !important;
  font-size: 40rpx;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
