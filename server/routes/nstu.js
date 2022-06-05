'use strict'

// GET    sys:api/nst/docs:WMD
// DELETE sys:api/nst/docs:WMD
// POST   sys:api/nst/docs:WMD
// UPDATE sys:api/nst/docs:WMD

const CPB = require('../lib/cpb.js')
const libdb = require('../lib/db.js')
const Reply = require('../lib/reply.js')
const sequelize = require('sequelize')

const nstu = require('express').Router()
const { Op } = require('sequelize')
const bcrypt = require('bcrypt')

const db = require('../models')
const util = require('../lib/util.js')


const ordef =(v, d, min, max)=> {
  let o = parseInt(v)
  o = Number.isNaN(o) ? d : o
  return Math.min(max, Math.max(min, o))
}


const getOne = async (req, res)=> {
  console.log('DBG: getting single resource')
  let where = libdb.nstuWhere(req.path)
  const ver = await db.version.findOne({where,
    include: [
      { model: db.user, as: 'editor',
        attributes: ['handle'],
      },
      { model: db.resource,
        attributes: [
          'createdAt', 'views', 'trashed',
          'trashable', 'movable', 'editable'
        ],
        include: {
          model: db.user, as: 'creator',
          attributes: ['handle'],
        },
      },
      { model: db.page,
        attributes: ['uuid'],
      },
      { model: db.image,
        attributes: ['uuid', 'filename', 'x', 'y'],
      },
      { model: db.user,
        attributes: ['handle', 'lastseen', 'views', 'logins'],
      },
    ],
  })
  if (ver) Reply.ok(ver).send(res)
  else Reply.missing().send(res)
}
const getListing = async (req, res)=> {
  console.log('DBG: getting resource index')
  const nstu = CPB.NSTU.parse(req.path)
  let where = {}
  let uuid
  let size = ordef(req.query.sz, 10, 5, 50)
  let page = ordef(req.query.pg, 1, 1, 1000)

  if (nstu.title || nstu.uuid) {
    Reply.invalid().send(res)
  } else {
    if (!req.query.inh) where.nextUuid = null
    if (nstu.namespace) where.namespace = nstu.namespace
    const ver = await db.version.findAndCountAll({where,
      offset: size * (page - 1),
      limit: size,
      include: [
        { model: db.user, as: 'editor',
          attributes: ['handle'],
        },
        { model: db.resource,
          attributes: [
            'createdAt', 'views', 'trashed',
            'trashable', 'movable', 'editable'
          ],
          include: {
            model: db.user, as: 'creator',
            attributes: ['handle'],
          },
        },
        { model: db.page,
          attributes: ['uuid'],
        },
        { model: db.image,
          attributes: ['uuid', 'filename', 'x', 'y'],
        },
        { model: db.user,
          attributes: ['handle', 'lastseen', 'views', 'logins'],
        },
      ],
    })
    const rows = ver.rows
    if (ver) Reply.ok(rows, {
      pg: page, sz: size,
      ct: ver.count, pp: Math.ceil(ver.count / size),
    }).send(res)
    else Reply.missing().send(res)
  }
}
const getHistory = async (req, res)=> {
  console.log('DBG: getting resource history')
  let where = libdb.nstuWhere(req.path)
  let size = ordef(req.query.sz, 10, 5, 50)
  let page = ordef(req.query.pg, 1, 1, 1000)
  const ver = await db.version.findOne({where,
    plain: true,
    attributes: ['uuid', 'namespace', 'title'],
    include: {
      model: db.resource,
      attributes: ['uuid'],
    },
  })
  if (ver) {
    const data = await db.version.findAndCountAll({
      where: { resourceUuid: ver.resource.uuid },
      offset: size * (page - 1),
      limit: size,
      include: {
        model: db.user, as: 'editor',
        attributes: ['handle'],
      },
    })
    if (data) Reply.ok(data.rows, {
      pg: page, sz: size,
      ct: data.count, pp: Math.ceil(data.count / size),
    }).send(res)
    else Reply.internal().send(res)
  }
  else Reply.missing().send(res)
}
const getAuthors = async (req, res)=> {
  console.log('DBG: getting resource history')
  let where = libdb.nstuWhere(req.path)
  let size = ordef(req.query.sz, 100, 5, 500)
  let page = ordef(req.query.pg, 1, 1, 1000)
  const ver = await db.version.findOne({where,
    plain: true,
    attributes: ['uuid', 'namespace', 'title'],
    include: {
      model: db.resource,
      attributes: ['uuid'],
    },
  })
  if (ver) {
    const data = await db.version.findAndCountAll({
      where: { resourceUuid: ver.resource.uuid },
      offset: size * (page - 1),
      limit: size,
      group: ['editor.handle'],
      include: {
        model: db.user, as: 'editor',
        attributes: ['handle'],
      },
    })
    if (data) Reply.ok(data.count, {
      pp: Math.ceil(data.count / size),
      pg: page, sz: size,
    }).send(res)
    else Reply.internal().send(res)
  } else Reply.missing().send(res)
}
const getLinks = async (req, res)=> {
  Reply.unimplemented().send(res)
}
const getResource = async (req, res)=> {
  if (req.query.get == 'list') await getListing(req, res)
  else if (req.query.get == 'hist') await getHistory(req, res)
  else if (req.query.get == 'authors') await getAuthors(req, res)
  else if (req.query.get == 'links') await getLinks(req, res)
  else await getOne(req, res)
}

const postResource =(req, res)=> {}
const putResource =(req, res)=> {}
const deleteResource = async (req, res)=> {
  console.log('DBG: deleting resource')
  let where = libdb.nstuWhere(req.path)
  const ver = await db.version.findOne({where,
    attributes: ['uuid'],
    include: { model: db.resource, attributes: ['uuid'], },
  })
  if (ver) {
    await ver.resource.destroy()
    Reply.ok("record deleted").send(res)
  }
  else Reply.missing().send(res)
}

nstu.get('/*', deleteResource)
nstu.post('/*', postResource)
nstu.put('/*', putResource)
nstu.delete('/*', deleteResource)

module.exports = nstu
