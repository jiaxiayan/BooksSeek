<template>
    <div class="message">
        <div v-if="lists!==''">
        <div class="message-list" v-for="item in lists" :key="item.id" @click="chat(item.fromId)">
            <div class="user-image"><img :src="item.imgSrc" /><p class="new-nums" v-show="item.countNoread!=0">{{item.countNoread}}</p></div>
            <div class="user-nickname"><p>{{item.fromName}}</p></div>
            <div class="user-msg"><p  style="text-overflow:ellipsis;">{{item.lastMessage}}</p></div>
            <div class="user-msg-time"><p>{{item.time}}</p></div>
        </div>
        </div>
        <div class="nomsg" v-else>
            <img src="/static/images/nomsg.jpg" />
        </div>
    </div>
</template>

<script>
import fly from '@/utils/fly'
export default {
    data(){
        return{
            lists:[]
        }
    },
    methods:{
        chat(index){
            wx.navigateTo({
                url:'/pages/chat/main?toId='+index
            })
        },
        getUnReadList(){
            var openId = wx.getStorageSync('openId')
            fly.post('wx/getunreadlist',{openId:openId}).then((res)=>{
                var list=res.data
                for(let i =0;i<list.length;i++){
                    list[i].time=this.TimeStamp(list[i].time)
                }
                this.lists=list
            }).catch((err)=>{
                console.log(err)
                wx.showToast({
                    title:'未知错误',
                    icon:'none',
                    duration:2000
                })
            })
        },
        TimeStamp(value){
            var timestamp = new Date(value*1000)
            var year = timestamp.getFullYear()
            var month = timestamp.getMonth()+1;     //month +1
            var day=timestamp.getDate();
            var hour = timestamp.getHours();
            var mins=timestamp.getMinutes()
            var sec = timestamp.getSeconds()
            return year+"/"+month+'/'+day+' '+hour+':'+mins+':'+sec;
        }
    },
    onShow(){
        this.getUnReadList()
    }
}
</script>

<style lang="scss" scoped>
.message{
    width: 100%;
    position:relative;
    .nomsg{
        padding-top: 90rpx;
        width: 500rpx;
        padding-left:15%;
        height: 600rpx;
        img{
            width: 100%;
            height: 100%;
        }
    }
    .message-list{
        width: 100%;
        height: 160rpx;
        border-bottom: 2px solid rgb(82, 81, 81);
        position: relative;
        .user-image{
            padding: 2% 2% 0 3% ; 
            width: 120rpx;
            height: 130rpx;
            img{
                width: 100%;
                height: 100%;
                box-shadow:1px 1px 8px 1px rgb(216, 213, 216);
                border-radius: 12rpx;
            }
            .new-nums{
                width: 30rpx;
                height: 30rpx;
                border-radius: 50%;
                background: red;
                color: white;
                font-weight: 200;
                position: absolute;
                top: 8%;
                left: 140rpx;
                text-align: center;
                font-size: 25rpx;
            }
        }
        .user-nickname{
            position: absolute;
            top: 10%;
            left: 25%;
            font-size: 35rpx;
            p{
                font-weight: 400;
            }
        }
        .user-msg{
            position: absolute;
            top: 50%;
            left: 25%;
            width: 50%;
            font-size: 30rpx;
            height: 40rpx;
            p{
                font-weight: 300;
                width: 100%;
                height: 100%;
                text-overflow:ellipsis;
                overflow:hidden;
                white-space: nowrap; 
            }
        }
        .user-msg-time{
            position: absolute;
            top: 10%;
            right: 3%;
            font-size: 20rpx;
            color:rgb(82, 82, 82);
            p{
                font-weight: 300;
            }
        }
    }
}
</style>
