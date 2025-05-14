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
  CardContent
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
  const [resumo, setResumo] = useState({
    totalPedidos: 0,
    totalClientes: 0,
    totalProdutos: 0,
    totalDividas: 0
  });
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
      
      // Carrega pedidos, clientes e produtos
      const [pedidosRes, clientesRes, produtosRes] = await Promise.all([
        api.get('/pedidos'),
        api.get('/clientes'),
        api.get('/produtos')
      ]);

      console.log('Dados carregados:', {
        pedidos: pedidosRes.data.length,
        clientes: clientesRes.data.length,
        produtos: produtosRes.data.length
      });

      setPedidosRecentes(pedidosRes.data.slice(0, 5)); // Últimos 5 pedidos
      setResumo({
        totalPedidos: pedidosRes.data.length,
        totalClientes: clientesRes.data.length,
        totalProdutos: produtosRes.data.length,
        totalDividas: 0 // Temporariamente fixo em 0 até implementarmos a funcionalidade de dívidas
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Não atualiza o estado em caso de erro para manter os dados anteriores
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Dashboard
      </Typography>

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
                  Dívidas
                </Typography>
              </Box>
              <Typography variant="h4">{resumo.totalDividas}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3 
        }}>
          <Typography variant="h5" color="primary">
            Pedidos Recentes
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/pedidos/novo')}
            startIcon={<AddIcon />}
            sx={{ minWidth: 150 }}
          >
            Novo Pedido
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cliente</TableCell>
                <TableCell>Data</TableCell>
                <TableCell align="right">Valor Total</TableCell>
                <TableCell>Forma de Pagamento</TableCell>
                <TableCell align="center" width={180}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pedidosRecentes.map((pedido) => (
                <TableRow key={pedido.id}>
                  <TableCell>{pedido.cliente?.nome}</TableCell>
                  <TableCell>{new Date(pedido.data).toLocaleDateString()}</TableCell>
                  <TableCell align="right">R$ {formatarValor(pedido.valor_total)}</TableCell>
                  <TableCell>{pedido.forma_pagamento}</TableCell>
                  <TableCell align="center">
                    <Button 
                      variant="contained"
                      color="primary"
                      onClick={() => navigate(`/pedidos/editar/${pedido.id}`)}
                      sx={{ mr: 1, minWidth: 100 }}
                    >
                      Editar
                    </Button>
                    <Button 
                      variant="outlined"
                      color="error"
                      onClick={() => handleExcluir(pedido.id)}
                      sx={{ minWidth: 100 }}
                    >
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Dashboard;