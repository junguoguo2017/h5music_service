const neteaseMusic = require('NeteaseCloudMusicApi')

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
const gettoplist = async ctx => {
   
    try{
        const parseData = await neteaseMusic.toplist({idx:1})
        console.log(parseData)
        if(parseData.status === 200){
            ctx.body = {
                code:0,
                data:parseData.body
            }
        }else{
            ctx.body = parseData
        }
       
    }catch(e){
        console.log(e)
        ctx.body={
            code:300,
            msg:JSON.stringify(e)
        }
    }
   
}

module.exports = {
    gettoplist
}