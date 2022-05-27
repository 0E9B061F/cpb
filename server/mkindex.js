'use strict'

const { readFileSync, writeFileSync } = require('fs')
const mustache = require('mustache')
const CPB = require('../lib/cpb.js')
const vinfo = require('../lib/mkv.js')

const manifest = {
  name: CPB.rc.title,
  short_name: CPB.rc.title,
  icons: [{
    src: CPB.rc.icon('android-chrome-192x192.png').rel,
    sizes: '192x192',
    type: 'image/png'
  }, {
    src: CPB.rc.icon('android-chrome-256x256.png').rel,
    sizes: '256x256',
    type: 'image/png'
  }],
  theme_color: '#ffffff',
  background_color: '#ffffff',
  start_url: CPB.rc.baseURL,
  display: 'standalone',
}

const genRobots =()=> {
  const template = readFileSync(`${__dirname}/robots.mustache`, {encoding: 'utf-8'})
  const robots = mustache.render(template, {
    api: CPB.rc.apiRoot.rel,
    login: CPB.rc.sysRoot.add('login').rel,
    register: CPB.rc.sysRoot.add('register').rel,
    search: CPB.rc.sysRoot.add('search').rel,
    sitemap: `${CPB.rc.baseURL}/sitemap.xml`,
  })
  writeFileSync(`${__dirname}/../public/robots.txt`, robots)
}
const genManifest =()=> {
  writeFileSync(`${__dirname}/../assets/conf/site.webmanifest`, JSON.stringify(manifest,))
}
const genBConf =()=> {
  const template = readFileSync(`${__dirname}/browserconfig.mustache`, {encoding: 'utf-8'})
  const xml = mustache.render(template, {
    icon: CPB.rc.icon('mstile-150x150.png').rel,
  })
  writeFileSync(`${__dirname}/../assets/conf/browserconfig.xml`, xml)
}
const genIndex =()=> {
  const template = readFileSync(`${__dirname}/index.mustache`, {encoding: 'utf-8'})
  const html = mustache.render(template, {
    rc: CPB.rc, vinfo,
    cpbcss: CPB.rc.asset('build/cpb.css').rel,
    cpbjs: CPB.rc.asset('build/cpb.js').rel,
    globalcss: CPB.rc.asset('css/global.css').rel,
    bonf: CPB.rc.asset('conf/browserconfig.xml').rel,
    appleicon: CPB.rc.icon('apple-touch-icon.png').rel,
    fav32: CPB.rc.icon('favicon-32x32.png').rel,
    fav16: CPB.rc.icon('favicon-16x16.png').rel,
    safari: CPB.rc.icon('safari-pinned-tab.svg').rel,
    manifest: CPB.rc.asset('conf/site.webmanifest').rel,
    ogimage: CPB.rc.image('og-default.png').rel,
  })
  writeFileSync(`${__dirname}/../public/index.html`, html)
}

const generate =()=> {
  genRobots()
  genIndex()
  genManifest()
  genBConf()
}

module.exports = generate
