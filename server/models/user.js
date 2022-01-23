'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.Config = this.belongsTo(models.config, {
        foreignKey: {
          type: DataTypes.UUID,
        }
      })
    }
  }
  User.init({
    uuid: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
    },
    handle: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [2, 16],
        is: /^[A-Za-z0-9_\-]+$/,
      },
    },
    key: {
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
    configUuid: {
      type: DataTypes.UUID,
      references: {
        model: 'configs',
        key: 'uuid',
        as: 'configUuid',
      },
    },
  }, {
    sequelize,
    modelName: 'user',
  });
  return User;
};
