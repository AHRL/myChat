const NewsListController = require('../controller/newsListController')

module.exports = function (koaRouter, options) {
  const News = new NewsListController(options)

  koaRouter.post('/addNews', News.addNews)
  koaRouter.post('/getNews', News.findNews)
}
