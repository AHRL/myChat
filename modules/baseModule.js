const User = require('./userModule')

module.exports = class {
  constructor (mongoose) {
    // 集成全部module
    // User是一个类，首字母大写，调用User的构造函数生成User实例作为基础模块的属性。
    this.User = new (User)(mongoose)
  }
}
