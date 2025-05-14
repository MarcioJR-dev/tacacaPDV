const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
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
    data_vencimento: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'data_vencimento'
    },
    status: {
      type: DataTypes.ENUM('pendente', 'pago', 'atrasado'),
      defaultValue: 'pendente'
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clientes',
        key: 'id'
      },
      field: 'cliente_id'
    }
  }, {
    tableName: 'dividas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
    paranoid: true,
    deletedAt: 'deleted_at'
  });

  Divida.associate = (models) => {
    Divida.belongsTo(models.Cliente, {
      foreignKey: 'cliente_id',
      as: 'cliente'
    });
  };

  return Divida;
};