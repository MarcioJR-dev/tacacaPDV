import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import api from '../../services/api';

const FormDivida = () => {
  const [divida, setDivida] = useState({
    ClienteId: '',
    valor: '',
    notasDivida: ''
  });
  const [clientes, setClientes] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    carregarClientes();
    if (id) {
      carregarDivida();
    }
  }, [id]);

  const carregarClientes = async () => {
    try {
      const response = await api.get('/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  const carregarDivida = async () => {
    try {
      const response = await api.get(`/dividas/${id}`);
      setDivida(response.data);
    } catch (error) {
      console.error('Erro ao carregar dívida:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.patch(`/dividas/${id}`, divida);
      } else {
        await api.post('/dividas', divida);
      }
      navigate('/dividas');
    } catch (error) {
      console.error('Erro ao salvar dívida:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Cliente</InputLabel>
            <Select
              value={divida.ClienteId}
              onChange={(e) => setDivida({ ...divida, ClienteId: e.target.value })}
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
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Valor"
            type="number"
            value={divida.valor}
            onChange={(e) => setDivida({ ...divida, valor: e.target.value })}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Notas da Dívida"
            multiline
            rows={4}
            value={divida.notasDivida}
            onChange={(e) => setDivida({ ...divida, notasDivida: e.target.value })}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Salvar
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/dividas')}
            sx={{ ml: 2 }}
          >
            Cancelar
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FormDivida;