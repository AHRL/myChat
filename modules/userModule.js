module.exports = class {
  constructor (mongoose) {
    const Schema = mongoose.Schema // 任何事情都是从Schema（模式）开始的。每一个模式映射到MongoDB集合,类似于表
    const userSchema = new Schema({
      username: String,
      password: String,
      token: String,
      friends: Array,
      status: Boolean
    })
    // 创建模型,模型的实例叫做文档
    const User = mongoose.model('User', userSchema)

    // 注册
    this.saveUser = function (moduleObj) {
      return new Promise((resolve, reject) => {
        const userObj = new User(moduleObj)
        userObj.save(function (err, data) {
          if (err) {
            reject(new Error({status: 'failed', msg: '注册失败，请重试', data: err}))
          } else {
            resolve({status: 'success', msg: '注册成功，现在去登录吧', data: data})
          }
        })
      })
    }
    // 查询用户
    this.findUser = function (option) {
      return new Promise((resolve, reject) => {
        User.find(option, function (err, data) {
          if (err) {
            reject(new Error({status: 'failed', msg: '查询失败', data: err}))
          } else {
            resolve({status: 'success', msg: '查询成功', data: data})
          }
        })
      })
    }

    // 添加好友
    this.addFriend = function (option) {
      return new Promise((resolve, reject) => {
        User.updateMany({ 'username': option.username }, {$push: {'friends': {'username': option.friend, 'textmsg': ''}}}, function (err, data) {
          if (err) {
            reject(new Error({status: 'failed', msg: '查询失败', data: err}))
          } else {
            User.find({ 'username': option.username }, function (err, data) {
              if (err) {
                console.log(err)
              } else {
                console.log(data)
                resolve({ status: 'success', msg: '添加成功', data: data[0].friends })
              }
            })
          }
        })
      })
    }

    // 消息记录
    this.addNewsList = function (option) {
      return new Promise((resolve, reject) => {
        User.updateMany({ 'username': option.from }, {$push: {'newsList': option}}, function (err, data) {
          if (err) {
            reject(new Error({status: 'failed', msg: '查询失败', data: err}))
          } else {
            User.find({ 'username': option.from }, function (err, data) {
              if (err) {
                console.log(err)
              } else {
                console.log(data)
                resolve({ status: 'success', msg: '添加成功', data: data[0].newsList })
              }
            })
          }
        })
      })
    }
  }
}
