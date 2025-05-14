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
      data_vencimento: {
        type: Sequelize.DATE,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pendente', 'pago', 'atrasado'),
        defaultValue: 'pendente'
      },
      descricao: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      cliente_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'clientes',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('dividas');
  }
}; 