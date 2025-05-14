import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Alert,
  Grid,
  Typography,
  CircularProgress
} from '@mui/material';
import api from '../../services/api';

const FormProduto = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [produto, setProduto] = useState({
    nome: '',
    preco: '',
    descricao: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      carregarProduto();
    }
  }, [id]);

  const carregarProduto = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/produtos/${id}`);
      setProduto({
        nome: response.data.nome,
        preco: response.data.preco,
        descricao: response.data.descricao || ''
      });
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
      setError('Erro ao carregar produto. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

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
      
      let response;
      if (id) {
        response = await api.patch(`/produtos/${id}`, produtoParaEnviar);
      } else {
        response = await api.post('/produtos', produtoParaEnviar);
      }
      
      console.log('Resposta do servidor:', response.data);
      navigate('/produtos');
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      const errorMessage = error.response?.data?.error || 'Erro ao salvar produto, tente novamente';
      setError(errorMessage);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        {id ? 'Editar Produto' : 'Novo Produto'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Grid container spacing={2}>
          <Grid xs={12}>
            <TextField
              fullWidth
              label="Nome do Produto"
              value={produto.nome}
              onChange={(e) => setProduto({ ...produto, nome: e.target.value })}
              required
              error={error && !produto.nome.trim()}
            />
          </Grid>
          <Grid xs={12}>
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
          <Grid xs={12}>
            <TextField
              fullWidth
              label="Descrição"
              value={produto.descricao}
              onChange={(e) => setProduto({ ...produto, descricao: e.target.value })}
              multiline
              rows={4}
            />
          </Grid>
          <Grid xs={12}>
            <Button type="submit" variant="contained" color="primary">
              {id ? 'Atualizar' : 'Salvar'}
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
    </Box>
  );
};

export default FormProduto;