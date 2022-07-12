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
        if (conf.transform) {
          conf.transform(token)
        }
        if (conf.block) {
          const k = typeof(conf.block) == 'string' ? conf.block : 'raw'
          this.lexer.blockTokens(token[k], token.tokens)
        } else if (conf.parse) {
          const k = typeof(conf.parse) == 'string' ? conf.parse : 'raw'
          this.lexer.inline(token[k], token.tokens)
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
    renderer: token=> `<a href="${token[group]}">${token.label || token[group]}</a>`,
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

block({
  name: 'typedec',
  hint: />TYPE/,
  rule: /^>TYPE (?<name>[a-zA-Z0-9_\-]+)\n/,
  renderer: token=> `<pre>${token.name}</pre>`,
})
block({
  name: 'datablock',
  hint: />DATA/,
  rule: /^>DATA\n(?<data>(?:[^: ]+: [^\n]*\n)*)<DATA\n/,
  parse: 'data',
  renderer: (token, inside)=> `<pre>${inside}\n</pre>`,
})
inline({
  name: 'dataline',
  hint: /[^: ]+: /,
  rule: /^(?<key>[^: ]+): (?<val>[^\n]*)\n/,
  renderer: token=> `${token.key}: ${token.val}\n`,
})
inline({
  name: 'cpblink',
  hint: /\[\[/,
  rule: /^\[\[\s*(?<nst>[^|\]]*?)\s*(?:\|\s*(?<text>.*?))?\]\]/,
  transform: token=> {
    if (!token.text) token.text = token.nst
  },
  renderer: token=> `<a href="${token.nst}">${token.text || token.nst}</a>`,
})
inline({
  name: 'dash',
  hint: /--/,
  rule: /^(?<dash>-{2,3})/,
  renderer: token=> `&mdash;`,
  transform: token=> {
    if (token.dash.length == 2) token.text = '–'
    else if (token.dash.length == 3) token.text = '—'
  }
})
block({
  name: 'figure',
  hint: /{{/,
  rule: /^{{(?<body>[\s\S]*?)}}(?:{(?<sig>[^}]+)})?(?:\s*(?<attrib>[^\n]+))?/,
  transform: token=> {
    token.body += `\n\n<<< ${token.attrib}`
  },
  block: 'body',
  renderer: (token, inside)=> `<figure>${token.inside}</figure>`,
})
block({
  name: 'attribution',
  hint: /<<</,
  rule: /^<<<\s*(?<text>.+)/,
  parse: 'text',
  renderer: (token, inside)=> `<figcaption>${token.inside}</figcaption>`,
})

block({
  name: 'block',
  hint: /{.+?(?:\/.+)?{/,
  rule: /^{(?<call>[a-zA-Z][a-zA-Z0-9\-_]+?)(?:\/(?<args>[^{]+?))?{(?<body>[\s\S]*?)}\/\k<call>}(?:{(?<sig>[^}]+)})?/,
  block: 'body',
  renderer: (token, inside)=> `<figure>${token.inside}</figure>`,
})

const decmd = /^(?<cmd>[a-zA-Z][a-zA-Z0-9\-_]*)(?:\/(?<args>.+))?$/
const decotrans =token=> {
  if (token.cmd[0] == '.') token.call = '.'
  else {
    const match = token.cmd.match(decmd)
    token.call = match?.groups.cmd
  }
  token.family = 'decorator'
}

inline({
  name: 'decorated',
  hint: /\[.+?\]\s*{[^}]+?}/,
  rule: /^\[(?<text>.+?)\]\s*{(?<cmd>.+?)}/,
  parse: 'text',
  transform: decotrans,
})
inline({
  name: 'multidec',
  hint: /\[.+?\]\s*{[^}]+?}{/,
  rule: /^(?<rest>\[.+?\]\s*(?:{[^}]+?})+){(?<cmd>.+?)}/,
  parse: 'rest',
  transform: decotrans,
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
