'use strict'

const { Model } = require('sequelize')
const cpbmodel = require('../lib/cpbmodel.js')

module.exports =(sequelize, DataTypes)=> {
  class Resource extends Model {
    static associate(models) {
      this.Version = this.hasMany(models.version, {
        onDelete: 'cascade',
        foreignKey: { type: DataTypes.UUID, allowNull: true, }
      })
      this.belongsTo(models.user, {
        as: 'creator',
        foreignKey: { type: DataTypes.UUID, allowNull: true, }
      })
    }
  }
  Resource.init(cpbmodel({
    trashed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    trashable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    movable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    editable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    views: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }), {
    sequelize, modelName: 'resource',
  })
  return Resource
}
