'use strict'

const bcrypt = require('bcrypt')

module.exports = {
  async up (queryInterface, Sequelize) {
    const key = await bcrypt('axiom', 10)
    return queryInterface.bulkInsert('Users', [{
      handle: 'root',
      email: 'owner@email.com',
      key,
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {})
  }
}
