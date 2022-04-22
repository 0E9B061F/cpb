// >TYPE tank
//
// >DATA
// introduced: March 3 1973
// produced: 1387
// <DATA
//
// >INFO tankbox
// image: CPB:images/tank_header
// <INFO
//
// >SRC Browning
// ...
// <SRC
//
// <>The tank is really strong and powerful.<Browning 55-56>
//
// Amalachae becomes the arisen Fisher Queen. <>Beginning with the fall of the east,
// Amalachae and Infinit's spheres of influence, and ideologies, begin to
// conflict.<ref canonitetl 127478>
//

const extensions = []

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

const decolink =(name, char, group)=> {
  return inline({name,
    hint: new RegExp(`\\[${char}\\/`),
    rule: new RegExp(`^\\[${char}\\/(?<${group}>[^|]+?)(?:\\s*\\|\\s*(?<text>[^\\]]*?))?\\]`),
    renderer: token=> `<a href="${token[group]}">${token.text || token[group]}</a>`,
  })
}

decolink('extlink', 'e', 'href')
decolink('wikilink', 'w', 'title')
decolink('biblelink', 'b', 'query')

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
  renderer: token=> `<a href="${token.nst}">${token.text || token.nst}</a>`,
})
inline({
  name: 'dash',
  hint: /--/,
  rule: /^(?<dash>-{2,3})/,
  renderer: token=> `&mdash;`,
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
})


module.exports = extensions
