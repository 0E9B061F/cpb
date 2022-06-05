'use strict'

const { uuid, createdAt, updatedAt, ref } = require('../lib/parts.js')

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Versions', {
      uuid,
      createdAt,
      updatedAt,
      number: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      views: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      namespace: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: [1, 64],
          not: /\//,
          notIn: ['CPB'],
        },
      },
      title: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          len: [1, 64],
          not: /\//,
        },
      },
      source: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
      },
      ...ref('resources', 'resource', true, 'CASCADE'),
      ...ref('versions', 'prev', true, 'SET NULL'),
      ...ref('versions', 'next', true, 'SET NULL'),
      ...ref('users', 'editor', true, 'SET NULL'),
      ...ref('pages', 'page', true, 'SET NULL'),
      ...ref('images', 'image', true, 'SET NULL'),
      ...ref('users', 'user', true, 'SET NULL'),
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Versions')
  }
}
