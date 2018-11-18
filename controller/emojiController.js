const baseController = require('./baseController')

module.exports = class extends baseController {
  constructor (options) {
    super(options)

    this.searchEmojiUrl = async (ctx, next) => {
      const params = ctx.request.body
      console.log(params)
      if (!isNaN(params.emojiId)) {
        console.log(`${ctx.host}/emoji/${params.emojiId}.gif`)
        ctx.body = {status: 200, data: {emojiUrl: `//${ctx.host}/emoji/${params.emojiId}.gif`}}
      } else {
        ctx.body = {status: 400, data: {emojiUrl: ''}}
      }
    }
  }
}
