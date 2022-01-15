const express = require('express')
const cors = require('cors')
const port = 3000
const { Op } = require('sequelize')
const { db, Page } = require('./models.js')
const sirv = require('sirv')
const session = require('express-session')
const { v4 } = require('uuid')
const api = require('./api.js')
const SequelizeStore = require("connect-session-sequelize")(session.Store)

const assets = sirv('public', {
  maxAge: 31536000, // 1Y
  single: true
})

const app = express()
app.use(session({
  secret: 'kigig989iu3nrnndkfsaloip3;lqmkfkjfjdkij nn',
  store: new SequelizeStore({db}),
  resave: false,
}))
app.use((req, res, next)=> {
  if (!req.session.user) {
    req.session.user = {
      handle: 'guest',
      login: false,
    }
  }
  if (!req.session.uuid) req.session.uuid = v4()
  next()
})
app.use(express.json())
app.use(cors())

app.use('/CPB/api', api)

app.use(assets);

(async ()=> {
  await db.sync()
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
})()

