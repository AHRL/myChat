const Koa = require('koa')
const cors = require('koa2-cors') // 跨域资源共享
const app = new Koa()
const json = require('koa-json') // json漂亮地打印响应中间件
const onerror = require('koa-onerror') // koa的错误处理程序，在一个地方处理所有初五
const bodyparser = require('koa-bodyparser')
// 对于post请求的处理，koa-bodyparser中间件可以把上下文的formData数据解析到ctx.request.body中
const logger = require('koa-logger')
const config = require('../config')[process.env.NODE_ENV || 'dev'] // 获取配置
const mongodb = require('../config/db')(config)
const DBModule = new (require('../modules/baseModule'))(mongodb)
const router = require('../routes/baseRouter')({ config: config, DBModule: DBModule })
const info = require('../config/info')

// 服务端口，默认为3000
process.env.PORT = info.serverAddress.port

const server = require('http').createServer(app.callback())
const io = require('socket.io')(server)
server.listen(process.env.PORT)
// console.log(io)

// 错误处理
onerror(app)

// 请求体设置
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text'], // 请求类型
  jsonLimit: '5mb', // 控制parser转换大小，默认1mb
  formLimit: '4096kb' // 控制post大小，默认56kb
}))
app.use(cors()) // 允许跨域
app.use(json())
app.use(logger())

app.use(require('koa-static')(`${__dirname}/static`))

// 启动的日志
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(` ${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.use(router.routes()).use(router.allowedMethods())

let user = []
io.on('connection', function (socket) {
  socket.on('signIn', function (username) {
    user.push({
      username: username,
      socketId: socket.id
    })
    io.sockets.emit('getOnlineNum', user.length)
  })
  socket.on('receive', function (msg, from, to) {
    let date = new Date().toTimeString().substr(0, 8)
    let socketId = getSocketId(user, to)
    let meSocketId = getSocketId(user, from)
    io.sockets.sockets[meSocketId].emit('newMsg', {from: from, to: to, msg: msg, date: date})
    io.sockets.sockets[socketId].emit('newMsg', {from: from, to: to, msg: msg, date: date})
    DBModule.NewsList.addNews({from: from, to: to, msg: msg, date: date})
  })
  socket.on('updateFriends', function (username, friend) {
    let socketId = getSocketId(user, friend)
    io.sockets.sockets[socketId].emit('updateFriends', username)
  })
  socket.on('disconnect', function () {
    const item = getUsername(user, socket.id)
    if (item.index) {
      user.splice(item.index, 1)
    }
    io.sockets.emit('getOnlineNum', user.length)
    console.log(item.username + '下线')
  })
})

function getSocketId (user, username) {
  for (let i = 0; i < user.length; i++) {
    if (user[i].username === username) return user[i].socketId
  }
}

function getUsername (user, socketId) {
  for (let i = 0; i < user.length; i++) {
    if (user[i].socketId === socketId) {
      return {username: user[i].username, index: i}
    }
  }
}

console.log(`the server is start at port ${process.env.PORT}`)
