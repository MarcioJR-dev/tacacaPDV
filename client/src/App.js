import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import ListaClientes from './pages/Clientes/ListaClientes';
import NovoCliente from './pages/Clientes/NovoCliente';
import EditarCliente from './pages/Clientes/EditarCliente';
import ListaPedidos from './pages/Pedidos/ListaPedidos';
import FormPedido from './pages/Pedidos/FormPedido';
import ListaDividas from './pages/Dividas/ListaDividas';
import FormDivida from './pages/Dividas/FormDivida';
import ListaProdutos from './pages/Produtos/ListaProdutos';
import FormProduto from './pages/Produtos/FormProduto';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clientes" element={<ListaClientes />} />
            <Route path="/clientes/novo" element={<NovoCliente />} />
            <Route path="/clientes/editar/:id" element={<EditarCliente />} />
            <Route path="/pedidos" element={<ListaPedidos />} />
            <Route path="/pedidos/novo" element={<FormPedido />} />
            <Route path="/pedidos/editar/:id" element={<FormPedido />} />
            <Route path="/dividas" element={<ListaDividas />} />
            <Route path="/dividas/novo" element={<FormDivida />} />
            <Route path="/dividas/editar/:id" element={<FormDivida />} />
            <Route path="/produtos" element={<ListaProdutos />} />
            <Route path="/produtos/novo" element={<FormProduto />} />
            <Route path="/produtos/editar/:id" element={<FormProduto />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
