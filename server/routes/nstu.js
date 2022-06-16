'use strict'

// GET    sys:api/nst/docs:WMD
// DELETE sys:api/nst/docs:WMD
// POST   sys:api/nst/docs:WMD
// UPDATE sys:api/nst/docs:WMD

const CPB = require('../lib/cpb.js')
const CPBImage = require('../lib/cpbimage.js')
const libdb = require('../lib/db.js')
const Reply = require('../lib/reply.js')
const sequelize = require('sequelize')
const { v4 } = require('uuid')
const multer  = require('multer')
const fs = require('fs')
const pathlib = require('path')
const rimraf = require('rimraf')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/../../assets/uploads`)
  },
  filename: function (req, file, cb) {
    const base = req.imageUuid.toUpperCase()
    const ext = util.extmap[file.mimetype] || ''
    const full = `${base}.${ext}`
    req.filename = { base, ext, full }
    cb(null, full)
  }
})
const upload = multer({ storage })

const nstu = require('express').Router()
const { Op } = require('sequelize')
const bcrypt = require('bcrypt')

const db = require('../models')
const util = require('../lib/util.js')

const loggedas =(h, req)=> {
  return req.session.cpb.login && req.session.cpb.handle == h
}

const needlogin =(req, res)=> {
  if (!res.headersSent && !req.session.cpb.login) {
    Reply.unauthorized('you are not logged in').send(res)
    return true
  }
}

const needlogout =(req, res)=> {
  if (!res.headersSent && req.session.cpb.login) {
    Reply.invalid('you are already logged in').send(res)
    return true
  }
}

const notsingleuser =(req, res)=> {
  if (!res.headersSent && CPB.rc.singleuser) {
    Reply.invalid('registration disabled').send(res)
    return true
  }
}

const ordef =(v, d, min, max)=> {
  let o = parseInt(v)
  o = Number.isNaN(o) ? d : o
  return Math.min(max, Math.max(min, o))
}

const remask =(o={}, m={}, black=false)=> {
  const r = {}
  Object.keys(o).forEach(k=> {
    if (m[k]) {
      if (typeof(m[k]) == 'function') {
        r[k] = m[k](o[k])
      } else if (typeof(m[k]) == 'object') {
        if (Array.isArray(o[k])) {
          r[k] = o[k].map(i=> {
            if (typeof(i) == 'object') {
              return remask(i, m[k], black)
            } else {
              throw new Error('cannot screen non-object')
            }
          })
        } else if (o[k] && typeof(o[k]) == 'object') {
          r[k] = remask(o[k], m[k], black)
        } else if (o[k]) {
          throw new Error('cannot screen non-object')
        }
      } else if (!black) {
        r[k] = o[k]
      }
    } else if (black) {
      r[k] = o[k]
    }
  })
  return r
}

const reshape =(v, req)=> {
  if (v.toJSON) v = v.toJSON()
  const mask = {
    editor: e=> e.handle,
    uuid: 1, number: 1,
    namespace: 1, title: 1, source: 1,
    views: 1,  createdAt: 1,
    resource: {
      creator: c=> c.handle,
      uuid: 1, type: 1,
      trashed: 1, trashable: 1, movable: 1, editable: 1,
      views: 1,  createdAt: 1,
    },
    image: {
      rel: 1, size: 1, x: 1, y: 1,
      thumbnails: { rel: 1, size: 1, x: 1, y: 1 },
    },
    user: {
      handle: 1, lastseen: 1, views: 1,
    },
  }
  if (v.user?.handle) {
    if (req.session.cpb.handle == 'guest' && req.session.cpb.handle == v.user.handle) {
      mask.user.config = {
        autodark: 1, darkmode: 1, debug: 1
      }
      mask.user.session = 1
      v.user.session = util.exportsess(req.session)
    } else if (req.session.cpb.login && req.session.cpb.handle == v.user.handle) {
      mask.user.email = 1
      mask.user.logins = 1
      mask.user.config = {
        autodark: 1, darkmode: 1, debug: 1
      }
      mask.user.session = 1
      v.user.session = util.exportsess(req.session)
    }
  }
  return remask(v, mask)
}
const invert =(r, req)=> {
  if (r.toJSON) r = r.toJSON()
  const ver = r.versions[0]
  delete r.versions
  ver.resource = r
  return reshape(ver, req)
}

const preAll =async(req, res, next)=> {
  req.nstu = CPB.NSTU.parse(req.path)
  if (req.nstu.usercurrent) {
    req.nstu = new CPB.NSTU({namespace: `~${req.session.cpb.handle}`})
  }
  next()
}

const getOne =async(req, res)=> {
  console.log('DBG: getting single resource')
  let where = libdb.nstuWhere(req.nstu)
  const ver = await db.version.findOne({where,
    attributes: [
      'number', 'views', 'namespace', 'title',
      'source', 'uuid', 'createdAt'
    ],
    include: [
      { model: db.user, as: 'editor',
        attributes: ['handle'],
      },
      { model: db.resource,
        attributes: [
          'uuid', 'createdAt', 'views', 'trashed',
          'trashable', 'movable', 'editable', 'type',
        ],
        include: {
          model: db.user, as: 'creator',
          attributes: ['handle'],
        },
      },
      { model: db.image,
        attributes: ['path', 'rel', 'x', 'y', 'size'],
        include: { model: db.thumbnail,
          attributes: ['thumb', 'path', 'rel', 'x', 'y', 'size'],
        },
      },
      { model: db.user,
        include: { model: db.config }
      },
    ],
  })
  console.log(ver)
  if (ver && !ver.resource.trashed) Reply.ok(reshape(ver, req)).send(res)
  else Reply.missing().send(res)
}
const getListing =async(req, res)=> {
  console.log('DBG: getting resource index')
  const nstu = req.nstu
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
      order: [['createdAt', 'DESC']],
      attributes: [
        'number', 'views', 'namespace', 'title',
        'uuid', 'createdAt'
      ],
      include: [
        { model: db.user, as: 'editor',
          attributes: ['handle'],
        },
        { model: db.resource,
          where: {
            trashed: false,
          },
          attributes: [
            'uuid', 'createdAt', 'views', 'trashed',
            'trashable', 'movable', 'editable', 'type',
          ],
          include: {
            model: db.user, as: 'creator',
            attributes: ['handle'],
          },
        },
        { model: db.image,
          attributes: ['path', 'rel', 'x', 'y', 'size'],
        },
        { model: db.user,
          attributes: ['handle', 'lastseen'],
        },
      ],
    })
    const rows = ver.rows.map(v=> reshape(v, req))
    if (ver) Reply.ok(rows, {
      pg: page, sz: size,
      ct: ver.count, pp: Math.ceil(ver.count / size),
    }).send(res)
    else Reply.missing().send(res)
  }
}
const getHistory =async(req, res)=> {
  console.log('DBG: getting resource history')
  let where = libdb.nstuWhere(req.nstu)
  let size = ordef(req.query.sz, 10, 5, 50)
  let page = ordef(req.query.pg, 1, 1, 1000)
  const ver = await db.version.findOne({where,
    plain: true,
    attributes: ['uuid', 'namespace', 'title'],
    include: {
      model: db.resource,
      attributes: ['uuid', 'trashed'],
    },
  })
  if (ver && !ver.resource.trashed) {
    const data = await db.version.findAndCountAll({
      where: { resourceUuid: ver.resource.uuid },
      offset: size * (page - 1),
      limit: size,
      order: [['number', 'DESC']],
      attributes: [
        'number', 'views', 'namespace', 'title',
        'uuid', 'createdAt'
      ],
      include: {
        model: db.user, as: 'editor',
        attributes: ['handle'],
      },
    })
    const rows = data.rows.map(v=> reshape(v, req))
    if (data) Reply.ok(rows, {
      pg: page, sz: size,
      ct: data.count, pp: Math.ceil(data.count / size),
    }).send(res)
    else Reply.internal().send(res)
  }
  else Reply.missing().send(res)
}
const getAuthors =async(req, res)=> {
  console.log('DBG: getting resource history')
  let where = libdb.nstuWhere(req.nstu)
  let size = ordef(req.query.sz, 100, 5, 500)
  let page = ordef(req.query.pg, 1, 1, 1000)
  const ver = await db.version.findOne({where,
    plain: true,
    attributes: ['uuid', 'namespace', 'title'],
    include: {
      model: db.resource,
      attributes: ['uuid', 'trashed'],
    },
  })
  if (ver && !ver.resource.trashed) {
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
    if (data) Reply.ok(data.count.sort((a, b) => (a.count < b.count) ? 1 : -1), {
      pp: Math.ceil(data.count / size),
      pg: page, sz: size,
    }).send(res)
    else Reply.internal().send(res)
  } else Reply.missing().send(res)
}
const getLinks =async(req, res)=> {
  Reply.unimplemented().send(res)
}
const getResource =async(req, res)=> {
  if (req.query.get == 'list') await getListing(req, res)
  else if (req.query.get == 'hist') await getHistory(req, res)
  else if (req.query.get == 'authors') await getAuthors(req, res)
  else if (req.query.get == 'links') await getLinks(req, res)
  else await getOne(req, res)
}

const exists =async(nstu)=> {
  let where = libdb.nstuWhere(nstu)
  const ver = await db.version.findOne({where,
    include: {
      model: db.resource,
      where: { trashed: false },
    },
  })
  return !!ver
}
const postPage =async(req, res, next)=> {
  if (req.body.type != 'page') {
    next()
    return
  }
  needlogin(req, res)
  if (res.headersSent) return
  console.log('posting page')
  try {
    const rid = v4()
    const resource = await db.resource.create({
      uuid: rid,
      creatorUuid: req.session.cpb.uuid,
      type: 'page',
      versions: [{
        namespace: req.nstu.namespace,
        title: req.nstu.title,
        source: req.body.source,
        editorUuid: req.session.cpb.uuid,
        page: {
          resourceUuid: rid,
        },
      }],
    }, {
      include: [{
        association: db.resource.Version,
        include: [db.version.Page]
      }]
    })
    Reply.ok(invert(resource, req)).send(res)
  } catch (e) {
    console.log(e)
    Reply.internal().send(res)
  }
}
const postImage =async(req, res, next)=> {
  if (req.body.type != 'image') {
    next()
    return
  }
  needlogin(req, res)
  if (res.headersSent) return
  if (!req.files.image[0]) {
    Reply.input('no image uploaded').send(res)
    return
  }
  if (!req.files.image[0].mimetype.match(util.validmime.image)) {
    Reply.input(`file is not an image (got type ${req.files.image[0].mimetype})`).send(res)
    return
  }
  console.log('posting image')

  const rid = v4()
  const cimg = new CPBImage(req.files.image[0].path)
  await cimg.prep()

  try {
    const resource = await db.resource.create({
      uuid: rid,
      creatorUuid: req.session.cpb.uuid,
      type: 'image',
      versions: [{
        namespace: req.nstu.namespace,
        title: req.nstu.title,
        source: req.body.source,
        editorUuid: req.session.cpb.uuid,
        image: {
          uuid: req.imageUuid,
          resourceUuid: rid,
          path: req.files.image[0].path,
          mime: req.files.image[0].mimetype,
          x: cimg.x,
          y: cimg.y,
          size: cimg.size,
          thumbnails: cimg.thumbinfo({resourceUuid: rid}),
        },
      }],
    }, {
      include: [{
        association: db.resource.Version,
        include: [{
          association: db.version.Image,
          include: [{
            association: db.image.Thumbnail,
          }]
        }]
      }]
    })
    Reply.ok(invert(resource, req)).send(res)
  } catch (e) {
    console.log(e)
    await cimg.rmall()
    Reply.internal().send(res)
  }
}
const postUser =async(req, res, next)=> {
  if (req.body.type != 'user') {
    next()
    return
  }
  notsingleuser(req, res)
  needlogout(req, res)
  if (res.headersSent) return
  console.log('posting user')
  if (!req.nstu.userspace) {
    Reply.invalid('invalid location for user').send(res)
  }
  try {
    const rid = v4()
    const user = await db.user.create({
      handle: req.nstu.username,
      email: req.body.email,
      hash: req.body.pass,
      config: {},
    }, {
      include: [{
        association: db.user.Config,
      }]
    })
    let resource = await db.resource.create({
      uuid: rid,
      creatorUuid: user.uuid,
      type: 'user',
      deletable: false,
      private: true,
      versions: [{
        namespace: req.nstu.namespace,
        source: req.body.source,
        editorUuid: user.uuid,
        userUuid: user.uuid,
      }],
    }, {
      include: [{
        association: db.resource.Version,
      }]
    })
    req.session.cpb = util.mklogin(user)
    resource = resource.toJSON()
    resource.versions[0].user = user
    Reply.ok(invert(resource, req)).send(res)
  } catch (e) {
    console.log(e)
    Reply.internal().send(res)
  }
}
const postLogin =async(req, res, next)=> {
  if (req.body.type != 'login') {
    next()
    return
  }
  needlogout(req, res)
  if (res.headersSent) return
  console.log('logging in')
  if (!req.nstu.userspace) {
    Reply.invalid('invalid location for user resource').send(res)
  }
  try {
    let where = libdb.nstuWhere(req.nstu)
    const ver = await db.version.findOne({where,
      include: [
        { model: db.resource },
        { model: db.user,
          where: {hash: {[Op.not]: null}},
          include: { model: db.config },
        },
      ]
    })
    if (ver) {
      const valid = await bcrypt.compare(req.body.pass, ver.user.hash)
      if (valid) {
        req.session.cpb = util.mklogin(ver.user)
        const out = ver.toJSON()
        out.session = util.exportsess(req.session)
        Reply.ok(reshape(out, req)).send(res)
      } else Reply.input('bad credentials').send(res)
    } else Reply.input('bad credentials').send(res)
  } catch (e) {
    console.log(e)
    Reply.internal().send(res)
  }
}
const postLogout =async(req, res, next)=> {
  if (req.body.type != 'logout') {
    next()
    return
  }
  console.log('logging out')
  needlogin(req, res)
  if (res.headersSent) return
  else if (!req.nstu.userspace) {
    Reply.invalid('invalid location for user resource').send(res)
  } else if (!req.nstu.username == req.session.cpb.handle) {
    Reply.invalid('you are not logged in as this user').send(res)
  } else {
    req.session.cpb = util.guestsess()
    const out = {session: req.session.cpb}
    Reply.ok(reshape(out, req)).send(res)
  }
}
const prePost =async(req, res, next)=> {
  console.log('!!! !!! !!! GOT POST')
  req.imageUuid = v4()
  next()
}
const postErr =async(req, res, next)=> {
  if (req.body.type) Reply.input(`invalid type: ${req.body.type}`).send(res)
  else Reply.input(`no type given`).send(res)
}

const put =async(req, res, next)=> {
  needlogin(req, res)
  if (res.headersSent) return
  let where = libdb.nstuWhere(req.nstu)
  const old = await db.version.findOne({where,
    include: [
      { model: db.resource },
      { model: db.user,
        include: { model : db.config },
      },
    ]
  })
  if (old) {
    if (!old.resource.editable) {
      return Reply.unallowed('resource is not editable').send(res)
    }
    if (old.resource.type != req.body.type) {
      return Reply.input(`wrong type: ${req.body.type}`).send(res)
    }
    if (req.body.type == 'user' && req.body.handle) {
      req.body.namespace = `~${req.body.handle}`
    }
    const nsc = req.body.namespace !== undefined && req.body.namespace != old.namespace
    const tc = req.body.title !== undefined && req.body.title != old.title
    const sc = req.body.source !== undefined && req.body.source != old.source
    const namespace = req.body.namespace === undefined ? old.namespace : req.body.namespace
    const title = req.body.title === undefined ? old.title : req.body.title
    const source = req.body.source === undefined ? old.source : req.body.source
    if (!old.resource.movable && (nsc || tc)) {
      return Reply.unallowed('resource is not movable').send(res)
    }
    if (req.body.type == 'image') {
      if ((req.body.namespace === undefined || req.body.namespace == old.namespace) &&
          (req.body.title === undefined || req.body.title == old.title) &&
          (req.body.source === undefined || req.body.source == old.source) &&
          !req.files.image?.[0]) {
        return Reply.input('nothing changed').send(res)
      }
      if (req.files.image?.[0]) {
        if (!req.files.image[0].mimetype.match(util.validmime.image)) {
          Reply.input(`file is not an image (got type ${req.files.image[0].mimetype})`).send(res)
          return
        }
        const cimg = new CPBImage(req.files.image[0].path)
        await cimg.prep()
        try {
          const ver = await db.version.create({
            number: old.number + 1,
            resourceUuid: old.resourceUuid,
            prevUuid: old.uuid,
            namespace, title, source,
            editorUuid: req.session.cpb.uuid,
            image: {
              uuid: req.imageUuid,
              resourceUuid: old.resource.uuid,
              path: req.files.image[0].path,
              mime: req.files.image[0].mimetype,
              x: cimg.x,
              y: cimg.y,
              size: cimg.size,
              thumbnails: cimg.thumbinfo({resourceUuid: old.resource.uuid}),
            }
          }, {
            include: [{
              association: db.version.Image,
              include: [{
                association: db.image.Thumbnail,
              }]
            }]
          })
          old.nextUuid = ver.uuid
          await old.save()
          req.session.cpb = util.guestsess()
          Reply.ok().send(res)
        } catch (e) {
          await cimg.rmall()
          Reply.internal().send(res)
        }
      } else {
        const ver = await db.version.create({
          number: old.number + 1,
          resourceUuid: old.resourceUuid,
          prevUuid: old.uuid,
          namespace, title, source,
          editorUuid: req.session.cpb.uuid,
          imageUuid: old.imageUuid,
        })
        old.nextUuid = ver.uuid
        await old.save()
        Reply.ok(reshape(ver, req)).send(res)
      }
    } else if (req.body.type == 'user') {
      const ec = req.body.email !== undefined && req.body.email != old.user.email
      const pc = req.body.pass !== undefined
      const cdc = req.body.confDebug !== undefined && req.body.confDebug != old.user.config.debug
      const cdmc = req.body.confDarkmode !== undefined && req.body.confDarkmode != old.user.config.darkmode
      const cadc = req.body.confAutodark !== undefined && req.body.confAutodark != old.user.config.autodark
      const doconfirm = ec || pc || nsc
      let confirmed = false
      if (doconfirm && req.body.confirmation) {
        confirmed = await bcrypt.compare(req.body.confirmation, old.user.hash)
      }
      if (tc || (nsc && namespace[0] != '~')) {
        Reply.input(`invalid location for user resource`)
      } else if (!(nsc || sc || ec || pc || cdc || cdmc || cadc)) {
        Reply.input('nothing changed').send(res)
      } else if (doconfirm && !req.body.confirmation) {
        Reply.input('confirmation with current password required').send(res)
      } else if (doconfirm && !confirmed) {
        Reply.input('invalid credentials').send(res)
      } else {
        let ver
        if (cdc || cdmc || cadc) {
          if (cdc) old.user.config.debug = req.body.confDebug
          if (cdmc) old.user.config.darkmode = req.body.confDarkmode
          if (cadc) old.user.config.autodark = req.body.confAutodark
          await old.user.config.save()
        }
        if (nsc || ec || pc) {
          const oh = old.user.handle
          let cl = false
          if (nsc) {
            if (oh == req.session.cpb.handle) cl = true
            old.user.handle = req.body.handle || namespace.slice(1)
          }
          if (ec) old.user.email = req.body.email
          if (pc) old.user.hash = req.body.pass
          await old.user.save()
          if (cl) req.session.cpb.handle = old.user.handle
        }
        if (nsc || sc) {
          ver = await db.version.create({
            number: old.number + 1,
            resourceUuid: old.resourceUuid,
            prevUuid: old.uuid,
            namespace, source,
            editorUuid: req.session.cpb.uuid,
            userUuid: old.user.uuid,
          })
          old.nextUuid = ver.uuid
          await old.save()
        }
        if (ver) {
          ver = ver.toJSON()
          ver.resource = old.resource.toJSON()
          ver.user = old.user.toJSON()
        }
        console.log(req.session)
        Reply.ok(reshape(ver || old, req)).send(res)
      }
    } else if (req.body.type == 'page') {
      if ((req.body.namespace === undefined || req.body.namespace == old.namespace) &&
          (req.body.title === undefined || req.body.title == old.title) &&
          (req.body.source === undefined || req.body.source == old.source)) {
        Reply.input('nothing changed').send(res)
        return
      }
      const ver = await db.version.create({
        number: old.number + 1,
        resourceUuid: old.resourceUuid,
        prevUuid: old.uuid,
        namespace, title, source,
        editorUuid: req.session.cpb.uuid,
        pageUuid: old.pageUuid,
      })
      old.nextUuid = ver.uuid
      await old.save()
      Reply.ok(reshape(ver, req)).send(res)
    } else Reply.input(`no such type: ${req.body.type}`).send(res)
  } else Reply.missing().send(res)
}
const prePut =async(req, res, next)=> {
  console.log('!!! !!! !!! GOT PUT')
  req.imageUuid = v4()
  next()
}

const destroyResource =async(req, res)=> {
  console.log('DBG: deleting resource')
  let where = libdb.nstuWhere(req.nstu)
  const ver = await db.version.findOne({where,
    include: {
      model: db.resource,
      include: {
        model: db.image,
        include: { model: db.thumbnail },
      },
    },
  })
  if (!ver) {
    Reply.missing().send(res)
  } else if (!ver.resource.trashable) {
    Reply.unallowed("resource is not trashable").send(res)
  } else if (!ver.resource.deletable) {
    Reply.unallowed("resource is not deletable").send(res)
  } else if (!ver.resource.trashed) {
    Reply.invalid("resource must be trashed first").send(res)
  } else {
    let imgs = []
    ver.resource.images.forEach(i=> {
      imgs.push(i.path)
      i.thumbnails.forEach(t=> imgs.push(t.path))
    })
    await ver.resource.destroy()
    for (let x = 0; x < imgs.length; x++) {
      const img = imgs[x]
      console.log(`deleting ${img}`)
      await fs.promises.unlink(img)
    }
    Reply.ok("resource deleted").send(res)
  }
}
const trashResource =async(req, res)=> {
  console.log('DBG: trashing resource')
  let where = libdb.nstuWhere(req.path)
  const ver = await db.version.findOne({where,
    include: [
      {
        model: db.resource,
        include: { model: db.user, as: 'creator' }
      },
      { model: db.user },
    ],
  })
  if (!ver) {
    Reply.missing().send(res)
  } else if (!ver.resource.trashable) {
    Reply.unallowed("resource is not trashable").send(res)
  } else if (ver.resource.trashed) {
    Reply.invalid("resource is already trashed").send(res)
  } else if (ver.resource.private && !loggedas(ver.resource.creator.handle)) {
    Reply.unallowed("private resource - only the owner can do that").send(res)
  } else {
    if (ver.resource.type == 'user') {
      if (!req.body.pass) {
        Reply.input('must confirm user deletion with current password')
      } else {
        const confirmed = await bcrypt.compare(req.body.pass, ver.user.hash)
        if (!confirmed) {
          Reply.input('invalid credentials')
        } else {
          // on trashing a user, instead transform it into a dummy
          // account to maintain article ownership
          // trashing users is not reversible, unlike other resources,
          // and requires password confirmation
          const lastdel = await db.user.findOne({
            where: {deleted: true},
            attributes: ['delnum'],
            order: [['delnum', 'DESC']]
          })
          const delnum = lastdel?.delnum ? lastdel.delnum + 1 : 1
          const u = ver.user
          const d = new Date()
          const hnum = `${delnum}`.padStart(16, '0')
          u.handle = `deleted-${hnum}`
          u.deleted = true
          u.delnum = delnum
          u.hash = null
          u.email = null
          u.special = true
          u.logins = 0
          u.views = 0
          u.createdAt = d
          u.updatedAt = d
          u.lastseen = d
          await u.save()
          const r = ver.resource
          await db.version.destroy({where: {resourceUuid: r.uuid}})
          await db.version.create({
            resourceUuid: r.uuid,
            userUuid: u.uuid,
            namespace: `~${u.handle}`,
            editorUuid: u.uuid,
          })
          r.trashable = false
          r.movable = false
          await r.save()
          req.session.cpb = util.guestsess()
        }
      }
    } else {
      ver.resource.trashed = true
      await ver.resource.save()
    }
    Reply.ok("record trashed").send(res)
  }
}
const deleteResource =async(req, res)=> {
  needlogin(req, res)
  if (res.headersSent) return
  if (req.query.mode == 'trash') await trashResource(req, res)
  else await destroyResource(req, res)
}

nstu.get('/*', preAll, getResource)
nstu.post('/*',
  preAll,
  prePost, upload.fields([{ name: 'image', maxCount: 1 }]),
  postPage,
  postUser,
  postLogin,
  postLogout,
  postImage,
  postErr
)
nstu.put('/*', preAll, prePut, upload.fields([{ name: 'image', maxCount: 1 }]), put)
nstu.delete('/*', preAll, deleteResource)

module.exports = nstu
