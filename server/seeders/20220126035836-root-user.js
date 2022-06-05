'use strict'

const { mkuser } = require('../lib/seeders.js')

if (!process.env.CPBUSER) process.env.CPBUSER = 'qibly'

if (!process.env.CPBROOTPW ||
    !process.env.CPBUSER ||
    !process.env.CPBMAIL ||
    !process.env.CPBPW ||
    !process.env.CPBROOTMAIL) {
  throw new Error('please supply credentials (CPBROOTPW, CPBROOTMAIL, CPBUSER, CPBMAIL, CPBPW)')
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await mkuser(queryInterface, [{
      handle: 'system',
      email: 'system+'+process.env.CPBROOTMAIL,
      pw: process.env.CPBROOTPW,
    }, {
      handle: 'root',
      email: process.env.CPBROOTMAIL,
      pw: process.env.CPBROOTPW,
    }, {
      handle: process.env.CPBUSER,
      email: process.env.CPBMAIL,
      pw: process.env.CPBPW,
    }])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
    return queryInterface.bulkDelete('Configs', null, {})
  }
}
