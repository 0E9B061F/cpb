'use strict'

const Lang = require('../lang.js')


const lang = new Lang()

lang.decolink('extlink', 'e', 'href', token=> {
  token.link = token.href
  if (!token.href.match(Lang.re.proto)) token.href = `https://${token.href}`
  if (token.label == '') {
    try {
      const url = new URL(token.href)
      if (!url.hostname) token.text = token.link
      else {
        token.text = url.hostname.split('.').slice(-2).join('.')
      }
    } catch (TypeError) {
      token.text = token.link
    }
  } else if (token.label) {
    token.text = token.label
  } else {
    token.text = token.link
  }
})
lang.decolink('wikilink', 'w', 'title', token=> {
  token.slug = token.title.replace(/ /g, '_')
  token.href = `https://en.wikipedia.org/wiki/${token.slug}`
  if (token.label == '') {
    token.text = Lang.clip(token.title)
  } else if (token.label) {
    token.text = token.label
  } else {
    token.text = token.title
  }
})
lang.decolink('biblelink', 'b', 'query', token=> {
  token.href = `https://www.biblegateway.com/passage/?version=KJV&search=${token.query}`
  token.text = token.label || token.query
})

lang.inline({
  name: 'cpblink',
  hint: /\[\[/,
  rule: /^\[\[\s*(?<nst>[^|\]]*?)\s*(?:\|\s*(?<text>.*?))?\]\]/,
  transform: token=> {
    if (!token.text) token.text = token.nst
    token.family = 'link'
  },
})


module.exports = lang.exports
