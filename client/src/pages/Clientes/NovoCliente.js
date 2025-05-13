import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import ClienteForm from '../../components/Cliente/ClienteForm';

const NovoCliente = () => {
  const navigate = useNavigate();

  const handleSave = () => {
    navigate('/clientes');
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <ClienteForm onSave={handleSave} />
    </Box>
  );
};

export default NovoCliente;