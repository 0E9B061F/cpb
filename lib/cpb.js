'use strict'

const RC = require('./cpb/rc.js')
const { rep, re, mask, mute, rq, mkq, deepAssign } = require('./util.js')

const rc = new RC()

const optMask = {
  pg: undefined, sz: undefined,
  inf: undefined, inh: undefined,
  edit: undefined, history: undefined,
  q: undefined, hl: undefined,
  tab: undefined,
}

const parseOpts =o=> {
  if (!o) o = {}
  if (typeof(o) == 'string') {
    if (o[0] != '?') o = `?${o}`
    o = rq(o)
  }
  return mask(o, optMask)
}

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
  static defaults = {
    namespace: null, title: null, tail: null,
    uuid: null,
    opts: null, hash: null,
  }
  static mkconf =(...confs)=> {
    confs = [new Object(null), this.defaults, ...confs]
    confs.forEach(conf=> {
      if (!conf.opts) conf.opts = {}
      if (typeof(conf.opts) == 'string') conf.opts = parseOpts(conf.opts)
    })
    const head = confs[0]
    const tail = confs.slice(1)
    tail.forEach(t=> {
      deepAssign(head, t)
    })
    return head
  }
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
  constructor(...confs) {
    this.confs = confs
    this.conf = this.constructor.mkconf(...this.confs)
    this.uuid = this.conf.uuid
    this.uuid = this.uuid?.toUpperCase()

    this.namespace = this.conf.namespace
    this.userspace = this.conf.namespace?.[0] == '~'

    this.title = this.conf.title
    this.tail = this.conf.tail

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

    this.opts = this.conf.opts
    this.hash = this.conf.hash

    this.optstr = mkq(this.opts)
    this.optcmp = mkq(mute(this.opts, 'hl tab'))

    this.valid = true
    this.normal = this.normalize()
    this.abs = rc.abs(this.normal)
  }
  same(b) {
    let s = this.uuid == b.uuid
    && this.namespace == b.namespace
    && this.titlestr == b.titlestr
    && this.tailstr == b.tailstr
    if (this.optstr) s = s && this.optstr == b.optstr
    if (this.hash) s = s && this.hash == b.hash
    return s
  }
  changed(b) {
    return !( this.uuid == b.uuid
           && this.namespace == b.namespace
           && this.titlestr == b.titlestr
           && this.tailstr == b.tailstr
           && this.optcmp == b.optcmp
           )
  }
  amend(...confs) {
    return new this.constructor(...this.confs, ...confs)
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
  static defaults = {
    load: true, scroll: false,
  }
  constructor(...confs) {
    super(Location.defaults, ...confs)
    this.load = this.conf.load
    this.scroll = this.conf.scroll
  }
  compare(old) {
    this.load = old ? this.changed(old) : true
    if (!this.load) {
      if (this.hash && this.hash != old.hash) {
        this.scroll = true
      }
    }
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
