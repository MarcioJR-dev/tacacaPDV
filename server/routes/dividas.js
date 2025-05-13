const express = require('express');
const router = express.Router();
const Divida = require('../models/Divida');

// Buscar todas as dívidas
router.get('/', async (req, res) => {
  try {
    const dividas = await Divida.find().populate('cliente');
    res.json(dividas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Criar nova dívida
router.post('/', async (req, res) => {
  const divida = new Divida({
    cliente: req.body.clienteId,
    valor: req.body.valor,
    notasDivida: req.body.notasDivida,
    dataPagamento: req.body.dataPagamento
  });

  try {
    const novaDivida = await divida.save();
    const dividaPopulada = await Divida.findById(novaDivida._id).populate('cliente');
    res.status(201).json(dividaPopulada);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Atualizar dívida (para marcar como paga)
router.patch('/:id', async (req, res) => {
  try {
    const divida = await Divida.findById(req.params.id);
    if (divida) {
      if (req.body.dataPagamento) divida.dataPagamento = req.body.dataPagamento;
      if (req.body.notasDivida) divida.notasDivida = req.body.notasDivida;
      
      const dividaAtualizada = await divida.save();
      res.json(dividaAtualizada);
    } else {
      res.status(404).json({ message: 'Dívida não encontrada' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;