'use strict'

const rc = require('./rc.js')
const util = require('./util.js')

const express = require('express')
const cors = require('cors')
const sirv = require('sirv')
const compress = require('compression')()
const session = require('express-session')

const { Op } = require('sequelize')
const db = require('./models')

const { v4 } = require('uuid')

const api = require('./api.js')


const SequelizeStore = require("connect-session-sequelize")(session.Store)


const html = sirv('public', {
  maxAge: 31536000, // 1Y
  single: true
})
const assets = sirv('assets', {
  maxAge: 31536000, // 1Y
})

const app = express()
app.use(session({
  secret: rc.secret,
  store: new SequelizeStore({db: db.sequelize}),
  resave: false,
}))
app.use((req, res, next)=> {
  if (!req.session.uuid) {
    req.session.uuid = v4()
  }
  if (!req.session.cpb) {
    req.session.cpb = util.guestsess()
  }
  next()
})
app.use(express.json())
app.use(cors())

app.use(`/${rc.syskey}/api`, api)
app.use(`/${rc.syskey}/data`, compress, assets)
app.use(compress, html);

(async ()=> {
  await db.sequelize.sync()
  app.listen(rc.port, ()=> {
    console.log(`Commonplace Book listening on ${rc.port}`)
  })
})()
