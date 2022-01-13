'use strict'

const repl = require('repl')

const init =c=> {
  const m = require('./models.js')
  c.Version = m.Version
  c.Page = m.Page
}

const r = repl.start({prompt: '> '})
init(r.context)

r.on('reset', init)

