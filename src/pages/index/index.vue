<template>
  <div class="index">
    <Authorize @close="close" v-if="ifShow" id="authorize"/>
    <div class="search">
      <div><p>{{position}}</p></div>
      <div @click="tosearch">
        <input type="text" placeholder="搜索图书"  />
        <span class="icon iconfont">&#xe606;</span>
      </div>
    </div>
    <div class="hot-recommand">
      <div class="p"><p>热门推荐</p></div>
      <div class="carousel-img">
        <swiper class="swiper-container" autoplay="true" circular="true" duration="500" previous-margin='50px' next-margin='50px'>
          <block v-for="(item,index) in images" :key="index">
            <swiper-item class="swiper-item" @click="toDetail(item)">
              <div class="box">
                <img :src="item.imgSrc" />
                <div class='content'>
                  {{item.bookName}}
                </div>
              </div>
            </swiper-item>
          </block>
        </swiper>
      </div>
    </div>
    <div class="select">
      <div class="sort-list">
        <div class="sort" @click="selectType">
          <span class="type">&#xe6c0;</span>  全部类型
        </div>
      </div>
    </div>
      <div class="chose-type" v-if="choseType">
        <div class="type">
          <div class="single-type" @click="changeType('全部')" :class="['全部'==type?'active':'']"><p>全部</p></div>
          <div class="single-type" @click="changeType('个人')" :class="['个人'==type?'active':'']"><p>个人</p></div>
          <div class="single-type" @click="changeType('图书馆')" :class="['图书馆'==type?'active':'']"><p>图书馆</p></div>
        </div> 
        <div class="book-container">
          <p class="direction">书籍种类：</p>
          <div class="book-type">
            <div class="single-book-type" @click="changeBooktype('全部')" :class="['全部'==booktype?'active':'']"><p>全部</p></div>
            <div class="single-book-type" @click="changeBooktype('小说')" :class="['小说'==booktype?'active':'']"><p>小说</p></div>
            <div class="single-book-type" @click="changeBooktype('传记')" :class="['传记'==booktype?'active':'']"><p>传记</p></div>
            <div class="single-book-type" @click="changeBooktype('教材')" :class="['教材'==booktype?'active':'']"><p>教材</p></div>
            <div class="single-book-type" @click="changeBooktype('计算机')" :class="['计算机'==booktype?'active':'']"><p>计算机</p></div>
            <div class="single-book-type" @click="changeBooktype('其他')" :class="['其他'==booktype?'active':'']"><p>其他</p></div>
          </div>
        </div>
        <div class="btn">
          <button class="reset" @click="reset">重置</button>
          <button class="confirm" @click="select">筛选</button>
        </div>
      </div>
      <div class="booksList">
        <div class="books-list" v-for="(item,index) in booklist" :key="index" @click="toDetail(item)">
          <div class="books-info-image"><img :src="item.imgSrc" class="books-image"></div>
          <div class="books-info">
            <div class="books-info-name">{{item.bookName}}</div>
            <div class="books-info-type">书籍类型：{{item.bookType}}</div>
            <div class="books-info-belonging">由{{item.nickName}}提供</div>
          </div> 
        </div>
      </div>
    <bookDetail :bookInfo='bookInfo' @recover="showDetail=!showDetail" v-if="showDetail"></bookDetail>
    <div class="page-mask" v-show="showMask" @click="recover"></div>
  </div>
</template>

<script>
import fly from '@/utils/fly'
import amapFile from '../../utils/amap-wx'
import {mapState,mapMutations} from "vuex"
import Authorize from '@/components/authorize'
import bookDetail from '@/components/bookDetail'      
export default {
  data () {
    return {
      type:'全部',
      booktype:'全部',
      choseType:false,
      showMask:false,
      showDetail:false,
      bookInfo:[],
      images:[],
      booklist:[],
      ifShow:true
    }
  },
  // 定位
  computed:{
    ...mapState(['position'])
  },
  onLoad(){
    this.getPosition()
    var openId = wx.getStorageSync('openId')
    if(openId){
      this.close()
    }
  },
  onShow(){
    this.showRecommandBooks()
    this.showallbooks()
  },
  onReachBottom(){
    this.getMoreBooks()
  },
  async onPulldownRefresh(){
    this.showallbooks()
    wx.stopPullDownRefresh()
  },
  components:{bookDetail,Authorize},
  methods:{
    ...mapMutations(['update']),
    showRecommandBooks(){
      fly.post('wx/showrecommandbooks').then((res)=>{
        this.images=res.data.data
      }).catch((err)=>{
        console.log(err)
        wx.showToast({
          title:'未知错误',
          icon:'none',
          duration:2000
        })
      })
    },
    showallbooks(){
      fly.post('wx/showallbooks').then((res)=>{
        this.booklist=res.data.data
      }).catch((err)=>{
        console.log(err)
        wx.showToast({
          title:'未知错误',
          icon:'none',
          duration:2000
        })
      })
    },
    getMoreBooks(){
      wx.showLoading({
        title:'加载中'
      })
      fly.post('wx/showmorebooks',{startNum:this.booklist.length}).then((res)=>{
        this.booklist=this.booklist.concat(res.data.data)
        wx.hideLoading()
      }).catch((err)=>{
        console.log(err)
        wx.showToast({
          title:'未知错误',
          icon:'none',
          duration:2000
        })
      })
    },
    toMap(){/*
      var that = this;
      wx.getSetting({
        success(res){
          if(!res.authSetting['scope.userLocation']){
            wx.openSetting({
              success:res=>{
                that.getPosition();
              }
            })
          }else{
            wx.navigateTo({
              url:'/pages/map/main'
            })
          }
        }
      })*/
    },
    getPosition(){
      var that = this
      var myMapFun = new amapFile.AMapWX({
        key:'e545e7f79a643f23aef187add14e4548'
      })
      myMapFun.getRegeo({
        success:function(data){
          that.update({position:data[0].regeocodeData.formatted_address});
        },
        fail:function(info){
          wx.showToast({
            title:info,
            icon:'none',
            duration:2000
          })
          that.position = "定位中",
          that.update({position:'定位中'})
        }
      })
    },
    tosearch(){
      wx.navigateTo({
        url:'/pages/search/main'
      })
    },
    selectType(){
      this.choseType=!this.choseType
      this.showMask=!this.showMask
    },
    recover(){   //
      this.showMask=!this.showMask
      if(this.choseType==true){
        this.choseType=!this.choseType
      }
    },
    changeType(type){
      if(this.type==type){
        this.type=""
      }else{
        this.type=type;
      }
    },
    changeBooktype(type){
      if(this.booktype==type){
        this.booktype=""
      }else{
        this.booktype=type;
      }
    },
    toDetail(item){
      this.bookInfo=item
      this.showDetail=!this.showDetail
      this.showMask=!this.showMask
    },
    reset(){
      this.type=''
      this.booktype=''
    },
    select(){
      var that = this
      fly.post('wx/selectbook',{belonging:that.type,bookType:that.booktype}).then((res)=>{
        this.booklist=res.data.data
      }).catch((err)=>{
        wx.showToast({
          title:err,
          icon:'none',
          duration:2000
        })
      })
      this.choseType=!this.choseType
    },
    close(){
      this.ifShow=false
    }
  }
}
</script>

<style lang="scss" scoped>

.index {
  width: 100%;
  overflow: hidden;
  position: relative;
  height: 100%;
  font-family: PingFangSC-Regular, sans-serif;
  #authorize{
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
  .search {
    width: 100%;
    box-sizing: border-box;
    padding: 0 25rpx 0 10rpx;
    position: relative;
    top: 0;
    z-index: 2;
    height: 80rpx;
    display: flex;
    align-items: center;
    background: #eee;

    div:nth-child(1) {
      width: 200rpx;
      background-color: rgb(82, 81, 81);
      opacity: 0.7;
      border-radius: 25%;
      height: 50rpx;
      text-align: center;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 20rpx;
      margin-left: 20rpx;
      color: rgb(218, 213, 213);
      p{
        padding-top: 13rpx;
        
      }
    }
    div:nth-child(2) {
      flex: 1;
      position: relative;
      input {
        width: 75%;
        height: 56rpx;
        margin-left: 80rpx;
        border-radius: 8rpx;
        background: #fff;
        box-sizing: border-box;
        padding-left: 60rpx;
      }
      .icon {
        position: absolute;
        background-size: 100%;
        color: rgb(155, 155, 155);
        width: 28rpx;
        height: 28rpx;
        left: 90rpx;
        top: 15rpx;
        z-index: 999;
      }
  }
  }
  .hot-recommand{
    width: 100%;
    height: 550rpx;
    position: relative;
    top:10rpx;
    .p{
      width: 90%;
      margin: 0 5%;
      border-bottom: 1rpx solid #ECECEC;
      p{
        text-align: center;
        font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
        font-weight: 300;
      }
    }
    .carousel-img{
      width:90%;
      margin-left:5%;
      margin-right:5%;
      margin-top: 5rpx;
      height: 450rpx;
      box-sizing: border-box;
      .swiper-container{
        width:100%;
        height:100%;
        .box{
          width: 90%;
          height:400rpx;
          display: inline-block;
          margin-top: 10rpx;
          box-sizing: border-box;
          position:relative;
          top:45%;
          transform:translateY(-45%);
          img{
            height: 90%;
            width: 100%;
          }
          .content{
            font-size: 35rpx;
            text-align: center;
          }
        }
      }
    }
  }
  .select{
    width: 250rpx;
    position: relative;
    .sort-list{
      border-top-right-radius: 25rpx;
      justify-content: space-around;
      display: flex;
      background: white;
      width: 100%;
      height: 80rpx;
      font-size: 27rpx;
      text-indent: 50rpx;
      color: #6A6A6A;
      align-content: center;
      border: 1rpx solid #ECECEC;
      .sort{
        margin: auto 0;
        height: 30rpx;
        line-height: 30rpx;
        border-right: 1rpx solid #ECECEC;
        flex: 1;
        .sort-active{
          color: black;
          font-weight:800;
        }
      }
    }
  }
  .chose-type{
    position: absolute;
    top:710rpx;
    width:100%;
    height:auto;
    background: #ffffff;
    z-index: 999;
    border-top: 1rpx solid #eee;
    .type{
      position:relative;
      margin-top: 20rpx;
      margin-left:50rpx;
      font-size: 30rpx;
      width: 100%; 
      height: 50rpx;     
      .single-type{
        width: 150rpx;
        height: 50rpx;
        background: #b8b5b5;
        float: left;
        margin: 15rpx;
        border-radius: 25rpx;
        p{
          padding-top: 3rpx;
          color: black;
          text-align: center;
        }
      }
    }
      .single-type.active{
        background: rgb(225,113,98);
        p{
          padding-top: 3rpx;
          color: white
        }
      }
    .book-container{
      margin: 40rpx;
      width: 100%;
      height: 170rpx;
      position: relative;
      .direction{
        color: #6A6A6A;
        font-size: 35rpx;
      }
      .book-type{
        .single-book-type{
          width: 200rpx;
          height: 50rpx;
          font-size: 30rpx;
          background: #b8b5b5;
          text-align: center;
          float: left;
          margin: 15rpx;
          border-radius: 25rpx;
          p{
            padding-top: 3rpx;
            color: black;
          }
        }
        .single-book-type.active{
          background: rgb(225,113,98);
          p{
            padding-top: 3rpx;
            color: white;
          }
        }
      }
    }
    .btn{
      width:100%;
      height: 70rpx;
      position: relative;
     
      .reset{
        width:130rpx;
        height: 100%;
        float:right;
        margin:5rpx;
        border-radius: 25rpx;
        background-color: #666; 
        color:white;
        font-size: 30rpx;
      }
      .confirm{
        width: 130rpx;
        height: 100%;
        float:right;
        margin: 5rpx;
        border-radius: 25rpx;
        background-color: rgb(225,113,98);
        color:white;
        font-size: 30rpx;
      }
    }
  }
  .booksList{
    padding-top: 0rpx;
    position: relative;
    border-top: 1rpx solid #ECECEC;
  .books-list{
    font-size: 25rpx;
    display :flex;
    width: 100%;
    height: 200rpx;
    padding: 10rpx;   
    border-bottom: 1rpx solid #ECECEC;
    color: #6D6D6D;
    justify-content: space-between;
    .books-info-image{
      margin: 20rpx 30rpx;
      .books-image{
      width: 160rpx;
      height: 160rpx;
      }
    }
    .books-info{
      margin:15rpx 50rpx;;
      flex:1;
      .books-info-name{
        color: #333;
        font-size: 36rpx;
        font-weight: 700;
        margin-bottom: 10rpx;
      }
      .books-info-type{
        color: #333;
        display: flex;
        width: 300rpx;
        height: 50rpx;
        line-height: 50rpx;
      }
      .books-info-belonging{
        display: flex;
        width: 300rpx;
        height: 50rpx;
        line-height: 50rpx;
      }
    }
  }
  }
.page-mask{    
  width: 100%;
  height: 100%;
  position: fixed;
  top:0;
  left:0;
  z-index: 100;
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
.type {
  font-family: "iconfont" !important;
  font-size: 15px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
