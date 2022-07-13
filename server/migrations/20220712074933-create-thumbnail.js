'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('Thumbnail', {
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

      path: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      thumb: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      size: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      x: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      y: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },

      imageUuid: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
        references: { model: 'image', key: 'uuid' },
      },

      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('Thumbnail');
  }
};
