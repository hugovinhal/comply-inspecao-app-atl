import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { equipmentService, clientService } from '../services/api';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import { Client, Equipment } from '../types';

const Equipments = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentEquipment, setCurrentEquipment] = useState<Partial<Equipment>>({
    id: undefined,
    name: '',
    tag: '',
    type: 'Vaso de Pressão',
    client_id: 0,
    manufacturer: '',
    serial_number: '',
    year_of_manufacture: '',
    capacity: '',
    working_pressure: '',
    temperature: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Verificar se há um client_id na URL
    const params = new URLSearchParams(location.search);
    const clientId = params.get('client_id');
    
    if (clientId) {
      setSelectedClientId(parseInt(clientId));
    }
    
    loadClients();
    loadEquipments(clientId);
  }, [location.search]);

  const loadClients = async () => {
    try {
      const data = await clientService.getAll();
      setClients(data);
    } catch (error) {
      toast.error('Erro ao carregar clientes');
      console.error(error);
    }
  };

  const loadEquipments = async (clientId: string | null = null) => {
    setLoading(true);
    try {
      const data = await equipmentService.getAll(clientId ? parseInt(clientId) : null);
      setEquipments(data);
    } catch (error) {
      toast.error('Erro ao carregar equipamentos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentEquipment({
      ...currentEquipment,
      [name]: value
    });
  };

  const resetForm = () => {
    setCurrentEquipment({
      id: undefined,
      name: '',
      tag: '',
      type: 'Vaso de Pressão',
      client_id: selectedClientId || 0,
      manufacturer: '',
      serial_number: '',
      year_of_manufacture: '',
      capacity: '',
      working_pressure: '',
      temperature: ''
    });
    setIsEditing(false);
  };

  const openModal = (equipment: Equipment | null = null) => {
    if (equipment) {
      setCurrentEquipment(equipment);
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
      if (isEditing && currentEquipment.id !== undefined) {
        await equipmentService.update(currentEquipment.id, currentEquipment);
        toast.success('Equipamento atualizado com sucesso!');
      } else {
        // Remover o id para criar um novo equipamento
        const { id, ...equipmentData } = currentEquipment;
        await equipmentService.create(equipmentData as Omit<Equipment, 'id'>);
        toast.success('Equipamento criado com sucesso!');
      }
      
      closeModal();
      loadEquipments(selectedClientId ? selectedClientId.toString() : null);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar equipamento');
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este equipamento?')) {
      try {
        await equipmentService.delete(id);
        toast.success('Equipamento excluído com sucesso!');
        loadEquipments(selectedClientId ? selectedClientId.toString() : null);
      } catch (error: any) {
        toast.error(error.message || 'Erro ao excluir equipamento');
        console.error(error);
      }
    }
  };

  const filterByClient = (clientId: number | null) => {
    setSelectedClientId(clientId);
    if (clientId) {
      navigate(`/equipments?client_id=${clientId}`);
    } else {
      navigate('/equipments');
    }
  };

  const getClientName = (clientId: number) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Cliente não encontrado';
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold text-gray-800">Equipamentos</h1>
            <button
              onClick={() => openModal()}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
            >
              Novo Equipamento
            </button>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por Cliente
            </label>
            <select
              value={selectedClientId || ''}
              onChange={(e) => filterByClient(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Todos os Clientes</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tag</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {equipments.length > 0 ? (
                    equipments.map((equipment) => (
                      <tr key={equipment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{equipment.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{equipment.tag}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{equipment.type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{getClientName(equipment.client_id)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => openModal(equipment)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(equipment.id)}
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
                        Nenhum equipamento encontrado
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
                    {isEditing ? 'Editar Equipamento' : 'Novo Equipamento'}
                  </h3>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cliente
                      </label>
                      <select
                        name="client_id"
                        value={currentEquipment.client_id}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      >
                        <option value="">Selecione um cliente</option>
                        {clients.map((client) => (
                          <option key={client.id} value={client.id}>
                            {client.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome do Equipamento
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={currentEquipment.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tag
                      </label>
                      <input
                        type="text"
                        name="tag"
                        value={currentEquipment.tag}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo
                      </label>
                      <select
                        name="type"
                        value={currentEquipment.type}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      >
                        <option value="Vaso de Pressão">Vaso de Pressão</option>
                        <option value="Caldeira">Caldeira</option>
                        <option value="Tubulação">Tubulação</option>
                        <option value="Outro">Outro</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fabricante
                      </label>
                      <input
                        type="text"
                        name="manufacturer"
                        value={currentEquipment.manufacturer}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número de Série
                      </label>
                      <input
                        type="text"
                        name="serial_number"
                        value={currentEquipment.serial_number}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ano de Fabricação
                        </label>
                        <input
                          type="text"
                          name="year_of_manufacture"
                          value={currentEquipment.year_of_manufacture}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Capacidade
                        </label>
                        <input
                          type="text"
                          name="capacity"
                          value={currentEquipment.capacity}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pressão de Trabalho
                        </label>
                        <input
                          type="text"
                          name="working_pressure"
                          value={currentEquipment.working_pressure}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Temperatura
                      </label>
                      <input
                        type="text"
                        name="temperature"
                        value={currentEquipment.temperature}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
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

export default Equipments;
