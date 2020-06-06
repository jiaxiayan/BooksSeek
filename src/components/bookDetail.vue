<template>
<div class="showdetail">
    <div class="close" @click="close">x</div>
    <div class="bookDetail">
        <div class="book-info-image"><img :src="bookInfo.imgSrc" /></div>
        <div class="book-info">
            <div class="book-info-name">书名：{{bookInfo.bookName}}</div>
            <div class="book-info-type">书籍类型：{{bookInfo.bookType}}</div>
            <div class="book-info-author">作者：{{bookInfo.author}}</div>
            
        </div>
        <div class="book-info-intro">简介：{{bookInfo.intro}}</div>
    </div>
    <div class="line"></div>
    <div class="uploader">
        <div class="intro">上传者信息:</div>
        <div class="uploader-image"><img :src="bookInfo.userAvatar" /></div>
        <div class="uploader-info">
            <div class="uploader-info-nickName">昵称：{{bookInfo.nickName}}</div>
            <div class="uploader-info-uploadBooks" >上传书籍：{{uploadBooks}}</div>
        </div>
        <div class="chat" @click="chat(bookInfo.openId)" v-if="bookInfo.nickName!=='图书馆'&&bookInfo.openId!==openId"><span class="icon iconfont">&#xe60e;</span></div>
    </div>
</div>
</template>

<script>
import fly from '@/utils/fly'
export default {
    props:['bookInfo'],
    data(){
        return {
            uploadBooks:'',
            openId:''
        }
    },
    methods:{
        chat(index){
            wx.navigateTo({
                url:"/pages/chat/main?toId="+index
            })
        },
        close(){
            this.$emit('recover');
        }
    },
    created(){
        fly.post('wx/showopeniduploadbooks',{openId:this.bookInfo.openId}).then((res)=>{
            this.uploadBooks=res.data.data
            if(this.uploadBooks.length>2){
                this.uploadBooks=this.uploadBooks.splice(0,2)+' 等'
            }
        }).catch((err)=>{
            console.log(err)
            wx.showToast({
                title:'未知错误',
                icon:'none',
                duration:2000
            })
        })
        this.openId=wx.getStorageSync('openId')
    }
}
</script>

<style lang="scss" scoped>
.showdetail{
    top: 10%;
    left: 10%;
    width: 80%;
    right: 10%;
    height: 85%;
    font-size: 27rpx;
    position: fixed;
    z-index: 999;
    background: white;
    box-shadow:1px 1px 8px 1px rgb(216, 213, 216);
    .close{
        top: 5rpx;
        left: 90%;
        font-size: 40rpx;
        position: absolute;
        color: rgb(214, 214, 214);
        z-index: 999;
    }
    .bookDetail{
        height: 60%;
        width: 90%;
        position: relative;
        margin: 25rpx;
        background:white;
        border-bottom: 1rpx solid #ECECEC;
        .book-info-image{
            width: 60%;
            padding-top: 5%;
            padding-left: 5%;
            position: relative;
            img{
                width: 200rpx;
                height: 200rpx;
                float: left;         
            }
        }
        .book-info{
            width: 50%;
            margin-top:20rpx;
            margin-left:20rpx;
            height: 200rpx;
            float: left;
            position: relative;
            div{
                min-height: 30rpx;
                padding-bottom:12rpx;
            }
        }
        .book-info-intro{
            //padding: 0 5%;
            padding-top: 20rpx;
            padding-left: 5%;
            padding-right: 5%;
            min-height: 100rpx;
            height: 250rpx;
            overflow:scroll;
        }
    }
    .uploader{
        height: 25%;
        width: 85%;
        margin-left:5%;
        background:white;
        .intro{
            padding-top:22rpx;
        }
        .uploader-image{
            padding-top: 8%;
            width: 20%;
            float: left;
            img{
                border-radius: 50%;
                box-shadow:1px 1px 8px 1px rgb(216, 213, 216);
                width: 120rpx;
                height: 120rpx;
                float: left;
            }
        } 
        .uploader-info{
            padding-top:12%;
            width: 250rpx;
            margin-left:50rpx;
            float: left;
        }
        .chat{
            padding-top: 8%;
            width: 20%;
            float: left;
        }
    }
}
@font-face {
  font-family: 'iconfont';
  src: url('../../static/icon/iconfont.eot');
  src: url('../../static/icon/iconfont.eot?#iefix') format('embedded-opentype'),
      url('../../static/icon/iconfont.woff2') format('woff2'),
      url('../../static/icon/iconfont.woff') format('woff'),
      url('../../static/icon/iconfont.ttf') format('truetype'),
      url('../../static/icon/iconfont.svg#iconfont') format('svg');
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 28px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>