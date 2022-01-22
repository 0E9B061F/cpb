'use strict'

const { Page } = require('./models.js')
const { Op } = require('sequelize')

const exid =u=> u ? u.toUpperCase() : u
const imid =u=> u ? u.toLowerCase() : u

const proc =page=> {
  return {
    namespace: page.namespace,
    title: page.title,
    body: page.body,
    uuid: exid(page.uuid),
    vuuid: exid(page.vuuid),
    parentVuuid: exid(page.parentVuuid),
    childVuuid: exid(page.childVuuid),
    vnum: page.vnum,
    createdAt: page.createdAt,
    updatedAt: page.updatedAt,
  }
}

const getnstu =(namespace, title)=> {
  const hex = '[a-fA-F0-9]'
  let where
  let uuid
  if (namespace.match(`${hex}{8}-(${hex}{4}-){3}${hex}{12}`)) {
    uuid = namespace
    where = {[Op.or]: [{uuid, childVuuid: null}, {vuuid: uuid}]}
  } else {
    where = {
      namespace, title,
      childVuuid: null
    }
  }
  return Page.findOne({where}).then(page=> {
    if (page) return proc(page)
    else false
  })
}


module.exports = { exid, imid, proc, getnstu }
