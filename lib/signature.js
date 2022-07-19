'use strict'

class Received {
  constructor(args) {
    this.positional = []
    this.named = {}
    this.names = []
    for (let i = 0, m = args.length; i < m; i++) {
      if (typeof(args[i][0]) == 'number') {
        this.positional[args[i][0]] = args[i][1]
      } else if (typeof(args[i][0]) == 'string') {
        this.named[args[i][0]] = args[i][1]
        this.names.push(args[i][0])
      }
    }
  }
}

class Argument {
  constructor(n, p, d) {
    this.name = n
    this.position = p
    this.default = d
    this.unset = true
  }
  get hasDefault() { return this.default !== undefined }
  get invalid() { return !this.hasDefault && this.unset }
  get value() { return this.setval || this.default }
  set(v) {
    if (!this.unset) throw new Error('already set')
    this.setval = v
    this.unset = false
  }
}

class Signature {
  constructor(sig) {
    this.positions = []
    this.index = {}
    this.free = {}
    this.tail = []
    this.collect = sig[sig.length-1] == '*'
    if (this.collect) sig.pop()
    for (let i = 0, m = sig.length; i < m; i++) {
      let s = sig[i]
      if (!Array.isArray(s)) s = [s]
      const n = s[0]
      const d = s[1]
      if (this.index[n]) throw new Error('already exists')
      const arg = new Argument(n, i, d)
      this.positions[i] = arg
      this.index[n] = arg
    }
  }
  setpos(i, v) {
    if (this.positions[i]) {
      console.log(this.positions[i])
      this.positions[i].set(v)
    } else if (this.collect) {
      this.tail.push(v)
    }
  }
  receive(rec) {
    for (let i = 0, m = rec.positional.length; i < m; i++) {
      this.setpos(i, rec.positional[i])
    }
    let n, v
    for (let i = 0, m = rec.names.length; i < m; i++) {
      n = rec.names[i]
      v = rec.named[n]
      if (this.index[n]) {
        this.index[n].set(v)
      } else {
        this.free[n] = v
      }
    }
  }
  get(n) {
    return this.index[n]?.value || this.free[n]
  }
  get values() { return [...this.positions.map(p=> p.value), ...this.tail] }
}

const consume =(args, sig=[])=> {
  if (!Array.isArray(sig)) sig = [sig]
  const rec = new Received(args)
  console.log(rec)
  sig = new Signature(sig)
  sig.receive(rec)
  return sig
}

module.exports = {
  consume
}
