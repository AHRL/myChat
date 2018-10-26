const NewsListController = require('../controller/newsListController')
const UpLoadController = require('../controller/uploadController')

module.exports = function (koaRouter, options) {
  const News = new NewsListController(options)
  const UpLoadImg = new UpLoadController(options)

  koaRouter.post('/addNews', News.addNews)
  koaRouter.post('/getNews', News.findNews)
  koaRouter.post('/uploadImg', UpLoadImg.uploadFile)
}
