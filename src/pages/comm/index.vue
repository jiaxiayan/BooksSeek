<template>
<div class="index">
    <div class="comm">
        <div class="comm-list" v-for="item in seekers" :key="item">
            <div class="user-img"><img :src="item.userAvatar" /></div>
            <div class="user-name"><p>{{item.nickName}}</p></div>
            <div class="user-msg"><p>{{item.message}}</p></div>
            <div class="user-time"><p>{{item.time}}</p></div>
            <div class="chat"  @click="chat(item.openId)" v-if="item.openId!==openId"><span class="icon chat">&#xe60e;</span></div>
            <div class="status"><p>状态：<i class="done" v-if="item.status==1">已完成 √</i><i class="jinxing" v-else>进行中 <span class="iconfont">&#xe615;</span></i></p></div>
        </div>
        <div class="comm-edit">
            <input class="comm-info" tpye="text" placeholder="您可以在此处发布消息" v-model="keywords"/>
            <span class="send-btn" @click="send">&#xe617;</span>
        </div>
    </div>
</div>
</template>

<script>
import {getHM,getMDHM,getTimeDiff} from "@/utils/time" 
import fly from '@/utils/fly'
export default {
    data(){
        return{
            seekers:'',
            timeDiff:'',
            getTime:'',
            keywords:'',
            status:'已完成 √',
            openId:'',
        }
    },
    onShow(){
        this.showSeeking()
        this.openId=wx.getStorageSync('openId')
    },
    methods:{
        showSeeking(){
            fly.post('wx/getseeking').then((res)=>{
                this.seekers=res.data.data
                for(let i=0;i<this.seekers.length;i++){
                    let nowtime=getMDHM()
                    let oldtime = this.seekers[i].time
                    let diff = getTimeDiff(oldtime,nowtime)
                    this.seekers[i].time=diff
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
        send(){
            var time = getMDHM()
            if(this.keywords!=''){
                fly.post('wx/uploadseeking',{openId:this.openId,message:this.keywords,nowtime:time}).then((res)=>{
                    wx.showToast({
                        title:'发布成功'
                    })
                    this.keywords=''
                    this.showSeeking()
                })
            }
            
        },
        chat(index){   //fromid 通过获取自身的openid得到
            wx.navigateTo({
                url:"/pages/chat/main?toId="+index
            })
        }
    }
}
</script>

<style lang='scss' scoped>
.index{
    width: 100%;
}
.comm{
    width: 100%;
    height: 100%;
    background: #ececec;
    padding-top: 15%;   
    left: 0;
    position: relative;
    .comm-list{
        width: 96%;
        border-bottom: 1rpx solid #ECECEC;
        min-height: 180rpx;
        position: relative;
        margin:2%;
        background: #ffffff;
        border-radius: 12rpx;
        .user-img{
            width: 120rpx;
            height: 120rpx;
            position: absolute;
            left: 12rpx;
            top: 12rpx;
            img{
                width: 100%;
                height: 100%;
                border-radius: 12rpx;
            }
        }
        .user-name{
            left: 150rpx;
            position: absolute;
            top: 12rpx;
            height: 50rpx;
            font-size: 30rpx;
            font-weight: 500;
            color: rgb(43, 90, 243);
        }
        .user-msg{
            padding: 70rpx 10rpx 10rpx 160rpx;
            position: relative;
            width: 70%;
            height: auto;
            font-size: 30rpx;
            color: rgb(117, 117, 117);
        }
        .user-time{
            padding:25rpx 10rpx 15rpx 150rpx;
            position: relative;
            font-size: 20rpx;
            color:rgb(117, 117, 117);
        }
        .chat{
            right: 25rpx;
            top: 12rpx;
            position: absolute;
        }
        .status{
            right: 25rpx;
            bottom: 12rpx;
            position: absolute;
            font-size: 20rpx;
            p{
                color:rgb(117, 117, 117);
                .done{
                    color: rgb(16, 163, 16);
                    float: right;
                }
                .jinxing{
                    float: right;
                }
            }
        }
    }

}
.comm-edit {
    position: fixed;
    top: 0;  
    left: 0;
    width: 100%;
    height: 90rpx;
    box-sizing: border-box;
    border-top: 1px solid #eee;
    background: #fff;
    padding: 1rpx 250rpx 10rpx 75rpx;
    box-sizing: border-box;
}

.comm-info {
    width: 100%;
    border: 0;
    border-bottom: 1px solid #eee;
    resize: none;
    padding: 9rpx 0rpx;
    font-size: 30rpx;
    color: #666;
    overflow-y: visible;
}

.send-btn {
    padding:0 8rpx;
    color: rgb(225,113,98);
    position: absolute;
    right: 60rpx;
    bottom: 20rpx;
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
  font-size: 20rpx;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.send-btn{
  font-family: "iconfont" !important;
  font-size: 30px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.chat{
  font-family: "iconfont" !important;
  font-size: 28px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
