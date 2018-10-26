const path = require('path')
const fs = require('fs')
const Busboy = require('busboy')
const baseController = require('./baseController')

/**
 * 同步创建文件目录
 * @param {string} dirname 目录绝对地址
 * @return {boolean} 创建目录结果
 */
function mkdirSync (dirname) {
  if (fs.existsSync(dirname)) {
    return true
  } else {
    // path.dirname()用于获取一个路径中的目录名，当参数值为目录路径时，
    // 该方法返回该目录的上层；当参数为文件路径时，该方法返回该文件所在的目录
    if (mkdirSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname)
      return true
    }
  }
}

/**
 * 获取上传文件的后缀名
 * @param {string} fileName 获取上传文件的后缀名
 * @param {string} 文件后缀名
 */

function getSuffixName (fileName) {
  let nameList = fileName.split('.')
  return nameList[nameList.length - 1]
}

/**
 * 上传文件
 * @param {object} ctx koa上下文
 * @param {object} options 文件上传参数 fileType文件类型，path文件存放路径
 * @return {promise}
 */
function uploadFile (ctx, options) {
  let req = ctx.req
  // console.log(req)
  // let res = ctx.res
  let busboy = new Busboy({headers: req.headers})

  // 读取类型
  let fileType = options.fileType || 'common' // 默认文件夹为common
  let filePath = path.join(options.path, fileType)
  let mkdirResult = mkdirSync(filePath)
  if (mkdirResult) {
    return new Promise((resolve, reject) => {
      console.log('文件上传中')
      let result = { // 默认返回
        success: false,
        data: {}
      }

      // 解析请求文件事件
      busboy.on('file', function (filedname, file, filename, encoding, mimetype) {
        // toString()里面
        let fileName = new Date().getTime() + '.' + getSuffixName(filename)
        let _uploadFilePath = path.join(filePath, fileName)
        let saveTo = path.join(_uploadFilePath)

        // 文件保存到指定路径
        file.pipe(fs.createWriteStream(saveTo)) // 先读入再读出来写

        // 文件保存到指定路径
        file.on('end', function () {
          result.success = true
          result.message = '文件上传成功'
          result.data = {
            pictureUrl: `//${ctx.host}/img/${fileType}/${fileName}`
          }
          console.log('文件上传成功')
          resolve(result)
        })
      })

      // 解析结束事件
      busboy.on('finish', function () {
        console.log('文件上传结束')
        resolve(result)
      })
      busboy.on('error', function (err) {
        console.log(err)
        console.log('文件上传出错')
      })
      req.pipe(busboy)
    })
  }
}

module.exports = class extends baseController {
  constructor (options) {
    super(options)

    this.uploadFile = async (ctx, next) => {
      console.log(ctx.request.body)
      let serverFilePath = path.join(__dirname, '../static/img')
      const result = await uploadFile(ctx, {
        fileType: 'album',
        path: serverFilePath
      })
      if (result.success === true) {
        ctx.body = { status: 200, msg: '上传成功', data: result.data }
      } else {
        ctx.body = { status: 401, msg: '上传失败' }
      }
    }
  }
}
