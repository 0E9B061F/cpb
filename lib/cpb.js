'use strict'

const rc = require('./rc.js')
const { rep, re, mask, rq, mkq } = require('./util.js')

class Matchable {
  static parse(...args) { return new this(...args) }
  get valid() { return !!this.match }
}

class Title extends Matchable {
  static sensitive = new RegExp(`^(robots\.txt|favicon\.ico|sitemap(?:-.+?)?\.xml|${rep.uuid}|~.*)$`)
  constructor(raw) {
    super()
    this.raw = raw
    this.match = this.raw.match(re.title)
    this.shortenable = this.match ? !this.raw.match(Title.sensitive) : false
  }
}

class NSTU {
  static parse(raw) {
    const conf = {}
    const match = raw.match(re.nstu)
    conf.namespace = match?.groups.ns || match?.groups.jns || match?.groups.us || match?.groups.jus
    conf.title = match?.groups.t || match?.groups.jt
    conf.tail = match?.groups.tail
    conf.uuid = match?.groups.uuid
    conf.hash = match?.groups.hash
    conf.opts = match?.groups.opts
    return new this(conf)
  }
  constructor(conf) {
    conf = Object.assign({
      namespace: null, title: null, tail: null, uuid: null,
      opts: null, hash: null,
    }, conf)
    this.uuid = conf.uuid
    this.uuid = this.uuid?.toUpperCase()

    this.namespace = conf.namespace
    this.userspace = conf.namespace?.[0] == '~'

    this.title = conf.title
    this.tail = conf.tail

    this.titlestr = this.title?.replace(/_/g, ' ') || null

    if (this.title && !this.namespace) this.namespace = rc.defns

    if (!this.tail) this.tail = []
    else if (typeof(this.tail) == 'string') this.tail = this.tail.split('/')
    this.tailstr = this.tail.join('/')

    this.path = this.title ? [this.title, ...this.tail] : []

    this.dirname = this.path.slice(0,this.path.length-1)
    this.name = this.path[this.path.length-1]

    if (this.title) this.titlep = Title.parse(this.title)

    this.opts = conf.opts || {}
    this.hash = conf.hash

    if (this.opts && typeof(this.opts) == 'string') {
      this.opts = mask(rq('?'+this.opts), {
				pg: undefined, sz: undefined,
				inf: undefined, inh: undefined,
				edit: undefined, history: undefined,
			})
    }

    this.optstr = mkq(this.opts) || null

    this.valid = true
    this.normal = this.normalize()
  }
  same(b) {
    let s = this.uuid == b.uuid
    && this.namespace == b.namespace
    && this.titlestr == b.titlestr
    && this.tailstr == b.tailstr
    && this.optstr == b.optstr
    if (this.hash) s = s && this.hash == b.hash
    return s
  }
  changed(b) {
    return !(this.uuid == b.uuid
           && this.namespace == b.namespace
           && this.titlestr == b.titlestr
           && this.tailstr == b.tailstr
           && this.optstr == b.optstr)
  }
  get shortenable() {
    return this.titlep?.shortenable || false
  }
  normalize() {
    let out = ''
    if (this.valid) {
      if (this.uuid) out = this.uuid
      else if (this.title) {
        const ns = this.namespace || rc.defns
        if (ns == rc.defns && this.shortenable) {
          out = this.title
        } else {
          out = `${ns}:${this.title}`
        }
      } else {
        if (this.userspace) out = this.namespace
        else out = `${this.namespace}:`
      }
      if (this.tail) out = `${out}${this.tail.join('/')}`
      if (this.optstr) out = `${out}${this.optstr}`
      if (this.hash) out = `${out}#${this.hash}`
    }
    return out
  }
}

class Location extends NSTU {
  constructor(conf) {
    conf = Object.assign({
      load: true
    }, conf)
    super(conf)
    this.load = conf.load
  }
  compare(old) {
    this.load = old ? this.changed(old) : true
  }
  get cmd() { return this.hash }
  get opt() { return this.opts || {}}
  get args() { return this.tail }
  get sub() { return this.tail }
}

class CPB {
  static NSTU = NSTU
  static Title = Title
  static Location = Location
}

module.exports = CPB
