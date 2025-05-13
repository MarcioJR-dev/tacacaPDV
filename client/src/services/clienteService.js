import api from './api';

export const clienteService = {
  listarClientes: async () => {
    return await api.get('/clientes');
  },

  buscarCliente: async (id) => {
    return await api.get(`/clientes/${id}`);
  },

  criarCliente: async (cliente) => {
    return await api.post('/clientes', cliente);
  },

  atualizarCliente: async (id, cliente) => {
    return await api.patch(`/clientes/${id}`, cliente);
  }
};