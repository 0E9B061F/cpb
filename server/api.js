'use strict'

const rc = require('../lib/rc.js')

const api = require('express').Router()
const { Page, User } = require('./models.js')
const util = require('./util.js')
const { isuu } = require('../lib/util.js')
const { Op } = require('sequelize')
const bcrypt = require('bcrypt')

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
const internal =v=> resp(4, 'internal error', v)

api.get('/uuid/:uuid', (req, res) => {
  const uuid = util.imid(req.params.uuid)
  util.getnstu(uuid)
  .then(page=> {
    if (page) res.json(ok(util.proc(page)))
    else res.json(missing())
  })
  .catch(e=> res.json(internal()))
})

api.get('/titles/:ns', (req, res) => {
  Page.findAll({
    attributes: ['title'],
    where: {
      childVuuid: null,
      namespace: req.params.ns
    },
  }).then(titles=> {
    res.json(ok(titles.map(t=> t.title)))
  }).catch(e=> res.json(internal()))
})

const gethist =u=> {
  return Page.findAll({
    attributes: ['title', 'vnum', 'vuuid'],
    where: {uuid: u.toLowerCase()}
  }).then(vers=> vers.map(v=> util.proc(v)))
}

api.get([...bi('/history/:ns/:title'), '/history/:uuid'], (req, res) => {
  const title = req.params.title || 'Home'
  let a
  if (req.params.uuid) a = [req.params.uuid]
  else a = [req.params.ns, title]
  util.getnstu(...a)
  .then(page=> {
    if (page) {
      gethist(page.uuid)
      .then(vers=> res.json(ok(vers)))
    } else res.json(missing())
  }).catch(e=> res.json(internal()))
})

api.get('/missing/:titles', (req, res) => {
  const titles = {}
  req.params.titles.split('+').map(t=> {
    if (isuu(t)) {
      titles[t] = {[Op.or]: [{uuid: util.imid(t), childVuuid: null}, {vuuid: util.imid(t)}]}
    } else {
      const t2 = t.split(':')
      const namespace = t2[0] || 'main'
      const title = t2[1] || 'Home'
      titles[t] = {namespace, title, childVuuid: null}
    }
  })
  Page.findAll({
    where: {
      [Op.or]: Object.values(titles),
    }
  }).then(pages=> {
    const found = {}
    const map = {}
    pages.forEach(p=> {
      if (p.title == 'Home') found[p.namespace] = true
      found[`${p.namespace}:${p.title}`] = true
      found[util.exid(p.vuuid)] = true
      if (!p.childVuuid) found[util.exid(p.uuid)] = true
    })
    Object.keys(titles).forEach(nstu=> {
      if (!found[nstu]) map[nstu] = true
    })
    res.json(ok(map))
  }).catch(e=> res.json(internal()))
})

api.get(bi('/get/:ns/:title'), (req, res) => {
  const title = req.params.title || 'Home'
  util.getnstu(req.params.ns, title)
  .then(page=> {
    if (page) res.json(ok(page))
    else res.json(missing({namespace: req.params.ns, title}))
  })
  .catch(e=> res.json(internal()))
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
const reqlogin =(req, res, next)=> {
  if (req.session.cpb.login) {
    next()
  } else {
    res.json(forbidden())
    res.end()
  }
}
const reqlogout =(req, res, next)=> {
  if (!req.session.cpb.login) {
    next()
  } else {
    res.json(invalid())
    res.end()
  }
}

api.post(bi('/get/:ns/:title'), [reqlogin, (req, res)=> {
  Page.create({
    vnum: 1,
    namespace: req.body.namespace,
    title: req.body.title,
    body: req.body.body,
  })
  .then(p=> res.json(ok()))
  .catch(e=> res.json(internal()))
}])

api.post(bi('/update/:ns/:title'), [reqlogin, (req, res)=> {
  Page.findOne({where: {
    title: req.body.title,
    namespace: req.body.namespace,
    childVuuid: null
  }}).then(p1=> {
    Page.create({
      vnum: p1.vnum+1,
      uuid: p1.uuid,
      parentVuuid: p1.vuuid,
      title: req.body.title,
      namespace: req.body.namespace,
      body: req.body.body,
    }).then(p2=> {
      p1.childVuuid = p2.vuuid
      p1.save().then(x=> {
        res.json(ok())
      })
    })
  }).catch(e=> res.json(internal()))
}])

api.post('/login', [reqlogout, (req, res)=> {
  User.findOne({where: {
    handle: req.body.handle,
  }}).then(u=> {
    bcrypt.compare(req.body.pass, u.key, (err, result)=> {
      if (result) {
        req.session.cpb.handle = u.handle
        req.session.cpb.login = true
        res.json(ok())
      } else {
        res.json(forbidden())
      }
    })
  }).catch(e=> res.json(internal()))
}])

api.post('/logout', [reqlogin, (req, res)=> {
  req.session.cpb.handle = 'guest'
  req.session.cpb.login = false
  res.json(ok())
}])

api.post('/register', [reqlogout, (req, res)=> {
  bcrypt.hash(req.body.pass, saltRounds, (err, hash)=> {
    if (err) {
      res.json(internal())
      res.end()
    } else {
      User.create({
        handle: req.body.handle,
        key: hash,
      }).then(u=> {
        req.session.cpb.handle = u.handle
        req.session.cpb.login = true
        res.json(ok())
      }).catch(e=> res.json(internal()))
    }
  })
}])

api.get('/session', (req, res)=> {
  res.json(ok(req.session.cpb))
})

api.get('/user/:handle', (req, res)=> {
  if (req.session.cpb.handle == req.params.handle) {
    User.findOne({where: {handle: req.params.handle}}).then(u=> {
      res.json(ok(u))
    }).catch(e=> res.json(internal()))
  } else {
    res.json(forbidden())
    res.end()
  }
})

module.exports = api
