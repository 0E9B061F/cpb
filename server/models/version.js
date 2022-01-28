'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Version extends Model {
    static associate(models) {
      this.belongsTo(this, {as: 'prev'}, {
        foreignKey: { type: DataTypes.UUID }
      })
      this.belongsTo(this, {as: 'next'}, {
        foreignKey: { type: DataTypes.UUID }
      })
      this.belongsTo(models.user, {
        foreignKey: { type: DataTypes.UUID }
      })
      this.Page = this.belongsTo(models.page, {
        foreignKey: { type: DataTypes.UUID }
      })
    }
  }
  Version.init({
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
    vnum: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    views: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    namespace: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 64],
        not: /\//,
        notIn: ['CPB'],
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 64],
        not: /\//,
      },
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    prevUuid: {
      type: DataTypes.UUID,
      validate: {
        isUUID: 4,
      },
      references: {
        model: 'versions',
        key: 'uuid',
        as: 'prevUuid',
      },
    },
    nextUuid: {
      type: DataTypes.UUID,
      validate: {
        isUUID: 4,
      },
      references: {
        model: 'versions',
        key: 'uuid',
        as: 'nextUuid',
      },
    },
    pageUuid: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        isUUID: 4,
      },
      references: {
        model: 'pages',
        key: 'uuid',
        as: 'pageUuid',
      },
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
    modelName: 'version',
  });
  return Version;
};
