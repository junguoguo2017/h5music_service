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

const getdata = async (requestBody)=>{
    const {pageSize=10,page=1} = requestBody
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
    ]}).skip((page - 1)*parseInt(pageSize)).limit(parseInt(pageSize));
    
    if(querydata.length>0){
        return {
            code:0,
            data:querydata,
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
            pageSize,
            page
        }
    })
  
    const parseData = JSON.parse(body)
    console.log('-----',parseData)
    // const {data} = parseData

    // for(item of data){
    //     const result = await MusicModel.find({songid:item.songid}); // 存第一条
      
    //     if(result.length==0){
    //         let musicEntity = new MusicModel(item)
           
    //         try {
    //             await musicEntity.save();
    //             console.log(`导入数据成功`);
    //             } catch (error) {
                
    //             console.log(' 数据导入失败...');
    //             }
    //     }
    // }
    

    return parseData
}

const querymusic = async ctx => {
    let body = ctx.query;
    try{
        const parseData = await getdata(body)
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

const insertMusic = async ctx=>{
    let item= ctx.request.body
    const result = await MusicModel.find({songid:item.songid});
    if(result.length==0){
        let musicEntity = new MusicModel(item)    
        try {
            await musicEntity.save();
            ctx.body={
                code:0,
                msg:`数据保存成功`,
            }
        } catch (error) {
            ctx.body={
                code:0,
                msg:`数据保存失败`,
            }
        }
    }else{
        ctx.body={
            code:0,
            msg:`已经存在`,
        }   
    }
    
}
const removeOneMusic = async ctx=>{
    let {
        id
    } = ctx.query;
    const result = await MusicModel.remove({songid:id});
    ctx.body={
        code:0,
        msg:`删除成功${result.deletedCount}`,
    }
   
}
const getOneMusicMsg = async ctx=>{
    let {
        id
    } = ctx.query;
    const result = await MusicModel.find({songid:id});
    if(result.length==0){
        ctx.body = {
            code:300,
            msg:'找不到相关数据'
        }
    }else{
        ctx.body = {
            code:0,
            data:result
        } 
    }
}

const removeMusics = async ctx=>{
    let {
        ids
    } = ctx.query;
    const result = await MusicModel.remove({songid:{$in:ids}}); 
    console.log(result)
   ctx.body={
       code:0,
       msg:'删除成功'
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
const getHotKeys = async ctx => {
    // 获取歌曲信息
    try{
        const parseData = await qqMusic.api('search/hot')
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
const getHotMusics = async ctx => {
    // 获取歌曲信息
    try{
        const parseData = await qqMusic.api('singer/songs')
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
    getHotKeys,
    getHotMusics,
    queryNeteaseMusic,
    queryQQSongMsg,
    queryQQSongUrl,
    queryMusics,
    querymusic,
    queryNeteaseSongMsg,
  
    removeOneMusic,
    removeMusics,
    getOneMusicMsg,
    insertMusic
}