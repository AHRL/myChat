const crypto = require('crypto')

const api = {
  md5 (str, encoding) {
    return crypto.createHash('md5').update(str).digest(encoding || 'hex')
  }
}

module.exports = api
