const qqMusic = require('qq-music-api');

const getRank = async ctx =>{
    // 获取歌曲信息

    try{
        const parseData = await qqMusic.api('top/category')
       
        if(parseData.result===100){
            const list = []
           parseData.data.forEach(v => {
                if(v.title ==='巅峰榜'){
                    const children = v.list
                    children.forEach(vv=>{
                        if(vv.label === '热歌榜'|| vv.label==='飙升榜'){
                            list.push(vv)
                        }
                    })
                    
                }
                if(v.title ==='特色榜'){
                    const children = v.list
                    children.forEach(vv=>{
                        if(vv.label === '抖音排行榜'||vv.label==='影视金曲榜'){
                            list.push(vv)
                        }
                    })
                    
                }
                
            });
            ctx.body = {
                code:0,
                data:list
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
const getRankDetail = async ctx =>{
    const {
        id,pageSize=100,
    } = ctx.query
    // 获取歌曲信息
    const params = {
        id,pageSize
    }
    try{
        const parseData = await qqMusic.api('top',params)
       
        if(parseData.result===100){

            const {list} = parseData.data
            const newList = list.map(v=>{
                return {
                    author:v.singerName,
                    link:'',
                    lrc:'',
                    pic:v.cover,
                    songid:v.songId,
                    title:v.title,
                    type:'qq',
                    url:'',
                    songmid:v.mid,
                    existUrl:false
                }
            })
            ctx.body = {
                code:0,
                data:{
                    ...parseData.data,
                    list:newList
                }
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

const getLyric =async ctx =>{
    const {
        songmid
    } = ctx.query
    // 获取歌曲信息
    const params = {
        songmid
    }
    try{
        const parseData = await qqMusic.api('lyric',params)
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
const getUrl =async ctx =>{
    const {
        songmid
    } = ctx.query
    // 获取歌曲信息
    const params = {
        id:songmid
    }
    try{
        const parseData = await qqMusic.api('song/urls',params)
        if(parseData.result===100){
            ctx.body = {
                code:0,
                data:{
                    ...parseData.data,
                    
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

module.exports = {
    getRank,
    getRankDetail,
    getLyric,
    getUrl
}