<template>
  <div class="book-recommand">
    <div class="recommand" v-for="(type,index) in recommandType" :key="index">
      <div class="recommand-title"><p class="title-left">{{type.title}}</p><p class="title-right" @click="showBook(type)">{{type.right}}</p><i class="iconfont" v-if="type.right=='换一换'">&#xe612;</i><i class="more" v-else>&#xe6c1;</i></div>
    <div class="book-list">
      <div class="book-intro" v-for="(item,index_) in type.book" :key="index_" @click="toDetail(item)">
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
    </div>
  </div>
</template>

<script>
import fly from '@/utils/fly'
export default {
  data(){
    return {
      recommandType:[
          {id:'1',title:'为你推荐',right:'换一换',book:'recommandBook'},
          {id:'2',title:'中国文学',right:'更多',book:'literatureBook'},
          {id:'3',title:'人物传记',right:'更多',book:'biographyBook'},
          {id:'4',title:'历史',right:'更多',book:'historyBook'},
          {id:'5',title:'哲学',right:'更多',book:'philosophyBook'},
          {id:'6',title:'小说',right:'更多',book:'novelBook'},
          {id:'7',title:'心理学',right:'更多',book:'psychologyBook'},
          {id:'8',title:'成功励志',right:'更多',book:'motivationBook'},
          {id:'9',title:'经典名著',right:'更多',book:'classicBook'},
          {id:'10',title:'散文',right:'更多',book:'simpleBook'},
          {id:'11',title:'管理',right:'更多',book:'managementBook'},
      ],
      bookInfo:'',
      recommandLimit:[],
      index:'0',      //推荐书籍的指数
    }
  },
  onShow(){
    this.getAllRecommand()
    this.getLiteratureBook()
    this.getBiographyBook()
    this.getHistoryBook()
    this.getPhilosophyBook()
    this.getNovelBook()
    this.getpsychologyBook()
    this.getMotivationBook()
    this.getClassicBook()
    this.getSimpleBook()
    this.getManagementBook()
  },
  methods:{
    toDetail(item){    
      wx.navigateTo({
        url:"/pages/showBook/main?bookInfo="+JSON.stringify(item)
      })
    },
    showBook(index){
      if(index.title=='为你推荐'){
        this.index++
        if(this.index==this.recommandLimit.length){
          this.index=0
        }
        this.getRecommand()
      }else{
        wx.navigateTo({
          url:"/pages/moreBooks/main?book="+index.title
        })
      }
    },
    getAllRecommand(){     
      fly.post('wx/getrecommand',{num:'all'}).then((res)=>{
        for(let i =0;i<Math.ceil(res.data.data.length/3);i++){
          var start = i*3;
          var end=start+3;
          this.recommandLimit.push(res.data.data.slice(start,end))
        }
        this.getRecommand()
      })
    },
    getRecommand(){
       this.recommandType[0].book=this.recommandLimit[this.index]
    },
    getLiteratureBook(){
      fly.post('wx/getliteraturebook',{num:'3'}).then((res)=>{
        this.recommandType[1].book=res.data.data
      })
    },
    getBiographyBook(){
      fly.post('wx/getbiographybook',{num:'3'}).then((res)=>{
        this.recommandType[2].book=res.data.data
      })
    },
    getHistoryBook(){
      fly.post('wx/gethistorybook',{num:'3'}).then((res)=>{
        this.recommandType[3].book=res.data.data
      })
    },
    getPhilosophyBook(){
      fly.post('wx/getphilosophybook',{num:'3'}).then((res)=>{
        this.recommandType[4].book=res.data.data
      })
    },
    getNovelBook(){
      fly.post('wx/getnovelbook',{num:'3'}).then((res)=>{
        this.recommandType[5].book=res.data.data
      })
    },
    getpsychologyBook(){
      fly.post('wx/getpsychologybook',{num:'3'}).then((res)=>{
        this.recommandType[6].book=res.data.data
      })
    },
    getMotivationBook(){
      fly.post('wx/getmotivationbook',{num:'3'}).then((res)=>{
        this.recommandType[7].book=res.data.data
      })
    },
    getClassicBook(){
      fly.post('wx/getclassicbook',{num:'3'}).then((res)=>{
        this.recommandType[8].book=res.data.data
      })
    },
    getSimpleBook(){
      fly.post('wx/getsimplebook',{num:'3'}).then((res)=>{
        this.recommandType[9].book=res.data.data
      })
    },
    getManagementBook(){
      fly.post('wx/getmanagementbook',{num:'3'}).then((res)=>{
        this.recommandType[10].book=res.data.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.book-recommand{
    width: 100%;
    position: relative;
    .recommand{
        margin: 2% 5%;
        width: 90%;
        height: 800rpx;
        position: relative;
        box-shadow:1px 1px 8px 1px rgb(216, 213, 216);
        .recommand-title{
          border-bottom: 3rpx solid rgb(194, 194, 194);
            height: 50rpx;
            background: #fff;
            .title-left{
                font-size: 30rpx;
                padding-top: 10rpx;
                float: left;
                position: absolute;
                left: 12rpx; 
            }
            .title-right{
                font-size: 25rpx;
                padding-top: 10rpx;
                float: left;
                right: 40rpx;
                position: absolute;
                color: rgb(194, 194, 194);
                
            }
            i{
                color: rgb(194, 194, 194);
                font-size: 25rpx;
                padding-top: 15rpx;
                float: left;
                right: 5rpx;
                position: absolute;
            }
        }
        .book-list{
            width: 100%;
            position:relative;
            .book-intro{
              height: 250rpx;
              width: 100%;
              position: relative;
              border-bottom: 1rpx solid #ECECEC;
            }
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
                padding-top: 2%;
                padding-left:270rpx;
                font-size:30rpx;
                position: relative;
                color: rgb(139, 139, 139);
            }
            .book-catalog{
                padding-left: 270rpx;
                padding-top: 2%;
                font-size: 30rpx;
                position: relative;
                color: rgb(139, 139, 139);
            }
            .book-sub1{
                padding-left: 270rpx;
                font-size: 30rpx;
                width: 60%;
                padding-top: 2%;
                position: relative;
                color: rgb(139, 139, 139);
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
.more{
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
