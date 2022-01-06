// 引入koa
const Koa = require('koa');
// 引入ctx.boby解析中间件（记得安装依赖包）
const BodyParser = require('koa-bodyparser');
// 引入跨域中间件（记得安装依赖包）
const cors = require('koa-cors');
// 引入路由文件
const Routes = require('./router/index')
require('./services/connect')
// 实例化koa
const app = new Koa();

// 对于任何请求，app将调用该异步函数处理请求：
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
  });

// 使用ctx.body解析中间件
app.use(new BodyParser());
// 使用跨域中间件，解决跨域问题
app.use(cors());

// 初始化路由中间件
app.use(Routes.routes()).use(Routes.allowedMethods());
// 错误处理
app.on('error', (err, ctx) => {
  console.error('server error', err);
});

// 设置端口监听
app.listen(3000, () => {
  console.log('端口号是3000')
})