const Produto = require('../models/Produto');

// Listar todos os produtos
exports.listarProdutos = async (req, res) => {
  try {
    const produtos = await Produto.findAll({
      order: [['nome', 'ASC']]
    });
    res.json(produtos);
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.status(500).json({ 
      error: 'Erro ao listar produtos',
      details: error.message 
    });
  }
};

// Buscar produto por ID
exports.buscarProduto = async (req, res) => {
  try {
    const produto = await Produto.findByPk(req.params.id);
    if (produto) {
      res.json(produto);
    } else {
      res.status(404).json({ error: 'Produto não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar produto',
      details: error.message 
    });
  }
};

// Criar novo produto
exports.criarProduto = async (req, res) => {
  try {
    console.log('Dados recebidos:', req.body);
    const { nome, preco, descricao } = req.body;
    
    // Validar dados
    if (!nome || nome.trim() === '') {
      console.log('Erro: Nome é obrigatório');
      return res.status(400).json({ error: 'Nome é obrigatório' });
    }

    if (!preco) {
      console.log('Erro: Preço é obrigatório');
      return res.status(400).json({ error: 'Preço é obrigatório' });
    }

    // Converter preço para número
    const precoNumerico = parseFloat(preco);
    if (isNaN(precoNumerico) || precoNumerico < 0) {
      console.log('Erro: Preço inválido');
      return res.status(400).json({ error: 'Preço inválido' });
    }

    console.log('Criando produto com:', {
      nome: nome.trim(),
      preco: precoNumerico,
      descricao: descricao ? descricao.trim() : null
    });

    const produto = await Produto.create({
      nome: nome.trim(),
      preco: precoNumerico,
      descricao: descricao ? descricao.trim() : null
    });

    console.log('Produto criado com sucesso:', produto);
    res.status(201).json(produto);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ 
      error: 'Erro ao criar produto',
      details: error.message 
    });
  }
};

// Atualizar produto
exports.atualizarProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, preco, descricao, ativo } = req.body;

    const produto = await Produto.findByPk(id);
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    // Validar e converter preço se fornecido
    let precoNumerico;
    if (preco !== undefined) {
      precoNumerico = parseFloat(preco);
      if (isNaN(precoNumerico) || precoNumerico < 0) {
        return res.status(400).json({ error: 'Preço inválido' });
      }
    }

    // Validar nome se fornecido
    if (nome !== undefined && nome.trim() === '') {
      return res.status(400).json({ error: 'Nome não pode ser vazio' });
    }

    await produto.update({
      nome: nome ? nome.trim() : produto.nome,
      preco: precoNumerico !== undefined ? precoNumerico : produto.preco,
      descricao: descricao !== undefined ? descricao.trim() : produto.descricao,
      ativo: ativo !== undefined ? ativo : produto.ativo
    });

    res.json(produto);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ 
      error: 'Erro ao atualizar produto',
      details: error.message 
    });
  }
};

// Excluir produto
exports.excluirProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const produto = await Produto.findByPk(id);
    
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    await produto.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    res.status(500).json({ 
      error: 'Erro ao excluir produto',
      details: error.message 
    });
  }
}; 