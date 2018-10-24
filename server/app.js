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

let user = {}
let socketID = {}
io.on('connection', function (socket) {
  socket.on('signIn', function (username) {
    user[username] = socket.id
    socketID[socket.id] = username
    console.log(socketID)
    console.log(user)
    io.sockets.emit('getOnlineNum', Object.keys(socketID).length)
  })
  socket.on('receive', function (msg, from, to) {
    let date = new Date().toTimeString().substr(0, 8)
    let socketId = user[to]
    let meSocketId = user[from]
    io.sockets.sockets[meSocketId].emit('newMsg', {from: from, to: to, msg: msg, date: date})
    io.sockets.sockets[socketId].emit('newMsg', {from: from, to: to, msg: msg, date: date})
    DBModule.NewsList.addNews({from: from, to: to, msg: msg, date: date})
  })
  socket.on('updateFriends', function (username, friend) {
    let socketId = user[friend]
    io.sockets.sockets[socketId].emit('updateFriends', username)
  })
  socket.on('forceOffLine', async function (username) {
    let socketId = user[username]
    if (socketId) {
      delete socketID[socketId]
      io.sockets.sockets[socketId].emit('offLine')
    }
    await DBModule.User.updateStatus({ 'username': username, 'status': false })
  })
  socket.on('disconnect', async function () {
    console.log('aaa')
    const username = socketID[socket.id]
    const result = await DBModule.User.updateStatus({ 'username': username, 'status': false })
    console.log(result)
    delete socketID[socket.id]
    delete user[username]
    io.sockets.emit('getOnlineNum', Object.keys(socketID).length)
    console.log(username + '下线')
  })
})

console.log(`the server is start at port ${process.env.PORT}`)
