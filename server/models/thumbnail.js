'use strict'

const { Model } = require('sequelize')
const cpbmodel = require('../lib/cpbmodel.js')
const { validmime, extmap, thumbsizes } = require('../lib/util.js')
const sharp = require('sharp')
const pathlib = require('path')
const fs = require('fs')
const rimraf = require('rimraf')
const CPB = require('../lib/cpb.js')

module.exports = (sequelize, DataTypes) => {
  class Thumbnail extends Model {
    static associate(models) {
      this.belongsTo(models.image, {
        foreignKey: { type: DataTypes.UUID, allowNull: true, },
        onDelete: 'CASCADE',
      })
    }
  }
  Thumbnail.init(cpbmodel({
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rel: {
      type: DataTypes.VIRTUAL,
      get() { return CPB.rc.upload(this.filename).rel },
    },
    filename: {
      type: DataTypes.VIRTUAL,
      get() { return pathlib.basename(this.path) },
    },
    thumb: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    x: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    y: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }), {
    sequelize, modelName: 'thumbnail',
    hooks: {
    },
  })
  return Thumbnail
}
