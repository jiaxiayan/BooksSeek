<template>
    <div class="book-list">
        <div class="book-img"><img :src="bookInfo.imgSrc" /></div>
        <div class="book-info">
            <div class="book-name">书名：<p>{{bookInfo.title}}</p></div>
            <div class="book-catalog">分类目录：<p>{{bookInfo.catalog}}</p></div>
            <div class="book-tags">标签：<span>{{bookInfo.tags}}</span></div>
            <div class="book-sub1">简介：<p>{{bookInfo.sub1}}</p></div>
        </div>
        <div class="line"></div>
        <div class="book-sub2">
            <scroll-view>
            详情：<div style="white-space: pre-wrap;">{{bookInfo.sub2}}</div>
            </scroll-view>
        </div>
    </div>
</template>

<script>
export default {
    data(){
      return{
        bookInfo:''
      }
    },
    onLoad(options){   //数据库文章展示不会转义换行符
        this.bookInfo=JSON.parse(options.bookInfo)
        wx.setNavigationBarTitle({
            title: this.bookInfo.title,
            success: function(res) {
                // success
            }
        })
    },
}
</script>

<style lang='scss' scoped>
.book-list{      
    font-family:-apple-system-font,Helvetica Neue,sans-serif;
    width: 90%;
    height: auto;
    margin:0 5%;
    top: 15rpx;
    position: relative;
    background: white;  
    .book-img{
        width: 210rpx;
        height: 240rpx;
        float: left;
        position: relative;
        img{
            width: 100%;
            height: 100%
        }
    }
    .book-info{
        position: relative;
        padding-left:100rpx;
        .book-name{
            padding-top:15rpx;
            padding-left: 100rpx;
            font-size: 30rpx;
            color: rgb(139, 139, 139);
            p{
                color: rgb(0, 0, 0);
                display: inline;
            }
        }
        .book-catalog{
            padding-top:15rpx;
            padding-left: 30rpx;
            font-size: 30rpx;
            color: rgb(139, 139, 139);
            p{
                color: rgb(0, 0, 0);
                display: inline;
                position: relative;
            }
        }
        .book-tags{
            padding-top:15rpx;
            padding-left: 30rpx;
            font-size: 30rpx;
            color: rgb(139, 139, 139);
            position: relative;
            span{
                color: rgb(0, 0, 0);
                display: inline;
            }
        }
        .book-sub1{
            padding-top:15rpx;
            padding-left: 30rpx;
            font-size: 30rpx;
            color: rgb(139, 139, 139);
            position: relative;
            p{
                color: rgb(0, 0, 0);
                display: inline;
            }
        }
    }
    .line{
        height: 2rpx;
        border-bottom: 1rpx solid rgb(228, 228, 228);
        padding-left: 5%;
        width: 90%;
        padding-top: 5%;
    }
    .book-sub2{
        padding-top:15rpx;
        padding-left: 30rpx;
        font-size: 30rpx;
        color: rgb(139, 139, 139);
        position: relative;
        div{
            color: rgb(29, 29, 29);
        }
    }
}
</style>
