'use strict'

const rc = require('../lib/rc.js')
const util = require('./util.js')

const express = require('express')
const cors = require('cors')
const sirv = require('sirv')
const session = require('express-session')

const { Op } = require('sequelize')
const db = require('./models')

const { v4 } = require('uuid')

const api = require('./api.js')


const SequelizeStore = require("connect-session-sequelize")(session.Store)


const assets = sirv('public', {
  maxAge: 31536000, // 1Y
  single: true
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

app.use('/CPB/api', api)

app.use(assets)

(async ()=> {
  await db.sequelize.sync()
  app.listen(rc.port, ()=> {
    console.log(`Example app listening at http://localhost:${rc.port}`)
  })
})()
