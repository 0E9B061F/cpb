'use strict'

const { inspect } = require('util')
const wmd = require('../../lib/wmd/wmd.js')
const marked = require('marked')
marked.use(wmd)

class Text {
  constructor() {
    this.parts = []
    this.raws = []
    this.trims = []
  }
  get text() { return this.parts.join('').trim() }
  get raw() { return this.raws.join('').trim() }
  get trim() { return this.trims.join('').trim() }
  get empty() { return !this.parts.length }
  addTrim(s) {
    s = s.replace(/[_\-.\/\\&@]+/g, ' ')
    this.trims.push(s)
  }
  add(s) {
    if (s) {
      this.parts.push(s)
      this.addTrim(s)
    }
  }
  addRaw(s) { this.raws.push(s) }
  break() {
    if (this.parts.length && this.parts[this.parts.length-1] != '\n') {
      this.parts.push('\n')
      this.trims.push('\n')
    }
  }
}
class WMD {
  constructor(doc) {
    this.doc = doc
    this.tokens = marked.lexer(this.doc)
    this.allText = new Text()
    this.paraText = new Text()
    this.autoText = new Text()
    this.userLede = new Text()
    this.cpbLinks = []
    this.extLinks = []
    this.analyze(this.tokens)
    const t = this.allText.trim
    this.wordCount = t ? t.split(/\s+/).length : 0
  }
  analyze(tokens, ledeEnd=false, under, inLede) {
    const root = !under
    for (let i = 0, m = tokens.length; i < m; i++) {
      const token = tokens[i]
      const next = under || token.type
      if (!ledeEnd && root && token.type != 'paragraph' && !this.autoText.empty) {
        ledeEnd = true
      }
      if (!ledeEnd && root && token.type == 'paragraph') this.autoText.addRaw(token.raw)
      if (token.type == 'cpblink') this.cpbLinks.push(token)
      else if (token.family == 'extlink') this.extLinks.push(token)
      else if (token.family == 'decorator') {
        if (token.cmd == 'lede') {
          this.userLede.addRaw(token.text)
          inLede = true
        }
      }
      if (token.tokens && token.tokens.length) this.analyze(token.tokens, ledeEnd, next, inLede)
      else {
        if (token.type == 'space') {
          this.allText.break()
          this.paraText.break()
          if (!ledeEnd) this.autoText.break()
          if (inLede) this.userLede.break()
        } else {
          const t = token.type == 'text' ? token.raw : token.text
          if (inLede) this.userLede.add(t)
          this.allText.add(t)
          if (under == 'paragraph') {
            this.paraText.add(t)
            if (!ledeEnd) this.autoText.add(t)
          }
        }
      }
      if (root) {
        this.allText.break()
        if (token.type == 'paragraph') {
          this.paraText.break()
          if (!ledeEnd) this.autoText.break()
        }
      }
    }
  }
  get links() { return [...this.cpbLinks, ...this.extLinks] }
  get lede() { return this.userLede.empty ? this.autoText : this.userLede }
}


module.exports = WMD
