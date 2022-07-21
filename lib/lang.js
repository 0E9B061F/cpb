'use strict'



class Lang {
  static re = {
    proto: /^[a-zA-Z][a-zA-Z0-9+.\-]*:\/\//,
    pclip: /^(:?[^:]+:)?(?<clip>.+) \(/,
    cclip: /^(:?[^:]+:)?(?<clip>[^.,]+)/,
    sclip: /^(:?[^:]+:)?(?<clip>\S+)/,
  }
  static clip(t) {
    let m = t.match(this.re.pclip)
    if (m) return m.groups.clip
    m = t.match(this.re.cclip)
    if (m) return m.groups.clip
    m = t.match(this.re.sclip)
    if (m) return m.groups.clip
    return t
  }
  constructor() {
    this.extensions = []
  }
  add(conf) {
    conf = Object.assign({
      renderer: token=> token.raw,
    }, conf)
    return this.extensions.push({
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
  block(conf) { return this.add(Object.assign({}, conf, {level: 'block'})) }
  inline(conf) { return this.add(Object.assign({}, conf, {level: 'inline'})) }
  decolink(name, char, group, transform=null) {
    return this.inline({name,
      hint: new RegExp(`\\[${char}\\/`),
      rule: new RegExp(`^\\[${char}\\/(?<${group}>[^|]+?)(?:\\s*\\|\\s*(?<label>[^\\]]*?))?\\]`),
      transform: token=> {
        if (transform) transform(token)
        token.family = 'link'
      },
    })
  }
  get exports() {
    return { extensions: this.extensions }
  }
}


module.exports = Lang
