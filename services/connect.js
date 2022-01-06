const mongoose = require('mongoose');
//注意保证你的本地数据库已经开启，并拥有admin数据库（可以修改成你自己的地址/数据库名称）
let contentUrl = "mongodb://localhost/music_api"; 
//连接数据库
mongoose.connect(contentUrl, { useNewUrlParser: true },function(err){
    if(err){
        console.log(err)
        return
    }
    console.log('数据库连接成功')
})