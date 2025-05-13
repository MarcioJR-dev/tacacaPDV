const express = require('express');
const router = express.Router();
const Pedido = require('../models/Pedido');
const Cliente = require('../models/Cliente');

// Buscar todos os pedidos
router.get('/', async (req, res) => {
  try {
    const pedidos = await Pedido.find().populate('cliente');
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Criar novo pedido
router.post('/', async (req, res) => {
  const pedido = new Pedido({
    cliente: req.body.clienteId,
    produtos: req.body.produtos,
    valorTotal: req.body.valorTotal,
    notasPedido: req.body.notasPedido,
    formaPagamento: req.body.formaPagamento
  });

  try {
    const novoPedido = await pedido.save();
    const pedidoPopulado = await Pedido.findById(novoPedido._id).populate('cliente');
    res.status(201).json(pedidoPopulado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;