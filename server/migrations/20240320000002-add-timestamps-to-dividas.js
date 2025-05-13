'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('dividas', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });

    await queryInterface.addColumn('dividas', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });

    await queryInterface.addColumn('dividas', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true
    });

    // Adicionar a coluna ClienteId se não existir
    await queryInterface.addColumn('dividas', 'ClienteId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'clientes',
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('dividas', 'createdAt');
    await queryInterface.removeColumn('dividas', 'updatedAt');
    await queryInterface.removeColumn('dividas', 'deletedAt');
    await queryInterface.removeColumn('dividas', 'ClienteId');
  }
}; 