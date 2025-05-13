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
  Box
} from '@mui/material';
import api from '../../services/api';

const ListaProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const response = await api.get('/produtos');
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await api.delete(`/produtos/${id}`);
        await carregarProdutos();
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
      }
    }
  };

  const formatarPreco = (preco) => {
    const precoNumerico = parseFloat(preco);
    return isNaN(precoNumerico) ? '0.00' : precoNumerico.toFixed(2);
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/produtos/novo')}
        >
          Novo Produto
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {produtos.map((produto) => (
              <TableRow key={produto.id}>
                <TableCell>{produto.nome}</TableCell>
                <TableCell>R$ {formatarPreco(produto.preco)}</TableCell>
                <TableCell>
                  <Button 
                    size="small" 
                    color="primary"
                    onClick={() => navigate(`/produtos/editar/${produto.id}`)}
                  >
                    Editar
                  </Button>
                  <Button 
                    size="small" 
                    color="error"
                    onClick={() => handleExcluir(produto.id)}
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
  );
};

export default ListaProdutos;