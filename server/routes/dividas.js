const express = require('express');
const router = express.Router();
const Divida = require('../models/Divida');
const Cliente = require('../models/Cliente');

router.get('/', async (req, res) => {
  try {
    const dividas = await Divida.findAll({
      include: [Cliente],
      order: [['createdAt', 'DESC']]
    });
    res.json(dividas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const divida = await Divida.findByPk(req.params.id, {
      include: [Cliente]
    });
    if (divida) {
      res.json(divida);
    } else {
      res.status(404).json({ message: 'Dívida não encontrada' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const novaDivida = await Divida.create(req.body);
    res.status(201).json(novaDivida);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const divida = await Divida.findByPk(req.params.id);
    if (divida) {
      await divida.update(req.body);
      res.json(divida);
    } else {
      res.status(404).json({ message: 'Dívida não encontrada' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/:id/pagar', async (req, res) => {
  try {
    const divida = await Divida.findByPk(req.params.id);
    if (divida) {
      await divida.update({
        status: 'Pago',
        dataPagamento: new Date()
      });
      res.json(divida);
    } else {
      res.status(404).json({ message: 'Dívida não encontrada' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const divida = await Divida.findByPk(req.params.id);
    if (divida) {
      await divida.destroy();
      res.json({ message: 'Dívida excluída com sucesso' });
    } else {
      res.status(404).json({ message: 'Dívida não encontrada' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;