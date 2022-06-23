'use strict'


class Resource {
  constructor(conf) {
    this.type = conf.type
  }
}

class Listing {

}

const mkmsg =(...m)=> m.filter(x=> !!x).join(' - ')

class Reply extends Resource {
  static ok(val=null, conf={}) { return new this({...conf, val}) }
  static missing(m) { return new this({
    err: 1, name: 'missing',
    msg: mkmsg('no resource found', m),
  })}
  static unauthorized(m) { return new this({
    err: 2, name: 'unauthorized',
    msg: mkmsg('you may not do that', m),
  })}
  static invalid(m) { return new this({
    err: 3, name: 'invalid',
    msg: mkmsg('action invalid', m),
  })}
  static internal(m) { return new this({
    err: 4, name: 'internal',
    msg: mkmsg('server encountered an error', m),
  })}
  static input(m) { return new this({
    err: 5, name: 'input',
    msg: mkmsg('malformed input', m),
  })}
  static unimplemented(m) { return new this({
    err: 6, name: 'unimplemented',
    msg: mkmsg('this feature is unimplemented', m),
  })}
  static unallowed(m) { return new this({
    err: 7, name: 'unallowed',
    msg: mkmsg('that action has been disabled', m),
  })}
  constructor(conf={}) {
    conf = Object.assign({
      err: 0, name: null, msg: null, val: null,
    }, conf)
    super(conf)
    Object.assign(this, conf)
    if (this.val) {
      this.type = Array.isArray(this.val) ? 'list' : 'item'
    }
  }
  parseErrors(errors) {
    const details = []
    errors.forEach(e=> details.push(e.message))
    if (details.length) this.details = details
    return this
  }
  send(res) {
    res.charset = res.charset || 'utf-8'
    res.get('Content-Type') || res.set('Content-Type', 'application/json')
    res.send(JSON.stringify(this, (k, v) => v ?? undefined))
    res.end()
  }
}


module.exports = Reply
