const request = require('request')
const qqMusic = require('qq-music-api');
const neteaseMusic = require('NeteaseCloudMusicApi')
const apiurl = 'https://music.liuzhijin.cn' //'http://www.zgei.com'
const MusicModel = require('../model/music')
const apireq = options => new Promise((resolve, reject) => request(options, (err, response, body) => {
    if (err) {
        reject(err);
    } else {
        resolve(body);
    }
}))
async function downloadMp3(url){
  return new Promise((resolve, reject) =>{
    var req = request(url, {timeout: 10000, pool: false});
   
    req.setMaxListeners(50);
    req.setHeader('user-agent', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36');

    req.on('error', function(err) {
        reject()
        throw err;
    });
    
    req.on('response', function(res) {
        res.setEncoding("binary");
        var fileData = "";

        res.on('data', function (chunk) {
            fileData+=chunk; 
          
        });
        res.on('end',function(){
            
            resolve(fileData)
        });
    })
  })
    
}
const downloadUrl = async ctx => {
    let {
        url
    } = ctx.query;
    try{
        const fileData = await downloadMp3(url)
        
        ctx.body = {
            code:0,
            data:fileData
        }
        console.log(fileData)
    }catch(e){
        ctx.body={
            code:300,
            msg:JSON.stringify(e)
        }
    }
   
}
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
    console.log(body)
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

const querymusic = async ctx => {
    let body = ctx.query;

    try{
        const parseData = await getdata(body)
        console.log(parseData)
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
const queryQQMusic = async ctx => {
    let {
        keywords='周杰伦',
        type=0,
        pageNo=1,
        pageSize=10
    } = ctx.query;
    const params = {
        key:keywords,
        t:type,//默认为 0 // 0：单曲，2：歌单，7：歌词，8：专辑，9：歌手，12：mv
        pageNo,
        pageSize
    }
    try{
        const parseData = await qqMusic.api('search', params)
        if(parseData.result===100){
            ctx.body = {
                code:0,
                data:parseData.data
            }
        }else{
            ctx.body = parseData
        }
        
    }catch(e){
        ctx.body={
            code:300,
            msg:JSON.stringify(e)
        }
    }
   
}
const queryQQSongMsg = async ctx => {
    // 获取歌曲信息
    let {
        id
    } = ctx.query;
    const params = {
        songmid:id,
    }
    try{
        const parseData = await qqMusic.api('song', params)
        if(parseData.result===100){
            ctx.body = {
                code:0,
                data:parseData.data
            }
        }else{
            ctx.body = parseData
        }
        
    }catch(e){
        ctx.body={
            code:300,
            msg:JSON.stringify(e)
        }
    }
   
}
const queryQQSongUrl = async ctx => {
    // 获取歌曲播放url
    let {
        id
    } = ctx.query;
    const params = {
        id:id,
    }
    try{
        const parseData = await qqMusic.api('song/urls', params)
        if(parseData.result===100){
            ctx.body = {
                code:0,
                data:parseData.data
            }
        }else{
            ctx.body = parseData
        }
        
    }catch(e){
        ctx.body={
            code:300,
            msg:JSON.stringify(e)
        }
    }
   
}
const queryNeteaseMusic = async ctx => {
    let {
        keywords='周杰伦',
        type=1,
        pageNo=1,
        pageSize=10
    } = ctx.query;
    const params = {
        keywords,
        type,//默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频
        limit:pageSize,
        offset:(pageNo-1)*pageSize
    }
    try{
        const parseData = await neteaseMusic.search(params)
        console.log(neteaseMusic)

        // http://music.163.com/song/media/outer/url?id=1306459970.mp3
        if(parseData.status === 200){
            ctx.body = {
                code:0,
                data:parseData.body
            }
        }else{
            ctx.body = parseData
        }
       
    }catch(e){
        ctx.body={
            code:300,
            msg:JSON.stringify(e)
        }
    }
   
}
const queryNeteaseSongMsg=async ctx => {
    const {id} = ctx.query
    const params = {
        id
    }
    try{
        const lyricData = await neteaseMusic.lyric(params)
        const urlData = await neteaseMusic.song_url(params)
        if(lyricData.status === 200&&urlData.status ===200){
            ctx.body = {
                code:0,
                data:{
                    songid:id,
                    type:'netease',
                    url:urlData.body.data[0].url,
                    lyric:lyricData.body.lrc.lyric
                }
            }
        }else{
            ctx.body = parseData
        }
       
    }catch(e){
        ctx.body={
            code:300,
            msg:JSON.stringify(e)
        }
    }
}
const queryMusics =  async ctx => {
    let {
        from='qq'
    } = ctx.query;
    if(from=='qq'){
        return queryQQMusic(ctx)
    }else{
        return queryNeteaseMusic(ctx)
    }
}
module.exports = {
    queryQQMusic,
    queryNeteaseMusic,
    queryQQSongMsg,
    queryQQSongUrl,
    queryMusics,
    querymusic,
    queryNeteaseSongMsg,
    downloadUrl
}