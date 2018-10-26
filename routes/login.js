const UserController = require('../controller/userController')

module.exports = function (koaRouter, options) {
  // 创建controller实例
  const user = new UserController(options)
  // get请求
  koaRouter.get('/signIn', async (ctx, next) => {
    ctx.body = '<h3>aa</h3>'
  })
  // post请求
  koaRouter.post('/signUp', user.signUp) // 注册
  koaRouter.post('/signIn', user.signIn) // 登录
  koaRouter.post('/forceUpdateStatus', user.forceUpdateStatus)
}
