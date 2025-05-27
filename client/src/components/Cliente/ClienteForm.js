import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Grid,
  Alert,
  Snackbar
} from '@mui/material';
import api from '../../services/api';

const ClienteForm = ({ onSave, clienteInicial = null }) => {
  const [cliente, setCliente] = useState({
    nome: clienteInicial?.nome || '',
    endereco: clienteInicial?.endereco || '',
    notas: clienteInicial?.notas || '',
    taxa_entrega: clienteInicial?.taxa_entrega || ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Enviando dados do cliente:', cliente);
      let response;
      
      if (clienteInicial) {
        response = await api.patch(`/clientes/${clienteInicial.id}`, cliente);
      } else {
        response = await api.post('/clientes', cliente);
      }

      console.log('Resposta do servidor:', response.data);
      setSuccess(true);
      onSave(response.data);
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      setError(error.response?.data?.message || 'Erro ao salvar cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {clienteInicial ? 'Editar Cliente' : 'Novo Cliente'}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nome"
              name="nome"
              value={cliente.nome}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Endereço"
              name="endereco"
              value={cliente.endereco}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Taxa de Entrega"
              name="taxa_entrega"
              type="number"
              value={cliente.taxa_entrega}
              onChange={handleChange}
              InputProps={{
                inputProps: { step: "0.01" }
              }}
              helperText="Deixe em branco para usar a taxa padrão"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notas"
              name="notas"
              value={cliente.notas}
              onChange={handleChange}
              multiline
              rows={4}
            />
          </Grid>
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </Box>
      </form>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        message="Cliente salvo com sucesso!"
      />
    </Paper>
  );
};

export default ClienteForm;