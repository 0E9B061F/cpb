'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.changeColumn('versions', 'namespace', {
      type: Sequelize.STRING,
      allowNull: true,
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.changeColumn('versions', 'namespace', {
      type: Sequelize.STRING,
      allowNull: false,
    })
  }
};
