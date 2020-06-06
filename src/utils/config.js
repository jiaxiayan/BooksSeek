var fileHost = ""                //填写你的阿里云OSS地址
var config = {
    uploadImageUrl:`${fileHost}`,
    AccessKeySecret:'',       //填写你的阿里云OSSAccessKeySecret
    OSSAccessKeyId:'',         //填写你的阿里云OSSAccessKeyId
    timeout:80000
}
module.exports=config;       //连接阿里云OOS配置