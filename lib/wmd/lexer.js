'use strict'

const marked = require('marked')
const wmd = require('./wmd.js')
marked.use(wmd)

module.exports =source=> {
  return marked.lexer(source)
}
