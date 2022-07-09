'use strict'

const defaults = require('../../data/rc.json')
const user = require(`../../rc.json`)

class RC {
  constructor() {
    this.expand(defaults, user)
    this.types = ['page', 'image', 'user']
    this.baseURL = `${this.proto}://${this.domain}${this.via ? ':'+this.via : ''}`
    this.searchConfig.type = {
      valid: [...this.types, 'any'],
      default: 'any',
    }
    this.listDefaults = {}
    this.searchDefaults = {}
    this.searchConfig = Object.assign({}, this.listConfig, this.searchConfig)
    Object.keys(this.listConfig).forEach(o=> {
      const conf = this.listConfig[o]
      if (conf && typeof(conf) == 'object' && conf.default !== undefined) {
        this.listDefaults[o] = conf.default
      } else {
        this.listDefaults[o] = conf
      }
    })
    Object.keys(this.searchConfig).forEach(o=> {
      const conf = this.searchConfig[o]
      if (conf && typeof(conf) == 'object' && conf.default !== undefined) {
        this.searchDefaults[o] = conf.default
      } else {
        this.searchDefaults[o] = conf
      }
    })

  }
  expand(...rc) {
    Object.assign(this, ...rc)
  }
  abs(p) {
    return p ? `${this.baseURL}/${p}` : this.baseURL
  }
}

module.exports = RC
