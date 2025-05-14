const express = require('express');
const router = express.Router();
const { Cliente } = require('../models');

// GET all clients
router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET client by ID
router.get('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (cliente) {
      res.json(cliente);
    } else {
      res.status(404).json({ message: 'Cliente não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new client
router.post('/', async (req, res) => {
  try {
    const cliente = await Cliente.create(req.body);
    res.status(201).json(cliente);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  console.log('Tentando excluir cliente com ID:', req.params.id);
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    console.log('Cliente encontrado:', cliente);
    if (cliente) {
      await cliente.destroy();
      res.json({ message: 'Cliente excluído com sucesso' });
    } else {
      res.status(404).json({ message: 'Cliente não encontrado' });
    }
  } catch (err) {
    console.error('Erro ao excluir:', err);
    res.status(500).json({ message: err.message });
  }
});

// PATCH update client
router.patch('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (cliente) {
      await cliente.update(req.body);
      res.json(cliente);
    } else {
      res.status(404).json({ message: 'Cliente não encontrado' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;