import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Grid,
  Alert
} from '@mui/material';
import api from '../../services/api';

const NovoCliente = () => {
  const [cliente, setCliente] = useState({
    numero: '',
    nome: '',
    endereco: '',
    notas: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/clientes', cliente);
      navigate('/clientes');
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      setError(error.response?.data?.message || 'Erro ao criar cliente');
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <h2>Novo Cliente</h2>
      <Box component="form" onSubmit={handleSubmit}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Grid container spacing={2}>
          <Grid xs={12} sm={6}>
            <TextField
              fullWidth
              label="Número"
              value={cliente.numero}
              onChange={(e) => setCliente({ ...cliente, numero: e.target.value })}
              placeholder="Número do cliente"
            />
          </Grid>
          <Grid xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nome"
              value={cliente.nome}
              onChange={(e) => setCliente({ ...cliente, nome: e.target.value })}
              required
            />
          </Grid>
          <Grid xs={12}>
            <TextField
              fullWidth
              label="Endereço"
              value={cliente.endereco}
              onChange={(e) => setCliente({ ...cliente, endereco: e.target.value })}
            />
          </Grid>
          <Grid xs={12}>
            <TextField
              fullWidth
              label="Notas"
              multiline
              rows={4}
              value={cliente.notas}
              onChange={(e) => setCliente({ ...cliente, notas: e.target.value })}
            />
          </Grid>
          <Grid xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Salvar
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/clientes')}
              sx={{ ml: 2 }}
            >
              Cancelar
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default NovoCliente;