<template>
  <div class="info">
    <div class="user-intro">
      <div class="user-avatar"><img :src="avatarUrl" /></div>
      <div class="user-nickName"><p>{{nickName}}</p></div>
    </div>
    <div class="show-nums">
      <div class="user-upload" @click="myUpload"><p>我的上传</p><p class="upload-nums">{{uploads}}</p></div>
      <div class="user-msg" @click="myMsgs"><p>消息</p><p class="msg-nums">{{msgs}}</p></div>
      <div class="new-message" v-show="msgs!=0"></div>
      <div class="comm" @click="comm"><p>历史发布</p><p class="comm-nums">{{requests}}</p></div>
    </div>
    <div class="user-info">
      <p class="intro">个人信息</p>
      <div class="user-info-form">
        <div class="user-info-nickname"><p>昵称：{{nickName}}</p></div>
        <div class="user-info-address"><p>地址：{{position}}</p></div>
        <div class="user-info-upload"><button @click="upload">上传</button></div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState,mapMutations} from "vuex"
import fly from '@/utils/fly'
export default {
  data(){
    return{
      uploads:'0',
      msgs:'0',
      requests:'0',
      avatarUrl:'',
      nickName:'',
      openId:'',
    }
  },
  computed:{
    ...mapState(['position'])
  },
  onLoad(){
    var that = this
    wx.getUserInfo({
      success:function(res){
        that.avatarUrl = res.userInfo.avatarUrl
        that.nickName = res.userInfo.nickName
      }
    })
    this.openId = wx.getStorageSync('openId')
  },
  onShow(){
    this.showMyuploadNum()
    this.showMessageNum()
    this.showMyRequestNum()
  },
  methods:{
    showMyuploadNum(){
      fly.post('wx/myuploadnum',{openId:this.openId}).then((res)=>{
        this.uploads=res.data
      }).catch((err)=>{
        console.log(err)
        wx.showToast({
          title:'未知错误',
          icon:'none',
          duration:2000
        })
      })
    },
    showMessageNum(){
      fly.post('wx/getallnoreadnum',{toId:this.openId}).then((res)=>{
        this.msgs=res.data
      }).catch((err)=>{
        console.log(err)
        wx.showToast({
          title:"未知错误",
          icon:'none',
          duration:2000
        })
      })
    },
    showMyRequestNum(){
      fly.post('wx/getmyrequestnum',{openId:this.openId}).then((res)=>{
        this.requests=res.data
      }).catch((err)=>{
        console.log(err)
        wx.showToast({
          title:'未知错误',
          icon:'none',
          duration:2000
        })
      })
    },
    myUpload(){
      wx.navigateTo({
        url:"/pages/myUpload/main"
      })
    },
    myMsgs(){
      wx.navigateTo({
        url:'/pages/message/main'
      })
    },
    upload(){
      wx.navigateTo({
        url:"/pages/upload/main"
      })
    },
    comm(){
      wx.navigateTo({
        url:'/pages/request/main'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.info{
  width: 96%;
  height: 96%;
  margin: 2% 2%;
  box-shadow:1px 1px 8px 1px rgb(216, 213, 216);
  position: absolute;
  .user-intro{
    width: 100%;
    height: 30%;
    position: relative;
    .user-avatar{
      padding-left: 10%;
      padding-top: 5%;
      height: 250rpx;
      width: 40%;
      float: left;
      img{
        width: 100%;
        height: 100%;
        float: left;
        border-radius: 50%;
        box-shadow:1px 1px 10px 1px rgb(216, 213, 216);
      }
    }
    .user-nickName{
      width: 45%;
      margin: -18% 55%;
      float: left;
    }
  }
  .show-nums{
    display: block;
    width: 80%;
    height: 60rpx;
    padding: 2% 0;
    margin: 0 10%;
    position: relative;
    border-bottom: 1rpx solid #ECECEC;
    .user-upload{
      width: 30%;
      padding-left: 5%;
      float: left;
      p{
        text-align: center;
        font: 100;
        font-size: 25rpx;
        color: rgb(117, 117, 117);
      }
    }
    .user-msg{
      width: 30%;
      float: left;
      p{
        text-align: center;
        font-size: 25rpx;
        font: 100;
        color: rgb(117, 117, 117);
      }
    }
    .comm{
      width: 30%;
      float: left;
      p{
        text-align: center;
        font: 100;
        font-size: 25rpx;
        color: rgb(117, 117, 117);
      }
    }
    .new-message{
      width:13rpx;
      height: 13rpx;
      border-radius: 50%;
      background: red;
      position: absolute;
      top:16%;
      left:55%;
    }
  }
  .user-info{
    position: relative;
    margin-top: 5%;
    width: 80%;
    height:40%;
    padding: 0 10%; 
    p{
      font: 100;
      padding-left: 2%;
    }
    .user-info-form{
      margin-top: 5%; 
      box-shadow:1px 1px 8px 1px rgb(216, 213, 216);
      width:100%;
      height: 100%;
      .user-info-nickname{
        padding-left:3%;
        padding-top: 3%; 
        height: 20%;
        width: 80%;
        margin: 0 10%;
        border-bottom: 1rpx solid #ECECEC;
        position: relative;
        p{
          padding: 15rpx;
          color: rgb(117, 117, 117);
        }
      }
      .user-info-address{
        padding-left:3%;
        padding-top: 3%; 
        height: 20%;
        width: 80%;
        margin: 0 10%;
        position: relative;
        p{
          padding: 15rpx;
          color: rgb(117, 117, 117);
        }
      }
      .user-info-upload{
        padding-top: 15%;
        width: 80%;
        position:relative;
        button{
          width: 150rpx;
          height: 90rpx;
          float: right;
          background: rgb(225,113,98);
          color:white;
          p{
            font: 100;
            font-size: 18rpx;
          }
        }
      }
    }
  }
}
</style>
