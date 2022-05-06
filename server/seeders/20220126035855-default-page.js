'use strict'

const fs = require('fs')
const { v4 } = require ('uuid')
const homedata = fs.readFileSync('./data/Home.wmd', {encoding: 'utf-8'})
const wmddata = fs.readFileSync('./data/WMD.wmd', {encoding: 'utf-8'})

module.exports = {
  async up (queryInterface, Sequelize) {
    let root = await queryInterface.sequelize.query(
      `SELECT uuid from USERS where handle="root";`
    )
    root = root[0][0]

    const hd = new Date()
    const hu = v4()
    const wu = v4()
    await queryInterface.bulkInsert('Pages', [{
      uuid: hu,
      userUuid: root.uuid,
      createdAt: hd,
      updatedAt: hd,
    }, {
      uuid: wu,
      userUuid: root.uuid,
      createdAt: hd,
      updatedAt: hd,
    }])
    return await queryInterface.bulkInsert('Versions', [{
      uuid: v4(),
      namespace: 'main',
      title: 'Home',
      body: homedata,
      pageUuid: hu,
      userUuid: root.uuid,
      createdAt: hd,
      updatedAt: hd,
      vnum: 1,
    }, {
      uuid: v4(),
      namespace: 'docs',
      title: 'WMD',
      body: wmddata,
      pageUuid: wu,
      userUuid: root.uuid,
      createdAt: hd,
      updatedAt: hd,
      vnum: 1,
    }])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Pages', null, {})
    await queryInterface.bulkDelete('Versions', null, {})
  }
}
