'use strict'

const rc = require('./rc.js')
const { rep, re, mask, rq } = require('./util.js')

class Matchable {
  static parse(...args) { return new this(...args) }
  get valid() { return !!this.match }
}

class Title extends Matchable {
  static sensitive = new RegExp(`^(robots\.txt|favicon\.ico|sitemap(?:-.+?)?\.xml|${rep.uuid}|~.*)$`)
  constructor(raw) {
    super()
    this.raw = raw
    console.log(`raw: ${this.raw}`)
    this.match = this.raw.match(re.title)
    this.shortenable = this.match ? !this.raw.match(Title.sensitive) : false
  }
}

class NSTU {
  static parse(raw) {
    const conf = {}
    const match = raw.match(re.nstu)
    conf.namespace = match?.groups.ns || match?.groups.jns || match?.groups.us || match?.groups.jus
    const head = match?.groups.t || match?.groups.jt
    const tail = match?.groups.tail
    if (head && tail) conf.path = `${head}${tail}`
    else conf.path = head || tail
    conf.uuid = match?.groups.uuid
    conf.hash = match?.groups.hash
    conf.opts = match?.groups.opts
    return new this(conf)
  }
  constructor(conf) {
    conf = Object.assign({
      namespace: null, path: null, uuid: null,
      opts: null, hash: null,
    }, conf)
    this.uuid = conf.uuid
    this.namespace = conf.namespace || rc.defns
    this.userspace = conf.namespace?.[0] == '~'
    this.path = conf.path
    const t = this.path?.split("/")
    this.head = t?.[0]
    this.tail = t?.slice(1)
    this.dirname = t?.slice(0,t.length-1)
    this.title = t?.[t.length-1]
    if (this.head) this.head = Title.parse(this.head)
    this.opts = conf.opts
    this.hash = conf.hash
    if (this.opts && typeof(this.opts) == 'string') {
      this.opts = mask(rq('?'+this.opts), {
				pg: undefined, sz: undefined,
				inf: undefined, inh: undefined,
				edit: undefined, history: undefined,
			})
    }
    this.valid = this.path?.[0] != '/'
    this.normal = this.normalize()
  }
  normalize() {
    let out = ''
    if (this.valid) {
      if (this.uuid) out = this.uuid
      else if (this.head) {
        const ns = this.namespace || rc.defns
        if (ns == rc.defns && this.head.shortenable) {
          out = this.head.raw
        } else {
          out = `${ns}:${this.head.raw}`
        }
      } else {
        if (this.userspace) out = this.namespace
        else out = `${this.namespace}:`
      }
      if (this.tail) out = `${out}/${this.tail.join('/')}`
      if (this.hash) out = `${out}#${this.hash}`
    }
    return out
  }
}

class CPB {
  static NSTU = NSTU
  static Title = Title
}

module.exports = CPB
