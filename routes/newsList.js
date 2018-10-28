const NewsListController = require('../controller/newsListController')
const UpLoadController = require('../controller/uploadController')

module.exports = function (koaRouter, options) {
  const News = new NewsListController(options)
  const UpLoad = new UpLoadController(options)

  koaRouter.post('/addNews', News.addNews)
  koaRouter.post('/getNews', News.findNews)
  koaRouter.post('/uploadImg', UpLoad.uploadImg)
  koaRouter.post('/uploadFile', UpLoad.uploadFile)
  // koaRouter.get('/download:name', UpLoad.download)
}
