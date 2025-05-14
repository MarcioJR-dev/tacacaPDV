const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Cliente = sequelize.define('Cliente', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    numero: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    telefone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    endereco: {
      type: DataTypes.STRING,
      allowNull: true
    },
    notas: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'clientes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
    paranoid: true,
    deletedAt: 'deleted_at'
  });

  return Cliente;
};