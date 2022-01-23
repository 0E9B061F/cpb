'use strict'

const repl = require('repl')

const init =c=> {
  const db = require('./models')
  c.db = db
}

const r = repl.start({prompt: '> '})
init(r.context)

r.on('reset', init)
