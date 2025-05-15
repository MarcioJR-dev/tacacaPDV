# Sistema de Gestão de Pedidos e Dívidas

Este é um sistema de gestão desenvolvido para gerenciar pedidos, clientes, produtos e dívidas. O sistema foi construído com React no frontend e possui uma API RESTful no backend.

## Funcionalidades Principais

### 1. Gestão de Clientes
- Cadastro de novos clientes
- Edição de clientes existentes
- Listagem de clientes
- Busca de clientes
- Cada cliente possui:
  - Número identificador
  - Nome
  - Endereço
  - Notas adicionais

### 2. Gestão de Pedidos
- Criação de novos pedidos
- Edição de pedidos existentes
- Listagem de pedidos
- Detalhes do pedido incluindo:
  - Cliente
  - Produtos selecionados
  - Quantidades
  - Valor total
  - Forma de pagamento
  - Observações
- Criação rápida de cliente durante o pedido

### 3. Gestão de Produtos
- Cadastro de produtos
- Edição de produtos
- Listagem de produtos
- Cada produto possui:
  - Nome
  - Preço
  - Descrição

### 4. Gestão de Dívidas
- Registro de dívidas
- Acompanhamento de status (pendente, pago, atrasado)
- Listagem de dívidas
- Detalhes incluindo:
  - Cliente
  - Valor
  - Data de vencimento
  - Status
  - Descrição

## Como Usar

### Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
```

2. Instale as dependências do frontend:
```bash
cd client
npm install
```

3. Instale as dependências do backend:
```bash
cd ../server
npm install
```

### Configuração

1. Configure as variáveis de ambiente no backend:
```env
PORT=3001
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=nome_do_banco
```

2. Configure a URL da API no frontend (client/src/services/api.js):
```javascript
const api = axios.create({
  baseURL: 'http://localhost:3001'
});
```

### Executando o Projeto

1. Inicie o backend:
```bash
cd server
npm start
```

2. Inicie o frontend:
```bash
cd client
npm start
```

O sistema estará disponível em `http://localhost:3000`

## Guia de Uso

### Cadastro de Cliente
1. Acesse o menu "Clientes"
2. Clique em "Novo Cliente"
3. Preencha os dados:
   - Número (opcional)
   - Nome (obrigatório)
   - Endereço (obrigatório)
   - Notas (opcional)
4. Clique em "Cadastrar"

### Criação de Pedido
1. Acesse o menu "Pedidos"
2. Clique em "Novo Pedido"
3. Selecione um cliente existente ou crie um novo clicando em "Novo Cliente"
4. Adicione produtos:
   - Selecione o produto
   - Defina a quantidade
   - Clique em "Adicionar"
5. Escolha a forma de pagamento
6. Adicione observações se necessário
7. Clique em "Salvar"

### Registro de Dívida
1. Acesse o menu "Dívidas"
2. Clique em "Nova Dívida"
3. Selecione o cliente
4. Preencha:
   - Valor
   - Data de vencimento
   - Status
   - Descrição
5. Clique em "Criar"

### Gestão de Produtos
1. Acesse o menu "Produtos"
2. Para adicionar um produto:
   - Clique em "Novo Produto"
   - Preencha nome, preço e descrição
   - Clique em "Salvar"

## Dicas de Uso

1. **Criação Rápida de Cliente**
   - Durante a criação de um pedido, você pode criar um cliente rapidamente clicando em "Novo Cliente"
   - O cliente será automaticamente selecionado após a criação

2. **Busca de Clientes**
   - Use o campo de busca na lista de clientes para encontrar rapidamente um cliente específico

3. **Acompanhamento de Dívidas**
   - Monitore as dívidas pendentes no dashboard
   - Atualize o status das dívidas conforme o pagamento é realizado

4. **Gestão de Pedidos**
   - Visualize detalhes do pedido expandindo a linha na lista
   - Edite ou exclua pedidos conforme necessário

## Suporte

Em caso de dúvidas ou problemas, entre em contato com a equipe de suporte.

## Contribuição

Para contribuir com o projeto:
1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Faça commit das alterações
4. Envie um pull request

## Licença

Este projeto está sob a licença MIT.
