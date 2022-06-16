'use strict'

const { Op } = require('sequelize')

const exid =u=> u ? u.toUpperCase() : u
const imid =u=> u ? u.toLowerCase() : u

const proc =page=> {
  return page
}

const guestsess =()=> {
  return {
    handle: 'guest',
    login: false,
  }
}

const mklogin =u=> {
  return {
    handle: u.handle,
    login: true,
    uuid: u.uuid,
  }
}

const exportsess =s=> {
  if (!s.cpb || typeof(s.cpb) != 'object') {
    throw new Error(`'${JSON.stringify(s)}' is not a valid session`)
  }
  const e = Object.assign({}, s.cpb)
  return e
}

const validmime = {
  image: /^image\/(?:png|jpeg|gif|apng|avif|svg+xml|webp)$/,
}
const extmap = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/gif': 'gif',
  'image/apng': 'apng',
  'image/avif': 'avif',
  'image/svg+xml': 'svg',
  'image/webp': 'webp',
}
const thumbsizes = [
  32, 64, 128, 256, 512,
]


module.exports = { exid, imid, proc, guestsess, mklogin, exportsess, validmime, extmap, thumbsizes }
