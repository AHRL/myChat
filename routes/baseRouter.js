const router = require('koa-router')()

const loginRouter = require('./login')
const addFriendRouter = require('./addFriend')
const newsList = require('./newsList')

module.exports = function (options) {
  loginRouter(router, options)
  addFriendRouter(router, options)
  newsList(router, options)

  return router
}
