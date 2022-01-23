'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('Users', 'configUuid', {
          type: Sequelize.UUID,
          references: {
            model: 'Configs',
            key: 'uuid',
            as: 'configUuid',
          },
        }, { transaction: t }),
      ]);
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('Users', 'configUuid', { transaction: t }),
      ]);
    });
  }
};
