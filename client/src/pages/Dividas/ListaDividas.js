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
  Typography
} from '@mui/material';
import api from '../../services/api';

const ListaDividas = () => {
  const [dividas, setDividas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    carregarDividas();
  }, []);

  const carregarDividas = async () => {
    try {
      const response = await api.get('/dividas');
      setDividas(response.data);
    } catch (error) {
      console.error('Erro ao carregar dívidas:', error);
    }
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta dívida?')) {
      try {
        const response = await api.delete(`/dividas/${id}`);
        if (response.status === 200) {
          await carregarDividas();
          alert('Dívida excluída com sucesso!');
        }
      } catch (error) {
        console.error('Erro ao excluir dívida:', error);
        if (error.response && error.response.status === 404) {
          alert('Dívida não encontrada. Talvez já tenha sido excluída.');
        } else {
          alert('Erro ao excluir dívida. Por favor, tente novamente.');
        }
      }
    }
  };

  const formatarData = (data) => {
    if (!data) return '';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const formatarValor = (valor) => {
    return parseFloat(valor).toFixed(2);
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" color="primary">
          Dívidas
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/dividas/novo')}
        >
          Nova Dívida
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Vencimento</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dividas.map((divida) => (
              <TableRow key={divida.id}>
                <TableCell>{divida.cliente?.nome}</TableCell>
                <TableCell>R$ {formatarValor(divida.valor)}</TableCell>
                <TableCell>{formatarData(divida.data_vencimento)}</TableCell>
                <TableCell>{divida.status}</TableCell>
                <TableCell>{divida.descricao}</TableCell>
                <TableCell align="center">
                  <Button 
                    size="small" 
                    color="primary"
                    onClick={() => navigate(`/dividas/editar/${divida.id}`)}
                    sx={{ mr: 1 }}
                  >
                    Editar
                  </Button>
                  <Button 
                    size="small" 
                    color="error"
                    onClick={() => handleExcluir(divida.id)}
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

export default ListaDividas;