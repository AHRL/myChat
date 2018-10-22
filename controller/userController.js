const baseController = require('./baseController')

module.exports = class extends baseController {
  constructor (options) {
    super(options)

    // 项目初始化
    // 注册
    this.signUp = async (ctx, next) => {
      const params = ctx.request.body
      const isFind = await this.DBModule.User.findUser({ username: params.username })
      if (isFind.status === 'success' && isFind.data.length > 0) {
        ctx.body = { status: 401, msg: '该用户名已被使用', data: isFind.data }
      } else {
        const userObj = {
          username: params.username,
          password: params.password,
          token: '123ds465sxsdfs', // 登录验证token
          friends: [], // 好友
          status: false // 登录状态
        }
        const result = await this.DBModule.User.saveUser(userObj)
        if (result.status === 'success') {
          ctx.body = { status: 200, msg: result.msg, data: result.data }
        } else {
          ctx.body = { status: 400, msg: '注册失败，请重试' }
        }
      }
    }

    // 登录
    this.signIn = async (ctx, next) => {
      const params = ctx.request.body
      const isFind = await this.DBModule.User.findUser({ username: params.username })
      if (isFind.status === 'success') {
        if (isFind.data.length > 0) {
          if (isFind.data[0].password === params.password) {
            ctx.body = { status: 200, msg: '验证成功', data: isFind.data[0] }
          } else {
            ctx.body = { status: 401, msg: '密码错误' }
          }
        } else {
          ctx.body = { status: 401, msg: '用户名不存在' }
        }
      } else {
        ctx.body = { status: 400, msg: '服务器访问数据失败' }
      }
    }

    // 添加好友
    this.addFriend = async (ctx, next) => {
      const params = ctx.request.body
      const isFindUser = await this.DBModule.User.findUser({username: params.username})
      const isFind = await this.DBModule.User.findUser({username: params.friend})
      if (isFind.status === 'success') {
        if (isFind.data.length > 0) {
          let haveThis = false
          for (let i = 0; i < isFindUser.data[0].friends.length; i++) {
            if (isFindUser.data[0].friends[i].username === params.friend) {
              haveThis = true
            }
          }
          if (haveThis) {
            ctx.body = { status: 400, msg: '该用户已是你的好友' }
          } else {
            const isAddSuccess = await this.DBModule.User.addFriend({username: params.username, friend: params.friend})
            const isAddMe = await this.DBModule.User.addFriend({username: params.friend, friend: params.username})
            if (isAddSuccess.status === 'success' && isAddMe.status === 'success') {
              ctx.body = { status: 200, msg: '添加成功', data: isAddSuccess.data }
            } else {
              ctx.body = { status: 500, msg: '添加失败，请重试' }
            }
          }
        } else {
          ctx.body = { status: 404, msg: '未找到该用户' }
        }
      } else {
        ctx.body = { status: 404, msg: isFind.msg }
      }
    }

    // 添加消息
    // this.addNewsList = async (ctx, next) => {
    //   const params = ctx.request.body
    //   const isAdd = await this.DBModule.User.addNewsList(params)
    //   if (isAdd.status === 'success') {
    //     ctx.body = { status: 200, msg: '发送成功', data: isAdd.data }
    //   } else {
    //     ctx.body = { status: 403, msg: '发送失败，请重试' }
    //   }
    // }

    // 获取消息记录
    // this.getNewsList = async (ctx, next) => {
    //   const params = ctx.request.body
    //   const isFind = await this.DBModule.User.findUser({ username: params.username })
    //   if (isFind.status === 'success') {
    //     ctx.body = { state: 200, msg: '获取成功', data: isFind.data[0].newsList }
    //   } else {
    //     ctx.body = { state: 403, msg: '获取失败' }
    //   }
    // }
  }
}
