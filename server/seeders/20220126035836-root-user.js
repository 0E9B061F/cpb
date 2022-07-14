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
    await mkuser(queryInterface, [
      { handle: 'system', source: "Does everything a human doesn't." },
      { handle: 'guest' },
      { handle: 'root',
        email: process.env.CPBROOTMAIL,
        pw: process.env.CPBROOTPW,
        special: true,
      },
      { handle: process.env.CPBUSER,
        email: process.env.CPBMAIL,
        pw: process.env.CPBPW,
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('User', null, {})
    return queryInterface.bulkDelete('Config', null, {})
  }
}
