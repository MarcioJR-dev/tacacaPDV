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
  Chip
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

  const handlePagar = async (id) => {
    try {
      await api.patch(`/dividas/${id}/pagar`);
      carregarDividas();
    } catch (error) {
      console.error('Erro ao pagar dívida:', error);
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
              <TableCell>Data de Pagamento</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dividas.map((divida) => (
              <TableRow key={divida.id}>
                <TableCell>{divida.Cliente?.nome}</TableCell>
                <TableCell>R$ {divida.valor}</TableCell>
                <TableCell>
                  <Chip 
                    label={divida.status}
                    color={divida.status === 'Pendente' ? 'warning' : 'success'}
                  />
                </TableCell>
                <TableCell>
                  {divida.dataPagamento ? new Date(divida.dataPagamento).toLocaleDateString() : '-'}
                </TableCell>
                <TableCell>
                  {divida.status === 'Pendente' && (
                    <>
                      <Button 
                        size="small" 
                        color="success"
                        onClick={() => handlePagar(divida.id)}
                        sx={{ mr: 1 }}
                      >
                        Pagar
                      </Button>
                      <Button 
                        size="small" 
                        color="primary"
                        onClick={() => navigate(`/dividas/editar/${divida.id}`)}
                        sx={{ mr: 1 }}
                      >
                        Editar
                      </Button>
                    </>
                  )}
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