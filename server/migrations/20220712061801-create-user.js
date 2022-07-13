'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('User', {
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
      handle: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      hash: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [8, 72],
        },
      },
      special: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      deleted: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      delnum: {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: null,
        allowNull: true,
        unique: true,
      },
      email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
          isEmail: true
        },
      },
      logins: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      lastseen: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.DataTypes.NOW,
      },
      views: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      configUuid: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
        references: { model: 'config', key: 'uuid' },
      },

      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('User');
  }
};
