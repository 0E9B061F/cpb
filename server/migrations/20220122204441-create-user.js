'use strict'

const { uuid, createdAt, updatedAt, ref } = require('../lib/parts.js')

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      uuid,
      createdAt,
      updatedAt,
      handle: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      logins: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      lastseen: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      views: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      ...ref('configs', 'config'),
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users')
  }
}
