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
  TextField,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography
} from '@mui/material';
import api from '../../services/api';

const ListaClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [clienteParaExcluir, setClienteParaExcluir] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      const response = await api.get('/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  const handleExcluir = async (cliente) => {
    setClienteParaExcluir(cliente);
    setDialogOpen(true);
  };

  const confirmarExclusao = async () => {
    try {
      console.log('Excluindo cliente:', clienteParaExcluir); // Debug completo do objeto
      const response = await api.delete(`/clientes/${clienteParaExcluir.id}`);
      if (response.status === 200) {
        await carregarClientes();
        setDialogOpen(false);
        setClienteParaExcluir(null);
      } else {
        console.error('Erro ao excluir cliente:', response);
      }
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      // Mostrar o erro específico
      if (error.response) {
        console.log('Erro detalhado:', error.response.data);
      }
    }
  };

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <TextField
          label="Buscar cliente"
          variant="outlined"
          size="small"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/clientes/novo')}
        >
          Novo Cliente
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Endereço</TableCell>
              <TableCell>Notas</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientesFiltrados.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell>{cliente.nome}</TableCell>
                <TableCell>{cliente.endereco}</TableCell>
                <TableCell>{cliente.notas}</TableCell>
                <TableCell>
                  <Button 
                    size="small" 
                    color="primary"
                    onClick={() => navigate(`/clientes/editar/${cliente.id}`)}
                    sx={{ mr: 1 }}
                  >
                    Editar
                  </Button>
                  <Button 
                    size="small" 
                    color="error"
                    onClick={() => {
                      console.log('Cliente para excluir:', cliente); // Debug
                      handleExcluir(cliente);
                    }}
                  >
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o cliente {clienteParaExcluir?.nome}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button onClick={confirmarExclusao} color="error" autoFocus>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ListaClientes;