'use strict'

const CPB = require('../lib/cpb.js')

const defaults = require('../data/rc.server.json')
const user = require(`../rc.server.json`)

CPB.rc.expand(defaults, user)

module.exports = CPB
