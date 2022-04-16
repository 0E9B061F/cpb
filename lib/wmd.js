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
        if (conf.parse) {
          const k = typeof(conf.parse) == 'string' ? conf.parse : 'raw'
          this.lexer.inline(token[k], token.tokens)
        }
        return token
      }
    },
    renderer(token) {
      const inside = this.parser.parseInline(token.tokens)
      return conf.renderer(token, inside)
    }
  })
}
const block =conf=> add(Object.assign({}, conf, {level: 'block'}))
const inline =conf=> add(Object.assign({}, conf, {level: 'inline'}))

const decolink =(name, char, group)=> {
  return inline({name,
    hint: new RegExp(`\\[${char}\\/`),
    rule: new RegExp(`^\\[${char}\\/(?<${group}>[^|]+?)(?:\\s*\\|\\s*(?<text>[^\\]]+))?\\]`),
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
  rule: /^\[\[(?<nst>[^|]+?)(?:\|(?<text>.+?))?\]\]/,
  renderer: token=> `<a href="${token.nst}">${token.text || token.nst}</a>`,
})
inline({
  name: 'dash',
  hint: /--/,
  rule: /^(?<dash>-{2,3})/,
  renderer: token=> `&mdash;`,
})
block({
  name: 'quotation',
  hint: />-/,
  rule: /^>-\s*(?<quote>.*?)\s*--\s*(?<attribution>.*)/,
  renderer: (token, inside)=> `<blockquote>${token.inside}</blockquote>`,
  parse: 'attribution',
})

module.exports = extensions
