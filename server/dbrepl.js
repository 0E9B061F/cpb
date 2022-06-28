'use strict'

const repl = require('repl')
const { Op } = require('sequelize')
const util = require('../lib/util.js')
const cpb = require('../lib/cpb.js')
const seeders = require('./lib/seeders.js')

const init =c=> {
  const db = require('./models')
  c.db = db
  c.Op = Op
  c.u = util
  c.seed = seeders
  c.cpb = cpb
}

const r = repl.start({prompt: '> '})
init(r.context)

r.on('reset', init)
