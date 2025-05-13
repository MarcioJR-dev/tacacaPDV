const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const app = express();

app.use(cors());
app.use(express.json());

// Importar os modelos e associações
require('./models/associations');

// Sincronizar o banco de dados
sequelize.sync({ force: true }) // force: true vai recriar todas as tabelas
  .then(() => {
    console.log('Banco de dados sincronizado com sucesso');
  })
  .catch(err => {
    console.error('Erro ao sincronizar banco de dados:', err);
  });

// Rotas
const clienteRoutes = require('./routes/clientes');
const pedidoRoutes = require('./routes/pedidos');
const dividaRoutes = require('./routes/dividas');
const produtoRoutes = require('./routes/produtos');

app.use('/api/clientes', clienteRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/dividas', dividaRoutes);
app.use('/api/produtos', produtoRoutes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro na aplicação:', err);
  res.status(500).json({ 
    message: 'Erro interno do servidor',
    error: err.message 
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});