module.exports = class {
  constructor (mongoose) {
    const Schema = mongoose.Schema
    const newsListSchema = new Schema({
      from: String,
      to: String,
      date: String,
      msg: String
    })

    const NewsList = mongoose.model('NewsList', newsListSchema)

    // 添加消息
    this.addNews = function (option) {
      return new Promise((resolve, reject) => {
        const news = new NewsList(option)
        news.save(function (err, data) {
          if (err) {
            reject(new Error({ status: 'failed', msg: '添加失败' }))
          } else {
            resolve({ status: 'success', msg: '添加成功', data: data })
          }
        })
      })
    }
    // 获取消息
    this.getNews = function (options) {
      return new Promise((resolve, reject) => {
        NewsList.find({ $or: [{'from': options.username}, {'to': options.username}] }, function (err, data) {
          if (err) {
            reject(new Error({ status: 'failed', msg: '获取失败', data: data }))
          } else {
            resolve({ status: 'success', msg: '获取成功', data: data })
          }
        })
      })
    }
  }
}
