const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

// Listar todos os produtos
router.get('/', produtoController.listarProdutos);

// Criar novo produto
router.post('/', produtoController.criarProduto);

// Atualizar produto
router.put('/:id', produtoController.atualizarProduto);

// Excluir produto
router.delete('/:id', produtoController.excluirProduto);

module.exports = router; 