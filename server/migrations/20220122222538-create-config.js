'use strict'

const { uuid, createdAt, updatedAt } = require('../lib/parts.js')

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Configs', {
      uuid,
      createdAt,
      updatedAt,
      debug: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      darkmode: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      autodark: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Configs')
  }
}
