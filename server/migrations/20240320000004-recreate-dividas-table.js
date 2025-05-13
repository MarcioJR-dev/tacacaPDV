'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Primeiro, remover a tabela existente
    await queryInterface.dropTable('dividas');

    // Criar a tabela novamente com a estrutura correta
    await queryInterface.createTable('dividas', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      valor: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      dataPagamento: {
        type: Sequelize.DATE,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('Pendente', 'Pago'),
        defaultValue: 'Pendente'
      },
      notasDivida: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      ClienteId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'clientes',
          key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('dividas');
  }
}; 