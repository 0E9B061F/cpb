'use strict'

const { Model } = require('sequelize')
const cpbmodel = require('../lib/cpbmodel.js')

module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    static associate(models) {
      this.belongsTo(models.version, {
        foreignKey: { type: DataTypes.UUID, allowNull: true, },
        onDelete: 'CASCADE'
      })
    }
  }
  Image.init(cpbmodel({
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    x: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    y: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }), {
    sequelize, modelName: 'image',
  })
  return Image
}
