'use strict'

const defaults = require('../data/rc.json')
const user = require(`../rc.json`)

module.exports = Object.assign({}, defaults, user)
