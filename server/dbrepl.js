'use strict'

const repl = require('repl')
const { Op } = require('sequelize')
const util = require('../lib/util.js')

const init =c=> {
  const db = require('./models')
  c.db = db
  c.Op = Op
  c.u = util
}

const r = repl.start({prompt: '> '})
init(r.context)

r.on('reset', init)
