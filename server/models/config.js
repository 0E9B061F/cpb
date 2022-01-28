'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Config extends Model {
    static associate(models) {
      this.User = this.hasOne(models.user, {
        foreignKey: 'configUuid',
        type: DataTypes.UUID,
      })
    }
  }
  Config.init({
    uuid: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
    },
    debug: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'config',
  });
  return Config;
};
