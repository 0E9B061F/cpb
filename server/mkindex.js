'use strict'

const { readFileSync, writeFileSync } = require('fs')
const mustache = require('mustache')
const rc = require('./rc.js')
const vinfo = require('../lib/mkv.js')

console.log(vinfo)

const generate =()=> {
  const template = readFileSync(`${__dirname}/index.mustache`, {encoding: 'utf-8'})
  const html = mustache.render(template, {rc, vinfo})
  writeFileSync(`${__dirname}/../public/index.html`, html)
}

module.exports = generate
