'use strict'

// GET    sys:api/nst/docs:WMD
// DELETE sys:api/nst/docs:WMD
// POST   sys:api/nst/docs:WMD
// UPDATE sys:api/nst/docs:WMD

const CPB = require('../lib/cpb.js')
const WMD = require('../lib/analyzer.js')
const { CPBUpload } = require('../lib/cpbimage.js')
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
    cb(null, CPB.rc.uploads.temp)
  },
  filename: function (req, file, cb) {
    const base = req.imageUuid.toUpperCase()
    const ext = `.${util.extmap[file.mimetype]}` || ''
    const full = `${base}${ext}`
    req.filename = { base, ext, full }
    cb(null, full)
  }
})
const upload = multer({ storage, limits: {
  fields: 10,
  fileSize: 1048576 * 12,
  files: 1,
  headerPairs: 100,
}}).fields([{ name: 'image', maxCount: 1 }])

const clip = 500
const hclip = clip / 2

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

const shortMask = {
  editor: e=> e.handle,
  uuid: 1, number: 1,
  namespace: 1, title: 1,
  views: 1,  createdAt: 1,
  nextUuid: 1, prevUuid: 1,
  lede: 1, wordCount: 1,
  image: {
    rel: 1, size: 1, x: 1, y: 1, mime: 1, max: 1,
    thumbnails: { rel: 1, size: 1, x: 1, y: 1, thumb: 1 },
  },
  user: {
    handle: 1,
  },
}
const wholeMask = {
  ...shortMask, source: 1, text: 1,
  resource: {
    creator: c=> c.handle,
    uuid: 1, type: 1,
    trashed: 1, trashable: 1, movable: 1, editable: 1, private: 1,
    views: 1,  createdAt: 1,
  },
  user: {
    ...shortMask.user,
    lastseen: 1, views: 1,
  },
}
const guestMask = {
  ...wholeMask,
  user: {
    ...wholeMask.user,
    session: 1,
    config: {
      autodark: 1, darkmode: 1, debug: 1,
    }
  }
}
const loginMask = {
  ...guestMask,
  user: {
    ...guestMask.user,
    email: 1, logins: 1,
  }
}

const reshape =(v, req, m=false)=> {
  if (v.toJSON) v = v.toJSON()
  let mask
  if (m) mask = m
  else if (!v.user) mask = wholeMask
  else {
    if (req.session.cpb.handle == 'guest' && req.session.cpb.handle == v.user.handle) {
      v.user.session = util.exportsess(req.session)
      mask = guestMask
    } else if (req.session.cpb.login && req.session.cpb.handle == v.user.handle) {
      v.user.session = util.exportsess(req.session)
      mask = loginMask
    } else {
      mask = wholeMask
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

const coreInclude = {
  model: db.resource,
  where: { trashed: false },
}
const wholeInclude = [
  { ...coreInclude,
    include: { model: db.user, as: 'creator' },
  },
  { model: db.user, as: 'editor' },
  { model: db.user,
    include: { model: db.config },
  },
  { model: db.image,
    include: { model: db.thumbnail },
  },
  { model: db.page },
]
const wholeWhere =(where)=> {
  const i = [
    { model: db.resource,
      where: { trashed: false, ...where },
      include: { model: db.user, as: 'creator' },
    },
    { model: db.user, as: 'editor' },
    { model: db.user,
      include: { model: db.config },
    },
    { model: db.image,
      include: { model: db.thumbnail },
    },
    { model: db.page },
  ]
  return i
}

const exists =async(nstu)=> {
  const ver = await getCore(nstu)
  return !!ver
}
const getCore =async(nstu)=> {
  let where = libdb.nstuWhere(nstu)
  return await db.version.findOne({
    where, include: coreInclude,
  })
}
const getSingle =async(nstu)=> {
  let where = libdb.nstuWhere(nstu)
  return await db.version.findOne({
    where, include: wholeInclude,
  })
}

const procinf =(inf)=> {
  if (!inf || CPB.rc.searchConfig.inf.valid.indexOf(inf) < 0) {
    inf = CPB.rc.searchDefaults.inf
  }
  return inf
}
const proctype =(type)=> {
  if (!type) {
    type = CPB.rc.searchDefaults.type
    return type
  }
  if (typeof(type) == 'string') type = type.split(',')
  type = [...new Set(type)]
  if (type.indexOf(CPB.rc.searchDefaults.type) >= 0) {
    type = CPB.rc.searchDefaults.type
  } else {
    type.filter(t=> CPB.rc.searchConfig.type.valid.indexOf(t) >= 0)
    if (type.sort() == CPB.rc.types.sort()) type = CPB.rc.searchDefaults.type
  }
  return type
}
const highlight =(list, query, inf)=> {
  const rx = new RegExp(`(.{0,${hclip}}?)(${query})(.{0,${hclip}})`, 'i')
  const ht = query && (inf == 'both' || inf == 'title')
  const hs = query && (inf == 'both' || inf == 'source')
  list.forEach(v=> {
    const search = {}
    if (hs) {
      let sm = v.text.match(rx)
      sm = sm ? sm.slice(1,4) : null
      search.text = sm
    }
    delete v.source
    delete v.text
    if (v.title && ht) {
      let tm = v.title.match(rx)
      tm = tm ? tm.slice(1,4) : null
      search.title = tm
    }
    if (search.text || search.title) v.search = search
  })
}

const getOne =async(req, res)=> {
  const ver = await getSingle(req.nstu)
  if (ver) Reply.ok(reshape(ver, req)).send(res)
  else Reply.missing().send(res)
}
const getListing =async(req, res)=> {
  let where = {}

  if (!req.nstu.index) {
    Reply.invalid().send(res)
  } else {
    const inhist = !!req.query.inh
    if (!inhist) where.nextUuid = null
    if (req.nstu.namespace) where.namespace = req.nstu.namespace

    const query = req.query.q || null
    const pat = query ? `%${query}%` : null

    const inf = procinf(req.query.inf)
    const type = proctype(req.query.type)


    if (pat) {
      if (inf == 'both') {
        where[Op.or] = [
          { title: {[Op.like]: pat} },
          { text: {[Op.like]: pat} },
        ]
      } else if (inf == 'title') {
        where.title = {[Op.like]: pat}
      } else if (inf == 'source') {
        where.text = {[Op.like]: pat}
      }
    }

    const typewhere = {}
    if (type != CPB.rc.searchDefaults.type) {
      if (type.length > 1) {
        typewhere.type = { [Op.or]: type }
      } else {
        typewhere.type = type[0]
      }
    }

    const include = wholeWhere(typewhere)

    let size = ordef(req.query.sz, CPB.rc.searchConfig.sz.default, CPB.rc.searchConfig.sz.min, CPB.rc.searchConfig.sz.max)
    const count = await db.version.count({where, include, distinct: 'version.id'})
    const maxpg = Math.min(Math.ceil(count / size), CPB.rc.searchConfig.pg.max) || 1
    let page = ordef(req.query.pg, CPB.rc.searchConfig.pg.default, CPB.rc.searchConfig.pg.min, maxpg)
    console.log(page, CPB.rc.searchConfig.pg.default, CPB.rc.searchConfig.pg.min)

    let list = await db.version.findAll({where,
      offset: size * (page - 1),
      limit: size,
      order: [['createdAt', 'DESC']],
      include,
    })

    if (list) {
      list = list.map(v=> reshape(v, req, wholeMask))
      highlight(list, query, inf)
      const typestr = typeof(type) == 'string' ? type : type.join(',')
      Reply.ok(list, {
        opt: {
          pg: page, sz: size,
          ct: count, pp: Math.ceil(count / size),
          inh: inhist, inf, type: typestr,
        }
      }).send(res)
    } else Reply.internal().send(res)
  }
}
const getHistory =async(req, res)=> {
  const ver = await getCore(req.nstu)
  if (!ver) {
    Reply.missing().send(res)
  } else {
    try {
      let size = ordef(req.query.sz, CPB.rc.listConfig.sz.default, CPB.rc.listConfig.sz.min, CPB.rc.listConfig.sz.max)
      const count = await db.version.count({where: { resourceUuid: ver.resource.uuid }})
      const maxpg = Math.min(Math.ceil(count / size), CPB.rc.listConfig.pg.max)
      let page = ordef(req.query.pg, CPB.rc.listConfig.pg.default, CPB.rc.listConfig.pg.min, maxpg)
      let list = await db.version.findAll({
        where: { resourceUuid: ver.resource.uuid },
        offset: size * (page - 1),
        limit: size,
        order: [['number', 'DESC']],
        include: [
          { model: db.user, as: 'editor' },
          { model: db.user },
          { model: db.image,
            include: { model: db.thumbnail },
          },
        ],
      })
      list = list.map(v=> reshape(v, req, shortMask))
      if (list) Reply.ok(list, {
        opt: {
          pg: page, sz: size,
          ct: count, pp: Math.ceil(count / size),
        },
      }).send(res)
      else Reply.internal().send(res)
    } catch (e) {
      Reply.internal().send(res)
    }
  }
}
const getAuthors =async(req, res)=> {
  const ver = await getCore(req.nstu)
  if (!ver) {
    Reply.missing().send(res)
  } else {
    let data = await db.version.findAndCountAll({
      where: { resourceUuid: ver.resource.uuid },
      group: ['editor.handle'],
      include: {
        model: db.user, as: 'editor',
        attributes: ['handle'],
      },
    })
    if (!data) {
      Reply.internal().send(res)
    } else {
      data = data.count.sort((a, b) => (a.count < b.count) ? 1 : -1)
      Reply.ok(data).send(res)
    }
  }
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

const produceVersion =(conf)=> {
  const doc = new WMD(conf.source || '')
  return {
    ...conf,
    text: doc.allText.text,
    lede: doc.lede.raw,
    wordCount: doc.wordCount,
  }
}

const createPage =async(conf)=> {
  const rid = v4()
  try {
    const resource = await db.resource.create({
      uuid: rid,
      creatorUuid: conf.creatorUuid,
      type: 'page',
      versions: [
        produceVersion({
          ...conf,
          page: { resourceUuid: rid },
        }),
      ],
    }, {
      include: [{
        association: db.resource.Version,
        include: [db.version.Page]
      }]
    })
    return resource
  } catch (e) {
    console.log(e)
    return false
  }
}
const createImage =async(conf)=> {
  const rid = v4()
  const cimg = await conf.upload.mkimage()
  try {
    const resource = await db.resource.create({
      uuid: rid,
      creatorUuid: conf.creatorUuid,
      type: 'image',
      versions: [
        produceVersion({
          ...conf,
          image: {
            uuid: conf.imageUuid,
            resourceUuid: rid,
            path: cimg.path,
            mime: conf.mime,
            x: cimg.x,
            y: cimg.y,
            size: cimg.size,
            thumbnails: cimg.thumbinfo({resourceUuid: rid}),
          },
        }),
      ],
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
    return resource
  } catch (e) {
    console.log(e)
    await cimg.rmall()
    return false
  }
}
const createUser =async(conf)=> {
  try {
    const rid = v4()
    let user = await db.user.create({
      handle: conf.handle,
      email: conf.email,
      hash: conf.pass,
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
      versions: [
        produceVersion({
          ...conf,
          userUuid: user.uuid,
        }),
      ],
    }, {
      include: [{
        association: db.resource.Version,
      }]
    })
    return user
  } catch (e) {
    if (e.name == 'SequelizeUniqueConstraintError' || 'SequelizeValidationError') {
      throw e
      return false
    } else {
      console.log(e)
      return false
    }
  }
}

const duplicateResource =async(conf)=> {
  let dupe
  if (conf.target.resource.type == 'page') {
    dupe = await createPage({
      namespace: conf.dest.namespace,
      title: conf.dest.title,
      source: conf.target.source,
      creatorUuid: conf.creatorUuid,
      editorUuid: conf.creatorUuid,
    })
  } else if (conf.target.resource.type == 'image') {
    const upload = new CPBUpload(conf.target.image.path, conf.target.image.mime, conf.imageUuid.toUpperCase(), true)
    dupe = await createImage({
      namespace: conf.dest.namespace,
      title: conf.dest.title,
      source: conf.target.source,
      creatorUuid: conf.creatorUuid,
      editorUuid: conf.creatorUuid,
      upload,
      mime: conf.target.image.mime,
      imageUuid: conf.imageUuid,
    })
  } else {
    throw new Error('invalid resource type')
  }
  return dupe
}

const postPage =async(req, res, next)=> {
  if (req.body.type != 'page') {
    next()
    return
  }
  needlogin(req, res)
  if (res.headersSent) {
    next()
    return
  }
  if (req.nstu.index || req.nstu.userspace) {
    Reply.invalid('resources cannot be created here').send(res)
  } else if (await exists(req.nstu)) {
    Reply.invalid('resource already exists here').send(res)
  } else {
    try {
      const resource = await createPage({
        namespace: req.nstu.namespace,
        title: req.nstu.title,
        source: req.body.source,
        creatorUuid: req.session.cpb.uuid,
        editorUuid: req.session.cpb.uuid,
      })
      if (resource) {
        const ver = await getSingle(req.nstu)
        Reply.ok(reshape(ver, req)).send(res)
      } else {
        Reply.internal().send(res)
      }
    } catch (e) {
      console.log(e)
      Reply.internal().send(res)
    }
  }
  next()
}
const postImage =async(req, res, next)=> {
  if (req.body.type != 'image') {
    next()
    return
  }
  needlogin(req, res)
  if (res.headersSent) {
    next()
    return
  }
  if (req.nstu.index || req.nstu.userspace) {
    Reply.invalid('resources cannot be created here').send(res)
  } else if (!req.upload) {
    Reply.input('no image uploaded').send(res)
  } else if (!req.upload.valid) {
    Reply.input(`file is not an image (got type ${req.files.image[0].mimetype})`).send(res)
  } else if (await exists(req.nstu)) {
    Reply.invalid('resource already exists here').send(res)
  } else {
    try {
      const resource = await createImage({
        upload: req.upload,
        namespace: req.nstu.namespace,
        title: req.nstu.title,
        source: req.body.source,
        creatorUuid: req.session.cpb.uuid,
        editorUuid: req.session.cpb.uuid,
        mime: req.files.image[0].mimetype,
        imageUuid: req.imageUuid,
      })
      if (resource) {
        const ver = await getSingle(req.nstu)
        Reply.ok(reshape(ver, req)).send(res)
      } else {
        Reply.internal().send(res)
      }
    } catch (e) {
      console.log(e)
      Reply.internal().send(res)
    }
  }
  next()
}
const postUser =async(req, res, next)=> {
  if (req.body.type != 'user') {
    next()
    return
  }
  notsingleuser(req, res)
  needlogout(req, res)
  if (res.headersSent) {
    next()
    return
  }
  if (!req.nstu.userspace) {
    Reply.invalid('invalid location for user').send(res)
  } else if (req.nstu.reserved) {
    Reply.invalid('reserved name').send(res)
  } else if (await exists(req.nstu)) {
    Reply.invalid('resource already exists here').send(res)
  } else {
    try {
      const user = await createUser({
        namespace: req.nstu.namespace,
        source: req.body.source,
        handle: req.nstu.username,
        email: req.body.email,
        pass: req.body.pass,
      })
      if (user) {
        req.session.cpb = util.mklogin(user)
        const ver = await getSingle(req.nstu)
        Reply.ok(reshape(ver, req)).send(res)
      } else {
        Reply.internal().send(res)
      }
    } catch (e) {
      if (e.name == 'SequelizeUniqueConstraintError' || 'SequelizeValidationError') {
        Reply.input().parseErrors(e.errors).send(res)
      } else {
        console.log(e)
        Reply.internal().send(res)
      }
    }
    next()
  }
}
const postLogin =async(req, res, next)=> {
  if (req.body.type != 'login') {
    next()
    return
  }
  needlogout(req, res)
  if (res.headersSent) {
    next()
    return
  }
  if (!req.nstu.userspace) {
    Reply.invalid('invalid location for user resource').send(res)
    next()
    return
  }
  try {
    let where = libdb.nstuWhere(req.nstu)
    const ver = await db.version.findOne({where,
      include: [
        { model: db.resource,
          include: { model: db.user, as: 'creator' },
        },
        { model: db.user, as: 'editor' },
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
  next()
}
const postLogout =async(req, res, next)=> {
  if (req.body.type != 'logout') {
    next()
    return
  }
  needlogin(req, res)
  if (res.headersSent) {
    next()
    return
  } else if (!req.nstu.userspace) {
    Reply.invalid('invalid location for user resource').send(res)
  } else if (!req.nstu.username == req.session.cpb.handle) {
    Reply.invalid('you are not logged in as this user').send(res)
  } else {
    req.session.cpb = util.guestsess()
    const out = {session: req.session.cpb}
    Reply.ok(reshape(out, req)).send(res)
  }
  next()
}
const postDuplicate =async(req, res, next)=> {
  if (req.body.type != 'dupe') {
    next()
    return
  }
  needlogin(req, res)
  if (res.headersSent) {
    next()
    return
  }
  const target = await getSingle(req.nstu)
  if (!target) {
    Reply.invalid('no resource here').send(res)
  } else if (target.resource.type == 'user') {
    Reply.invalid('cannot duplicate users').send(res)
  } else {
    const dest = new CPB.NSTU({
      namespace: req.body.namespace, title: req.body.title,
    })
    const occupied = await exists(dest)
    if (occupied) {
      Reply.invalid('resource already exists at destination').send(res)
    } else if (!dest.contentspace) {
      Reply.invalid('invalid destination for resource').send(res)
    } else {
      try {
        const dupe = await duplicateResource({
          target, dest,
          creatorUuid: req.session.cpb.uuid,
          imageUuid: req.imageUuid,
        })
        if (!dupe) {
          Reply.internal().send(res)
        } else {
          const ver = await getSingle(dest)
          Reply.ok(reshape(ver, req)).send(res)
        }
      } catch (e) {
        console.log(e)
        Reply.internal().send(res)
      }
    }
  }
  next()
}
const prePost =async(req, res, next)=> {
  req.imageUuid = v4()
  upload(req, res, function (err) {
    if (err) console.log(err)
    if (err instanceof multer.MulterError) {
      if (err.code == 'LIMIT_FILE_SIZE') {
        Reply.input('file is too large').send(res)
      } else if (err.code == 'LIMIT_FILE_COUNT') {
        Reply.input('you may only upload one file at a time').send(res)
      } else {
        Reply.internal('upload failed').send(res)
      }
    } else if (err) {
      Reply.internal().send(res)
    } else {
      if (req.files && req.files.image?.[0]) {
        req.upload = new CPBUpload(req.files.image[0].path, req.files.image[0].mimetype)
      }
      next()
    }
  })
}
const postEnd =async(req, res, next)=> {
  if (!res.headersSent) {
    Reply.internal().send(res)
  }
  if (req.upload) req.upload.cleanup()
}

const prePut =async(req, res, next)=> {
  req.imageUuid = v4()
  upload(req, res, function (err) {
    if (err) console.log(err)
    if (err instanceof multer.MulterError) {
      if (err.code == 'LIMIT_FILE_SIZE') {
        Reply.input('file is too large').send(res)
      } else if (err.code == 'LIMIT_FILE_COUNT') {
        Reply.input('you may only upload one file at a time').send(res)
      } else {
        Reply.internal('upload failed').send(res)
      }
    } else if (err) {
      Reply.internal().send(res)
    } else {
      if (req.files && req.files.image?.[0]) {
        req.upload = new CPBUpload(req.files.image[0].path, req.files.image[0].mimetype)
      }
      next()
    }
  })
}
const put =async(req, res, next)=> {
  needlogin(req, res)
  if (res.headersSent) return
  let where = libdb.nstuWhere(req.nstu)
  const old = await db.version.findOne({where,
    include: [
      { model: db.resource,
        include: {
          model: db.user, as: 'creator'
        }
      },
      { model: db.user,
        include: { model : db.config },
      },
    ]
  })
  if (old) {
    if (old.resource.private && !loggedas(old.resource.creator.handle, req)) {
      Reply.unauthorized('you may not edit edit another users private resource').send(res)
      next()
      return
    }
    if (!old.resource.editable) {
      Reply.unallowed('resource is not editable').send(res)
      next()
      return
    }
    if (old.resource.type != req.body.type) {
      Reply.input(`wrong type: ${req.body.type}`).send(res)
      next()
      return
    }
    if (req.body.type == 'user' && req.body.handle) {
      req.body.namespace = `~${req.body.handle}`
    }
    const nsc = req.body.namespace !== undefined && req.body.namespace != old.namespace
    const tc = req.body.title !== undefined && req.body.title != old.title
    const moving = nsc || tc
    const sc = req.body.source !== undefined && req.body.source != old.source
    const namespace = req.body.namespace === undefined ? old.namespace : req.body.namespace
    const title = req.body.title === undefined ? old.title : req.body.title
    const source = req.body.source === undefined ? old.source : req.body.source
    const dest = moving ? new CPB.NSTU({namespace, title}) : req.nstu
    if (moving) {
      if (!old.resource.movable) {
        Reply.unallowed('resource is not movable').send(res)
        next()
        return
      }
      if (dest.reserved) {
        Reply.invalid('invalid location').send(res)
        next()
        return
      }
      if ((req.body.type == 'user' && !dest.userpage) || req.body.type != 'user' && !dest.contentspace || (title && !namespace)) {
        Reply.invalid('invalid location').send(res)
        next()
        return
      }
      const existing = await exists(dest)
      if (existing) {
        Reply.invalid('a resource already exists there').send(res)
        next()
        return
      }
    }
    if (req.body.type == 'image') {
      if ((req.body.namespace === undefined || req.body.namespace == old.namespace) &&
          (req.body.title === undefined || req.body.title == old.title) &&
          (req.body.source === undefined || req.body.source == old.source) &&
          !req.upload) {
        Reply.input('nothing changed').send(res)
        next()
        return
      }
      if (req.upload) {
        if (!req.upload.valid) {
          Reply.input(`file is not an image (got type ${req.upload.mime})`).send(res)
          next()
          return
        }
        const cimg = await req.upload.mkimage()
        try {
          let ver = await db.version.create(produceVersion({
            number: old.number + 1,
            resourceUuid: old.resourceUuid,
            prevUuid: old.uuid,
            namespace, title, source,
            editorUuid: req.session.cpb.uuid,
            image: {
              uuid: req.imageUuid,
              resourceUuid: old.resource.uuid,
              path: cimg.path,
              mime: req.files.image[0].mimetype,
              x: cimg.x,
              y: cimg.y,
              size: cimg.size,
              thumbnails: cimg.thumbinfo({resourceUuid: old.resource.uuid}),
            },
          }), {
            include: [{
              association: db.version.Image,
              include: [{
                association: db.image.Thumbnail,
              }]
            }]
          })
          old.nextUuid = ver.uuid
          await old.save()
          ver = await getSingle(dest)
          Reply.ok(reshape(ver, req)).send(res)
          next()
          return
        } catch (e) {
          await cimg.rmall()
          Reply.internal().send(res)
          next()
          return
        }
      } else {
        let ver = await db.version.create(produceVersion({
          number: old.number + 1,
          resourceUuid: old.resourceUuid,
          prevUuid: old.uuid,
          namespace, title, source,
          editorUuid: req.session.cpb.uuid,
          imageUuid: old.imageUuid,
        }))
        old.nextUuid = ver.uuid
        await old.save()
        ver = await getSingle(dest)
        Reply.ok(reshape(ver, req)).send(res)
        next()
        return
      }
    } else if (req.body.type == 'user') {
      console.log(req.body)
      const ec = req.body.email !== undefined && req.body.email != old.user.email
      const pc = req.body.pass !== undefined
      const cdc = req.body.config?.debug !== undefined && req.body.config.debug != old.user.config.debug
      const cdmc = req.body.config?.darkmode !== undefined && req.body.config.darkmode != old.user.config.darkmode
      const cadc = req.body.config?.autodark !== undefined && req.body.config.autodark != old.user.config.autodark
      const doconfirm = ec || pc || nsc
      let confirmed = false
      if (doconfirm && req.body.confirmation) {
        confirmed = await bcrypt.compare(req.body.confirmation, old.user.hash)
      }
      if (!(nsc || sc || ec || pc || cdc || cdmc || cadc)) {
        Reply.input('nothing changed').send(res)
        next()
        return
      } else if (doconfirm && !req.body.confirmation) {
        Reply.input('confirmation with current password required').send(res)
        next()
        return
      } else if (doconfirm && !confirmed) {
        Reply.input('invalid credentials').send(res)
        next()
        return
      } else {
        try {
          let ver
          if (cdc || cdmc || cadc) {
            if (cdc) old.user.config.debug = req.body.config.debug
            if (cdmc) old.user.config.darkmode = req.body.config.darkmode
            if (cadc) old.user.config.autodark = req.body.config.autodark
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
            ver = await db.version.create(produceVersion({
              number: old.number + 1,
              resourceUuid: old.resourceUuid,
              prevUuid: old.uuid,
              namespace, source,
              editorUuid: req.session.cpb.uuid,
              userUuid: old.user.uuid,
            }))
            old.nextUuid = ver.uuid
            await old.save()
          }
          ver = await getSingle(dest)
          Reply.ok(reshape(ver, req)).send(res)
          next()
          return
        } catch(e) {
          Reply.internal().send(res)
          next()
          return
        }
      }
    } else if (req.body.type == 'page') {
      if ((req.body.namespace === undefined || req.body.namespace == old.namespace) &&
          (req.body.title === undefined || req.body.title == old.title) &&
          (req.body.source === undefined || req.body.source == old.source)) {
        Reply.input('nothing changed').send(res)
        next()
        return
      }
      let ver = await db.version.create(produceVersion({
        number: old.number + 1,
        resourceUuid: old.resourceUuid,
        prevUuid: old.uuid,
        namespace, title, source,
        editorUuid: req.session.cpb.uuid,
        pageUuid: old.pageUuid,
      }))
      old.nextUuid = ver.uuid
      await old.save()
      ver = await getSingle(dest)
      Reply.ok(reshape(ver, req)).send(res)
      next()
      return
    } else {
      Reply.input(`no such type: ${req.body.type}`).send(res)
      next()
      return
    }
  } else {
    Reply.missing().send(res)
    next()
    return
  }
}

const destroyResource =async(req, res)=> {
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
      await fs.promises.unlink(img)
    }
    Reply.ok().send(res)
  }
}
const trashResource =async(req, res)=> {
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
    return Reply.missing().send(res)
  } else if (!ver.resource.trashable) {
    return Reply.unallowed("resource is not trashable").send(res)
  } else if (ver.resource.trashed) {
    return Reply.invalid("resource is already trashed").send(res)
  } else if (ver.resource.private && !loggedas(ver.resource.creator.handle, req)) {
    return Reply.unallowed("private resource - only the owner can do that").send(res)
  } else {
    if (ver.resource.type == 'user') {
      if (!req.body.pass) {
        return Reply.input('must confirm user deletion with current password').send(res)
      } else {
        const confirmed = await bcrypt.compare(req.body.pass, ver.user.hash)
        if (!confirmed) {
          return Reply.input('invalid credentials').send(res)
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
          await db.version.create(produceVersion({
            resourceUuid: r.uuid,
            userUuid: u.uuid,
            namespace: `~${u.handle}`,
            editorUuid: u.uuid,
          }))
          r.trashable = false
          r.movable = false
          await r.save()
          req.session.cpb = util.guestsess()
          return Reply.ok().send(res)
        }
      }
    } else {
      ver.resource.trashed = true
      await ver.resource.save()
      return Reply.ok().send(res)
    }
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
  prePost,
  postPage,
  postUser,
  postLogin,
  postLogout,
  postImage,
  postDuplicate,
  postEnd,
)
nstu.put('/*', preAll, prePut, put, postEnd)
nstu.delete('/*', preAll, deleteResource)

module.exports = nstu
