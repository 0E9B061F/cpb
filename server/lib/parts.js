'use strict'

const { DataTypes } = require('sequelize')

const datefield = {
  allowNull: false,
  type: DataTypes.DATE
}

module.exports = {
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
  createdAt: datefield,
  updatedAt: datefield,
  ref: (m, a, an=false, od=null)=> {
    const n = `${a}Uuid`
    const obj = {
      [n]: {
        type: DataTypes.UUID,
        allowNull: an,
        validate: { isUUID: 4 },
        references: {
          model: m, as: n,
          key: 'uuid',
        },
      }
    }
    if (od) obj.onDelete = od
    return obj
  },
}
