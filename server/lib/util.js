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
    uuid: '00000000-0000-0000-0000-000000000000',
  }
}

const mklogin =u=> {
  return {
    login: true,
    uuid: u.uuid,
    handle: u.handle,
    config: u.config,
  }
}

const exportsess =s=> {
  if (!s.cpb || typeof(s.cpb) != 'object') {
    throw new Error(`'${JSON.stringify(s)}' is not a valid session`)
  }
  const e = Object.assign({}, s.cpb)
  e.uuid = s.uuid
  return e
}


module.exports = { exid, imid, proc, guestsess, mklogin, exportsess }
