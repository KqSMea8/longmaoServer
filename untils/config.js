var mongoose = require('mongoose');

var Mongoose = {
    url:'mongodb://localhost:27017/longmao',
    connect(){
        mongoose.connect(this.url,{useNewUrlParser:true},(err)=>{
            if (err) {
                console.log("数据库连接失败");
                return
            }
            console.log("数据库连接成功");
        })
    }
}

module.exports = {
    Mongoose
}