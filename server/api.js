'use strict'

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

api.get('/uuid/:uuid', (req, res) => {
  const uuid = util.imid(req.params.uuid)
  util.getnstu(uuid).then(page=> res.json(page))
})

api.get('/titles/:ns', (req, res) => {
  Page.findAll({
    attributes: ['title'],
    where: {
      childVuuid: null,
      namespace: req.params.ns
    }
  }).then(titles=> {
    return res.json({result: titles.map(t=> t.title)})
  })
})

api.get(bi('/history/:ns/:title'), (req, res) => {
  const title = req.params.title || 'Home'
  util.getnstu(req.params.ns, title).then(obj=> {
    Page.findAll({
      attributes: ['title', 'vnum', 'vuuid'],
      where: {
        uuid: obj.uuid.toLowerCase()
      }
    }).then(versions=> {
      res.json(versions.map(v=> util.proc(v)))
    })
  })
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
  console.log(titles)
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
    res.json(map)
  })
})

api.get(bi('/get/:ns/:title'), (req, res) => {
  const title = req.params.title || 'Home'
  util.getnstu(req.params.ns, title).then(obj=> res.json(obj))
})

const loggedas =h=> {
  return (req, res, next)=> {
    if (req.session.user.login && req.session.user.handle == h) {
      next()
    } else {
      res.json({error: 10, message: 'access denied'})
      res.end()
    }
  }
}
const reqlogin =(req, res, next)=> {
  if (req.session.user.login) {
    next()
  } else {
    res.json({error: 10, message: 'access denied, you must be logged in'})
    res.end()
  }
}
const reqlogout =(req, res, next)=> {
  if (!req.session.user.login) {
    next()
  } else {
    res.json({error: 11, message: 'access denied, you must be logged out'})
    res.end()
  }
}

api.post(bi('/get/:ns/:title'), [reqlogin, (req, res)=> {
  Page.create({
    vnum: 1,
    namespace: req.body.namespace,
    title: req.body.title,
    body: req.body.body,
  }).then(p=> {
    res.json({error: 0})
  })
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
      p1.save().then(x=> res.json({error: 0}))
    })
  })
}])

api.post('/login', [reqlogout, (req, res)=> {
  User.findOne({where: {
    handle: req.body.handle,
  }}).then(u=> {
    bcrypt.compare(req.body.pass, u.key, (err, result)=> {
      if (result) {
        req.session.user.handle = u.handle
        req.session.user.login = true
        res.json({error: 0})
      } else {
        res.json({error: 10, message: 'unauthorized'})
      }
    })
  })
}])
api.post('/logout', [reqlogin, (req, res)=> {
  req.session.user.handle = 'guest'
  req.session.user.login = false
  res.json({error: 0})
}])
api.post('/register', [reqlogout, (req, res)=> {
  bcrypt.hash(req.body.pass, saltRounds, (err, hash)=> {
    // Store hash in your password DB.
    User.create({
      handle: req.body.handle,
      key: hash,
    }).then(u=> {
      req.session.user.handle = u.handle
      req.session.user.login = true
      res.json({error: 0})
    })
  })
}])
api.get('/session', (req, res)=> {
  res.json(req.session)
})
api.get('/user/:handle', (req, res)=> {
  if (req.session.user.handle == req.params.handle) {
    User.findOne({where: {handle: req.params.handle}}).then(u=> {
      res.json(u)
    })
  } else {
    res.json({error: 10, message: 'access denied'})
    res.end()
  }
})

module.exports = api

