const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');

// Buscar todos os clientes
router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.json(clientes);
  } catch (err) {
    console.error('Erro ao buscar clientes:', err);
    res.status(500).json({ message: err.message });
  }
});

// Buscar cliente por ID
router.get('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (cliente) {
      res.json(cliente);
    } else {
      res.status(404).json({ message: 'Cliente não encontrado' });
    }
  } catch (err) {
    console.error('Erro ao buscar cliente:', err);
    res.status(500).json({ message: err.message });
  }
});

// Criar novo cliente
router.post('/', async (req, res) => {
  try {
    console.log('Dados recebidos para criar cliente:', req.body);
    
    // Validar dados obrigatórios
    if (!req.body.nome || !req.body.endereco) {
      return res.status(400).json({ 
        message: 'Nome e endereço são obrigatórios' 
      });
    }

    const novoCliente = await Cliente.create(req.body);
    console.log('Cliente criado com sucesso:', novoCliente);
    res.status(201).json(novoCliente);
  } catch (err) {
    console.error('Erro ao criar cliente:', err);
    res.status(400).json({ 
      message: 'Erro ao criar cliente',
      error: err.message 
    });
  }
});

// Atualizar cliente
router.patch('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (cliente) {
      await cliente.update(req.body);
      res.json(cliente);
    } else {
      res.status(404).json({ message: 'Cliente não encontrado' });
    }
  } catch (err) {
    console.error('Erro ao atualizar cliente:', err);
    res.status(400).json({ message: err.message });
  }
});

// Excluir cliente
router.delete('/:id', async (req, res) => {
  try {
    console.log('Tentando excluir cliente com ID:', req.params.id);
    
    const cliente = await Cliente.findByPk(req.params.id, {
      include: [
        { model: require('../models/Pedido') },
        { model: require('../models/Divida') }
      ]
    });

    if (!cliente) {
      console.log('Cliente não encontrado');
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    console.log('Cliente encontrado:', {
      id: cliente.id,
      nome: cliente.nome,
      pedidos: cliente.Pedidos?.length || 0,
      dividas: cliente.Dividas?.length || 0
    });

    await cliente.destroy({
      force: false,
      hooks: true
    });

    console.log('Cliente excluído com sucesso');
    res.json({ message: 'Cliente excluído com sucesso' });
  } catch (err) {
    console.error('Erro detalhado ao excluir cliente:', {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    res.status(500).json({ 
      message: 'Erro ao excluir cliente',
      error: err.message 
    });
  }
});

module.exports = router;