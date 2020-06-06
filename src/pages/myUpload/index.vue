<template>
    <div class="myupload">
        <div v-show="ifshow">
        <div class="intro"><p>我的上传 <span class="iconfont">&#xf0024;</span></p></div>
        <div class="upload-books" v-if="booklists!=''">
            <div class="upload-book" v-for="item in booklists" :key="item.id">
                <div class="upload-book-image"><img :src="item.imgSrc" /></div>
                <div class="upload-book-bookName"><p>书名：{{item.bookName}}</p></div>
                <div class="upload-book-author"><p>作者：{{item.author}}</p></div>
                <div class="upload-book-bookType"><p>书籍类型：{{item.bookType}}</p></div>
                <div class="upload-book-bookIntro"><p>简介：{{item.intro}}</p></div>
                <div class="btns">
                    <div class="btn-update"><button @click="updateBook(item)">修改</button></div>
                    <div class="btn-delete"><button @click="deleteBook(item.id)">删除</button></div>
                </div>
            </div>
        </div>
        <div class="none-book" v-else>
            <img src="/static/images/uploadbook.jpg" />
        </div>
        </div>
        <update :bookInfo="showwhich" v-if="showUpdate" @close="hideUpdate"></update>
    </div>
</template>

<script>
import update from '@/components/update'
import fly from '@/utils/fly'
export default {
    components:{update},
    data(){
        return{
            booklists:[],
            openId:'',
            showwhich:'',
            showUpdate:false,
            ifshow:true,
        }
    },
    onLoad(){
        var that = this
        that.openId = wx.getStorageSync('openId')
        
    },
    onShow(){
        this.getMyupload()
    },
    methods:{
        getMyupload(){
            fly.post('wx/myupload',{openId:this.openId}).then((res)=>{
                if(res.data.code==1){
                    this.booklists=res.data.data
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
        updateBook(index){
            this.showUpdate=!this.showUpdate
            this.ifshow=!this.ifshow
            this.showwhich=index
        },
        hideUpdate(){
            this.getMyupload()
            this.ifshow=!this.ifshow
            this.showUpdate=!this.showUpdate
        },
        deleteBook(index){
            fly.post('wx/deletebook',{data:index}).then((res)=>{
                if(res.data.code==1){
                    wx.showToast({
                        title:'删除成功',
                        duration:2000
                    })
                    this.getMyupload()
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
    }
}
</script>

<style lang="scss" scoped>
.myupload{
    width: 100%;
    .intro{
        width: 100%;
        padding-top: 3%;
        height: 60rpx;
        padding-left: 3%;
        position: relative;
        border-bottom: 1rpx solid #ECECEC;
        p{
            font-size:40rpx;
            color: #6A6A6A;
        }
    }
    .upload-books{
        width: 100%;
        position: relative;
        margin-top: 40rpx;
        height: 100%;
        .upload-book{
            padding-top: 25rpx;
            width: 96%;
            min-height: 360rpx;
            margin: 2% 2%;
            position: relative;
            box-shadow:1px 1px 8px 1px rgb(216, 213, 216);
            border-radius: 12rpx;
            color: rgb(117, 117, 117);
            .upload-book-image{
                position: absolute;
                top: 20rpx;
                left: 20rpx;
                width: 34%;
                height: 300rpx;
                img{
                    width: 260rpx;
                    height: 300rpx;
                    box-shadow:1px 1px 8px 1px rgb(216, 213, 216);
                }
            }
            .upload-book-bookName{
                position: relative;
                padding-left: 300rpx;
                padding-top: 10rpx;
                padding-bottom: 10rpx;
                height: auto;
                font-size: 30rpx; 
            }
            .upload-book-author{
                position: relative;
                padding-left: 300rpx;
                padding-top: 10rpx;
                padding-bottom: 10rpx;
                height: auto;
                font-size: 30rpx; 
            }
            .upload-book-bookType{
                position: relative;
                padding-left: 300rpx;
                padding-top: 10rpx;
                padding-bottom: 10rpx;
                height: auto;
                font-size: 30rpx; 
            }
            .upload-book-bookIntro{

                position: relative;
                padding-left: 300rpx;
                padding-top: 10rpx;
                padding-bottom: 10rpx;
                font-size: 30rpx; 
                width: 400rpx;
            }
            .btns{
                padding-left: 300rpx;
                padding-top: 10rpx;
                padding-bottom: 10rpx;
                height: 70rpx;
                position: relative;
                .btn-update{
                    position: absolute;
                    left: 60%;
                    width: 130rpx;
                    height: 50rpx;
                    button{
                        font-size: 30rpx;
                        background: rgb(225,113,98);
                        color:white;
                    }
                }
                .btn-delete{
                    position: absolute;
                    left: 80%;
                    width: 130prx;
                    height: 50rpx;
                    button{
                        font-size: 30rpx;
                        background: #666; 
                        color:white;
                    }
                }
            }
            
        }
    }
    .none-book{
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
  font-size: 40rpx;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
