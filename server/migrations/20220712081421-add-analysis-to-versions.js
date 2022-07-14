'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('versions', 'lede', {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
        }, { transaction: t }),
        queryInterface.addColumn('versions', 'text', {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
        }, { transaction: t }),
        queryInterface.addColumn('versions', 'wordCount', {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
        }, { transaction: t })
      ]);
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('versions', 'lede', { transaction: t }),
        queryInterface.removeColumn('versions', 'text', { transaction: t }),
        queryInterface.removeColumn('versions', 'wordCount', { transaction: t }),
      ]);
    });
  }
};
