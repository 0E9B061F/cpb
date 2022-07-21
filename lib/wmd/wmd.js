'use strict'

const Lang = require('../lang.js')
const dmd = require('../dmd/dmd.js')


const lang = new Lang()

// {{{@deco
//  | figure=true
//  | class=foo bar
//  | aside=btw you should know...
//  |>
//  source
// }}}
// {{@shatter|some text here}}
// {{@clear}}
// {{!tmp:navigation|arg1=foo|arg2=bar|>[[hello]]}}
// {{{@figure&&@cls|quote left&&@aside|fooooo|>one upon a time}}}
// {{{@src|google|>http://google.com}}}
// {{@cite|google|>some bullshit}}
// {{{@biblio}}}
const x = {}
x.argid = `[a-zA-Z][a-zA-Z0-9_\\-]*`
x.valid = `[^|]*`
x.named = `${x.argid}=${x.valid}`
x.arg = `(?: *\\|(?!>) *(?:${x.named}|${x.valid}))`
x.cmd = `(?:!|@)(?:${x.argid})`
x.pin = `(?<pin>\\|>)`
x.sig = `(?:${x.cmd}(?:${x.arg}*))`
x.sigs = `(?<sigs>${x.sig}(?:\\/${x.sig})*)`
x.lineL = '\\{\\{'
x.lineR = '\\}\\}'
x.blockL = '\\{\\{\\{'
x.blockR = '\\}\\}\\}'
x.linePin = `(?:${x.pin}(?<text>[^\\}]+|\\}(?!\\}))*)`
x.blockPin = `(?:${x.pin}(?<text>[^\\}]+|\\}(?!\\}\\}))*)`

const synthcmds =token=> {
  console.log(token)
  const cmds = token.sigs.split('/')
  const rest = cmds.slice(1)
  const decmd = cmds[0].split('|')
  const tail = rest.length ? {
    ...token, sigs: cmds.slice(1).join('/'),
    tokens: token.tokens
  } : null
  console.log(tail)
  token.cmd = decmd[0].slice(1)
  token.cmdtype = decmd[0][0]
  token.args = decmd.slice(1)
  let p = 0
  for (let i = 0, m = token.args.length; i < m; i++) {
    token.args[i] = token.args[i].split('=')
    if (token.args[i].length == 1) {
      token.args[i].unshift(p)
      p++
    }
  }
  if (tail) {
    token.tokens = [tail]
    synthcmds(tail)
  }
}

lang.inline({
  name: 'linedeco',
  hint: new RegExp(x.lineL),
  rule: new RegExp(`^${x.lineL}${x.sigs}${x.linePin}?${x.lineR}`),
  parse: 'text',
  transform: token=> {
    console.log(token)
    token.family = 'decorator'
    token.block = false
    synthcmds(token)
  },
})

lang.block({
  name: 'blockdeco',
  hint: new RegExp(x.blockL),
  rule: new RegExp(`^${x.blockL}${x.sigs}${x.blockPin}?${x.blockR}`),
  block: 'text',
  transform: token=> {
    token.family = 'decorator'
    token.block = true
    synthcmds(token)
  },
})

lang.inline({
  name: 'dash',
  hint: /--/,
  rule: /^(?<dash>-{2,3})/,
  transform: token=> {
    if (token.dash.length == 2) token.text = '–'
    else if (token.dash.length == 3) token.text = '—'
  }
})
lang.block({
  name: 'attribution',
  hint: /<<</,
  rule: /^<<<\s*(?<text>.+)/,
  parse: 'text',
})

lang.block({
  name: 'pgpkey',
  hint: /-----BEGIN/,
  rule: /^-----BEGIN PGP PUBLIC KEY BLOCK-----(?<key>[\s\S]+?)-----END PGP PUBLIC KEY BLOCK-----/,
  transform: token=> {
    token.text = token.raw
  },
})


module.exports = { extensions: [...dmd.extensions, ...lang.extensions]}
