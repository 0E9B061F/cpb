'use strict'

const { DataTypes } = require('sequelize')
const { uuid } = require('./parts.js')


const cpbmodel =m=> {
  return Object.assign(m, { uuid })
}


module.exports = cpbmodel
