'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notes', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      title: {
        type: Sequelize.TEXT(`long`),
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT('long'),
        allowNull: true,
      },
      color: {
        type: Sequelize.STRING(20),  //optional
        defaultValue: '#d3d3d3',
      },
      category: {
        type: Sequelize.STRING(100), // optional
        allowNull: true,
      },
      is_pinned: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_archived: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addConstraint('notes', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_notes_user_id',
      references: {
        table: 'users',
        field: 'id',
      },
      onDelete: 'CASCADE',
    });

    await queryInterface.addIndex('notes', ['user_id']);
    await queryInterface.addIndex('notes', ['is_pinned']);
    await queryInterface.addIndex('notes', ['is_archived']);
    await queryInterface.addIndex('notes', ['is_deleted']);
    await queryInterface.addIndex('notes', ['created_at']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('notes');
  },
};
