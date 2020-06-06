<template>
  <div class="upload">
    <div class="book-image">
      <img :src="tempFilePaths " @click="auth" catchTap="chooseImageTap" mode="aspectFit" />
    </div>
    <div class="book-info">
      <div class="book-info-name">
        <p>书名：<input type="text" v-model="bookName" autocomplete="off"/></p>
      </div>
      <div class="book-info-type">
        <p>书籍类型：
          <picker @change="bindCasPickerChange" v-model='typeIndex' :range="typeList" >
            <text>{{typeList[typeIndex]}}</text>
          </picker>
        </p>
      </div>
      <div class="book-info-author">
        <p>作者：<input type="text" v-model="author" autocomplete="off"/></p>
      </div>
      <div class="book-info-intro">
        <p>简介：<textarea v-model="intro" autocomplete="off"/></p>
      </div>
      <div class="btn">
        <button @click="upload">上传</button>
      </div>
    </div>
  </div>
</template>

<script>
//
import axios from 'axios'
import fly from '@/utils/fly'
import  uploadImg from '@/utils/uploadfile.js';
import  util from '@/utils/util.js'
import {mapState,mapMutations} from "vuex"       
export default {
  data(){
    return{
      tempFilePaths:'/static/tabs/upload.jpg',
      uploadfileurl:'',
      bookName:'',
      author:'',
      intro:'',
      picSrc:'',
      typeList:['请选择','小说','传记','教材','计算机','其他'],
      typeIndex:0
    }
  },
  computed:{
    ...mapState(['position'])
  },
  methods: {
    bindCasPickerChange(e){
      this.typeIndex=e.mp.detail.value
    },
    auth(){
      var that=this
      wx.showActionSheet({
        itemList:['从手机相册选择','拍照'],
        success:function(res){
          if(!res.cancel){
            if(res.tapIndex==0){
              that.chooseWxImage('album')
            }else if(res.tapIndex==1){
              that.chooseWxImage('camera')
            }
          }
        },
        fail:function(err){
          console.log(err)
          wx.showToast({
            title:'未知错误',
            icon:'none',
            duration:2000
          })
        }
      })
    },
    chooseWxImage: function (type) {
      var that = this;
      wx.chooseImage({
        sizeType: ['original', 'compressed'],
        sourceType: [type],
        success: function (res) {
          that.tempFilePaths = res.tempFilePaths
          var nowTime = util.formatTime(new Date());
          uploadImg(that.tempFilePaths[0],'testImages/'+nowTime+'/',    //检测图片是否合格先将图片存储至oss中的testImages中
          function(result){
            that.picSrc=result
            wx.showLoading({
              title:'检测中'
            })
            fly.post('images/test',{image:that.picSrc}).then((res)=>{
              wx.hideLoading();
                var resdata=res.data.results;
                for(let i = 0;i<resdata.length;i++){
                  if(resdata[i].name=='hege'){
                    var hegerate=resdata[i].score
                  }
                  if(resdata[i].name=='[default]'){
                    var defaultrate=resdata[i].score
                  }
                  if(resdata[i].name=='buhegeyuanyin2_bushitushu'){
                    var buhegerate=resdata[i].score
                  }
                }
                if(hegerate>=0.7){
                  if(defaultrate<=0.4){
                    if(buhegerate<=0.3){
                      wx.showToast({
                        title:'图片符合'
                      })
                    }
                  }
                }else{
                  wx.showToast({
                    title:'图片不符合,请重新选择',
                    icon:'none',
                    duration:2000
                  })
                  that.tempFilePaths='/static/tabs/upload.jpg'
                }
            }).catch((err)=>{
              console.log(err)
              wx.showToast({
                title:'上传出错',
                icon:'none',
                duration:2000
              })
            })
          }),function(result){
            console.log('上传失败',result);
          }
        }
      })
    },
    reset(){
      this.tempFilePaths='/static/tabs/upload.jpg'
      this.picSrc=''
      this.bookName=''
      this.typeIndex=0
      this.author=''
      this.intro=''
    },
    upload(){    //需要添加地址以及用户信息后才能完成
      var that = this
      var openid = wx.getStorageSync('openId')
      if(that.tempFilePaths!=='/static/tabs/upload.jpg'){
        if(that.bookName!==''){
          if(that.typeIndex!==0){
            if(that.author!==''){
              wx.showLoading({
                title:'上传中'
              })
              fly.post('wx/uploadbooks',{
                openId:openid,bookName:that.bookName,imgSrc:that.picSrc,bookType:that.typeList[that.typeIndex],author:that.author,intro:that.intro,address:that.position,belonging:'个人'
              }).then((res)=>{
                wx.hideLoading()
                wx.navigateTo({
                  url:'/pages/myUpload/main'
                })
                that.reset()
              })
            }else{
              wx.showToast({
                title:'请输入作者',
                icon:'none',
                duration:2000
              })
            }
          }else{
            wx.showToast({
              title:'请选择书籍类型',
              icon:'none',
              duration:2000
           })
          }
        }else{
          wx.showToast({
            title:'请输入书名',
            icon:'none',
            duration:2000
          })
        }
      }else{
        wx.showToast({
          title:'请上传图片',
          icon:'none',
          duration:2000
        })
      }  
    },
  }
}
</script>

<style lang="scss" scoped>
.upload{
  width: 96%;
  height: 96%;
  margin: 2%;
  position: absolute;
  box-shadow:1px 1px 8px 1px rgb(216, 213, 216);
  .book-image{
    padding:5% 15%;
    width: 350rpx;
    height: 320rpx;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .book-info{
    margin: 3% 3%;
    width: 80%;
    height: 60%;
    position: relative;
    .book-info-name{
      padding: 3%;
      width: 100%;
      height: 10%;
      border-bottom: 1rpx solid #ECECEC;
      p{
        font-size: 30rpx;
        input{
          border: none
        }
      }
    }
    .book-info-type{
      padding: 3%;
      width: 100%;
      height: 10%;
      font-size: 30rpx;
      border-bottom: 1rpx solid #ECECEC;
      p{
        font-size: 30rpx;
      }
      /*
      .select_name{
        width: 150rpx;
        background: rgba(230, 226, 226, 0.952);
        p{
          padding-left: 20rpx;
          i{
            float:right;
          }
        }
      }
      .select_list{
        width: 150rpx;
        background: rgba(230, 226, 226, 0.952);
        position: absolute;
        z-index: 99;
        p{
          padding-left: 20rpx;
        }
      }*/
    }
    .book-info-author{
      padding: 3%;
      width: 100%;
      height: 10%;
      border-bottom: 1rpx solid #ECECEC;
      p{
        font-size: 30rpx;
        input{
          border: none
        }
      }
    }
    .book-info-intro{
      padding: 3%;
      width: 100%;
      height: 10%;
      p{
        font-size: 30rpx;
        textarea{
          width: 100%;
          height: 200rpx;
          border:1px solid #ECECEC;
        }
      }
    }
   .btn{
      padding: 38% 4% 4%;
      float: right;
      height: 60rpx;
      width: 150rpx;
      text-align: center;
      position: relative;
      button{
        font-size: 25rpx;
        color: #ffffff;
        background: rgb(225,113,98);
        color:white;
      }
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
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
