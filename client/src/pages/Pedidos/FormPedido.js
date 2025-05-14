import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Box,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../services/api';

const FormPedido = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState('');
  const [selectedProdutos, setSelectedProdutos] = useState([]);
  const [quantidade, setQuantidade] = useState(1);
  const [selectedProduto, setSelectedProduto] = useState('');
  const [valorTotal, setValorTotal] = useState(0);
  const [formaPagamento, setFormaPagamento] = useState('Dinheiro');
  const [notasPedido, setNotasPedido] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Carregar clientes e produtos
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [clientesRes, produtosRes] = await Promise.all([
          api.get('/clientes'),
          api.get('/produtos')
        ]);
        setClientes(clientesRes.data);
        setProdutos(produtosRes.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Erro ao carregar dados. Por favor, tente novamente.');
      }
    };
    carregarDados();
  }, []); // Array de dependências vazio para executar apenas uma vez

  // Atualizar valor total quando produtos mudarem
  useEffect(() => {
    const total = selectedProdutos.reduce((acc, item) => {
      const produto = produtos.find(p => p.id === item.id);
      return acc + (produto?.preco || 0) * item.quantidade;
    }, 0);
    setValorTotal(total);
  }, [selectedProdutos, produtos]);

  const handleAddProduto = () => {
    if (!selectedProduto || quantidade <= 0) return;

    const produto = produtos.find(p => p.id === selectedProduto);
    if (!produto) return;

    setSelectedProdutos(prev => {
      const existing = prev.find(p => p.id === selectedProduto);
      if (existing) {
        return prev.map(p => 
          p.id === selectedProduto 
            ? { ...p, quantidade: p.quantidade + quantidade }
            : p
        );
      }
      return [...prev, { id: selectedProduto, quantidade }];
    });

    setSelectedProduto('');
    setQuantidade(1);
  };

  const handleRemoveProduto = (produtoId) => {
    setSelectedProdutos(prev => prev.filter(p => p.id !== produtoId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!selectedCliente) {
      setError('Selecione um cliente');
      setLoading(false);
      return;
    }

    if (selectedProdutos.length === 0) {
      setError('Adicione pelo menos um produto');
      setLoading(false);
      return;
    }

    const pedidoData = {
      cliente_id: selectedCliente,
      valorTotal,
      formaPagamento,
      notasPedido,
      produtos: selectedProdutos
    };

    console.log('Enviando dados do pedido:', pedidoData);

    try {
      const response = await api.post('/pedidos', pedidoData);
      console.log('Pedido criado com sucesso:', response.data);
      navigate('/pedidos');
    } catch (error) {
      console.error('Erro ao salvar pedido:', error);
      setError(error.response?.data?.message || 'Erro ao salvar pedido. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Novo Pedido
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Cliente"
                value={selectedCliente}
                onChange={(e) => setSelectedCliente(e.target.value)}
                required
              >
                {clientes.map((cliente) => (
                  <MenuItem key={cliente.id} value={cliente.id}>
                    {cliente.nome}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Produtos
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      select
                      fullWidth
                      label="Produto"
                      value={selectedProduto}
                      onChange={(e) => setSelectedProduto(e.target.value)}
                    >
                      {produtos.map((produto) => (
                        <MenuItem key={produto.id} value={produto.id}>
                          {produto.nome} - R$ {produto.preco.toFixed(2)}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      type="number"
                      fullWidth
                      label="Quantidade"
                      value={quantidade}
                      onChange={(e) => setQuantidade(Number(e.target.value))}
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Button
                      variant="contained"
                      onClick={handleAddProduto}
                      fullWidth
                      sx={{ height: '100%' }}
                    >
                      Adicionar
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              <List>
                {selectedProdutos.map((item) => {
                  const produto = produtos.find(p => p.id === item.id);
                  return (
                    <ListItem key={item.id}>
                      <ListItemText
                        primary={produto?.nome}
                        secondary={`Quantidade: ${item.quantidade} - Total: R$ ${((produto?.preco || 0) * item.quantidade).toFixed(2)}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleRemoveProduto(item.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
              </List>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Valor Total"
                value={`R$ ${valorTotal.toFixed(2)}`}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Forma de Pagamento"
                value={formaPagamento}
                onChange={(e) => setFormaPagamento(e.target.value)}
                required
              >
                <MenuItem value="Dinheiro">Dinheiro</MenuItem>
                <MenuItem value="Cartão de Crédito">Cartão de Crédito</MenuItem>
                <MenuItem value="Cartão de Débito">Cartão de Débito</MenuItem>
                <MenuItem value="PIX">PIX</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Observações"
                multiline
                rows={4}
                value={notasPedido}
                onChange={(e) => setNotasPedido(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/pedidos')}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : 'Salvar'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default FormPedido;