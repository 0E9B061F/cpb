'use strict'

import { sample } from './util.js'

export class Fortune {
  constructor(fortunes) {
    this.fortunes = fortunes
    this.bin = [...this.fortunes]
    this.last = null
  }
  get() {
    if (!this.bin.length) {
      this.bin = [...this.fortunes]
      if (this.last) {
        const n = this.bin.indexOf(this.last)
        this.bin.splice(n, 1)
      }
    }
    const s = sample(this.bin)
    const n = this.bin.indexOf(s)
    this.bin.splice(n, 1)
    this.last = s
    return s
  }
}
