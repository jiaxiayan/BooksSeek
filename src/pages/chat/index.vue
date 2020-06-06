<template>
    <div class="chat-bg">
        <scroll-view>
        <div class="chat-box">
            <div class="bubbleDiv" v-for="item in chatlists" :key="item">
                <div v-if="item.toId==myopenid">
                <div class="bubbleItem" >
                    <div class="touser-head"><img :src="toUserAvatar" /></div>
                    <span class="bubble leftBubble">{{item.content}}<span class="topLevel"></span></span>
                </div>
                </div>
                <div v-else>
                    <div class="bubbleItem">
                        <div class="my-avatar"><img :src="myAvatar" /></div>
                        <span class="bubble rightBubble">{{item.content}}<span class="topLevel"></span></span>
                    </div>
                </div>
            </div>
        </div>
        </scroll-view>
        <div class="chat-edit">
            <input class="chat-info" tpye="text" v-model="keywords"/>
            <button class="send-btn" @click="send">发送</button> 
        </div>
    </div>
</template>

<script>
import fly from '@/utils/fly'
import {getHM,getMDHM} from '@/utils/time.js'
export default {
    data(){
        return {
            keywords:'',
            myAvatar:'https://leopord.cn/images/user/getAvatar/2',
            nickName:'none',
            toUserAvatar:'',
            toUserName:'',
            toId:'',
            chatlists:[],
            myopenid:'',
            online:0,
        }
    },
    onLoad(options){   //从url中获取参数ToId
        var atoId=options.toId
        this.toId=atoId
        
    },
    mounted(){
        wx.pageScrollTo({
            scrollTop:3000
        })
        this.messageLoad()
        this.getToUserName()
        this.getMyInfo()
        this.readMessage()
    },
    created(){       //在整个页面加载时就已经完成了
        var that = this
        that.myopenid=wx.getStorageSync('openId')
        //that.messageLoad()
        wx.connectSocket({     //连接socket
            url:'wss://leopord.cn/wss',
        })
        wx.onSocketOpen(function(){})
        wx.onSocketMessage(function(res){
            setInterval(that.show,10000);            //心跳检测
            var message =JSON.parse(res.data)
            switch (message.type){
                case "init": 
                var otherbind='{"type":"bind","fromId":"'+that.myopenid+'"}';   //绑定openid
                wx.sendSocketMessage({data:otherbind})
                if(that.toId!=''){
                    var online = '{"type":"online","toId":"'+that.toId+'","fromId":"'+that.myopenid+'"}';  //第三步，判断对方是否在线
                    wx.sendSocketMessage({data:online})
                }
                
            return;
            case 'text':     //发送端才能调用switch....
                //if(message.toId==that.myopenid){
                    var msg = message.data;  
                    //that.chatlists.push(msg) 
                    that.messageLoad()
                //}
            return;
            case "save":
                that.saveMessage(message)    //将数据持久化
                if(message.isRead==1){
                    that.online=1
                    console.log('通过回调save判断对方在线')
                }else{
                    that.online=0;
                    console.log('通过回调save判断对方不在线')
                }
            return;
            case "online":
                if(message.status==1){
                    that.online=1
                    console.log('通过回调online判断对方在线')
                }else{
                    that.online=0
                    console.log('通过回调online判断对方不在线')
                }
            return;
            }   
   
        })
        
    },
    methods:{
        readMessage(){
            fly.post('wx/updatereadstatus',{fromId:this.toId,toId:this.myopenid}).then((res)=>{
                console.log('已经改变了状态')
            })
        },
        getMyInfo(){
            var that = this
            wx.getUserInfo({          //获取使用者的头像以及昵s称
                success:function(res){
                    that.myAvatar = res.userInfo.avatarUrl
                    that.nickName = res.userInfo.nickName
                }
            })
        },
        getToUserName(){
            var that = this
            wx.request({          //获取聊天对象的信息
                url:'https://leopord.cn/wx/getuserinfo',
                data:{toId:that.toId},
                success:function(res){
                    that.toUserName=res.data.nickName
                    that.toUserAvatar=res.data.userAvatar
                    wx.setNavigationBarTitle({
                        title: that.toUserName,
                        success: function(res) {
                            // success
                        }
                    })
                }
            }) 
        },
        messageLoad(){             //加载聊天信息
            var that=this
            wx.request({
                url:'https://leopord.cn/wx/loadinfo',
                data:{
                    fromId:that.myopenid,
                    toId:that.toId
                },
                success:function(res){
                    that.chatlists=res.data        
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
        send(){   
            if(this.keywords==''){
                return;
            }else{
                var message = '{"data":"'+this.keywords+'","type":"say","fromId":"'+this.myopenid+'","fromName":"'+this.nickName+'","toId":"'+this.toId+'","toName":"'+this.toUserName+'"}';  //第三步，判断对方是否在线
                wx.sendSocketMessage({data:message})
                var time = getHM()
                var shuzu ={fromId:this.myopenid,toId:this.toId,content:this.keywords,time:time,isRead:'0',type:'1'}    //如果需要添加发送其他信息，则需要添加验证
                this.chatlists.push(shuzu);
                this.keywords=''
                setTimeout(() => {     //不加settimeout的话不会显示新增内容
                    wx.pageScrollTo({
                    scrollTop:3000
                })
                }, 200);
            }
        },
        saveMessage(message){
            wx.request({                           //将数据进行持久化
                url:'https://leopord.cn/wx/saveinfo',
                data:message,
                success:function(){
                    //success
                }
            })
        },
        show(){
            var message = '{"type":"ping","data":"heart beading"}'
            wx.sendSocketMessage({
                data:message
            })
        },
    },
}
</script>

<style scoped>
.chat-bg {
    background: #f9fcfd;
    height: 100%;
    position: relative;
}
.chat-box {
    height: 70%;
    position: relative;
    margin-bottom: 15%;
    overflow: scroll;
}
.bubbleDiv {
    width: 94%;
    margin: 0 auto;
    overflow: hidden;  
    padding: 0% 3%;
}
.bubbleItem {
    width: 100%;
    position: relative;
}
.leftBubble {
    position: relative;
    background-color: rgb(230, 232, 233);
    margin-left: 18rpx;
}
.rightBubble {
    position: relative;
    margin-right: 100rpx;
    float: right;
    background-color: #6F83FF;
    color: rgb(248, 247, 247);
}
.bubble {
    line-height: 45rpx;
    border-radius: 15rpx;
    margin-top: 40rpx;
    display: inline-block;
    padding: 0rpx 18rpx;
    font-size: 30rpx;
    margin-left: 90rpx;
}
.leftBubble .topLevel {
    position: absolute;
    top: 18rpx;
    left: -8rpx;
    border-bottom: 10rpx solid rgb(230, 232, 233);
    border-left: 10rpx solid transparent;
}
.rightBubble .topLevel {
    position: absolute;
    top: 18rpx;
    right: -8rpx;
    border-bottom: 10rpx solid #6F83FF;
    border-right: 10rpx solid transparent;
}
.chat-edit {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 90rpx;
    box-sizing: border-box;
    border-top: 1px solid #eee;
    background: #fff;
    padding: 1rpx 250rpx 10rpx 75rpx;
    box-sizing: border-box;
}
.chat-info {
    width: 100%;
    border: 0;
    border-bottom: 1px solid #eee;
    resize: none;
    padding: 9rpx 0rpx;
    font-size: 30rpx;
    color: #666;
    overflow-y: visible;
}
.send-btn {
    padding:0 8rpx;
    border: 0;
    background: #6F83FF;
    color: #fff;
    min-width: 120rpx;
    height: 60rpx;
    font-size: 27rpx;
    border-radius: 7rpx;
    position: absolute;
    right: 78rpx;
    bottom: 15rpx;
}
.uploadImg {
    display: inline-block;
    width: 2.4rem;
    height: 2.4rem;
    background-position: 0 -95px;
    background-size: 2.4rem;
    position: relative;
    z-index: 2;
    position: absolute;
    left: 1rem;
    bottom: 1rem;
}
.touser-head {
    width: 60rpx;
    box-sizing: border-box;
    position: absolute;
    height: 70rpx;
    top: 36rpx;
}
.touser-head img {
    width: 100%;
    border-radius: 12rpx;
    box-sizing: border-box;
    border: 1rpx solid #e5e5e5;
    height: 100%;
}
.my-avatar {
    width: 60rpx;
    box-sizing: border-box;
    position: absolute;
    height: 60rpx;
    top: 36rpx;
    right:0;
}
.my-avatar img {
    width: 100%;
    border-radius: 12rpx;
    box-sizing: border-box;
    border: 1rpx solid #e5e5e5;
    height: 100%;
}
</style>