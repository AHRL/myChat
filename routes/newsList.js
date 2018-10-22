const UserController = require('../controller/userController')

module.exports = function (koaRouter, options) {
  const User = new UserController(options)

  koaRouter.post('/getNewsList', User.getNewsList)
}
