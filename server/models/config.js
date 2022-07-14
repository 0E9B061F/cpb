'use strict'

const { Model } = require('sequelize')
const cpbmodel = require('../lib/cpbmodel.js')

module.exports =(sequelize, DataTypes)=> {
  class Config extends Model {
    static associate(models) {
      this.User = this.hasOne(models.user, {foreignKey: { type: DataTypes.UUID }})
    }
  }
  Config.init(cpbmodel({
    debug: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    darkmode: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    autodark: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  }), {
    sequelize, modelName: 'config',
  })
  return Config
}
