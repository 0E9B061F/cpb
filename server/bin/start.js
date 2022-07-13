#!/usr/bin/env node
'use strict'

const { db, app, CPB } = require('../server.js')

const main =async()=> {
  //await db.sequelize.sync()
  app.listen(CPB.rc.port, ()=> {
    console.log(`Commonplace Book listening on ${CPB.rc.port}`)
  })
}

main()
