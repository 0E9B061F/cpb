'use strict'

const bcrypt = require('bcrypt')
const { v4 } = require ('uuid')

if (!process.env.CPBROOTPW ||
    !process.env.CPBUSER ||
    !process.env.CPBMAIL ||
    !process.env.CPBPW ||
    !process.env.CPBROOTMAIL) {
  throw new Error('please supply credentials (CPBROOTPW, CPBROOTMAIL, CPBUSER, CPBMAIL, CPBPW)')
}

const time = new Date()

const mkuser = async (qi, name, mail, pw)=> {
  console.log(`creating ${name}`)
  const cid = v4()
  await qi.bulkInsert('Configs', [{
    uuid: cid,
    createdAt: time,
    updatedAt: time,
  }])
  const key = await bcrypt.hash(pw, 10)
  return qi.bulkInsert('Users', [{
    uuid: v4(),
    handle: name,
    email: mail,
    key,
    configUuid: cid,
    createdAt: time,
    updatedAt: time,
    lastseen: time,
  }])
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await mkuser(queryInterface, 'root', process.env.CPBROOTMAIL, process.env.CPBROOTPW)
    return mkuser(queryInterface, process.env.CPBUSER, process.env.CPBMAIL, process.env.CPBPW)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
    return queryInterface.bulkDelete('Configs', null, {})
  }
}
