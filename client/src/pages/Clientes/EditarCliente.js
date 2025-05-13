import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import ClienteForm from '../../components/Cliente/ClienteForm';
import api from '../../services/api';

const EditarCliente = () => {
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    carregarCliente();
  }, [id]);

  const carregarCliente = async () => {
    try {
      const response = await api.get(`/clientes/${id}`);
      setCliente(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar cliente:', error);
      navigate('/clientes');
    }
  };

  const handleSave = () => {
    navigate('/clientes');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <ClienteForm onSave={handleSave} clienteInicial={cliente} />
    </Box>
  );
};

export default EditarCliente;