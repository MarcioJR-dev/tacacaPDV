const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

router.get('/', pedidoController.listarPedidos);
router.get('/:id', pedidoController.buscarPedido);
router.post('/', pedidoController.criarPedido);
router.patch('/:id', pedidoController.atualizarPedido);
router.delete('/:id', pedidoController.excluirPedido);

module.exports = router;