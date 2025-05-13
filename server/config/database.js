const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('tacaca', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;