const _ = require('underscore')
module.exports = class {
  constructor (options) {
    let self = this
    if (options) {
      _.map(options, function (val, key) {
        self[key] = val
      })
    }
  }
}
