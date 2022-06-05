'use strict'


class Resource {
  constructor(conf) {
    this.type = conf.type
  }
}

class Listing {

}

class Reply extends Resource {
  static ok(val=null, conf={}) { return new this({...conf, val}) }
  static missing() { return new this({err: 1, msg: 'no resource found'}) }
  static invalid() { return new this({err: 3, msg: 'invalid action'}) }
  static internal() { return new this({err: 4, msg: 'internal error'}) }
  static unimplemented() { return new this({err: 5, msg: 'feature unimplemented'}) }
  constructor(conf={}) {
    conf = Object.assign({
      err: 0, msg: null, val: null,
    }, conf)
    super(conf)
    Object.assign(this, conf)
    if (this.val) {
      this.type = Array.isArray(this.val) ? 'list' : 'item'
    }
  }
  send(res) {
    res.charset = res.charset || 'utf-8'
    res.get('Content-Type') || res.set('Content-Type', 'application/json')
    res.send(JSON.stringify(this, (k, v) => v ?? undefined))
    res.end()
  }
}


module.exports = Reply
