const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

// Importar modelos
const ClienteModel = require('./Cliente');
const PedidoModel = require('./Pedido');
const ProdutoModel = require('./Produto');
const DividaModel = require('./Divida');

// Inicializar modelos
const Cliente = ClienteModel(sequelize);
const Pedido = PedidoModel(sequelize);
const Produto = ProdutoModel(sequelize);
const Divida = DividaModel(sequelize);

// Relacionamento Cliente-Pedido (1:N)
Cliente.hasMany(Pedido, {
  foreignKey: 'cliente_id',
  as: 'pedidos'
});
Pedido.belongsTo(Cliente, {
  foreignKey: 'cliente_id',
  as: 'cliente'
});

// Relacionamento Cliente-Divida (1:N)
Cliente.hasMany(Divida, {
  foreignKey: 'cliente_id',
  as: 'dividas'
});
Divida.belongsTo(Cliente, {
  foreignKey: 'cliente_id',
  as: 'cliente'
});

// Definir o modelo da tabela de junção
const PedidoProduto = sequelize.define('pedido_produto', {
  quantidade: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  pedido_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'pedidos',
      key: 'id'
    }
  },
  produto_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'produtos',
      key: 'id'
    }
  }
}, {
  tableName: 'pedido_produto',
  timestamps: false,
  underscored: true
});

// Relacionamento Pedido-Produto (N:M)
Pedido.belongsToMany(Produto, {
  through: PedidoProduto,
  foreignKey: 'pedido_id',
  otherKey: 'produto_id',
  as: 'produtos'
});
Produto.belongsToMany(Pedido, {
  through: PedidoProduto,
  foreignKey: 'produto_id',
  otherKey: 'pedido_id',
  as: 'pedidos'
});

module.exports = {
  Pedido,
  Cliente,
  Produto,
  Divida,
  PedidoProduto
};