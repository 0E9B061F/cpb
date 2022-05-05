'use strict'

import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { existsSync, readFileSync } from 'fs'
const dir = dirname(fileURLToPath(import.meta.url))
const root = `${dir}/..`

const series = require(`${root}/SERIES.json`)
const child_process = require('child_process')

const buildfile = `${root}/buildinfo`

let vinfo
if (existsSync(buildfile)) {
  vinfo = readFileSync(buildfile, {encoding: 'utf-8'})
} else {
  vinfo = child_process.execSync(`git --git-dir=${root}/.git describe --long --tags --match "v*"`, {
    encoding: 'utf-8'
  })
}
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
