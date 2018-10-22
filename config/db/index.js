/**
 * mongodb属性
 */
const mongoose = require('mongoose')
module.exports = function (config) {
  mongoose.Promise = global.Promise // 全局的primise
  console.log(config.env.mongodb)
  mongoose.connect(config.env.mongodb,{useNewUrlParser:true})
  // 连接成功
  mongoose.connection.on('connection', function () {
    console.log('连接mongodb成功')
  })
  // 连接异常
  mongoose.connection.on('error', function (err) {
    console.log(`连接异常，错误为：${err}`)
  })
  // 连接断开
  mongoose.connection.on('disconnected', function () {
    console.log('连接mongodb断开')
  })
  
  return mongoose
}