#!/usr/bin/env node
'use strict'

const repl = require('repl')
const { Op } = require('sequelize')
const { inspect } = require('util')

let context

const init =c=> {
  Object.assign(c, {
    Op,
    db: require('../server/models'),
    u: require('../lib/util.js'),
    sig: require('../lib/signature.js'),
    seeders: require('../server/lib/seeders.js'),
    CPB: require('../lib/cpb.js'),
    vinfo: require('../lib/mkv.js'),
    lexer: require('../lib/wmd/lexer.js'),
    dlex: require('../lib/dmd/lexer.js'),
    dmd: require('../lib/dmd/dmd.js'),
    wmd: require('../lib/wmd/wmd.js'),
  })
}

function result(raw) {
  return inspect(raw, {depth: 99, colors: true})
}

const r = repl.start({prompt: 'CPB> ', writer: result})
r.setupHistory(`${__dirname}/../.repl-log`, (e,r)=> {})
init(r.context)

r.on('reset', init)
