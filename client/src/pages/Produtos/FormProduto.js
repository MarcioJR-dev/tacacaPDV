import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Alert,
  Grid
} from '@mui/material';
import api from '../../services/api';

const FormProduto = () => {
  const navigate = useNavigate();
  const [produto, setProduto] = useState({
    nome: '',
    preco: '',
    descricao: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Validações básicas
      if (!produto.nome.trim()) {
        setError('Nome é obrigatório');
        return;
      }

      if (!produto.preco) {
        setError('Preço é obrigatório');
        return;
      }

      // Converte o preço para número
      const precoNumerico = parseFloat(produto.preco);
      if (isNaN(precoNumerico) || precoNumerico < 0) {
        setError('Preço inválido');
        return;
      }

      const produtoParaEnviar = {
        nome: produto.nome.trim(),
        preco: precoNumerico,
        descricao: produto.descricao ? produto.descricao.trim() : null
      };

      console.log('Enviando dados:', produtoParaEnviar);
      
      const response = await api.post('/produtos', produtoParaEnviar);
      console.log('Resposta do servidor:', response.data);
      
      navigate('/produtos');
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      const errorMessage = error.response?.data?.error || 'Erro ao salvar produto, tente novamente';
      setError(errorMessage);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Nome do Produto"
            value={produto.nome}
            onChange={(e) => setProduto({ ...produto, nome: e.target.value })}
            required
            error={error && !produto.nome.trim()}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Preço"
            type="number"
            step="0.01"
            value={produto.preco}
            onChange={(e) => setProduto({ ...produto, preco: e.target.value })}
            required
            error={error && !produto.preco}
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Descrição"
            value={produto.descricao}
            onChange={(e) => setProduto({ ...produto, descricao: e.target.value })}
            multiline
            rows={4}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Salvar
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/produtos')}
            sx={{ ml: 2 }}
          >
            Cancelar
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FormProduto;