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
    notas: clienteInicial?.notas || ''
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

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              name="nome"
              label="Nome"
              value={cliente.nome}
              onChange={handleChange}
              error={!!error && !cliente.nome}
              helperText={!!error && !cliente.nome ? 'Nome é obrigatório' : ''}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              name="endereco"
              label="Endereço"
              value={cliente.endereco}
              onChange={handleChange}
              error={!!error && !cliente.endereco}
              helperText={!!error && !cliente.endereco ? 'Endereço é obrigatório' : ''}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="notas"
              label="Notas"
              value={cliente.notas}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Salvando...' : (clienteInicial ? 'Atualizar' : 'Cadastrar')}
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Cliente {clienteInicial ? 'atualizado' : 'cadastrado'} com sucesso!
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default ClienteForm;