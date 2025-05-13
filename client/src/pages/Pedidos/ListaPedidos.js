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
  IconButton
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import api from '../../services/api';

const Row = ({ pedido, onEdit }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{new Date(pedido.data).toLocaleDateString()}</TableCell>
        <TableCell>{pedido.Cliente?.nome || 'Cliente não encontrado'}</TableCell>
        <TableCell>R$ {pedido.valorTotal.toFixed(2)}</TableCell>
        <TableCell>{pedido.formaPagamento}</TableCell>
        <TableCell>
          <Button 
            size="small" 
            color="primary"
            onClick={() => onEdit(pedido.id)}
          >
            Editar
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Produtos
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Produto</TableCell>
                    <TableCell>Quantidade</TableCell>
                    <TableCell>Preço Unitário</TableCell>
                    <TableCell>Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pedido.Produtos?.map((produto) => (
                    <TableRow key={produto.id}>
                      <TableCell>{produto.nome}</TableCell>
                      <TableCell>{produto.PedidoProduto.quantidade}</TableCell>
                      <TableCell>R$ {produto.preco.toFixed(2)}</TableCell>
                      <TableCell>
                        R$ {(produto.preco * produto.PedidoProduto.quantidade).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {pedido.notasPedido && (
                <Typography variant="subtitle2" sx={{ mt: 2 }}>
                  Notas: {pedido.notasPedido}
                </Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const ListaPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    carregarPedidos();
  }, []);

  const carregarPedidos = async () => {
    try {
      const response = await api.get('/pedidos');
      setPedidos(response.data);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/pedidos/editar/${id}`);
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
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
              <TableCell />
              <TableCell>Data</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Valor Total</TableCell>
              <TableCell>Forma de Pagamento</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pedidos.map((pedido) => (
              <Row 
                key={pedido.id} 
                pedido={pedido} 
                onEdit={handleEdit}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ListaPedidos;