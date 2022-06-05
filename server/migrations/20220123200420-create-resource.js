'use strict'

const { uuid, createdAt, updatedAt, ref } = require('../lib/parts.js')

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Resources', {
      uuid,
      createdAt,
      updatedAt,
      views: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      trashed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      trashable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      movable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      editable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      ...ref('users', 'creator', true, 'SET NULL'),
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Resources')
  }
}
