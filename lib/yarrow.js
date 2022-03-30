'use strict'

const SeedRandom = require('seedrandom')

class Reading {
  constructor(lines, change) {
    this.hexagram = parseInt(lines.join(''), 2)
    this.change = parseInt(change.join(''), 2)
    this.zhigua = this.change ? this.hexagram ^ this.change : null
  }
}

class Oracle {
  constructor() {
    this.rng = null
    this.lines = []
    this.change = []
  }
  query(q) {
    this.rng = new SeedRandom(q, {entropy:true})
    this.lines = []
    this.change = []
    this.generate()
    return new Reading(this.lines, this.change)
  }
  generate() {
    for (let l = 1; l <= 6; l++) {
      let line = new Line(this)
      switch(line.sum) {
        case 9:
          this.lines.push(1)
          this.change.push(1)
          break;
        case 8:
          this.lines.push(0)
          this.change.push(0)
          break;
        case 7:
          this.lines.push(1)
          this.change.push(0)
          break;
        case 6:
          this.lines.push(0)
          this.change.push(1)
          break;
        default:
          throw 'unknown line: ' + line
          break;
      }
    }
  }
}

class Line {
  constructor(oracle) {
    this.oracle = oracle
    this.stalks = 49
    this.sum = 0
    this.generate()
  }
  generate() {
    this.stalks = 49
    this.sum = 0
    for (let c = 1; c <= 3; c++) {
      this.calculate()
    }
  }
  calculate() {
    const remainder =size=> size % 4 || 4

    let pa = Math.ceil(this.oracle.rng() * (this.stalks - 9) + 4)
    let pb = this.stalks - pa

    pb -= 1
    let used = 1

    let r = remainder(pa)
    pa -= r
    used += r

    r = remainder(pb)
    pb -= r
    used += r

    let composite = { used }

    let s = used
    switch(used) {
      case 9:
      case 8:
        s = 2
        break;
      case 5:
      case 4:
        s = 3
        break;
      default:
        throw 'unknown number = ' + used
        break;
    }
    this.stalks -= used
    this.sum += s
  }
}

module.exports = Oracle
