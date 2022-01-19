const Router = require('koa-router');
// 实例化路由
let router = new Router();
const {login,getmusic} = require('../controls/index');
const initdata = require('../utils/initData')
// 初始化singer
router.get('/initsinger',async (ctx)=>{
    ctx.body = await initdata.index()
})

router.post('/api/login', login.loginSignIn);
router.post('/api/register', login.register);
router.get('/querymusic',getmusic.querymusic)
router.get('/queryMusics',getmusic.queryMusics)

router.get('/queryQQSong',getmusic.queryQQSongMsg)
router.get('/queryQQSongUrl',getmusic.queryQQSongUrl)

router.get('/queryNeteaseSongMsg',getmusic.queryNeteaseSongMsg)
router.get('/downloadUrl',getmusic.downloadUrl)

// 导出路由
module.exports = router;