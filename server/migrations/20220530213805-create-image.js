'use strict'

const { uuid, createdAt, updatedAt, ref } = require('../lib/parts.js')

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Images', {
      uuid,
      createdAt,
      updatedAt,
      filename: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      x: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      y: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Images')
  }
}
