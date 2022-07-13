'use strict'

const { Model } = require('sequelize')
const cpbmodel = require('../lib/cpbmodel.js')

module.exports =(sequelize, DataTypes)=> {
  class Resource extends Model {
    static associate(models) {
      this.Version = this.hasMany(models.Version, {
        foreignKey: { type: DataTypes.UUID, allowNull: true, },
        onDelete: 'CASCADE',
      })
      this.hasMany(models.Page, {
        foreignKey: { type: DataTypes.UUID, allowNull: true, },
        onDelete: 'CASCADE',
      })
      this.hasMany(models.Image, {
        foreignKey: { type: DataTypes.UUID, allowNull: true, },
        onDelete: 'CASCADE',
      })
      this.belongsTo(models.User, {
        as: 'creator',
        foreignKey: { type: DataTypes.UUID, allowNull: true, }
      })
    }
  }
  Resource.init(cpbmodel({
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['page', 'image', 'user']],
      }
    },
    trashed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    trashable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    deletable: {
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
    sequelize, modelName: 'Resource',
    validate: {
      usersAreNotDeletable() {
        if (this.type == 'user' && this.deletable) {
          throw new Error('user resources are not deletable')
        }
      },
      deletableResourcesMustBeTrashable() {
        if (this.deletable && !this.trashable) {
          throw new Error('deletable resources must be trashable')
        }
      },
      cannotSetTrashedOnUntrashable() {
        if (!this.trashable && this.trashed) {
          throw new Error('untrashable resources cannot be trashed')
        }
      },
    },
  })
  return Resource
}
