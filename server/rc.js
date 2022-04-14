'use strict'

const baserc = require('../lib/rc.js')
const defaults = require('../data/rc.server.json')
const user = require(`../rc.server.json`)

module.exports = Object.assign({}, baserc, defaults, user)
