'use strict'

const defaults = require('../../data/rc.json')
const user = require(`../../rc.json`)

class RC {
  constructor() {
    this.expand(defaults, user)
    this.baseURL = `${this.proto}://${this.domain}${this.via ? ':'+this.via : ''}`
  }
  expand(...rc) {
    Object.assign(this, ...rc)
  }
  abs(p) {
    return p ? `${this.baseURL}/${p}` : this.baseURL
  }
}

module.exports = RC
