const Cliente = require('./Cliente');
const Pedido = require('./Pedido');
const Divida = require('./Divida');

// Configurar as associações
Cliente.hasMany(Pedido, {
  foreignKey: 'ClienteId',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

Pedido.belongsTo(Cliente, {
  foreignKey: 'ClienteId'
});

Cliente.hasMany(Divida, {
  foreignKey: 'ClienteId',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

Divida.belongsTo(Cliente, {
  foreignKey: 'ClienteId'
});

module.exports = {
  Cliente,
  Pedido,
  Divida
};