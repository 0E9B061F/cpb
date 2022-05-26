'use strict'

const { dirname } = require('path')
const { fileURLToPath } = require('url')
const { existsSync, readFileSync } = require('fs')

const series = require(`${__dirname}/../SERIES.json`)
const child_process = require('child_process')

const buildfile = `${__dirname}/../buildinfo`

let vinfo
if (existsSync(buildfile)) {
  vinfo = readFileSync(buildfile, {encoding: 'utf-8'})
} else {
  vinfo = child_process.execSync(`git --git-dir=${__dirname}/../.git describe --long --tags --match "v*"`, {
    encoding: 'utf-8'
  })
}
const [version, release, hash] = vinfo.slice(1, vinfo.length-1).split('-')
const [major, minor, patch] = version.split('.').map(n=> parseInt(n))
const remainder = parseInt(release)

const codename =(maj, min)=> {
  return `${series[maj].minor[min]} ${series[maj].name}`
}

const info = {
  version, remainder, hash, major, minor, patch,
  release: `r${remainder}`,
  series: codename(major, minor),
  name: "Commonplace Book", short: "CPB",
}
info.fullver = info.remainder ? `${info.version}.${info.release}` : info.version

module.exports = info
