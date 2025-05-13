const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Make sure the route is registered correctly
app.use('/api/clientes', require('./routes/clientes'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});