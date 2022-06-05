'use strict'

const CPB = require('../lib/cpb.js')
const db = require('../models')


const nstuWhere =(nstu)=> {
  if (typeof(nstu) == 'string') nstu = CPB.NSTU.parse(nstu)
  let where
  if (nstu.uuid) {
    const uuid = nstu.uuid.toUpperCase()
    where = {[Op.or]: [{uuid}, {resourceUuid: uuid, nextUuid: null}]}
  } else {
    where = {nextUuid: null}
    if (nstu.namespace) where.namespace = nstu.namespace
    if (nstu.title) where.title = nstu.title
  }
  return where
}


module.exports = { nstuWhere }
