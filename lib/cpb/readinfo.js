'use strict'

const CPB = require('../cpb.js')

class ReadInfo {
  constructor(wc) {
    this.wordCount = wc
    this.minutes = this.wordCount / CPB.rc.readSpeed
    this.floor = Math.floor(this.minutes)
    this.ceil = Math.ceil(this.minutes)
    if (this.minutes < 2) this.label = 'a minute'
    else if (this.minutes < 10) {
      if ((this.minutes % 1) != 0) {
        this.label = `${this.floor}-${this.ceil} minutes`
      } else {
        this.label = `${this.ceil} minutes`
      }
    } else {
      this.label = `${this.ceil} minutes`
    }
  }
}

module.exports = ReadInfo
