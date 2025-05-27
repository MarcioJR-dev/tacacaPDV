import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import api from '../../services/api';

const EditarCliente = () => {
  const [cliente, setCliente] = useState({
    numero: '',
    nome: '',
    endereco: '',
    notas: '',
    taxa_entrega: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    carregarCliente();
  }, [id]);

  const carregarCliente = async () => {
    try {
      const response = await api.get(`/clientes/${id}`);
      setCliente(response.data);
    } catch (error) {
      console.error('Erro ao carregar cliente:', error);
      setError('Erro ao carregar dados do cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/clientes/${id}`, cliente);
      navigate('/clientes');
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      setError(error.response?.data?.message || 'Erro ao atualizar cliente');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <h2>Editar Cliente</h2>
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
              label="Taxa de Entrega"
              type="number"
              value={cliente.taxa_entrega}
              onChange={(e) => setCliente({ ...cliente, taxa_entrega: e.target.value })}
              InputProps={{
                inputProps: { step: "0.01" }
              }}
              helperText="Deixe em branco para usar a taxa padrão (R$ 0,00)"
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
              Atualizar
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

export default EditarCliente;