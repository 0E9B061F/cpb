'use strict'

const marked = require('marked')
const dmd = require('./dmd.js')
marked.use(dmd)

const promote =(tokens)=> {
  let found = false
  let t
  for (let i = 0, m = tokens.length; i < m; i++) {
    t = tokens[i]
    if (t) {
      if (t.family == 'link') {
        found = t
        break
      } else if (t.type != 'subdirectory' && t.tokens) {
        found = promote(t.tokens)
        if (found) break
      }
    }
  }
  return found
}

const mksdi =tokens=> {
  let sub
  const label = []
  let text = ''
  let raw = ''
  for (let i = 0, m = tokens.length; i < m; i++) {
    if (tokens[i]?.type == 'subdirectory') sub = tokens[i]
    else label.push(tokens[i])
  }
  for (let i = 0, m = label.length; i < m; i++) {
    if (label[i]?.text) text += label[i].text
    if (label[i]?.raw) raw += label[i].raw
  }
  return [ {type: 'dirlabel', tokens: label, text, raw}, sub ]
}

const hasub =tokens=> {
  let has = false
  for (let i = 0, m = tokens.length; i < m; i++) {
    if (tokens[i]?.type == 'subdirectory') {
      has = true
      break
    }
  }
  return has
}

const drilldown =(tokens, lede)=> {
  let t
  for (let i = 0, m = tokens.length; i < m; i++) {
    t = tokens[i]
    if (!lede && (t.type != 'list' && t.type != 'list_item' && t.type != 'text' && t.family != 'link' && t.type != 'em' && t.type != 'strong')) {
      delete tokens[i]
    } else {
      if (t.tokens || t.items) drilldown(t.tokens || t.items, lede)
      if (t.type == 'list') {
        t.type = 'subdirectory'
        t.tokens = t.items
        delete t.items
      } else if (t.type == 'list_item') {
        if (!t.text.trim()) delete tokens[i]
        else {
          const p = promote(t.tokens)
          if (p) t.tokens = [p]
          if (hasub(t.tokens)) {
            t.type = 'subdirectory_item'
            t.tokens = mksdi(t.tokens)
          } else {
            t.type = 'directory_item'
          }
        }
      }
    }
  }
}

const drill =(tokens, top=true)=> {
  let lede = true
  let t
  const head = []
  const tail = []
  const iraws = []
  const draws = []
  for (let i = 0, m = tokens.length; i < m; i++) {
    t = tokens[i]
    if (lede) {
      if (t.type == 'space') {
        head.push(t)
        iraws.push(t.raw)
      } else if (t.type == 'paragraph') {
        drilldown(t.tokens, lede)
        head.push(t)
        iraws.push(t.raw)
      } else {
        lede = false
        if (t.type == 'list') {
          drilldown(t.items, lede)
          tail.push(t.items)
          draws.push(t.raw)
        }
      }
    } else if (t.type == 'list') {
      drilldown(t.items, lede)
      tail.push(t.items)
      draws.push(t.raw)
    }
  }
  return [
    { type: 'intro',
      raw: iraws.join(''),
      tokens: head,
    },
    { type: 'directory',
      raw: draws.join(''),
      tokens: tail[0]?.concat(...tail.slice(1)) || [],
    },
  ]
}

module.exports =source=> {
  return drill(marked.lexer(source))
}
