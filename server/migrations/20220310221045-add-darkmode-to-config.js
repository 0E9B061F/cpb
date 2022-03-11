'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t=> {
      return Promise.all([
        queryInterface.addColumn('Configs', 'darkmode', {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        }, { transaction: t }),
        queryInterface.addColumn('Configs', 'autodark', {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
          allowNull: false,
        }, { transaction: t }),
      ]);
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('Configs', 'darkmode', { transaction: t }),
        queryInterface.removeColumn('Configs', 'autodark', { transaction: t }),
      ]);
    });
  }
};
