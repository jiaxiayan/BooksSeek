const env = require('./config.js');

const base64 = require('./base64');
require('./hmac.js');
require('./sha1.js');
const Crypto = require('./crypto.js');

const uploadFile = function (filePath,dir,successc,failc){
    if(!filePath || filePath.length<9){
        wx.showModel({
            title:'图片错误',
            content:'请重试',
            showCancel:false
        })
        return;
    }
    console.log('上传中');
    const aliyunFileKey = dir + new Date().getTime()+Math.floor(Math.random()*150+'.png');
    const aliyunServerUrl = env.uploadImageUrl;
    const accessid = env.OSSAccessKeyId;
    const policyBase64 = getPolicyBase64();
    const signature = getSignature(policyBase64);

    wx.uploadFile({
        url:aliyunServerUrl,
        filePath:filePath,
        name:'file',
        formData:{
            'key':aliyunFileKey,
            'policy':policyBase64,
            'OSSAccessKeyId':accessid,
            'signature':signature,
            'success_action_status':'200'
        },
        success:function(res){
            if(res.statusCode!=200){
                failc(new Error('上传错误：'+JSON.stringify(res)))
                return;
            }
            successc(aliyunServerUrl+aliyunFileKey);
        },
        fail:function(err){
            err.wxaddinfo=aliyunServerUrl;
            //failc(err)
            console.log(err)
        }
    })
}

const getPolicyBase64 = function(){
    let date= new Date();
    date.setHours(date.getHours()+env.timeout);
    let srcT = date.toISOString();
    const policyText={
        'expiration':srcT,
        'conditions':[
            ['content-length-range',0,5*1024*1024]
        ]
    };
    const policyBase64 = base64.encode(JSON.stringify(policyText));
    return policyBase64;
}

const getSignature = function (policyBase64){
    const accesskey = env.AccessKeySecret;

    const bytes = Crypto.HMAC(Crypto.SHA1,policyBase64,accesskey,{
        asBytes:true
    });
    const signature = Crypto.util.bytesToBase64(bytes);

    return signature;
}
export default uploadFile;