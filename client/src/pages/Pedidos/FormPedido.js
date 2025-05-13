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
  Autocomplete
} from '@mui/material';
import api from '../../services/api';

const FormPedido = () => {
  const [pedido, setPedido] = useState({
    ClienteId: '',
    valorTotal: '',
    formaPagamento: '',
    notasPedido: ''
  });
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const carregarPedido = useCallback(async () => {
    try {
      const response = await api.get(`/pedidos/${id}`);
      setPedido(response.data);
      // Find and set the selected client when loading an existing pedido
      const clienteAtual = clientes.find(c => c.id === response.data.ClienteId);
      setSelectedCliente(clienteAtual || null);
    } catch (error) {
      console.error('Erro ao carregar pedido:', error);
    }
  }, [id, clientes]);

  const carregarClientes = async () => {
    try {
      const response = await api.get('/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  useEffect(() => {
    carregarClientes();
    if (id) {
      carregarPedido();
    }
  }, [id, carregarPedido]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.patch(`/pedidos/${id}`, pedido);
      } else {
        await api.post('/pedidos', pedido);
      }
      navigate('/pedidos');
    } catch (error) {
      console.error('Erro ao salvar pedido:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Autocomplete
            value={selectedCliente}
            onChange={(event, newValue) => {
              setSelectedCliente(newValue);
              setPedido({ ...pedido, ClienteId: newValue?.id || '' });
            }}
            options={clientes}
            getOptionLabel={(option) => option.nome || ''}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Cliente"
                required
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Valor Total"
            type="number"
            value={pedido.valorTotal}
            onChange={(e) => setPedido({ ...pedido, valorTotal: e.target.value })}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Forma de Pagamento</InputLabel>
            <Select
              value={pedido.formaPagamento}
              onChange={(e) => setPedido({ ...pedido, formaPagamento: e.target.value })}
              required
            >
              <MenuItem value="Dinheiro">Dinheiro</MenuItem>
              <MenuItem value="Cartão">Cartão</MenuItem>
              <MenuItem value="Pix">Pix</MenuItem>
              <MenuItem value="Fiado">Fiado</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Notas do Pedido"
            multiline
            rows={4}
            value={pedido.notasPedido}
            onChange={(e) => setPedido({ ...pedido, notasPedido: e.target.value })}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Salvar
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/pedidos')}
            sx={{ ml: 2 }}
          >
            Cancelar
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FormPedido;