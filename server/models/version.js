'use strict'

const { Model } = require('sequelize')
const cpbmodel = require('../lib/cpbmodel.js')

module.exports =(sequelize, DataTypes)=> {
  class Version extends Model {
    static associate(models) {
      this.belongsTo(this, {
        as: 'prev',
        onDelete: 'SET NULL',
        foreignKey: {
          type: DataTypes.UUID,
          allowNull: true,
        }
      })
      this.belongsTo(this, {
        as: 'next',
        onDelete: 'SET NULL',
        foreignKey: {
          type: DataTypes.UUID,
          allowNull: true,
        }
      })
      this.belongsTo(models.user, {
        as: 'editor',
        onDelete: 'SET NULL',
        foreignKey: {
          type: DataTypes.UUID,
          allowNull: true,
        }
      })
      this.Resource = this.belongsTo(models.resource, {
        onDelete: 'CASCADE',
        foreignKey: {
          type: DataTypes.UUID,
          allowNull: true,
        }
      })
      this.belongsTo(models.user, {
        foreignKey: {
          type: DataTypes.UUID,
          allowNull: true,
        }
      })
      this.belongsTo(models.page, {
        foreignKey: {
          type: DataTypes.UUID,
          allowNull: true,
        }
      })
      this.belongsTo(models.image, {
        foreignKey: {
          type: DataTypes.UUID,
          allowNull: true,
        }
      })
      // this.belongsToMany(this, { through: Links })
      // this.belongsToMany(this, { through: Tags })
    }
  }
  Version.init(cpbmodel({
    number: {
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
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [1, 64],
        not: /\//,
      },
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
  }), {
    sequelize, modelName: 'version',
  })
  return Version
}
