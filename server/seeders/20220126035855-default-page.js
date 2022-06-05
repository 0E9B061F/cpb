'use strict'

const fs = require('fs')
const { mkpage } = require('../lib/seeders.js')
const homedata = fs.readFileSync('./data/Home.wmd', {encoding: 'utf-8'})
const wmddata = fs.readFileSync('./data/WMD.wmd', {encoding: 'utf-8'})


module.exports = {
  async up (queryInterface, Sequelize) {
    return mkpage(queryInterface, [{
      space: 'main', title: 'Home',
      source: homedata,
    }, {
      space: 'docs', title: 'WMD',
      source: wmddata,
    }])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Pages', null, {})
    await queryInterface.bulkDelete('Versions', null, {})
  }
}
