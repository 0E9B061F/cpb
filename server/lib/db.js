'use strict'

const CPB = require('../lib/cpb.js')
const db = require('../models')
const { Op } = require('sequelize')


const nstuWhere =(nstu)=> {
  if (typeof(nstu) == 'string') nstu = CPB.NSTU.parse(nstu)
  let where
  if (nstu.uuid) {
    const uuid = nstu.uuid.toLowerCase()
    where = {[Op.or]: [{uuid}, {resourceUuid: uuid, nextUuid: null}]}
  } else {
    where = {nextUuid: null}
    const ns = nstu.namespace || null
    const t = nstu.title || null
    where.namespace = ns
    where.title = t
  }
  return where
}


module.exports = { nstuWhere }
