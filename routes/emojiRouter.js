const EmojiController = require('../controller/emojiController')

module.exports = function (koaRouter, options) {
  const emojiController = new EmojiController(options)
  koaRouter.post('/searchEmojiUrl', emojiController.searchEmojiUrl) // 添加好友
}
