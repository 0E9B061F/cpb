'use strict'

const db = require('./models')
const { Op } = require('sequelize')

const exid =u=> u ? u.toUpperCase() : u
const imid =u=> u ? u.toLowerCase() : u

const proc =page=> {
  return page
}

const getnstu =(namespace, title)=> {
  const hex = '[a-fA-F0-9]'
  let where
  let uuid
  if (namespace.match(`${hex}{8}-(${hex}{4}-){3}${hex}{12}`)) {
    uuid = imid(namespace)
    where = {[Op.or]: [{uuid}, {pageUuid: uuid, nextUuid: null}]}
  } else {
    where = {
      namespace, title,
      nextUuid: null
    }
  }
  return db.version.findOne({where,
    include: {
      model: db.user,
      attributes: ['handle'],
    },
  }).then(page=> {
    if (page) return proc(page)
    else false
  })
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


module.exports = { exid, imid, proc, getnstu, guestsess, mklogin, exportsess }
