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
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const formatarValor = (valor) => {
  const valorNumerico = parseFloat(valor);
  return isNaN(valorNumerico) ? '0.00' : valorNumerico.toFixed(2);
};

const Dashboard = () => {
  const [pedidosRecentes, setPedidosRecentes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    carregarPedidosRecentes();
  }, []);

  const carregarPedidosRecentes = async () => {
    try {
      const response = await api.get('/pedidos');
      setPedidosRecentes(response.data);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    }
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este pedido?')) {
      try {
        await api.delete(`/pedidos/${id}`);
        carregarPedidosRecentes(); // Recarrega a lista após excluir
      } catch (error) {
        console.error('Erro ao excluir pedido:', error);
      }
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Pedidos Recentes</Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/pedidos/novo')}
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
                <TableCell>Valor Total</TableCell>
                <TableCell>Forma de Pagamento</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pedidosRecentes.map((pedido) => (
                <TableRow key={pedido.id}>
                  <TableCell>{pedido.Cliente?.nome}</TableCell>
                  <TableCell>{new Date(pedido.data).toLocaleDateString()}</TableCell>
                  <TableCell>R$ {formatarValor(pedido.valor_total)}</TableCell>
                  <TableCell>{pedido.forma_pagamento}</TableCell>
                  <TableCell>
                    <Button 
                      size="small" 
                      color="primary"
                      onClick={() => navigate(`/pedidos/editar/${pedido.id}`)}
                      sx={{ mr: 1 }}
                    >
                      Editar
                    </Button>
                    <Button 
                      size="small" 
                      color="error"
                      onClick={() => handleExcluir(pedido.id)}
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