const { Produto } = require('../models/associations');

const produtoController = {
  // Listar todos os produtos
  async listarProdutos(req, res) {
    try {
      console.log('Buscando todos os produtos...');
      const produtos = await Produto.findAll({
        where: { ativo: true },
        order: [['nome', 'ASC']]
      });
      console.log(`${produtos.length} produtos encontrados`);
      res.json(produtos);
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      res.status(500).json({ 
        message: 'Erro ao listar produtos',
        error: error.message,
        stack: error.stack
      });
    }
  },

  // Buscar produto por ID
  async buscarProduto(req, res) {
    try {
      const { id } = req.params;
      console.log(`Buscando produto com ID: ${id}`);
      
      const produto = await Produto.findByPk(id);
      if (!produto) {
        console.log(`Produto com ID ${id} não encontrado`);
        return res.status(404).json({ message: 'Produto não encontrado' });
      }

      console.log('Produto encontrado:', produto.toJSON());
      res.json(produto);
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      res.status(500).json({ 
        message: 'Erro ao buscar produto',
        error: error.message,
        stack: error.stack
      });
    }
  },

  // Criar novo produto
  async criarProduto(req, res) {
    try {
      console.log('Dados recebidos:', req.body);
      const produtoData = {
        ...req.body,
        preco: parseFloat(req.body.preco)
      };
      console.log('Criando produto com:', produtoData);
      
      const produto = await Produto.create(produtoData);
      console.log('Produto criado com sucesso:', produto.toJSON());
      res.status(201).json(produto);
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      res.status(400).json({ 
        message: 'Erro ao criar produto',
        error: error.message,
        stack: error.stack
      });
    }
  },

  // Atualizar produto
  async atualizarProduto(req, res) {
    try {
      const { id } = req.params;
      const produtoData = {
        ...req.body,
        preco: parseFloat(req.body.preco)
      };
      console.log(`Atualizando produto ${id} com dados:`, produtoData);

      const produto = await Produto.findByPk(id);
      if (!produto) {
        console.log(`Produto ${id} não encontrado`);
        return res.status(404).json({ message: 'Produto não encontrado' });
      }

      await produto.update(produtoData);
      console.log('Produto atualizado com sucesso:', produto.toJSON());
      res.json(produto);
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      res.status(400).json({ 
        message: 'Erro ao atualizar produto',
        error: error.message,
        stack: error.stack
      });
    }
  },

  // Excluir produto (soft delete)
  async excluirProduto(req, res) {
    try {
      const { id } = req.params;
      console.log(`Excluindo produto ${id}`);

      const produto = await Produto.findByPk(id);
      if (!produto) {
        console.log(`Produto ${id} não encontrado`);
        return res.status(404).json({ message: 'Produto não encontrado' });
      }

      await produto.update({ ativo: false });
      console.log(`Produto ${id} excluído com sucesso`);
      res.json({ message: 'Produto excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      res.status(500).json({ 
        message: 'Erro ao excluir produto',
        error: error.message,
        stack: error.stack
      });
    }
  }
};

module.exports = produtoController; 