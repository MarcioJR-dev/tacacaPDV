const express = require('express');
const router = express.Router();
const { Divida, Cliente } = require('../models');

router.get('/', async (req, res) => {
  try {
    const dividas = await Divida.findAll({
      include: [{
        model: Cliente,
        as: 'cliente',
        attributes: ['id', 'nome']
      }],
      order: [['created_at', 'DESC']]
    });
    res.json(dividas);
  } catch (err) {
    console.error('Erro ao listar dívidas:', err);
    res.status(500).json({ message: 'Erro ao listar dívidas' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const divida = await Divida.findByPk(req.params.id, {
      include: [{
        model: Cliente,
        as: 'cliente',
        attributes: ['id', 'nome']
      }]
    });
    if (divida) {
      res.json(divida);
    } else {
      res.status(404).json({ message: 'Dívida não encontrada' });
    }
  } catch (err) {
    console.error('Erro ao buscar dívida:', err);
    res.status(500).json({ message: 'Erro ao buscar dívida' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { cliente_id, valor, dataVencimento, status, descricao } = req.body;

    // Validações
    if (!cliente_id) {
      return res.status(400).json({ message: 'Cliente é obrigatório' });
    }

    if (!valor || isNaN(valor) || valor <= 0) {
      return res.status(400).json({ message: 'Valor inválido' });
    }

    if (!dataVencimento) {
      return res.status(400).json({ message: 'Data de vencimento é obrigatória' });
    }

    // Validação do status
    const statusValidos = ['pendente', 'pago', 'atrasado'];
    if (status && !statusValidos.includes(status.toLowerCase())) {
      return res.status(400).json({ message: 'Status inválido' });
    }

    // Verifica se o cliente existe
    const cliente = await Cliente.findByPk(cliente_id);
    if (!cliente) {
      return res.status(400).json({ message: 'Cliente não encontrado' });
    }

    // Tenta criar a dívida
    try {
      const novaDivida = await Divida.create({
        cliente_id: parseInt(cliente_id),
        valor: parseFloat(valor),
        dataVencimento: new Date(dataVencimento),
        status: status ? status.toLowerCase() : 'pendente',
        descricao: descricao || null
      });

      res.status(201).json(novaDivida);
    } catch (createError) {
      console.error('Erro ao criar dívida:', createError);
      if (createError.name === 'SequelizeValidationError') {
        return res.status(400).json({ 
          message: 'Dados inválidos',
          errors: createError.errors.map(err => err.message)
        });
      }
      throw createError;
    }
  } catch (err) {
    console.error('Erro ao criar dívida:', err);
    res.status(400).json({ message: 'Erro ao criar dívida' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { valor, dataVencimento, status, descricao } = req.body;

    const divida = await Divida.findByPk(id);
    if (!divida) {
      return res.status(404).json({ message: 'Dívida não encontrada' });
    }

    // Validações
    if (valor && (isNaN(valor) || valor <= 0)) {
      return res.status(400).json({ message: 'Valor inválido' });
    }

    const dadosAtualizados = {
      ...(valor && { valor: parseFloat(valor) }),
      ...(dataVencimento && { dataVencimento: new Date(dataVencimento) }),
      ...(status && { status: status.toLowerCase() }),
      ...(descricao !== undefined && { descricao })
    };

    await divida.update(dadosAtualizados);
    res.json(divida);
  } catch (err) {
    console.error('Erro ao atualizar dívida:', err);
    res.status(400).json({ message: 'Erro ao atualizar dívida' });
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
    console.error('Erro ao excluir dívida:', err);
    res.status(500).json({ message: 'Erro ao excluir dívida' });
  }
});

module.exports = router;