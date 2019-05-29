
var smsClient = require('../xinxi/demo/index.js')
var UserModel = require('../models/users.js')


//登录接口
var login = async(req,res,next)=>{
    var {username,password} = req.body;

    var result = await UserModel.findLogin({
        username,
        password
    })
    if (result) {
        req.session.username = username
        res.send({
            msg:'登录成功',
            code:0
        })
    } else {
        res.send({
            msg:'登录失败',
            code:-1
        })
    }
}

var register = async(req,res,next)=>{
    var {username,password,phonenum,yzm} = req.body;
    if (phonenum != req.session.phonenum || yzm != req.session.yzm) {
        res.send({
            msg:'手机验证码错误',
            code:-1
        })
        return
    }
    if ((Date.now() - req.session.time)/1000 > 60) {
        res.send({
            msg:'验证码已过期',
            code:-3
        })
        return
    }
    console.log(username,password,phonenum);
    var result = await UserModel.save({
        username,
        password,
        phonenum
    })
    if (result) {
        res.send({
            msg:'注册成功',
            code:0
        })
    }else{
        res.send({
            msg:'注册失败',
            code:-2
        })
    }
}

//短信验证码
var verify = async(req,res,next)=>{
    var code = null;
    var time = null;
    //创建随机6位验证码
    function suiji() {
        code = Math.random().toString().substring(3,9);
        return code;
    }
    //创建当前时间
    function nowTime() {
        time = Date.now()
        return time;
    }
    var phonenum = req.query.phonenum;
    suiji();
    nowTime();
    /* req.session.phonenum = phonenum;
    req.session.yzm = code;
    req.session.time = time;
    console.log(req.session.phonenum,req.session.yzm);
    res.json({code:0,msg:'发送验证码成功'}) */

    //发送验证码
    smsClient.sendSMS({
        PhoneNumbers: phonenum,
        SignName: '凌晨肆点的洛杉矶',
        TemplateCode: 'SMS_166375558',
        TemplateParam: `{'code':${code}}`
    }).then(function (rescode) {
        let {
            Code
        } = rescode
        if (Code === 'OK') {
            //处理返回参数
            //console.log(res)
            req.session.phonenum = phonenum;
            req.session.yzm = code;
            req.session.time = time;
            res.json({code:0,msg:'发送验证码成功'})
            console.log(req.session.phonenum,req.session.yzm);
        }
    }, function (err) {
        //console.log(err)
        res.json({code:-1,msg:'发送验证码失败'})
    })
    
}

//退出
var logout = async(req,res,next)=>{
    req.session.username = ''
    res.send({
        msg:'退出成功',
        code:0
    })
}

//获取用户信息
var getUser = async(req,res,next)=>{
    if (req.session.username) {
        res.send({
            msg:'获取用户信息成功',
            code:0,
            data:{
                username:req.session.username
            }
        })
    }else{
        res.send({
            msg:'获取用户信息失败',
            code:-1,
            
        })
    }
}
//修改密码
var findPassword = async(req,res,next)=>{
    var {phonenum,password,yzm} = req.body;
    if (phonenum == req.session.phonenum && yzm == req.session.yzm) {
        var result = await UserModel.updatePassword(phonenum,password)
        if (result) {
            res.send({
                msg:'修改密码成功',
                code:0
            })
        } else {
            res.send({
                msg:'修改密码失败',
                code:-1
            })
        }
    } else {
        res.send({
            msg:'验证码错误或手机号错误',
            code:-1
        })
    }
}

module.exports = {
    login,
    register,
    verify,
    logout,
    getUser,
    findPassword
}