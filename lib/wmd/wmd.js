'use strict'


const extensions = []
const re = {
  proto: /^[a-zA-Z][a-zA-Z0-9+.\-]*:\/\//,
  pclip: /^(:?[^:]+:)?(?<clip>.+) \(/,
  cclip: /^(:?[^:]+:)?(?<clip>[^.,]+)/,
  sclip: /^(:?[^:]+:)?(?<clip>\S+)/,
}

const add =conf=> {
  conf = Object.assign({
    renderer: token=> token.raw,
  }, conf)
  return extensions.push({
    name: conf.name,
    level: conf.level,
    start(src) { return src.match(conf.hint)?.index; },
    tokenizer(src, tokens) {
      const match = conf.rule.exec(src)
      if (match) {
        const token = Object.assign({}, match.groups, {
          type: conf.name,
          raw: match[0],
          tokens: []
        })
        if (conf.block) {
          const k = typeof(conf.block) == 'string' ? conf.block : 'raw'
          this.lexer.blockTokens(token[k], token.tokens)
        } else if (conf.parse) {
          const k = typeof(conf.parse) == 'string' ? conf.parse : 'raw'
          this.lexer.inline(token[k], token.tokens)
        }
        if (conf.transform) {
          conf.transform(token)
        }
        return token
      }
    },
    renderer(token) {
      const inside = conf.block ? this.parser.parse(token.tokens) : this.parser.parseInline(token.tokens)
      return conf.renderer(token, inside)
    }
  })
}
const block =conf=> add(Object.assign({}, conf, {level: 'block'}))
const inline =conf=> add(Object.assign({}, conf, {level: 'inline'}))

const decolink =(name, char, group, transform=null)=> {
  return inline({name,
    hint: new RegExp(`\\[${char}\\/`),
    rule: new RegExp(`^\\[${char}\\/(?<${group}>[^|]+?)(?:\\s*\\|\\s*(?<label>[^\\]]*?))?\\]`),
    transform: token=> {
      if (transform) transform(token)
      token.family = 'extlink'
    },
  })
}

const clip =t=> {
  let m = t.match(re.pclip)
  if (m) return m.groups.clip
  m = t.match(re.cclip)
  if (m) return m.groups.clip
  m = t.match(re.sclip)
  if (m) return m.groups.clip
  return t
}

decolink('extlink', 'e', 'href', token=> {
  token.link = token.href
  if (!token.href.match(re.proto)) token.href = `https://${token.href}`
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
decolink('wikilink', 'w', 'title', token=> {
  token.slug = token.title.replace(/ /g, '_')
  token.href = `https://en.wikipedia.org/wiki/${token.slug}`
  if (token.label == '') {
    token.text = clip(token.title)
  } else if (token.label) {
    token.text = token.label
  } else {
    token.text = token.title
  }
})
decolink('biblelink', 'b', 'query', token=> {
  token.href = `https://www.biblegateway.com/passage/?version=KJV&search=${token.query}`
  token.text = token.label || token.query
})
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

inline({
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
block({
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
inline({
  name: 'cpblink',
  hint: /\[\[/,
  rule: /^\[\[\s*(?<nst>[^|\]]*?)\s*(?:\|\s*(?<text>.*?))?\]\]/,
  transform: token=> {
    if (!token.text) token.text = token.nst
  },
})
inline({
  name: 'dash',
  hint: /--/,
  rule: /^(?<dash>-{2,3})/,
  transform: token=> {
    if (token.dash.length == 2) token.text = '–'
    else if (token.dash.length == 3) token.text = '—'
  }
})
block({
  name: 'attribution',
  hint: /<<</,
  rule: /^<<<\s*(?<text>.+)/,
  parse: 'text',
})

block({
  name: 'pgpkey',
  hint: /-----BEGIN/,
  rule: /^-----BEGIN PGP PUBLIC KEY BLOCK-----(?<key>[\s\S]+?)-----END PGP PUBLIC KEY BLOCK-----/,
  transform: token=> {
    token.text = token.raw
  },
})


function walkTokens(token) {

}


module.exports = {extensions, walkTokens}
