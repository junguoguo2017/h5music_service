//注意添加在该文件最顶部（需要引入该文件）
const ModelUser = require('../model/user');
let loginSignIn = async ctx => {
    let requestBody = ctx.request.body;
    const res =  await ModelUser.find({ username: requestBody.username, password: requestBody.password })
    if(res.length === 1) {
        ctx.body = {
          status: 200,
          result: {
            code: 1,
            userInfo: res[0],
            message: '登录成功'
          }
        }
      }else {
        ctx.body = {
          status: 200,
          result: {
            code: 0,
            message: '登录异常'
          }
        }
      }
  };
  const register = async ctx=>{
    let requestBody = ctx.request.body;
    const {username,password} = requestBody
    if(username=='' || password ==''){
        ctx.body = {
            status: 200,
            result: {
              code: -1,
              message: '用户名或密码不能为空'
            }
          }

          return
    }
    const res =  await ModelUser.find({ username })
    if(res.length > 1) {
        ctx.body = {
            status: 200,
            result: {
              code: -1,
              message: '用户名存在'
            }
          }
          return 
      }
      const newUser =  new ModelUser({username,password})
      try {
        await newUser.save();
        ctx.body = {
            status: 200,
            result: {
              code: 0,
              message: '注册成功'
            }
          }

      } catch (error) {
        ctx.body = {
            status: 200,
            result: {
              code: -1,
              message: '注册失败'
            }
          }
      }
  }
  
  const adminApiConfig = {
    loginSignIn,
    register
  };
  
  module.exports = adminApiConfig;