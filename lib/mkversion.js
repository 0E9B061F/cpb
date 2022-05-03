'use strict'

const series = require('./SERIES.json')
const child_process = require('child_process')


let vinfo = child_process.execSync('git describe --long --tags --match "v*"', {
  encoding: 'utf-8'
})
const [version, release, hash] = vinfo.slice(1, vinfo.length-1).split('-')
const [major, minor, patch] = version.split('.').map(n=> parseInt(n))
const remainder = parseInt(release)

const codename =(maj, min)=> {
  return `${series[maj].minor[min]} ${series[maj].name}`
}

export default {
  version, remainder, hash, major, minor, patch,
  release: `r${remainder}`,
  series: codename(major, minor),
}
