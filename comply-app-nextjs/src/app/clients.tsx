import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientService } from '../services/api';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import { Client } from '../types';

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentClient, setCurrentClient] = useState<Partial<Client>>({
    id: undefined,
    name: '',
    contact_name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    try {
      const data = await clientService.getAll();
      setClients(data);
    } catch (error) {
      toast.error('Erro ao carregar clientes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentClient({
      ...currentClient,
      [name]: value
    });
  };

  const resetForm = () => {
    setCurrentClient({
      id: undefined,
      name: '',
      contact_name: '',
      email: '',
      phone: '',
      address: ''
    });
    setIsEditing(false);
  };

  const openModal = (client: Client | null = null) => {
    if (client) {
      setCurrentClient(client);
      setIsEditing(true);
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && currentClient.id !== undefined) {
        await clientService.update(currentClient.id, currentClient);
        toast.success('Cliente atualizado com sucesso!');
      } else {
        // Remover o id para criar um novo cliente
        const { id, ...clientData } = currentClient;
        await clientService.create(clientData as Omit<Client, 'id'>);
        toast.success('Cliente criado com sucesso!');
      }
      
      closeModal();
      loadClients();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar cliente');
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await clientService.delete(id);
        toast.success('Cliente excluído com sucesso!');
        loadClients();
      } catch (error: any) {
        toast.error(error.message || 'Erro ao excluir cliente');
        console.error(error);
      }
    }
  };

  const viewEquipments = (clientId: number) => {
    navigate(`/equipments?client_id=${clientId}`);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold text-gray-800">Clientes</h1>
            <button
              onClick={() => openModal()}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
            >
              Novo Cliente
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clients.length > 0 ? (
                    clients.map((client) => (
                      <tr key={client.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{client.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{client.contact_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{client.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{client.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => viewEquipments(client.id)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Equipamentos
                          </button>
                          <button
                            onClick={() => openModal(client)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(client.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                        Nenhum cliente encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Modal de Cadastro/Edição */}
          {showModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
                  </h3>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome da Empresa
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={currentClient.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome do Contato
                      </label>
                      <input
                        type="text"
                        name="contact_name"
                        value={currentClient.contact_name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={currentClient.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={currentClient.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Endereço
                      </label>
                      <textarea
                        name="address"
                        value={currentClient.address}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        rows={3}
                        required
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                      Salvar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Clients;
