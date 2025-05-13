const express = require('express');
const router = express.Router();
const { Pedido, Cliente, Produto } = require('../models');

router.get('/', async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      include: [
        Cliente,
        {
          model: Produto,
          through: { attributes: ['quantidade'] }
        }
      ],
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
      include: [
        Cliente,
        {
          model: Produto,
          through: { attributes: ['quantidade'] }
        }
      ]
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
    const { produtos, ...pedidoData } = req.body;
    const pedido = await Pedido.create(pedidoData);

    if (produtos && produtos.length > 0) {
      await pedido.setProdutos(produtos.map(p => p.id), {
        through: { quantidade: p.quantidade }
      });
    }

    const pedidoCompleto = await Pedido.findByPk(pedido.id, {
      include: [
        Cliente,
        {
          model: Produto,
          through: { attributes: ['quantidade'] }
        }
      ]
    });

    res.status(201).json(pedidoCompleto);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { produtos, ...pedidoData } = req.body;
    const pedido = await Pedido.findByPk(req.params.id);
    
    if (pedido) {
      await pedido.update(pedidoData);

      if (produtos && produtos.length > 0) {
        await pedido.setProdutos(produtos.map(p => p.id), {
          through: { quantidade: p.quantidade }
        });
      }

      const pedidoAtualizado = await Pedido.findByPk(pedido.id, {
        include: [
          Cliente,
          {
            model: Produto,
            through: { attributes: ['quantidade'] }
          }
        ]
      });

      res.json(pedidoAtualizado);
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