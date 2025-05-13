const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

// Listar todos os produtos
router.get('/', produtoController.listarProdutos);

// Buscar produto por ID
router.get('/:id', produtoController.buscarProduto);

// Criar novo produto
router.post('/', produtoController.criarProduto);

// Atualizar produto
router.put('/:id', produtoController.atualizarProduto);

// Deletar produto
router.delete('/:id', produtoController.excluirProduto);

module.exports = router; 