const router = require('koa-router')()

const loginRouter = require('./login')
const addFriendRouter = require('./addFriend')
const newsList = require('./newsList')
const emojiRouter = require('./emojiRouter')

module.exports = function (options) {
  loginRouter(router, options)
  addFriendRouter(router, options)
  newsList(router, options)
  emojiRouter(router, options)

  return router
}
