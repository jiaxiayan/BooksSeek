<template>
  <div class="login">
    <img src="/static/images/book.jpg" />
    <div class="login-info">
      <h1>欢迎使用广工书友小程序</h1>
      <p>您可以在这里发布求书信息、交友以及查看图书馆内的书籍信息</p>
      <button open-type="getUserInfo" @getuserinfo="bindGetUserInfo">微信授权</button>
    </div>
  </div>
</template>
 
<script>
import  util from '@/utils/util.js'
import fly from '@/utils/fly'
export default {
  data(){
    return{
      userInfo:'',
      avatarUrl:''
    }
  },
  onShow(){
    var openId = wx.getStorageSync('openId')
    if(openId){
        wx.switchTab({
            url:'/pages/index/main'
        })
    }
  },
  methods:{
    bindGetUserInfo(e){        
      var that = this
      if(e.mp.detail.userInfo){
        that.userInfo=e.mp.detail.userInfo
        wx.login({
          success:function(res){
            /*
            wx.request({
              url:'https://leopord.cn/wxlogin/login',
              data:{
                code:res.code
              },
              success:function(resid){
                wx.setStorageSync('openId',resid.data.openid);
                that.saveUser(that.userInfo.nickName,that.userInfo.avatarUrl,resid.data.openid)
                wx.switchTab({
                  url:'/pages/index/main'
                })
              }
            })
            */
           fly.post('wxlogin/login',{code:res.code}).then((resid)=>{
             wx.setStorageSync('openId',resid.data.openid)
             fly.post('wx/checkuser').then((response)=>{
               var result=response
               if(result==''){
                 that.saveUser(that.userInfo.nickName,that.userInfo.avatarUrl,resid.data.openid)
               }
             })
             wx.switchTab({
               url:'/pages/index/main'
             })
           })
          },
          fail:function(err){
            wx.showToast({
              title:'登陆失败，请重试',
              icon:'none',
              duration:2000
            })
          }
        })
      }else{
        wx.showModal({
          title:'warning',
          content:'拒绝授权，将无法访问小程序，点击确定重新获取授权',
          success:function(res){
            if(res.confirm){
              wx.openSetting({
                success:(res)=>{
                  if(res.authSetting['scope.userInfo']){
                    wx.login({
                      success:function(res_login){
                        if(res_login.code){
                          wx.getUserInfo({
                            withCredentials:true,
                            success:function(res_user){
                              that.userInfo=JSON.parse(res_user.rawData)
                              /*
                              wx.request({
                                url:'https://leopord.cn/wxlogin/login',
                                data:{
                                  code:res_login.code,
                                },
                                success:function(resid){
                                  wx.setStorageSync('openId',resid.data.openid);
                                  that.saveUser(that.userInfo.nickName,that.userInfo.avatarUrl,resid.data.openid)
                                  wx.switchTab({
                                    url:'/pages/index/main'
                                  })
                                }
                              })
                              */
                            fly.post('wxlogin/login',{code:res_login.code}).then((resid)=>{
                              wx.setStorageSync('openId',resid.data.openid);
                              fly.post('wx/checkuser').then((response)=>{
                                var result=response
                                if(result==''){
                                  that.saveUser(that.userInfo.nickName,that.userInfo.avatarUrl,resid.data.openid)
                                }
                              })
                              wx.switchTab({
                                url:'/pages/index/main'
                              })
                            })
                            },
                            fail:function(err){
                              wx.showToast({
                                title:'登陆失败，请重试',
                                icon:'none',
                                duration:2000
                              })
                            }
                          })
                        }
                      }
                    })
                  }
                }
              })
            }
          }
        })
      }
    },
    saveUser(nickname,avatarurl,openid){
      /*
      wx.request({
        url:'https://leopord.cn/wx/uploaduser',
        data:{nickName:nickname,userAvatar:avatarurl,openId:openid},
        success:function(){
          console.log("成功保存用户")
        },
      })
      */
      fly.post('wx/uploaduser',{nickName:nickname,userAvatar:avatarurl,openId:openid}).then((res)=>{
        console.log("成功保存用户")
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.login{
  width: 100%;
  height: 100%;
  background-color: #eee;
  position: absolute;
  z-index: 999;
  img{
    top: 20%;
    height: 500rpx;
    width: 80%;
    left: 10%;
    position: absolute;
    z-index: 1;
    opacity: 0.2;
    border-radius: 20rpx;
  }
  .login-info{
    top: 20%;
    height: 500rpx;
    width: 80%;
    left: 10%;
    position: absolute;
    z-index: 999;
    border-radius: 20rpx;
    box-shadow:1px 1px 8px 1px rgb(216, 213, 216);
    h1{
      padding-top: 50rpx;
      padding-left:25rpx;
      font-size: 50rpx;
    }
    p{
      padding-top: 80rpx;
      padding-left: 20rpx;
      width: 90%;
      font-size: 35rpx;
      color: rgb(122, 122, 122);
    }
    button{
      margin-top: 80rpx;
      width: 250rpx;
      height: 100rpx;
      background:rgb(225,113,98);
      color: white;
      font-size: 40rpx;
    }
  }
}
</style>