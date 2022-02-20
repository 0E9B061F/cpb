'use strict'

const bcrypt = require('bcrypt')
const { v4 } = require ('uuid')

module.exports = {
  async up (queryInterface, Sequelize) {
    const x = await queryInterface.bulkInsert('Configs', [{
      uuid: v4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }])
    console.log(x)
    let config = await queryInterface.sequelize.query(
      `SELECT uuid from CONFIGS;`
    )
    config = config[0][0]
    console.log(config)
    const key = await bcrypt.hash('axiom', 10)
    console.log(key)
    return queryInterface.bulkInsert('Users', [{
      uuid: v4(),
      handle: 'root',
      email: 'owner@fakedomain.com',
      key,
      configUuid: config.uuid,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastseen: new Date(),
    }])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {})
    return queryInterface.bulkDelete('Configs', null, {})
  }
}
