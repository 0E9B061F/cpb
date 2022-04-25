'use strict'

const rc = require('./rc.js')

const api = require('express').Router()
const { Op } = require('sequelize')
const bcrypt = require('bcrypt')

const db = require('./models')
const util = require('./util.js')
const { isuu } = require('../lib/util.js')

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

api.get('/search/:query', (req, res)=> {
  const query = req.params.query
  const pat = `%${query}%`
  let size = ordef(req.query.sz, rc.searchDefaults.sz)
  if (size < rc.minResults) size = rc.minResults
  else if (size > rc.maxResults) size = rc.maxResults
  let page = ordef(req.query.pg, rc.searchDefaults.pg)
  let inf = req.query.inf || rc.searchDefaults.inf
  if (typeof(inf) == 'string') inf = inf.split(',')
  const intitle = inf.indexOf('title') > -1 || false
  const inbody = inf.indexOf('body') > -1 || false
  const both = (!intitle && !inbody) || (intitle && inbody)
  const inhist = req.query.inh || rc.searchDefaults.inh
  const where = {}
  const attr = ['namespace', 'title']
  if (both) {
    where[Op.or] = [
      {title: {[Op.like]: pat}},
      {body: {[Op.like]: pat}},
    ]
    attr.push('body')
  } else if (intitle) {
    where.title = {[Op.like]: pat}
  } else if (inbody) {
    where.body = {[Op.like]: pat}
    attr.push('body')
  } else throw new Error()
  if (!inhist) where.nextUuid = null
  db.version.count({where})
  .then(total=> {
    const pages = Math.ceil(total / size)
    if (page > pages) page = pages
    if (page < 1) page = 1
    if (total > 0) {
      db.version.findAll({
        where,
        offset: size * (page - 1),
        limit: size,
        attributes: attr,
        raw: true,
      })
      .then(items=> {
        const rx = new RegExp(`(.{0,40}?)(${req.params.query})(.{0,40})`, 'i')
        res.json(ok({
          total, page, pages,
          items: items.map(i=> {
            if (i.body) {
              let bm = i.body.match(rx)
              bm = bm ? bm.slice(1,4) : i.body.slice(0,40)
              i.body = bm
            }
            i.plain = i.title
            if (both || intitle) {
              let tm = i.title.match(rx)
              tm = tm ? tm.slice(1,4) : i.title
              i.title = tm
            }
            return i
          }),
        }))})
    } else {
      res.json(ok({
        total, page, pages, items: [],
      }))
    }
  })
  .catch(e=> res.json(internal(e)))
})

api.get([...bi('/history/:ns/:title'), '/history/:uuid'], (req, res) => {
  const title = req.params.title || 'Home'
  const uuid = req.params.uuid ? util.imid(req.params.uuid) : null
  let size = ordef(req.query.sz, 10)
  if (size < 5) size = 5
  else if (size > 50) size = 50
  let page = ordef(req.query.pg, 1)
  let a
  if (uuid) a = [uuid]
  else a = [req.params.ns, title]
  util.getnstu(...a)
  .then(ver=> {
    if (ver) {
      const where = {
        pageUuid: ver.pageUuid.toLowerCase()
      }
      db.version.count({where})
      .then(total=> {
        const pages = Math.ceil(total / size)
        if (page > pages) page = pages
        if (page < 1) page = 1
        if (total > 0) {
          db.version.findAll({
            attributes: ['title', 'vnum', 'uuid'],
            where,
            include: {
              model: db.user,
              attributes: ['handle']
            },
            offset: size * (page - 1),
            limit: size,
            order: [['vnum', 'DESC']],
          })
          .then(items=> items.map(i=> util.proc(i)))
          .then(items=> res.json(ok({
            total, page, pages, size, items,
          })))
        } else {
          res.json(ok({
            total, page, pages, size, items: [],
          }))
        }
      })
    } else res.json(missing())
  }).catch(e=> res.json(internal(e)))
})

api.get('/uuid/:uuid', (req, res)=> {
  const uuid = util.imid(req.params.uuid)
  util.getnstu(uuid)
  .then(page=> {
    if (page) res.json(ok(util.proc(page)))
    else res.json(missing())
  })
  .catch(e=> res.json(internal(e)))
})

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

api.get(bi('/recent/:num'), (req, res)=> {
  const num = req.params.num || 5
  db.version.findAll({
    attributes: ['namespace', 'title', 'createdAt'],
    where: { nextUuid: null },
    order: [['createdAt', 'DESC']],
    include: {
      model: db.user,
      attributes: ['handle'],
    },
    limit: num,
  })
  .then(vers=> res.json(ok(vers)))
  .catch(e=> res.json(internal(e)))
})

api.get('/missing/:titles', (req, res) => {
  const titles = {}
  req.params.titles.split('+').map(t=> {
    if (isuu(t)) {
      t = util.imid(t)
      titles[t] = {[Op.or]: [{pageUuid: t, nextUuid: null}, {uuid: t}]}
    } else {
      const t2 = t.split(':')
      const namespace = t2[0] || 'main'
      const title = t2[1] || 'Home'
      titles[t] = {namespace, title, nextUuid: null}
    }
  })
  db.version.findAll({
    where: {
      [Op.or]: Object.values(titles),
    }
  }).then(pages=> {
    const found = {}
    const map = {}
    pages.forEach(p=> {
      if (p.title == 'Home') found[p.namespace] = true
      found[`${p.namespace}:${p.title}`] = true
      found[p.uuid] = true
      if (!p.nextUuid) found[p.pageUuid] = true
    })
    Object.keys(titles).forEach(nstu=> {
      if (!found[nstu]) map[nstu] = true
    })
    res.json(ok(map))
  }).catch(e=> res.json(internal(e)))
})

api.get(bi('/get/:ns/:title'), (req, res) => {
  const title = req.params.title || 'Home'
  util.getnstu(req.params.ns, title)
  .then(page=> {
    if (page) res.json(ok(page))
    else res.json(missing({namespace: req.params.ns, title}))
  })
  .catch(e=> res.json(internal(e)))
})

const loggedas =h=> {
  return (req, res, next)=> {
    if (req.session.cpb.login && req.session.cpb.handle == h) {
      next()
    } else {
      res.json(forbidden())
      res.end()
    }
  }
}
const needlogin =(req, res, next)=> {
  if (req.session.cpb.login) {
    next()
  } else {
    res.json(forbidden())
    res.end()
  }
}
const needlogout =(req, res, next)=> {
  if (!req.session.cpb.login) {
    next()
  } else {
    res.json(invalid())
    res.end()
  }
}
const notsingleuser =(req, res, next)=> {
  if (!rc.singleuser) {
    next()
  } else {
    res.json(invalid())
    res.end()
  }
}

api.post(bi('/get/:ns/:title'), [needlogin, (req, res)=> {
  db.page.create({
    userUuid: req.session.cpb.uuid,
    versions: [{
      namespace: req.body.namespace,
      title: req.body.title,
      body: req.body.body,
      userUuid: req.session.cpb.uuid,
    }],
  }, {
    include: [{
      association: db.page.Version,
    }]
  })
  .then(p=> res.json(ok(p)))
  .catch(e=> res.json(internal(e)))
}])

api.post(bi('/update/:ns/:title'), [needlogin, (req, res)=> {
  db.version.findOne({where: {
    title: req.body.title,
    namespace: req.body.namespace,
    nextUuid: null,
  }}).then(old=> {
    db.version.create({
      vnum: old.vnum+1,
      pageUuid: old.pageUuid,
      prevUuid: old.uuid,
      title: req.body.title,
      namespace: req.body.namespace,
      body: req.body.body,
      userUuid: req.session.cpb.uuid,
    }).then(cur=> {
      old.nextUuid = cur.uuid
      old.save().then(x=> {
        res.json(ok())
      })
    })
  }).catch(e=> res.json(internal(e)))
}])

api.post('/login', [needlogout, (req, res)=> {
  db.user.findOne({
    where: { handle: req.body.handle },
    include: [db.config],
  }).then(u=> {
    if (!u) {
      res.json(inputerr(['Bad credentials. Failed to login.']))
      res.end()
    } else {
      bcrypt.compare(req.body.pass, u.key)
      .then(valid=> {
        if (valid) {
          req.session.cpb = util.mklogin(u)
          res.json(ok(util.exportsess(req.session)))
        } else {
          res.json(inputerr(['Bad credentials. Failed to login.']))
          res.end()
        }
      })
    }
  }).catch(e=> res.json(internal(e)))
}])

api.post('/logout', [needlogin, (req, res)=> {
  req.session.cpb = util.guestsess()
  res.json(ok())
}])

api.post('/register', [notsingleuser, needlogout, (req, res)=> {
  if (!req.body.pass || req.body.pass.length < 9) {
    res.json(inputerr(['Invalid password.']))
    res.end()
  } else {
    bcrypt.hash(req.body.pass, saltRounds, (err, hash)=> {
      if (err) {
        res.json(internal(err))
        res.end()
      } else {
        db.user.create({
          handle: req.body.handle,
          email: req.body.email,
          key: hash,
          config: {},
        }, {
          include: [{
            association: db.user.Config,
          }]
        })
        .then(u=> {
          console.log(`created user ${u}`)
          req.session.cpb = util.mklogin(u)
          res.json(ok())
        })
        .catch(e=> {
          console.log(e)
          console.log(e.name)
          if (e.name == "SequelizeUniqueConstraintError") {
            const m = []
            e.errors.forEach(e=> {
              if (e.path == 'handle') m.push(`The username '${req.body.handle}' is already in use.`)
              if (e.path == 'email') m.push(`The email '${req.body.email}' is already in use.`)
            })
            res.json(inputerr(m))
            res.end()
          } else if (e.name == "SequelizeValidationError") {
            const m = []
            e.errors.forEach(e=> {
              if (e.path == 'handle') m.push(`Invalid handle.`)
              if (e.path == 'email') m.push(`Invalid email.`)
              if (e.path == 'key') m.push(`Invalid password.`)
            })
            res.json(inputerr(m.filter((v, i, a) => a.indexOf(v) === i)))
            res.end()
          } else {
            console.log('KAPUT')
            res.json(internal(e))
            res.end()
          }
          console.log(`failed to create user: ${e}`)
        })
      }
    })
  }
}])

api.get('/session', (req, res)=> {
  res.json(ok(util.exportsess(req.session)))
})

api.get('/user/:handle', [needlogin, (req, res)=> {
  if (req.session.cpb.handle == req.params.handle) {
    db.user.findOne({where: {handle: req.params.handle}}).then(u=> {
      res.json(ok(u))
    }).catch(e=> res.json(internal(e)))
  } else {
    res.json(forbidden())
    res.end()
  }
}])

api.post('/config/:handle', [needlogin, (req, res)=> {
  if (req.session.cpb.handle == req.params.handle) {
    db.user.findOne({where: {uuid: req.session.cpb.uuid}}).then(u=> {
      db.config.update(req.body, {where: {uuid: u.configUuid}}).then(r=> {
        db.config.findOne({where: {uuid: u.configUuid}}).then(c=> {
          req.session.cpb.config = c
          res.json(ok(c))
        })
      })
    }).catch(e=> res.json(internal(e)))
  } else {
    res.json(forbidden())
    res.end()
  }
}])


module.exports = api
