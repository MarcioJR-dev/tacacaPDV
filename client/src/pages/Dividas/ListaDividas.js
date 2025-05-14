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

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <h2>Dívidas</h2>
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
              <TableCell>Status</TableCell>
              <TableCell>Notas</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dividas.map((divida) => (
              <TableRow key={divida.id}>
                <TableCell>{divida.cliente?.nome}</TableCell>
                <TableCell>R$ {divida.valor}</TableCell>
                <TableCell>{divida.status}</TableCell>
                <TableCell>{divida.descricao}</TableCell>
                <TableCell>
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