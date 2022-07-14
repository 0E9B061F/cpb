'use strict'

const { Model } = require('sequelize')
const cpbmodel = require('../lib/cpbmodel.js')

module.exports = (sequelize, DataTypes) => {
  class Page extends Model {
    static associate(models) {
      this.hasOne(models.version, {
        foreignKey: {
          type: DataTypes.UUID,
          allowNull: true,
        },
      })
      this.belongsTo(models.resource, {
        foreignKey: { type: DataTypes.UUID, allowNull: true, },
        onDelete: 'CASCADE'
      })
    }
  }
  Page.init(cpbmodel({
  }), {
    sequelize, modelName: 'page',
  })
  return Page
}
