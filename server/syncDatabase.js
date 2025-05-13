const sequelize = require('./config/database');
const Produto = require('./models/Produto');
const Cliente = require('./models/Cliente');

async function syncDatabase() {
  try {
    // Força a sincronização do banco de dados
    await sequelize.sync({ force: true });
    console.log('Banco de dados sincronizado com sucesso!');
    
    // Cria alguns produtos de exemplo
    await Produto.create({
      nome: 'Produto Teste 1',
      preco: 10.99,
      descricao: 'Descrição do produto teste 1'
    });

    await Produto.create({
      nome: 'Produto Teste 2',
      preco: 20.50,
      descricao: 'Descrição do produto teste 2'
    });

    // Cria alguns clientes de exemplo
    await Cliente.create({
      nome: 'Cliente Teste 1',
      endereco: 'Endereço do cliente teste 1',
      notas: 'Notas do cliente teste 1'
    });

    await Cliente.create({
      nome: 'Cliente Teste 2',
      endereco: 'Endereço do cliente teste 2',
      notas: 'Notas do cliente teste 2'
    });

    console.log('Dados de exemplo criados com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao sincronizar banco de dados:', error);
    process.exit(1);
  }
}

syncDatabase(); 