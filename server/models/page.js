'use strict'

const { Model } = require('sequelize')
const cpbmodel = require('../lib/cpbmodel.js')

module.exports = (sequelize, DataTypes) => {
  class Page extends Model {
    static associate(models) {
      this.hasOne(models.Version, {
        foreignKey: {
          type: DataTypes.UUID,
          allowNull: true,
        },
      })
      this.belongsTo(models.Resource, {
        foreignKey: { type: DataTypes.UUID, allowNull: true, },
        onDelete: 'CASCADE'
      })
    }
  }
  Page.init(cpbmodel({
  }), {
    sequelize, modelName: 'Page',
  })
  return Page
}
