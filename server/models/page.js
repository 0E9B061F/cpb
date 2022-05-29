'use strict';

const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Page extends Model {
    static associate(models) {
      this.Version = this.hasMany(models.version, {
        foreignKey: { type: DataTypes.UUID }
      })
      this.belongsTo(models.user, {
        foreignKey: { type: DataTypes.UUID }
      })
    }
  }
  Page.init({
    uuid: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      validate: {
        isUUID: 4,
      },
    },
    views: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    userUuid: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        isUUID: 4,
      },
      references: {
        model: 'users',
        key: 'uuid',
        as: 'userUuid',
      },
    },
  }, {
    sequelize,
    modelName: 'page',
  });
  return Page;
};
