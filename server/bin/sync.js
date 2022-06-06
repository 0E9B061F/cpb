#!/usr/bin/env node
'use strict'

const db = require('../models')

const main = async ()=> {
  await db.sequelize.sync()
}
main()
