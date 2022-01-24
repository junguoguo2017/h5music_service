const Router = require('koa-router');
// 实例化路由
let router = new Router();
const {login,getmusic,neteasemusic,qqmusic} = require('../controls/index');
const initdata = require('../utils/initData')
// 初始化singer
router.get('/initsinger',async (ctx)=>{
    ctx.body = await initdata.index()
})

router.post('/api/login', login.loginSignIn);
router.post('/api/register', login.register);
router.get('/querymusic',getmusic.querymusic)
router.get('/getOneMusicMsg',getmusic.getOneMusicMsg)
router.get('/removeOneMusic',getmusic.removeOneMusic)
router.post('/insertMusic',getmusic.insertMusic)



router.get('/queryMusics',getmusic.queryMusics)
router.get('/getHotKeys',getmusic.getHotKeys)
router.get('/getHotMusics',getmusic.getHotMusics)

router.get('/queryQQSong',getmusic.queryQQSongMsg)
router.get('/queryQQSongUrl',getmusic.queryQQSongUrl)

router.get('/queryNeteaseSongMsg',getmusic.queryNeteaseSongMsg)
router.get('/gettoplist',neteasemusic.gettoplist)
router.get('/getRank',qqmusic.getRank)
router.get('/getRankDetail',qqmusic.getRankDetail)
router.get('/getLyric',qqmusic.getLyric)
router.get('/getUrl',qqmusic.getUrl)


// 导出路由
module.exports = router;