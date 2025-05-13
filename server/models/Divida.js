const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Divida = sequelize.define('Divida', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  notasDivida: {
    type: DataTypes.TEXT
  },
  dataPagamento: {
    type: DataTypes.DATE
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
  tableName: 'dividas',
  timestamps: true
});

module.exports = Divida;