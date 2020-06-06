export function getHM(){
    var time = new Date()    //获取时间戳，显示用户聊天记录的时间
    var month = time.getMonth()+1;
    var day=time.getDate();
    var hour = time.getHours();
    var mins=time.getMinutes()
    var sec = time.getSeconds()
    return hour+':'+mins+":"+sec;
  }
export function getMDHM(){
    var time = new Date()    //获取时间戳，显示用户聊天记录的时间
    var year = time.getFullYear()
    var month = time.getMonth()+1;     //month +1
    var day=time.getDate();
    var hour = time.getHours();
    var mins=time.getMinutes()
    var sec = time.getSeconds()
    return year+"/"+month+'/'+day+' '+hour+':'+mins+':'+sec;
  }
  export function getTimeDiff(oldtime,newtime){
      
      var timediff = new Date(newtime).getTime()-new Date(oldtime).getTime();   //获取时间差的毫秒数
      var minDiff=Math.floor(timediff/(60*1000))      //获取总共的分钟差
      var hourDiff = Math.floor(timediff/(60*1000*60));    //时钟差
      var dayDiff = Math.floor(timediff/(60*1000*60*24));
      var weekDiff = Math.floor(timediff/(60*1000*60*24*7));
      var monthDiff = Math.floor(timediff/(60*1000*60*24*30));
      var yearDiff = Math.floor(timediff/(60*1000*60*24*365));
      var result = null
      if(timediff<0){
        return
      }
      if(minDiff==0){
        result = '刚刚'
      }else if(minDiff>=1 && minDiff<=60){
        result =" "+parseInt(minDiff)+"分钟前"
      }else if(hourDiff>=1 && hourDiff<=24){
        result =" "+parseInt(hourDiff)+"小时前"
      }else if(dayDiff>=1&&dayDiff<=6){
        result =" "+parseInt(dayDiff)+"天前"
      }else if(weekDiff>=1&&weekDiff<=4){
        result = " "+parseInt(weekDiff)+"星期前"
      }else if(monthDiff>=1&&monthDiff<=12){
        result =" "+parseInt(monthDiff)+'月前'
      }else if(yearDiff>=1){
        result = " "+parseInt(yearDiff)+"年前"
      }
      return result
  }
  export default {
    getHM,getMDHM,getTimeDiff
  }