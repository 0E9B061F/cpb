'use strict'

const CPB = require('./lib/cpb.js')
const util = require('./lib/util.js')

const express = require('express')
const cors = require('cors')
const sirv = require('sirv')
const serveStatic = require('serve-static')
const compress = require('compression')()
const session = require('express-session')

const { Op } = require('sequelize')
const db = require('./models')

const { v4 } = require('uuid')

const api = require('./routes/api.js')

const SequelizeStore = require("connect-session-sequelize")(session.Store)

const store = new SequelizeStore({db: db.sequelize})

store.sync()

const html = sirv('public', {
  maxAge: 31536000, // 1Y
  single: true
})
const assets = serveStatic('assets', {
  maxAge: 31536000, // 1Y
})

const app = express()
app.use(session({
  secret: CPB.rc.secret,
  store,
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

app.use(CPB.rc.apiRoot.rel, api)
app.use(CPB.rc.dataRoot.rel, compress, assets)
app.use(compress, html);

const Server = {
  app, CPB, db,
}

module.exports = Server
