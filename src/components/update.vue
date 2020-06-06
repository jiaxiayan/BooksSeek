<template>
  <div class="upload">
    <div class="book-image">
      <img :src="tempFilePaths " />
    </div>
    <div class="book-info">
      <div class="book-info-name">
        <p>书名：<input type="text" v-model="bookName" autocomplete="off"/></p>
      </div>
      <div class="book-info-type">
        <p>书籍类型：<input type="text" v-model="bookType" autocomplete="off" disabled/>
        </p>
        <div class="select_list" v-show="ifShow">
            <p v-for="item in typeList" :key="item.id" @click="select(item.value)">{{item.value}}</p>
        </div>
      </div>
      <div class="book-info-author">
        <p>作者：<input type="text" v-model="author" autocomplete="off"/></p>
      </div>
      <div class="book-info-intro">
        <p>简介：<textarea v-model="intro" autocomplete="off"/></p>
      </div>
      <div class="btn">
        <button @click="upload">确定</button>
      </div>
    </div>
  </div>
</template>

<script>
import fly from '@/utils/fly'
import  util from '@/utils/util.js'
export default {
    props:['bookInfo'],
    data(){
      return{
        tempFilePaths:'',
        bookName:'',
        bookType:'',
        author:'',
        intro:'',
        picSrc:'',
        bookInfo:[],
        id:'',
      }
    },
    mounted(){
        this.tempFilePaths=this.bookInfo.imgSrc
        this.bookName=this.bookInfo.bookName
        this.bookType=this.bookInfo.bookType
        this.author=this.bookInfo.author
        this.intro=this.bookInfo.intro
    },
  methods: {
    upload(){
    var that = this
    fly.post('wx/updatebook',{id:that.bookInfo.id,bookName:that.bookName,bookType:that.bookType,author:that.author,intro:that.intro}).then((res)=>{
        if(res.data.code==1){
            wx.showToast({
                title:'更新成功'
            })
            this.$emit('close')
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
    radioChange(e){
      this.radiovalue=e.target.value
    },
  },
}
</script>

<style lang="scss" scoped>
.upload{
  width: 96%;
  height: 96%;
  margin: 2%;
  position: absolute;
  box-shadow:1px 1px 8px 1px rgb(216, 213, 216);
  z-index: 999;
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
          border: none;
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
        input{
          border: none
        }
      }
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
</style>
