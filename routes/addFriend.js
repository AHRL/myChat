const UserController = require('../controller/userController')

module.exports = function (koaRouter, options) {
  const user = new UserController(options)
  koaRouter.post('/addFriend', user.addFriend) // 添加好友
}
