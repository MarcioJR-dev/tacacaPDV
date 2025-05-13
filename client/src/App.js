import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Layout from './components/Layout/Layout';
import ListaClientes from './pages/Clientes/ListaClientes';
import NovoCliente from './pages/Clientes/NovoCliente';
import EditarCliente from './pages/Clientes/EditarCliente';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/clientes" element={<ListaClientes />} />
            <Route path="/clientes/novo" element={<NovoCliente />} />
            <Route path="/clientes/editar/:id" element={<EditarCliente />} />
            {/* Outras rotas serão adicionadas aqui */}
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
