'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Versions', {
      uuid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        validate: {
          isUUID: 4,
        },
      },
      vnum: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      views: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      namespace: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: [1, 64],
          not: /\//,
          notIn: ['CPB'],
        },
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: [1, 64],
          not: /\//,
        },
      },
      body: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
      },
      prevUuid: {
        type: Sequelize.UUID,
        validate: {
          isUUID: 4,
        },
        references: {
          model: 'versions',
          key: 'uuid',
          as: 'prevUuid',
        },
      },
      nextUuid: {
        type: Sequelize.UUID,
        validate: {
          isUUID: 4,
        },
        references: {
          model: 'versions',
          key: 'uuid',
          as: 'nextUuid',
        },
      },
      pageUuid: {
        type: Sequelize.UUID,
        allowNull: false,
        validate: {
          isUUID: 4,
        },
        references: {
          model: 'pages',
          key: 'uuid',
          as: 'pageUuid',
        },
      },
      userUuid: {
        type: Sequelize.UUID,
        allowNull: false,
        validate: {
          isUUID: 4,
        },
        references: {
          model: 'users',
          key: 'uuid',
          as: 'userUuid',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Versions');
  }
};
