const path = require('path')
const fs = require('fs')
const Busboy = require('busboy')
// const formidable = require('formidable')
const inspect = require('util').inspect
const baseController = require('./baseController')
// const send = require('koa-send')

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
// function uploadImg (ctx, options) {
//   let req = ctx.req
//   // console.log(req)
//   // let res = ctx.res
//   let busboy = new Busboy({headers: req.headers})

//   // 读取类型
//   let fileType = options.fileType || 'common' // 默认文件夹为common
//   let filePath = path.join(options.path, fileType)
//   let mkdirResult = mkdirSync(filePath)
//   if (mkdirResult) {
//     return new Promise((resolve, reject) => {
//       console.log('文件上传中')
//       let result = { // 默认返回
//         success: false,
//         data: {}
//       }

//       // 解析请求文件事件
//       busboy.on('file', function (filedname, file, filename, encoding, mimetype) {
//         // toString()里面
//         let fileName = new Date().getTime() + '.' + getSuffixName(filename)
//         let _uploadFilePath = path.join(filePath, fileName)
//         let saveTo = path.join(_uploadFilePath)

//         // 文件保存到指定路径
//         file.pipe(fs.createWriteStream(saveTo)) // 先读入再读出来写

//         // 文件保存到指定路径
//         file.on('end', function () {
//           result.success = true
//           result.message = '文件上传成功'
//           result.data = {
//             pictureUrl: `//${ctx.host}/img/${fileType}/${fileName}`
//           }
//           console.log('文件上传成功')
//           resolve(result)
//         })
//       })

//       // 解析结束事件
//       busboy.on('finish', function () {
//         console.log('文件上传结束')
//         resolve(result)
//       })
//       busboy.on('error', function (err) {
//         console.log(err)
//         console.log('文件上传出错')
//       })
//       req.pipe(busboy)
//     })
//   }
// }
function uploadImg (ctx, options) {
  const req = ctx.req

  var busboy = new Busboy({ headers: req.headers })

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
      busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        let fileName = new Date().getTime() + '.' + getSuffixName(filename)
        console.log('File [' + fieldname + ']: filename: ' + filename)
        let _uploadFilePath = path.join(filePath, fileName)
        let saveTo = path.join(_uploadFilePath)

        // 文件保存到指定路径
        file.pipe(fs.createWriteStream(saveTo)) // 先读入再读出来写

        // 文件保存到指定路径
        file.on('end', function () {
          console.log('File [' + fieldname + '] Finished')
          result.data[filename] = `http://${ctx.host}/img/${fileType}/${fileName}`
        })
      })
      busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
        console.log('Field [' + fieldname + ']: value: ' + inspect(val))
      })
      busboy.on('finish', function () {
        result.success = true
        result.message = '文件上传成功'
        console.log('文件上传成功')
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
        let _uploadFilePath = path.join(filePath, filename)
        let saveTo = path.join(_uploadFilePath)

        // 文件保存到指定路径
        file.pipe(fs.createWriteStream(saveTo)) // 先读入再读出来写

        // 文件保存到指定路径
        file.on('end', function () {
          result.success = true
          result.message = '文件上传成功'
          result.data = {
            pictureUrl: `http://${ctx.host}/file/${fileType}/${filename}`
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

    this.uploadImg = async (ctx, next) => {
      let serverFilePath = path.join(__dirname, '../static/img')
      const result = await uploadImg(ctx, {
        fileType: 'album',
        path: serverFilePath
      })
      if (result.success === true) {
        ctx.body = { status: 200, msg: '上传成功', data: result.data }
      } else {
        ctx.body = { status: 401, msg: '上传失败' }
      }
    }

    this.uploadFile = async (ctx, next) => {
      let serverFilePath = path.join(__dirname, '../static/file')
      const result = await uploadFile(ctx, {
        fileType: 'file',
        path: serverFilePath
      })
      if (result.success === true) {
        ctx.body = { status: 200, msg: '上传成功', data: result.data }
      } else {
        ctx.body = { status: 401, msg: '上传失败' }
      }
    }

    // 下载文件
    // this.download = async (ctx) => {
    //   const fileName = ctx.params.name
    //   const path = `file/file/${fileName}`
    //   // 设置实体头（表示消息体的附加信息的头字段）,提示浏览器以文件下载的方式打开
    //   // 也可以直接设置 ctx.set("Content-disposition", "attachment; filename=" + fileName);
    //   ctx.attachment(path)
    //   await send(ctx, path)
    // }
  }
}
