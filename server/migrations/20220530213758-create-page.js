'use strict'

const { uuid, createdAt, updatedAt, ref } = require('../lib/parts.js')

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pages', {
      uuid,
      createdAt,
      updatedAt,
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Pages')
  }
}
