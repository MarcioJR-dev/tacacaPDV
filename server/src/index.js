const express = require('express');
const cors = require('cors');
const imprimirRoutes = require('./routes/imprimir');

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/imprimir', imprimirRoutes);

// ... outras rotas existentes ...

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); 