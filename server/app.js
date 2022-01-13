const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())
const port = 3000
const { Op } = require('sequelize')
const { db, Page } = require('./models.js')
const sirv = require('sirv')

const assets = sirv('public', {
  maxAge: 31536000, // 1Y
  single: true
})

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
    else {
      return {
        namespace, title,
        error: 1,
        msg: 'no such page',
      }
    }
  })
}

const apikey = 'CPBAPI'

const pre =r=> {
  return `/${apikey}/${r}`
}
const bip =(r,n,t)=> {
  const base = `${pre(r)}/:${n}`
  return [base, `${base}/:${t}`]
}

(async ()=> {
  await db.sync()
  
  app.get(pre('uuid/:uuid'), (req, res) => {
    const uuid = imid(req.params.uuid)
    getnstu(uuid).then(page=> res.json(page))
  })
  
  app.get(pre('titles/:ns'), (req, res) => {
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
  
  app.get(bip('history', 'ns', 'title'), (req, res) => {
    const title = req.params.title || 'Home'
    getnstu(req.params.ns, title).then(obj=> {
      Page.findAll({
        attributes: ['title', 'vnum', 'vuuid'],
        where: {
          uuid: obj.uuid.toLowerCase()
        }
      }).then(versions=> {
        res.json(versions.map(v=> proc(v)))
      })
    })
  })

  app.get(pre('missing/:titles'), (req, res) => {
    const hex = '[a-fA-F0-9]'
    const titles = {}
    req.params.titles.split('+').map(t=> {
      if (t.match(`${hex}{8}-(${hex}{4}-){3}${hex}{12}`)) {
        titles[t] = {[Op.or]: [{uuid: imid(t), childVuuid: null}, {vuuid: imid(t)}]}
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
        found[exid(p.vuuid)] = true
        if (!p.childVuuid) found[exid(p.uuid)] = true
      })
      Object.keys(titles).forEach(nstu=> {
        if (!found[nstu]) map[nstu] = true
      })
      res.json(map)
    })
  })
  
  app.get(bip('get', 'ns', 'title'), (req, res) => {
    const title = req.params.title || 'Home'
    getnstu(req.params.ns, title).then(obj=> res.json(obj))
  })

  app.post(bip('get', 'ns', 'title'), (req, res)=> {
    console.log(req.body)
    Page.create({
      vnum: 1,
      namespace: req.body.namespace,
      title: req.body.title,
      body: req.body.body,
    }).then(p=> {
      res.json({error: 0})
    })
  })

  app.post(bip('update', 'ns', 'title'), (req, res)=> {
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
  })

  app.use(assets)

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  });
})()
