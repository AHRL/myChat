'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
var info = require('./info')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  mongodb: info.mongodb.url
})
