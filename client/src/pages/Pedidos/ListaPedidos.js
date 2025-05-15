import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
  Collapse,
  IconButton,
  Alert
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../services/api';
import AddIcon from '@mui/icons-material/Add';

const formatarValor = (valor) => {
  const valorNumerico = parseFloat(valor);
  return isNaN(valorNumerico) ? '0.00' : valorNumerico.toFixed(2);
};

const Row = ({ pedido, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    console.log('Dados do pedido:', pedido);
    console.log('Dados do cliente:', pedido.cliente);
    setOpen(prevOpen => !prevOpen);
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            size="small"
            onMouseDown={toggleOpen}
            sx={{ color: 'primary.main' }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{new Date(pedido.data).toLocaleDateString()}</TableCell>
        <TableCell>{pedido.cliente?.nome || 'Cliente não encontrado'}</TableCell>
        <TableCell>R$ {formatarValor(pedido.valor_total)}</TableCell>
        <TableCell>{pedido.forma_pagamento}</TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="contained"
              color="primary"
              onClick={() => onEdit(pedido.id)}
              sx={{ minWidth: 100 }}
            >
              Editar
            </Button>
            <IconButton
              color="error"
              onClick={() => onDelete(pedido.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="h6" gutterBottom component="div" color="primary">
                Produtos
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Produto</TableCell>
                    <TableCell align="center">Quantidade</TableCell>
                    <TableCell align="right">Preço Unitário</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pedido.produtos?.map((produto) => (
                    <TableRow key={produto.id}>
                      <TableCell>{produto.nome}</TableCell>
                      <TableCell align="center">{produto.pedido_produto.quantidade}</TableCell>
                      <TableCell align="right">R$ {formatarValor(produto.preco)}</TableCell>
                      <TableCell align="right">
                        R$ {formatarValor(produto.preco * produto.pedido_produto.quantidade)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  Informações do Cliente
                </Typography>
                <Typography variant="body2">
                  <strong>Nome:</strong> {pedido.cliente?.nome}
                </Typography>
                <Typography variant="body2">
                  <strong>Número:</strong> {pedido.cliente?.numero}
                </Typography>
                <Typography variant="body2">
                  <strong>Endereço:</strong> {pedido.cliente?.endereco}
                </Typography>
                <Typography variant="body2">
                  <strong>Notas:</strong> {pedido.cliente?.notas}
                </Typography>
                {pedido.notas_pedido && (
                  <Typography variant="subtitle2" sx={{ mt: 2, color: 'text.secondary' }}>
                    <strong>Observações do Pedido:</strong> {pedido.notas_pedido}
                  </Typography>
                )}
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const ListaPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    carregarPedidos();
  }, []);

  const carregarPedidos = async () => {
    try {
      console.log('Carregando pedidos...');
      const response = await api.get('/pedidos');
      console.log('Pedidos carregados:', response.data);
      
      // Buscar dados completos dos clientes e calcular valor total
      const pedidosComClientes = await Promise.all(
        response.data.map(async (pedido) => {
          if (pedido.cliente?.id) {
            try {
              const clienteResponse = await api.get(`/clientes/${pedido.cliente.id}`);
              // Calcular valor total baseado nos produtos
              const valorTotal = pedido.produtos.reduce((total, produto) => {
                return total + (produto.preco * produto.pedido_produto.quantidade);
              }, 0);
              
              return {
                ...pedido,
                cliente: clienteResponse.data,
                valor_total: valorTotal
              };
            } catch (error) {
              console.error(`Erro ao buscar cliente ${pedido.cliente.id}:`, error);
              return pedido;
            }
          }
          return pedido;
        })
      );
      
      setPedidos(pedidosComClientes);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      setError('Erro ao carregar pedidos');
    }
  };

  const handleEdit = (id) => {
    navigate(`/pedidos/editar/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este pedido?')) {
      try {
        await api.delete(`/pedidos/${id}`);
        await carregarPedidos();
      } catch (error) {
        console.error('Erro ao excluir pedido:', error);
        setError('Erro ao excluir pedido');
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h4" color="primary">
          Pedidos
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

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={50} />
              <TableCell>Data</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell align="right">Valor Total</TableCell>
              <TableCell>Forma de Pagamento</TableCell>
              <TableCell align="center" width={180}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pedidos.map((pedido) => (
              <Row 
                key={pedido.id} 
                pedido={pedido} 
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ListaPedidos;