'use strict'

const { Model } = require('sequelize')
const cpbmodel = require('../lib/cpbmodel.js')
const { re } = require('../../lib/util.js')
const bcrypt = require('bcrypt')

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
        len: [2, 24],
        is: re.user,
        reserveDeletionNames(value) {
          const m = re.deluser.exec(value)
          if (this.deleted && !m) {
            throw new Error("deleted user's name is malformed")
          } else if (!this.deleted && m) {
            throw new Error("that name is reserved for deleted users")
          }
        }
      },
    },
    hash: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [8, 72],
      },
    },
    special: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    delnum: {
      type: DataTypes.INTEGER,
      defaultValue: null,
      allowNull: true,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true
      },
    },
    logins: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
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
    validate: {
      regularAccountMustHaveEmail() {
        if (!this.special && !this.email) {
          throw new Error('email required for regular users')
        }
      },
      regularAccountMustHaveHash() {
        if (!this.special && !this.hash) {
          throw new Error('password required for regular users')
        }
      },
      systemAccountHasNoHash() {
        if (this.special && this.hash) {
          throw new Error('system accounts cannot have passwords')
        }
      },
      systemAccountHasNoEmail() {
        if (this.special && this.email) {
          throw new Error('system accounts cannot have emails')
        }
      },
    },
    hooks: {
      beforeSave: (user, options)=> {
        if (options.fields.includes("hash") && user.hash) {
          user.hash = bcrypt.hashSync(user.hash, 10)
        }
        if (!this.hash) this.special = true
      },
    },
  })
  return User
}
