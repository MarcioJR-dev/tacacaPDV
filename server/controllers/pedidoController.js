const { Pedido, Cliente, Produto } = require('../models/associations');

const pedidoController = {
  // Listar todos os pedidos
  async listarPedidos(req, res) {
    try {
      console.log('Buscando todos os pedidos...');
      const pedidos = await Pedido.findAll({
        include: [
          {
            model: Cliente,
            as: 'cliente',
            attributes: ['id', 'nome']
          },
          {
            model: Produto,
            as: 'produtos',
            through: { attributes: ['quantidade'] }
          }
        ],
        order: [['data', 'DESC']]
      });
      console.log(`${pedidos.length} pedidos encontrados`);
      res.json(pedidos);
    } catch (error) {
      console.error('Erro ao listar pedidos:', error);
      res.status(500).json({ 
        message: 'Erro ao listar pedidos',
        error: error.message,
        stack: error.stack
      });
    }
  },

  // Buscar pedido por ID
  async buscarPedido(req, res) {
    try {
      const { id } = req.params;
      console.log(`Buscando pedido com ID: ${id}`);
      
      const pedido = await Pedido.findByPk(id, {
        include: [
          {
            model: Cliente,
            as: 'cliente',
            attributes: ['id', 'nome']
          },
          {
            model: Produto,
            as: 'produtos',
            through: { attributes: ['quantidade'] }
          }
        ]
      });

      if (!pedido) {
        console.log(`Pedido com ID ${id} não encontrado`);
        return res.status(404).json({ message: 'Pedido não encontrado' });
      }

      console.log('Pedido encontrado:', pedido.toJSON());
      res.json(pedido);
    } catch (error) {
      console.error('Erro ao buscar pedido:', error);
      res.status(500).json({ 
        message: 'Erro ao buscar pedido',
        error: error.message,
        stack: error.stack
      });
    }
  },

  // Criar novo pedido
  async criarPedido(req, res) {
    try {
      console.log('Dados recebidos para criar pedido:', req.body);
      const { produtos, ...pedidoData } = req.body;

      // Validação básica
      if (!pedidoData.valorTotal || pedidoData.valorTotal < 0) {
        console.log('Valor total inválido:', pedidoData.valorTotal);
        return res.status(400).json({ message: 'Valor total inválido' });
      }

      if (!pedidoData.formaPagamento) {
        console.log('Forma de pagamento não informada');
        return res.status(400).json({ message: 'Forma de pagamento é obrigatória' });
      }

      // Converter os dados para o formato do banco
      const pedidoDataFormatado = {
        cliente_id: pedidoData.cliente_id,
        valor_total: parseFloat(pedidoData.valorTotal),
        forma_pagamento: pedidoData.formaPagamento,
        notas_pedido: pedidoData.notasPedido
      };

      console.log('Criando pedido com dados:', pedidoDataFormatado);
      const pedido = await Pedido.create(pedidoDataFormatado);

      if (produtos && produtos.length > 0) {
        console.log('Adicionando produtos ao pedido:', produtos);
        const produtosComQuantidade = produtos.map(produto => ({
          id: produto.id,
          quantidade: produto.quantidade
        }));
        
        // Primeiro, adiciona os produtos com suas quantidades
        for (const produto of produtosComQuantidade) {
          await pedido.addProduto(produto.id, {
            through: { quantidade: produto.quantidade }
          });
        }
      }

      console.log('Buscando pedido criado com relacionamentos...');
      const pedidoCompleto = await Pedido.findByPk(pedido.id, {
        include: [
          {
            model: Cliente,
            as: 'cliente',
            attributes: ['id', 'nome']
          },
          {
            model: Produto,
            as: 'produtos',
            through: { attributes: ['quantidade'] }
          }
        ]
      });

      console.log('Pedido criado com sucesso:', pedidoCompleto.toJSON());
      res.status(201).json(pedidoCompleto);
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      console.error('Stack trace:', error.stack);
      res.status(400).json({ 
        message: 'Erro ao criar pedido',
        error: error.message,
        stack: error.stack,
        details: error.errors ? error.errors.map(e => ({
          message: e.message,
          type: e.type,
          path: e.path,
          value: e.value
        })) : null
      });
    }
  },

  // Atualizar pedido
  async atualizarPedido(req, res) {
    try {
      const { id } = req.params;
      const { produtos, ...pedidoData } = req.body;
      
      // Converter os dados para o formato do banco
      const pedidoDataFormatado = {
        cliente_id: pedidoData.cliente_id,
        valor_total: parseFloat(pedidoData.valorTotal),
        forma_pagamento: pedidoData.formaPagamento,
        notas_pedido: pedidoData.notasPedido
      };

      console.log(`Atualizando pedido ${id} com dados:`, pedidoDataFormatado);

      const pedido = await Pedido.findByPk(id);
      if (!pedido) {
        console.log(`Pedido ${id} não encontrado`);
        return res.status(404).json({ message: 'Pedido não encontrado' });
      }

      await pedido.update(pedidoDataFormatado);

      if (produtos && produtos.length > 0) {
        console.log('Atualizando produtos do pedido:', produtos);
        const produtosComQuantidade = produtos.map(produto => ({
          id: produto.id,
          quantidade: produto.quantidade
        }));
        
        // Primeiro, remove todos os produtos existentes
        await pedido.setProdutos([]);
        
        // Depois, adiciona os novos produtos com suas quantidades
        for (const produto of produtosComQuantidade) {
          await pedido.addProduto(produto.id, {
            through: { quantidade: produto.quantidade }
          });
        }
      }

      const pedidoAtualizado = await Pedido.findByPk(id, {
        include: [
          {
            model: Cliente,
            as: 'cliente',
            attributes: ['id', 'nome']
          },
          {
            model: Produto,
            as: 'produtos',
            through: { attributes: ['quantidade'] }
          }
        ]
      });

      console.log('Pedido atualizado com sucesso:', pedidoAtualizado.toJSON());
      res.json(pedidoAtualizado);
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
      res.status(400).json({ 
        message: 'Erro ao atualizar pedido',
        error: error.message,
        stack: error.stack
      });
    }
  },

  // Excluir pedido
  async excluirPedido(req, res) {
    try {
      const { id } = req.params;
      console.log(`Excluindo pedido ${id}`);

      const pedido = await Pedido.findByPk(id);
      if (!pedido) {
        console.log(`Pedido ${id} não encontrado`);
        return res.status(404).json({ message: 'Pedido não encontrado' });
      }

      await pedido.destroy();
      console.log(`Pedido ${id} excluído com sucesso`);
      res.json({ message: 'Pedido excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir pedido:', error);
      res.status(500).json({ 
        message: 'Erro ao excluir pedido',
        error: error.message,
        stack: error.stack
      });
    }
  }
};

module.exports = pedidoController; 