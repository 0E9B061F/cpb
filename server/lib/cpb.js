'use strict'

const pathlib = require('path')
const fs = require('fs-extra')
const CPB = require('../../lib/cpb.js')

const defaults = require('../../data/rc.server.json')
const user = require(`../../rc.server.json`)

CPB.rc.expand(defaults, user)
CPB.rc.uploads.temp = pathlib.resolve(CPB.rc.uploads.temp)
if (process.env.NODE_ENV == "test") {
  CPB.rc.uploads.path = pathlib.resolve(CPB.rc.uploads.testpath)
} else {
  CPB.rc.uploads.path = pathlib.resolve(CPB.rc.uploads.path)
}

fs.mkdirpSync(CPB.rc.uploads.temp)
fs.mkdirpSync(CPB.rc.uploads.path)

module.exports = CPB
