const Cliente = require('./Cliente');
const Pedido = require('./Pedido');
const Divida = require('./Divida');
const Produto = require('./Produto');

// Configurar as associações
Cliente.hasMany(Pedido, {
  foreignKey: 'cliente_id',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

Pedido.belongsTo(Cliente, {
  foreignKey: 'cliente_id',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

Cliente.hasMany(Divida, {
  foreignKey: 'cliente_id',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

Divida.belongsTo(Cliente, {
  foreignKey: 'cliente_id',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

// Associações de Produto
Pedido.belongsToMany(Produto, {
  through: 'pedido_produto',
  foreignKey: 'pedido_id',
  otherKey: 'produto_id'
});

Produto.belongsToMany(Pedido, {
  through: 'pedido_produto',
  foreignKey: 'produto_id',
  otherKey: 'pedido_id'
});

module.exports = {
  Cliente,
  Pedido,
  Divida,
  Produto
};