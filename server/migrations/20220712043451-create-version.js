'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('versions', {
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
      number: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      views: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      namespace: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 64],
          not: /\//,
        },
      },
      title: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [1, 64],
          not: /\//,
        },
      },
      source: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
      },

      prevUuid: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
        references: { model: 'versions', key: 'uuid' },
      },
      nextUuid: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
        references: { model: 'versions', key: 'uuid' },
      },
      editorUuid: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
        references: { model: 'users', key: 'uuid' },
      },
      resourceUuid: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
        references: { model: 'resources', key: 'uuid' },
      },
      userUuid: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
        references: { model: 'users', key: 'uuid' },
      },
      pageUuid: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
        references: { model: 'pages', key: 'uuid' },
      },
      imageUuid: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
        references: { model: 'images', key: 'uuid' },
      },

      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('versions');
  }
};
