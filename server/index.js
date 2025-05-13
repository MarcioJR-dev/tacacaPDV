const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/clientes', require('./routes/clientes'));
app.use('/api/produtos', require('./routes/produtos')); // Corrigido para usar o arquivo produtos.js

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});