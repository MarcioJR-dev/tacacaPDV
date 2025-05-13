const express = require('express');
const router = express.Router();
const Pedido = require('../models/Pedido');
const Cliente = require('../models/Cliente');

router.get('/', async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      include: [Cliente],
      order: [['data', 'DESC']]
    });
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const pedido = await Pedido.findByPk(req.params.id, {
      include: [Cliente]
    });
    if (pedido) {
      res.json(pedido);
    } else {
      res.status(404).json({ message: 'Pedido não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const novoPedido = await Pedido.create(req.body);
    res.status(201).json(novoPedido);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const pedido = await Pedido.findByPk(req.params.id);
    if (pedido) {
      await pedido.update(req.body);
      res.json(pedido);
    } else {
      res.status(404).json({ message: 'Pedido não encontrado' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const pedido = await Pedido.findByPk(req.params.id);
    if (pedido) {
      await pedido.destroy();
      res.json({ message: 'Pedido excluído com sucesso' });
    } else {
      res.status(404).json({ message: 'Pedido não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;