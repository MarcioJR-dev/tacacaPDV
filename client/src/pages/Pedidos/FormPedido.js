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
  Autocomplete,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../services/api';

const FormPedido = () => {
  const [pedido, setPedido] = useState({
    ClienteId: '',
    valorTotal: '',
    formaPagamento: '',
    notasPedido: '',
    produtos: []
  });
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [selectedProduto, setSelectedProduto] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const navigate = useNavigate();
  const { id } = useParams();

  const carregarPedido = useCallback(async () => {
    try {
      const response = await api.get(`/pedidos/${id}`);
      setPedido(response.data);
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

  const carregarProdutos = async () => {
    try {
      const response = await api.get('/produtos');
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  useEffect(() => {
    carregarClientes();
    carregarProdutos();
    if (id) {
      carregarPedido();
    }
  }, [id, carregarPedido]);

  const handleAddProduto = () => {
    if (selectedProduto && quantidade > 0) {
      const produtoExistente = pedido.produtos.find(p => p.id === selectedProduto.id);
      
      if (produtoExistente) {
        setPedido(prev => ({
          ...prev,
          produtos: prev.produtos.map(p => 
            p.id === selectedProduto.id 
              ? { ...p, quantidade: p.quantidade + quantidade }
              : p
          )
        }));
      } else {
        setPedido(prev => ({
          ...prev,
          produtos: [...prev.produtos, { ...selectedProduto, quantidade }]
        }));
      }
      
      setSelectedProduto(null);
      setQuantidade(1);
    }
  };

  const handleRemoveProduto = (produtoId) => {
    setPedido(prev => ({
      ...prev,
      produtos: prev.produtos.filter(p => p.id !== produtoId)
    }));
  };

  const calcularTotal = () => {
    return pedido.produtos.reduce((total, produto) => {
      return total + (produto.preco * produto.quantidade);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const pedidoData = {
        ...pedido,
        valorTotal: calcularTotal(),
        produtos: pedido.produtos.map(p => ({
          id: p.id,
          quantidade: p.quantidade
        }))
      };

      if (id) {
        await api.patch(`/pedidos/${id}`, pedidoData);
      } else {
        await api.post('/pedidos', pedidoData);
      }
      navigate('/pedidos');
    } catch (error) {
      console.error('Erro ao salvar pedido:', error);
      alert('Erro ao salvar pedido. Por favor, tente novamente.');
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
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Produtos
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <Autocomplete
                  value={selectedProduto}
                  onChange={(event, newValue) => setSelectedProduto(newValue)}
                  options={produtos}
                  getOptionLabel={(option) => option.nome || ''}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Produto"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="Quantidade"
                  value={quantidade}
                  onChange={(e) => setQuantidade(Math.max(1, parseInt(e.target.value) || 1))}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={3}>
                <Button
                  variant="contained"
                  onClick={handleAddProduto}
                  fullWidth
                >
                  Adicionar
                </Button>
              </Grid>
            </Grid>

            <List>
              {pedido.produtos.map((produto) => (
                <ListItem key={produto.id}>
                  <ListItemText
                    primary={produto.nome}
                    secondary={`Quantidade: ${produto.quantidade} - R$ ${(produto.preco * produto.quantidade).toFixed(2)}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleRemoveProduto(produto.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>

            <Typography variant="h6" align="right" sx={{ mt: 2 }}>
              Total: R$ {calcularTotal().toFixed(2)}
            </Typography>
          </Paper>
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