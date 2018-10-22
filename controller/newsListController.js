const baseController = require('./baseController')

module.exports = class extends baseController {
  constructor (options) {
    super(options)

    this.addNews = async (ctx, next) => {
      const params = ctx.request.body
      const result = this.DBModule.NewsList.addNews(params)
      if (result.status === 'success') {
        ctx.body = { status: 200, msg: '添加成功' }
      } else {
        ctx.body = { status: 401, msg: '添加失败' }
      }
    }

    this.findNews = async (ctx, next) => {
      const params = ctx.request.body
      console.log(params)
      const result = await this.DBModule.NewsList.getNews(params)
      if (result.status === 'success') {
        ctx.body = { status: 200, msg: '查找成功', data: result.data }
      } else {
        ctx.body = { status: 401, msg: '查找失败' }
      }
    }
  }
}
