'use strict'

const RC = require('./cpb/rc.js')
const { rep, re, mask, rq, mkq } = require('./util.js')

const rc = new RC()

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
    else if (typeof(this.tail) == 'string') {
      if (this.tail[0] == '/') this.tail = this.tail.slice(1)
      this.tail = this.tail.split('/')
    }
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
    this.abs = rc.abs(this.normal)
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
  add(...parts) {
    parts = parts.map(x=> x.split('/').filter(p=> p)).flat()
    let title = false
    if (!this.title) {
      title = parts[0]
      parts = parts.slice(1)
    }
    return new this.constructor({
      namespace: this.namespace,
      title: title || this.title,
      uuid: this.uuid,
      opts: this.opts,
      tail: [...this.tail, ...parts],
      hash: this.hash,
    })
  }
  get rel() { return `/${this.normal}` }
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
      } else if (this.namespace) {
        if (this.userspace) out = this.namespace
        else out = `${this.namespace}:`
      }
      if (this.tail && this.tail.length) out = `${out}/${this.tail.join('/')}`
      if (this.optstr) out = `${out}${this.optstr}`
      if (this.hash) out = `${out}#${this.hash}`
    }
    return out.replace(/ /g, '_')
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

class Conf extends RC {
  constructor() {
    super()
    this.sysRoot = new NSTU({namespace: this.syskey})
    this.apiRoot = this.sysRoot.add(this.defapi)
    this.dataRoot = this.sysRoot.add(this.defdata)
  }
  api(...parts) { return this.apiRoot.add(...parts) }
  asset(...parts) { return this.dataRoot.add(...parts) }
  icon(...parts) { return this.asset('icons', ...parts) }
  image(...parts) { return this.asset('images', ...parts) }
}

class CPB {
  static NSTU = NSTU
  static Title = Title
  static Location = Location
  static rc = new Conf()
}

module.exports = CPB
