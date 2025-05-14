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
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
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

  useEffect(() => {
    carregarDados();
    
    // Atualiza os dados a cada 30 segundos
    const intervalo = setInterval(carregarDados, 30000);
    
    // Limpa o intervalo quando o componente for desmontado
    return () => clearInterval(intervalo);
  }, []);

  const carregarDados = async () => {
    try {
      console.log('Carregando dados do dashboard...');
      setError('');
      
      // Carrega pedidos, clientes, produtos e dívidas
      const [pedidosRes, clientesRes, produtosRes, dividasRes] = await Promise.all([
        api.get('/pedidos'),
        api.get('/clientes'),
        api.get('/produtos'),
        api.get('/dividas')
      ]);

      console.log('Dados carregados:', {
        pedidos: pedidosRes.data.length,
        clientes: clientesRes.data.length,
        produtos: produtosRes.data.length,
        dividas: dividasRes.data.length
      });

      const dividasPendentes = dividasRes.data.filter(d => d.status === 'pendente');
      const valorTotalDividas = dividasPendentes.reduce((total, d) => total + parseFloat(d.valor), 0);

      setPedidosRecentes(pedidosRes.data.slice(0, 5)); // Últimos 5 pedidos
      setDividasRecentes(dividasPendentes.slice(0, 5)); // Últimas 5 dívidas pendentes
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

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este pedido?')) {
      try {
        await api.delete(`/pedidos/${id}`);
        carregarDados();
      } catch (error) {
        console.error('Erro ao excluir pedido:', error);
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ShoppingCartIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="primary">
                  Pedidos
                </Typography>
              </Box>
              <Typography variant="h4">{resumo.totalPedidos}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PeopleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="primary">
                  Clientes
                </Typography>
              </Box>
              <Typography variant="h4">{resumo.totalClientes}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <InventoryIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="primary">
                  Produtos
                </Typography>
              </Box>
              <Typography variant="h4">{resumo.totalProdutos}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <MoneyOffIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="primary">
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
        <Grid xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 2 
            }}>
              <Typography variant="h5" color="primary">
                Pedidos Recentes
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pedidosRecentes.map((pedido) => (
                    <TableRow key={pedido.id}>
                      <TableCell>{pedido.cliente?.nome}</TableCell>
                      <TableCell>{formatarData(pedido.data)}</TableCell>
                      <TableCell align="right">R$ {formatarValor(pedido.valor_total)}</TableCell>
                      <TableCell>{pedido.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>

        <Grid xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 2 
            }}>
              <Typography variant="h5" color="primary">
                Dívidas Pendentes
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
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
    </Box>
  );
};

export default Dashboard;