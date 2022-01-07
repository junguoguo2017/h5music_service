const request = require('request')
const apiurl = 'http://www.zgei.com'
const MusicModel = require('../model/music')
const apireq = options => new Promise((resolve, reject) => request(options, (err, response, body) => {
    if (err) {
        reject(err);
    } else {
        resolve(body);
    }
}))

const getdata = async (requestBody)=>{
    
    let limit = requestBody.pageSize || 10
    let page = requestBody.page || 1
    const querydata = await MusicModel.find({$or:[
       {
        author:{
            $regex:requestBody.input,
        }
       },
       {
        title:{
            $regex:requestBody.input,
        }
       }
    ]}).skip((page - 1)*parseInt(limit)).limit(parseInt(limit));
   
    if(querydata.length>0){
        return {
            code:0,
            data:querydata
        }
    }
    const body = await apireq({
        url:apiurl,
        method:'POST',
        headers:{
           'X-Requested-With':'XMLHttpRequest'
        },
        form:{
            ...requestBody,
        }
    })

    const parseData = JSON.parse(body)
   
    const {data} = parseData
   
    for(item of data){
        const result = await MusicModel.find({songid:item.songid}); // 存第一条
      
        if(result.length==0){
            let musicEntity = new MusicModel(item)
           
            try {
                await musicEntity.save();
                console.log(`导入数据成功`);
                } catch (error) {
                
                console.log(' 数据导入失败...');
                }
        }
    }
    

    return parseData
}
const queryMusic = async ctx => {
    let requestBody = ctx.query;
    try{
       const parseData = await getdata(requestBody)
        ctx.body = {
            code:0,
            data:parseData.data
        }
    }catch(e){
        ctx.body={
            code:300,
            msg:JSON.stringify(e)
        }
    }
   
    
 
}
module.exports = {
    queryMusic
}