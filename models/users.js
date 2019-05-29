var mongoose = require('mongoose')
//让index唯一值生效
mongoose.set('useCreateIndex',true)
//创建数据表
var UserSchema = new mongoose.Schema({
    username:{type:String,required:true,index:{unique:true}},
    password:{type:String,required:true},
    phonenum:{type:String,required:true,index:{unique:true}},
    date:{type:Date,default:Date.now()}

})

var UserModel = mongoose.model('user',UserSchema)
//让index唯一值生效,第二步
UserModel.createIndexes();
//添加数据-注册接口方法
var save = (data)=>{
    var user = new UserModel(data)
    return user.save()
            .then(()=>{
                return true;
            })
            .catch(()=>{
                return false; 
            })
}
//查询登录接口
var findLogin = (data)=>{
    return UserModel.findOne(data)
}

//修改密码
var updatePassword = (phonenum,password)=>{
    return UserModel.updateOne({phonenum},{ $set : {password}})
            .then(()=>{
                return true;
            })
            .catch(()=>{
                return false;
            });
}

module.exports = {
    save,
    findLogin,
    updatePassword
}