const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();

app.use(cors());
app.use(express.json());

// Importar rotas
const clientesRoutes = require('./routes/clientes');
const pedidosRoutes = require('./routes/pedidos');
const dividasRoutes = require('./routes/dividas');
const produtosRoutes = require('./routes/produtos');

// Usar rotas
app.use('/api/clientes', clientesRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/dividas', dividasRoutes);
app.use('/api/produtos', produtosRoutes);

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

// Sincronizar banco de dados e iniciar servidor
const PORT = process.env.PORT || 3001;

sequelize.sync({ force: true }).then(() => {
  console.log('Banco de dados sincronizado');
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}).catch(err => {
  console.error('Erro ao sincronizar banco de dados:', err);
});