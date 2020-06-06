<template>
    <div class="more-book">
        <div class="book-intro" v-for="(item,index) in bookInfo" :key="index" @click="toDetail(item)">
        <div class="book-img">
          <img :src="item.imgSrc" />
        </div>
        <div class="book-title">
          <p>书名：{{item.title}}</p>
        </div>
        <div class="book-catalog">
          <p>分类目录：{{item.catalog}}</p>
        </div>
        <div class="book-sub1">
          <p>简介：{{item.sub1}}</p>
        </div>
      </div>
    </div>
</template>

<script>
import fly from '@/utils/fly'
export default {
    data(){
      return{
        book:'',
        bookInfo:''
      }
    },
    onLoad(options){ 
        this.book=options.book
    },
    mounted(){
        this.showAll()
    },
    methods:{
        showAll(){
            if(this.book=='中国文学'){
                fly.post('wx/getliteraturebook',{num:'all'}).then((res)=>{
                    this.bookInfo=res.data.data
                })
            }
            if(this.book=='人物传记'){
                fly.post('wx/getbiographybook',{num:'all'}).then((res)=>{
                    this.bookInfo=res.data.data
                })
            }
            if(this.book=='历史'){
                fly.post('wx/gethistorybook',{num:'all'}).then((res)=>{
                    this.bookInfo=res.data.data
                })
            }
            if(this.book=='哲学'){
                fly.post('wx/getphilosophybook',{num:'all'}).then((res)=>{
                    this.bookInfo=res.data.data
                })
            }
            if(this.book=='小说'){
                fly.post('wx/getnovelbook',{num:'all'}).then((res)=>{
                    this.bookInfo=res.data.data
                })
            }
            if(this.book=='心理学'){
                fly.post('wx/getpsychologybook',{num:'all'}).then((res)=>{
                    this.bookInfo=res.data.data
                })
            }
            if(this.book=='成功励志'){
                fly.post('wx/getmotivationbook',{num:'all'}).then((res)=>{
                    this.bookInfo=res.data.data
                })
            }
            if(this.book=='经典名著'){
                fly.post('wx/getClassicbook',{num:'all'}).then((res)=>{
                    this.bookInfo=res.data.data
                })
            }
            if(this.book=='散文'){
                fly.post('wx/getsimplebook',{num:'all'}).then((res)=>{
                    this.bookInfo=res.data.data
                })
            }
            if(this.book=='管理'){
                fly.post('wx/getmanagementbook',{num:'all'}).then((res)=>{
                    this.bookInfo=res.data.data
                })
            }
        },
        toDetail(item){
            wx.navigateTo({
                url:"/pages/showBook/main?bookInfo="+JSON.stringify(item)
            })
        }
    }
}
</script>

<style lang='scss' scoped>
.more-book{
    width: 100%;
    position: relative;
    .book-intro{
        height: 250rpx;
        width: 100%;
        position: relative;
        border-bottom: 1rpx solid #ECECEC;
        .book-img{
            width: 200rpx;
            height: 220rpx;
            padding: 2%;
            position: absolute;
            img{
                width: 100%;
                height: 100%;
            }
        }
        .book-title{
            left: 270rpx;
            padding-top: 2%;
            font-size: 30rpx;
            position: absolute;color: rgb(139, 139, 139);
        }
        .book-catalog{
            left: 270rpx;
            padding-top: 9%;
            font-size: 30rpx;
            position: absolute;color: rgb(139, 139, 139);
        }
        .book-sub1{
            left: 270rpx;
            font-size: 30rpx;
            width: 60%;
            padding-top: 16%;
            position: absolute;color: rgb(139, 139, 139);
        }
    }
}
</style>
