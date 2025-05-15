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
  DialogActions,
  Autocomplete
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
  const [selectedProduto, setSelectedProduto] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [valorTotal, setValorTotal] = useState(0);
  const [formaPagamento, setFormaPagamento] = useState('Dinheiro');
  const [notasPedido, setNotasPedido] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openModalCliente, setOpenModalCliente] = useState(false);
  const [pesquisaProduto, setPesquisaProduto] = useState('');
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
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

  // Filtrar produtos baseado na pesquisa
  useEffect(() => {
    if (pesquisaProduto.trim() === '') {
      setProdutosFiltrados(produtos);
    } else {
      const filtrados = produtos.filter(produto =>
        produto.nome.toLowerCase().includes(pesquisaProduto.toLowerCase())
      );
      setProdutosFiltrados(filtrados);
    }
  }, [pesquisaProduto, produtos]);

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

    setSelectedProdutos(prev => {
      const existing = prev.find(p => p.id === selectedProduto.id);
      if (existing) {
        return prev.map(p => 
          p.id === selectedProduto.id 
            ? { ...p, quantidade: p.quantidade + quantidade }
            : p
        );
      }
      return [...prev, { id: selectedProduto.id, quantidade }];
    });

    setSelectedProduto(null);
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Seção de Cliente */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Cliente
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
                <Autocomplete
                  value={clientes.find(c => c.id === selectedCliente) || null}
                  onChange={(event, newValue) => {
                    setSelectedCliente(newValue ? newValue.id : '');
                  }}
                  options={clientes}
                  getOptionLabel={(option) => option ? `${option.nome} - ${option.numero}` : ''}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Cliente"
                      required
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenModalCliente(true)}
                  sx={{ height: 48 }}
                >
                  Novo Cliente
                </Button>
              </Box>
            </Box>

            {/* Seção de Produtos */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Produtos
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
                <Autocomplete
                  value={selectedProduto}
                  onChange={(event, newValue) => {
                    setSelectedProduto(newValue);
                  }}
                  options={produtos}
                  getOptionLabel={(option) => option ? `${option.nome} - R$ ${option.preco.toFixed(2)}` : ''}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Produto"
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
                <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                  <TextField
                    type="number"
                    fullWidth
                    label="Quantidade"
                    value={quantidade}
                    onChange={(e) => setQuantidade(Number(e.target.value))}
                    inputProps={{ min: 1 }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddProduto}
                    sx={{ minWidth: 120, height: 56 }}
                  >
                    Adicionar
                  </Button>
                </Box>
              </Box>
            </Box>

            {/* Lista de Produtos Selecionados */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Produtos Selecionados
              </Typography>
              <Paper variant="outlined" sx={{ width: '100%' }}>
                <List>
                  {selectedProdutos.map((item) => {
                    const produto = produtos.find(p => p.id === item.id);
                    return (
                      <ListItem 
                        key={item.id}
                        sx={{ 
                          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                          '&:last-child': { borderBottom: 'none' }
                        }}
                      >
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
              </Paper>
            </Box>

            {/* Seção de Pagamento */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Pagamento
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
                <TextField
                  fullWidth
                  label="Valor Total"
                  type="number"
                  value={valorTotal}
                  onChange={(e) => setValorTotal(Number(e.target.value))}
                  InputProps={{
                    startAdornment: <span>R$ </span>,
                    inputProps: { min: 0, step: 0.01 }
                  }}
                />
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
              </Box>
            </Box>

            {/* Observações */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Observações
              </Typography>
              <TextField
                fullWidth
                label="Observações"
                multiline
                rows={4}
                value={notasPedido}
                onChange={(e) => setNotasPedido(e.target.value)}
              />
            </Box>

            {/* Botões de Ação */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              justifyContent: 'flex-end',
              mt: 2
            }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/pedidos')}
                disabled={loading}
                sx={{ minWidth: 120, height: 48 }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ minWidth: 120, height: 48 }}
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>

      {/* Modal de Novo Cliente */}
      <Dialog 
        open={openModalCliente} 
        onClose={() => setOpenModalCliente(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Novo Cliente</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Número"
              value={novoCliente.numero}
              onChange={(e) => setNovoCliente({ ...novoCliente, numero: e.target.value })}
              placeholder="Número do cliente"
            />
            <TextField
              fullWidth
              label="Nome"
              value={novoCliente.nome}
              onChange={(e) => setNovoCliente({ ...novoCliente, nome: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Endereço"
              value={novoCliente.endereco}
              onChange={(e) => setNovoCliente({ ...novoCliente, endereco: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Notas"
              multiline
              rows={3}
              value={novoCliente.notas}
              onChange={(e) => setNovoCliente({ ...novoCliente, notas: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setOpenModalCliente(false)}
            sx={{ minWidth: 100 }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleCriarCliente}
            variant="contained"
            disabled={!novoCliente.nome || !novoCliente.endereco}
            sx={{ minWidth: 100 }}
          >
            Criar Cliente
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FormPedido;