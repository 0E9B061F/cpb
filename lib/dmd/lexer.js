'use strict'

const marked = require('marked')
const dmd = require('./dmd.js')
marked.use(dmd)

const drill =(tokens, top=true)=> {
  tokens = tokens.filter(t=> {
    if (top) return t.type == 'list'
    else return t.type == 'list' || t.type == 'list_item' || t.type == 'text' || t.family == 'link'
  })
  tokens.forEach(t=> {
    if (t.tokens) t.tokens = drill(t.tokens, false)
  })
  return tokens
}

module.exports =source=> {
  let tokens = drill(marked.lexer(source))
  const head = tokens[0]
  if (!head.tokens) head.tokens = []
  tokens.slice(1).forEach(t=> {
    head.raw += t.raw
    if (t.items) head.items = [...head.items, ...t.items]
  })
  return [head]
}
