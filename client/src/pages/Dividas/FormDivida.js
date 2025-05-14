import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  Typography,
  CircularProgress
} from '@mui/material';
import api from '../../services/api';

const FormDivida = () => {
  const [divida, setDivida] = useState({
    cliente_id: '',
    valor: '',
    dataVencimento: '',
    status: 'pendente',
    descricao: ''
  });
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  const carregarClientes = async () => {
    try {
      const response = await api.get('/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      setError('Erro ao carregar lista de clientes');
    }
  };

  const carregarDivida = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/dividas/${id}`);
      setDivida({
        cliente_id: response.data.cliente_id,
        valor: response.data.valor,
        dataVencimento: response.data.dataVencimento.split('T')[0],
        status: response.data.status,
        descricao: response.data.descricao || ''
      });
    } catch (error) {
      console.error('Erro ao carregar dívida:', error);
      setError('Erro ao carregar dados da dívida');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    carregarClientes();
    if (id) {
      carregarDivida();
    }
  }, [id, carregarDivida]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Validações
      if (!divida.cliente_id) {
        setError('Selecione um cliente');
        return;
      }

      if (!divida.valor || parseFloat(divida.valor) <= 0) {
        setError('Valor inválido');
        return;
      }

      if (!divida.dataVencimento) {
        setError('Data de vencimento é obrigatória');
        return;
      }

      // Formata os dados antes de enviar
      const dividaParaEnviar = {
        cliente_id: parseInt(divida.cliente_id),
        valor: parseFloat(divida.valor),
        dataVencimento: new Date(divida.dataVencimento).toISOString(),
        status: divida.status.toLowerCase(),
        descricao: divida.descricao || null
      };

      setLoading(true);
      if (id) {
        await api.patch(`/dividas/${id}`, dividaParaEnviar);
      } else {
        await api.post('/dividas', dividaParaEnviar);
      }
      navigate('/dividas');
    } catch (error) {
      console.error('Erro ao salvar dívida:', error);
      setError(error.response?.data?.message || 'Erro ao salvar dívida');
    } finally {
      setLoading(false);
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
      <Typography variant="h5" gutterBottom>
        {id ? 'Editar Dívida' : 'Nova Dívida'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Grid container spacing={2}>
          <Grid xs={12}>
            <FormControl fullWidth error={error && !divida.cliente_id}>
              <InputLabel>Cliente</InputLabel>
              <Select
                value={divida.cliente_id}
                onChange={(e) => setDivida({ ...divida, cliente_id: e.target.value })}
                required
              >
                {clientes.map((cliente) => (
                  <MenuItem key={cliente.id} value={cliente.id}>
                    {cliente.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={12} sm={6}>
            <TextField
              fullWidth
              label="Valor"
              type="number"
              step="0.01"
              value={divida.valor}
              onChange={(e) => setDivida({ ...divida, valor: e.target.value })}
              required
              error={error && (!divida.valor || parseFloat(divida.valor) <= 0)}
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid xs={12} sm={6}>
            <TextField
              fullWidth
              label="Data de Vencimento"
              type="date"
              value={divida.dataVencimento}
              onChange={(e) => setDivida({ ...divida, dataVencimento: e.target.value })}
              required
              error={error && !divida.dataVencimento}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid xs={12}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={divida.status}
                onChange={(e) => setDivida({ ...divida, status: e.target.value })}
                required
              >
                <MenuItem value="pendente">Pendente</MenuItem>
                <MenuItem value="pago">Pago</MenuItem>
                <MenuItem value="atrasado">Atrasado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={12}>
            <TextField
              fullWidth
              label="Descrição"
              multiline
              rows={4}
              value={divida.descricao}
              onChange={(e) => setDivida({ ...divida, descricao: e.target.value })}
            />
          </Grid>
          <Grid xs={12}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={loading}
            >
              {id ? 'Atualizar' : 'Salvar'}
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/dividas')}
              sx={{ ml: 2 }}
              disabled={loading}
            >
              Cancelar
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default FormDivida;