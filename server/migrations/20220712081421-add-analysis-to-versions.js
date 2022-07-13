'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('Version', 'lede', {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
        }, { transaction: t }),
        queryInterface.addColumn('Version', 'text', {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
        }, { transaction: t }),
        queryInterface.addColumn('Version', 'wordCount', {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
        }, { transaction: t })
      ]);
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('Version', 'lede', { transaction: t }),
        queryInterface.removeColumn('Version', 'text', { transaction: t }),
        queryInterface.removeColumn('Version', 'wordCount', { transaction: t }),
      ]);
    });
  }
};
