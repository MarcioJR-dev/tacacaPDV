const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Pedido = sequelize.define('Pedido', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    data: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    valor_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      get() {
        const value = this.getDataValue('valor_total');
        return value ? parseFloat(value) : 0;
      }
    },
    notas_pedido: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    forma_pagamento: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Dinheiro'
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'clientes',
        key: 'id'
      }
    }
  }, {
    tableName: 'pedidos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    underscored: true,
    paranoid: true
  });

  return Pedido;
};