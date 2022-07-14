'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('pages', {
      uuid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        unique: true,
        validate: {
          isUUID: 4,
        },
      },

      resourceUuid: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
        references: { model: 'resources', key: 'uuid' },
      },

      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('pages');
  }
};
