const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
  valorTotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  notasPedido: {
    type: DataTypes.TEXT
  },
  formaPagamento: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ClienteId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'clientes',
      key: 'id'
    }
  }
}, {
  tableName: 'pedidos',
  timestamps: true
});

module.exports = Pedido;