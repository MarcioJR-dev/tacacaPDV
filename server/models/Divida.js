const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Divida = sequelize.define('Divida', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  dataPagamento: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Pendente', 'Pago'),
    defaultValue: 'Pendente'
  },
  notasDivida: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ClienteId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'clientes',
      key: 'id'
    }
  }
}, {
  tableName: 'dividas',
  timestamps: true,
  paranoid: true
});

module.exports = Divida;