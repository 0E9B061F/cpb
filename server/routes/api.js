'use strict'

// sys:api/nstu/docs:WMD
// sys:api/nstu/docs:?get=list
// sys:api/nstu/?get=list
// sys:api/nstu/Home?get=history
// sys:api/nstu/Home?get=links
// sys:api/nstu/Home?get=authors
// sys:api/nstu/tag:tank?get=list
// sys:api/nstu/tag:blog?get=list
// sys:api/nstu/docs:WMD?get=list
// sys:api/nstu/main:draft_1
// sys:api/nstu/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX

// sys:api/list/
// sys:api/list/docs:
// sys:api/list/~root

// sys:api/hist/main:Home
// sys:api/hist/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX

// sys:api/search/QUERY

const CPB = require('../lib/cpb.js')
const { needlogin, needlogout, notsingleuser } = require('../lib/middleware.js')

const api = require('express').Router()
const { Op } = require('sequelize')
const bcrypt = require('bcrypt')

const nstu = require('./nstu.js')

const db = require('../models')
const util = require('../lib/util.js')
const { isuu } = require('../../lib/util.js')
const libdb = require('../lib/db.js')

const saltRounds = 10

const bi =r=> {
  const b = r.split('/').slice(0,-1).join('/')
  return [b, r]
}

const resp =(err=0, msg=null, val=null)=> {
  const r = { err }
  if (msg && msg.length) r.msg = msg
  if (val !== null && val !== undefined) r.val = val
  return r
}
const ok =v=> resp(0, '', v)
const missing =v=> resp(1, 'record not found', v)
const forbidden =v=> resp(2, 'unauthorized action', v)
const invalid =v=> resp(3, 'invalid action', v)
const internal =(e,v)=> {
  throw e
  console.log(process.env.NODE_ENV)
  if (process.env.NODE_ENV == 'development') {
    return resp(4, `internal error: ${JSON.stringify(e)}`, v)
  } else {
    return resp(4, 'internal error', v)
  }
}
const inputerr =v=> resp(5, 'input error', v)

const ordef =(v, d)=> {
  const o = parseInt(v)
  return Number.isNaN(o) ? d : o
}

api.use('/nstu', nstu)

api.get('/titles/:ns', (req, res)=> {
  db.version.findAll({
    attributes: ['title'],
    where: {
      nextUuid: null,
      namespace: req.params.ns
    },
  }).then(titles=> {
    res.json(ok(titles.map(t=> t.title)))
  }).catch(e=> res.json(internal(e)))
})

api.post('/missing', (req, res) => {
  const titles = {}
  const nstus = req.body.nstus || []
  for (let i = 0, m = nstus.length; i < m; i++) {
    const nstu = CPB.NSTU.parse(nstus[i])
    if (nstu.uuid) {
      titles[nstu.normal] = {[Op.or]: [{resourceUuid: nstu.uuid.toLowerCase(), nextUuid: null}, {uuid: nstu.uuid.toLowerCase()}]}
    } else {
      titles[nstu.normal] = {namespace: nstu.namespace, title: nstu.title || null, nextUuid: null}
    }
  }
  db.version.findAll({
    where: {
      [Op.or]: Object.values(titles),
    },
    include: {
      model: db.resource,
      where: { trashed: false },
    }
  }).then(pages=> {
    const map = {}
    const found = {}
    for (let i = 0, m = pages.length; i < m; i++) {
      const p = pages[i]
      const n = new CPB.NSTU({namespace: p.namespace, title: p.title})
      found[n.normal] = true
      found[p.uuid.toUpperCase()] = true
      if (!p.nextUuid) found[p.resourceUuid.toUpperCase()] = true
    }
    const keys = Object.keys(titles)
    for (let i = 0, m = keys.length; i < m; i++) {
      const nstu = keys[i]
      if (!found[nstu]) map[nstu] = true
    }
    res.json(ok(map))
  }).catch(e=> res.json(internal(e)))
})


module.exports = api
