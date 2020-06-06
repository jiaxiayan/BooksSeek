<template>
    <div class="search-page">
        <div class="search">
            <span class="search-icon">&#xe606;</span>
            <input v-model="keywords" placeholder="请输入关键字"/>
            <p @click="search">搜索</p>
        </div>
        <div v-if="ifDisplay">
        <div class="search-keywords">
            <div class="search-title"><p>热门搜索</p></div>
            <div class="search-item" v-for="item in hots" :key="item.id">
                <p @click="searchExist(item.bookName)">{{item.bookName}}</p>
            </div>
            <div class="search-title"><p>历史搜索</p><span class="delete" @click="deleteRecord">&#xe602;</span></div>
            <div class="search-item" v-for="item in histories" :key="item">
                <p @click="searchExist(item)">{{item}}</p>
            </div>
        </div>
        </div>
        <div class="show-result" v-else>
            <div  v-show="results!==''?true:false">
            <div class="search-result" v-for="(item,index) in results" :key="index" @click="toDetail(item)">
                <div class="books-info-image"><img :src="item.imgSrc" class="books-image"></div>
                <div class="books-info">
                    <div class="books-info-name">书名：{{item.bookName}}</div>
                    <div class="books-info-type">书籍类型：{{item.bookType}}</div>
                    <div class="books-info-belonging">由{{item.nickName}}提供</div>
                </div> 
                <bookDetail :bookInfo='bookInfo' v-if="showDetail"></bookDetail>
            </div>    
            </div>
            <div class="no-result" v-show="results==''?true:false">
                <img src="/static/images/result.jpg" />
            </div>
        </div>
        <div class="page-mask" v-show="showMask" @click="recover"></div>
    </div>
</template>

<script>
import fly from '@/utils/fly'
import bookDetail from '@/components/bookDetail'
export default {
    data(){
        return{
            hots:[],     
            results:[],
            keywords:'',
            ifDisplay:true,
            bookInfo:[],
            showDetail:false,
            showMask:false,
            myOpenId:'',
            history:[],
            histories:[]
        }
    },
    components:{bookDetail},
    onLoad(){
        this.myOpenId=wx.getStorageSync('openId')
        this.hotSearch()
    },
    onShow(){
        this.ifDisplay=true
        this.keywords=''
        this.histories= wx.getStorageSync('history')
    },
    methods:{
        hotSearch(){
            fly.post('wx/hotsearch').then((res)=>{
                this.hots=res.data.data
            }).catch((err)=>{
                console.log(err)
                wx.showToast({
                    title:'未知错误',
                    icon:'none',
                    duration:2000
                })
            })
        },
        search(){  
            if(this.keywords!=''){
                if(this.ifDisplay=true){
                     this.ifDisplay=!this.ifDisplay
                }
                var that = this
                for(let i=0;i<that.histories.length;i++){
                    if(that.keywords===that.histories[i]){
                        return false
                    }
                }  
               that.history.push(that.keywords)
               wx.setStorage({
                    key:'history',
                    data:that.history,
                    success:function(res){
                        that.history=that.history
                        console.log(res)
                    }
                })
                fly.post('wx/searchbook',{keywords:that.keywords}).then((res)=>{
                    that.results=res.data.data
                }).catch((err)=>{
                    console.log(err)
                    wx.showToast({
                        title:'未知错误',
                        icon:'none',
                        duration:2000
                    })
                })
            }else{
                return
            }
        },
        searchExist(value){
            this.keywords=value
            this.search()
        },
        deleteRecord(){
            wx.clearStorage('history')
            this.histories=''
        },
        toDetail(item){
            this.bookInfo=item
            fly.post('wx/updatesearchindex',{id:this.bookInfo.id}).then((res)=>{
                console.log(res)
            }).catch((err)=>{
                console.log(err)
                wx.showToast({
                    title:'未知错误',
                    icon:'none',
                    duration:2000
                })
            })
            this.showDetail=!this.showDetail
            this.showMask=!this.showMask
        },
        recover(){
            this.showMask=!this.showMask
        }
    }
}
</script>

<style lang="scss" scoped>
.search-page{
    width: 100%;
    height:100%;
    .search{
        width: 94%;
        height: 50rpx;
        margin: 3%;
        position: relative;
        span{
            top: 15rpx;
            position: absolute;
            left: 3%;
            width: 30rpx;
            height: 30rpx;
        }
        input{
            width: 70%;
            height: 100%;
            padding-left: 10%;
            border: none;
            background: rgb(241, 241, 241);
            border-radius: 10rpx;
            font-size: 30rpx;
        }
        p{
            color:rgb(225,113,98);
            position: absolute;
            width: 100rpx;
            top: 3%;
            right: 0;
        }
    }
    
    
    .search-keywords{
        padding: 30rpx;
        .search-title{
            padding-left: 20rpx;
            margin-top: 40rpx;
            margin-bottom: 20rpx;
            border-bottom: 2px solid rgb(175, 175, 175);
            p{
                color: rgb(175, 175, 175);
                font-size: 30rpx;
                padding-bottom: 15rpx;
            }
            .delete{
                padding-left: 75%;
                top: 420rpx;
                color: rgb(175, 175, 175);
                font-size: 30rpx;
                position: absolute;
            }
        }
        .search-item{
            display: inline-block;
            padding: 10rpx;
            border: 1px solid #ccc;
            border-radius: 15rpx;
            background-color: #fbfbfb;
            margin: 0 30rpx 10rpx 0;
            color: #555;
            p{
                font-size: 30rpx;
                color: rgb(175, 175, 175);
            }
        }
    }
    .show-result{
        width: 100%;
        position: relative;
        .search-result{
            width: 96%;
            margin: 3% 0 2% 2%;
            box-shadow:1px 1px 8px 1px rgb(216, 213, 216);
            font-size: 30rpx;
            height: 300rpx;
            .books-info-image{
                padding: 3% 3%;
                width:40%;
                float: left;
                position: absolute;
                .books-image{
                    width: 80%;
                    height: 260rpx;
                }
            }
            .books-info{
                left: 45%;
                padding-top: 6%;
                position: absolute;
                .books-info-name{
                    color: #333;
                    font-size: 36rpx;
                    font-weight: 700;
                    margin-bottom: 20rpx;
                }
                .books-info-type{
                    color: #333;
                    width: 300rpx;
                    height: 60rpx;
                    line-height: 50rpx;
                }
                .books-info-belonging{
                    width: 300rpx;
                    height: 60rpx;
                    line-height: 50rpx;
                    margin-bottom: 10rpx;
                }
            }
        }
        .no-result{
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
.delete {
  font-family: "iconfont" !important;
  font-size: 18px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.search-icon {
  font-family: "iconfont" !important;
  font-size: 17px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
