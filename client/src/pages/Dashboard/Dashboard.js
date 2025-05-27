import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Grid,
  Card,
  CardContent,
  Alert,
  IconButton,
  Stack,
  Container
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import DeleteIcon from '@mui/icons-material/Delete';
import ListIcon from '@mui/icons-material/List';
import api from '../../services/api';

const Dashboard = () => {
  const [pedidosRecentes, setPedidosRecentes] = useState([]);
  const [dividasRecentes, setDividasRecentes] = useState([]);
  const [resumo, setResumo] = useState({
    totalPedidos: 0,
    totalClientes: 0,
    totalProdutos: 0,
    totalDividas: 0,
    totalDividasPendentes: 0,
    valorTotalDividas: 0
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Lista de Clientes', icon: <PeopleIcon />, path: '/clientes' },
    { text: 'Lista de Produtos', icon: <InventoryIcon />, path: '/produtos' },
    { text: 'Lista de Pedidos', icon: <ShoppingCartIcon />, path: '/pedidos' },
    { text: 'Lista de Dívidas', icon: <MoneyOffIcon />, path: '/dividas' }
  ];

  useEffect(() => {
    carregarDados();
    const intervalo = setInterval(carregarDados, 30000);
    return () => clearInterval(intervalo);
  }, []);

  const carregarDados = async () => {
    try {
      setError('');
      const [pedidosRes, clientesRes, produtosRes, dividasRes] = await Promise.all([
        api.get('/pedidos'),
        api.get('/clientes'),
        api.get('/produtos'),
        api.get('/dividas')
      ]);

      const dividasPendentes = dividasRes.data.filter(d => d.status === 'pendente');
      const valorTotalDividas = dividasPendentes.reduce((total, d) => total + parseFloat(d.valor), 0);

      setPedidosRecentes(pedidosRes.data.slice(0, 5));
      setDividasRecentes(dividasPendentes.slice(0, 5));
      setResumo({
        totalPedidos: pedidosRes.data.length,
        totalClientes: clientesRes.data.length,
        totalProdutos: produtosRes.data.length,
        totalDividas: dividasRes.data.length,
        totalDividasPendentes: dividasPendentes.length,
        valorTotalDividas
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados do dashboard');
    }
  };

  const handleExcluirPedido = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este pedido?')) {
      try {
        await api.delete(`/pedidos/${id}`);
        await carregarDados();
      } catch (error) {
        console.error('Erro ao excluir pedido:', error);
        setError('Erro ao excluir pedido');
      }
    }
  };

  const formatarValor = (valor) => {
    const valorNumerico = parseFloat(valor);
    return isNaN(valorNumerico) ? '0.00' : valorNumerico.toFixed(2);
  };

  const formatarData = (data) => {
    if (!data) return '';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Menu Lateral */}
      <Box sx={{ 
        width: 240,
        bgcolor: '#2E7D32',
        color: 'white',
        p: 2,
        position: 'fixed',
        height: '100vh',
        left: 0,
        top: 0,
        zIndex: 1000,
        borderRight: '1px solid rgba(255,255,255,0.1)'
      }}>
        <Typography variant="h6" sx={{ mb: 3, color: 'white', fontWeight: 'bold', px: 2 }}>
          Menu Principal
        </Typography>
        <Stack spacing={1}>
          {menuItems.map((item) => (
            <Button
              key={item.text}
              variant="text"
              startIcon={item.icon}
              onClick={() => navigate(item.path)}
              fullWidth
              sx={{
                justifyContent: 'flex-start',
                py: 1.5,
                px: 2,
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              {item.text}
            </Button>
          ))}
        </Stack>
      </Box>

      {/* Conteúdo Principal */}
      <Box sx={{ 
        flex: 1, 
        ml: '240px',
        bgcolor: '#f5f5f5',
        minHeight: '100vh'
      }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Paper sx={{ 
            p: 4, 
            borderRadius: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <Typography variant="h4" sx={{ mb: 3, color: '#2E7D32' }}>
              Dashboard
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <ShoppingCartIcon sx={{ mr: 1, color: '#2E7D32' }} />
                      <Typography variant="h6" sx={{ color: '#2E7D32' }}>
                        Pedidos
                      </Typography>
                    </Box>
                    <Typography variant="h4">{resumo.totalPedidos}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PeopleIcon sx={{ mr: 1, color: '#2E7D32' }} />
                      <Typography variant="h6" sx={{ color: '#2E7D32' }}>
                        Clientes
                      </Typography>
                    </Box>
                    <Typography variant="h4">{resumo.totalClientes}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <InventoryIcon sx={{ mr: 1, color: '#2E7D32' }} />
                      <Typography variant="h6" sx={{ color: '#2E7D32' }}>
                        Produtos
                      </Typography>
                    </Box>
                    <Typography variant="h4">{resumo.totalProdutos}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <MoneyOffIcon sx={{ mr: 1, color: '#2E7D32' }} />
                      <Typography variant="h6" sx={{ color: '#2E7D32' }}>
                        Dívidas Pendentes
                      </Typography>
                    </Box>
                    <Typography variant="h4">{resumo.totalDividasPendentes}</Typography>
                    <Typography variant="subtitle1" color="error">
                      R$ {formatarValor(resumo.valorTotalDividas)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 2 
                  }}>
                    <Typography variant="h5" sx={{ color: '#2E7D32' }}>
                      Pedidos Recentes
                    </Typography>
                    <Button 
                      variant="contained" 
                      sx={{ 
                        bgcolor: '#2E7D32',
                        '&:hover': {
                          bgcolor: '#1B5E20'
                        }
                      }}
                      onClick={() => navigate('/pedidos/novo')}
                      startIcon={<AddIcon />}
                      size="small"
                    >
                      Novo Pedido
                    </Button>
                  </Box>

                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Cliente</TableCell>
                          <TableCell>Data</TableCell>
                          <TableCell align="right">Valor</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell align="center">Ações</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {pedidosRecentes.map((pedido) => (
                          <TableRow key={pedido.id}>
                            <TableCell>{pedido.cliente?.nome}</TableCell>
                            <TableCell>{formatarData(pedido.data)}</TableCell>
                            <TableCell align="right">R$ {formatarValor(pedido.valor_total)}</TableCell>
                            <TableCell>{pedido.status}</TableCell>
                            <TableCell align="center">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleExcluirPedido(pedido.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 2 
                  }}>
                    <Typography variant="h5" sx={{ color: '#2E7D32' }}>
                      Dívidas Pendentes
                    </Typography>
                    <Button 
                      variant="contained" 
                      sx={{ 
                        bgcolor: '#2E7D32',
                        '&:hover': {
                          bgcolor: '#1B5E20'
                        }
                      }}
                      onClick={() => navigate('/dividas/novo')}
                      startIcon={<AddIcon />}
                      size="small"
                    >
                      Nova Dívida
                    </Button>
                  </Box>

                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Cliente</TableCell>
                          <TableCell>Vencimento</TableCell>
                          <TableCell align="right">Valor</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dividasRecentes.map((divida) => (
                          <TableRow key={divida.id}>
                            <TableCell>{divida.cliente?.nome}</TableCell>
                            <TableCell>{formatarData(divida.data_vencimento)}</TableCell>
                            <TableCell align="right">R$ {formatarValor(divida.valor)}</TableCell>
                            <TableCell>{divida.status}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;