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
  class Image extends Model {
    static associate(models) {
      this.hasOne(models.Version, {
        foreignKey: { type: DataTypes.UUID, allowNull: true, },
      })
      this.belongsTo(models.Resource, {
        foreignKey: { type: DataTypes.UUID, allowNull: true, },
        onDelete: 'CASCADE'
      })
      this.Thumbnail = this.hasMany(models.Thumbnail, {
        foreignKey: { type: DataTypes.UUID, allowNull: true, },
        onDelete: 'CASCADE',
      })
    }
    thumbp(s) {
      s = `${s}`.padStart(3, '0')
      return `${this.dirname}/${this.basename}-${s}.${this.ext}`
    }
    async mkthumb(img, s) {
      await img.resize(s, s, {fit: 'inside'}).toFile(this.thumbp(s))
    }
    async thumbnail(img) {
      for (let n = 0; n < thumbsizes.length; n++) {
        const s = thumbsizes[n]
        if (this.max > s) await this.mkthumb(img, s)
      }
    }
    async deleteData() {
      console.log(`!!!!! DELETING ${this.dirname}/${this.basename}*`)
      rimraf(`${this.dirname}/${this.basename}*`, e=> {if (e) throw e})
    }
  }
  Image.init(cpbmodel({
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
    mime: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: validmime.image,
      },
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
    max: {
      type: DataTypes.VIRTUAL,
      get() { return Math.max(this.x, this.y) },
    },
  }), {
    sequelize, modelName: 'Image',
    hooks: {
    },
  })
  return Image
}
