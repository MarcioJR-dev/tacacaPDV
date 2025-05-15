import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import api from '../../services/api';

const FormPedido = () => {
  const navigate = useNavigate();
  const { id } = useParams();
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
  const [openModalCliente, setOpenModalCliente] = useState(false);
  const [novoCliente, setNovoCliente] = useState({
    nome: '',
    endereco: '',
    notas: '',
    numero: ''
  });

  // Carregar dados do pedido se estiver editando
  useEffect(() => {
    const carregarPedido = async () => {
      if (id) {
        try {
          const response = await api.get(`/pedidos/${id}`);
          const pedido = response.data;
          console.log('Dados do pedido carregados:', pedido);
          
          // Buscar dados completos do cliente
          const clienteResponse = await api.get(`/clientes/${pedido.cliente_id}`);
          console.log('Dados do cliente carregados:', clienteResponse.data);
          
          setSelectedCliente(pedido.cliente_id);
          setFormaPagamento(pedido.forma_pagamento);
          setNotasPedido(pedido.notas_pedido || '');
          setSelectedProdutos(pedido.produtos.map(p => ({
            id: p.id,
            quantidade: p.pedido_produto.quantidade
          })));
          setValorTotal(pedido.valor_total);
        } catch (error) {
          console.error('Erro ao carregar pedido:', error);
          setError('Erro ao carregar pedido. Por favor, tente novamente.');
        }
      }
    };
    carregarPedido();
  }, [id]);

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
  }, []);

  // Atualizar valor total quando produtos mudarem
  useEffect(() => {
    const total = selectedProdutos.reduce((acc, item) => {
      const produto = produtos.find(p => p.id === item.id);
      return acc + (produto?.preco || 0) * item.quantidade;
    }, 0);
    console.log('Calculando novo valor total:', total);
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

    try {
      // Formatar os produtos para o formato esperado pela API
      const produtosFormatados = selectedProdutos.map(item => ({
        id: item.id,
        quantidade: item.quantidade
      }));

      const dadosPedido = {
        cliente_id: selectedCliente,
        valorTotal: valorTotal,
        formaPagamento: formaPagamento,
        notasPedido: notasPedido || '',
        produtos: produtosFormatados
      };

      if (id) {
        // Se tiver ID, atualiza o pedido existente
        await api.patch(`/pedidos/${id}`, dadosPedido);
        console.log('Pedido atualizado com sucesso');
      } else {
        // Se não tiver ID, cria um novo pedido
        await api.post('/pedidos', dadosPedido);
        console.log('Pedido criado com sucesso');
      }
      navigate('/pedidos');
    } catch (error) {
      console.error('Erro ao salvar pedido:', error);
      setError(error.response?.data?.message || 'Erro ao salvar pedido. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCriarCliente = async () => {
    try {
      const response = await api.post('/clientes', novoCliente);
      setClientes(prev => [...prev, response.data]);
      setSelectedCliente(response.data.id);
      setOpenModalCliente(false);
      setNovoCliente({ nome: '', endereco: '', notas: '', numero: '' });
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      setError('Erro ao criar cliente. Por favor, tente novamente.');
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {id ? 'Editar Pedido' : 'Novo Pedido'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
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
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenModalCliente(true)}
                >
                  Novo Cliente
                </Button>
              </Box>
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
            </Grid>

            <Grid item xs={12}>
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

      {/* Modal de Novo Cliente */}
      <Dialog open={openModalCliente} onClose={() => setOpenModalCliente(false)}>
        <DialogTitle>Novo Cliente</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Número"
                  value={novoCliente.numero}
                  onChange={(e) => setNovoCliente({ ...novoCliente, numero: e.target.value })}
                  placeholder="Número do cliente"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nome"
                  value={novoCliente.nome}
                  onChange={(e) => setNovoCliente({ ...novoCliente, nome: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Endereço"
                  value={novoCliente.endereco}
                  onChange={(e) => setNovoCliente({ ...novoCliente, endereco: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notas"
                  multiline
                  rows={3}
                  value={novoCliente.notas}
                  onChange={(e) => setNovoCliente({ ...novoCliente, notas: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModalCliente(false)}>Cancelar</Button>
          <Button 
            onClick={handleCriarCliente}
            variant="contained"
            disabled={!novoCliente.nome || !novoCliente.endereco}
          >
            Criar Cliente
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FormPedido;