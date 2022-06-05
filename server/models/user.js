'use strict'

const { Model } = require('sequelize')
const cpbmodel = require('../lib/cpbmodel.js')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.Config = this.belongsTo(models.config, {
        foreignKey: { type: DataTypes.UUID },
      })
      this.hasMany(models.resource, {
        as: 'creator',
        foreignKey: { type: DataTypes.UUID },
      })
      this.hasMany(models.version, {
        as: 'editor',
        foreignKey: { type: DataTypes.UUID },
      })
      this.hasOne(models.version, {
        foreignKey: { type: DataTypes.UUID, allowNull: true, },
      })
    }
  }
  User.init(cpbmodel({
    handle: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [2, 16],
        is: /^[A-Za-z0-9_\-]+$/,
        notIn: ['guest'],
      },
    },
    hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      },
    },
    logins: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    lastseen: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    views: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }), {
    sequelize, modelName: 'user',
  })
  return User
}
