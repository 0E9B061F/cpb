'use strict'

const { Sequelize, DataTypes, Op } = require('sequelize')

const db = new Sequelize({
  dialect: 'sqlite',
  storage: 'server/database.sqlite'
})

const Page = db.define('Page', {
  vuuid: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  vnum: {
    type: DataTypes.NUMBER,
    allowNull: false
  },
  namespace: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'main',
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  body: {
    type: DataTypes.STRING
  }
})

Page.belongsTo(Page, {as: 'parent'})
Page.belongsTo(Page, {as: 'child'})

module.exports = { db, Page }

