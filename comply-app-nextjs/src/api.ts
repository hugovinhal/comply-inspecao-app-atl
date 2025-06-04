import axios from 'axios';
import { User, Client, Equipment, ServiceOrder, Inspection, InspectionPhoto, Report, SyncStatus } from '../types';

// Configuração base do axios
const API_URL = 'https://5000-i2fq93jmy7inntz8vhhhx-ff0977e0.manus.computer/api';

// Instância do axios com configurações padrão
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Serviço de autenticação
export const authService = {
  // Login
  login: async (username: string, _password: string): Promise<{user: User, token: string}> => {
    try {
      // Para demonstração, simulamos uma autenticação bem-sucedida
      // Em produção, isso seria uma chamada real à API
      // const response = await api.post('/auth/login', { username, password });
      
      const mockResponse = {
        user: {
          id: 1,
          name: 'Administrador',
          username: username,
          role: 'admin'
        },
        token: 'mock-jwt-token-12345'
      };
      
      // Armazenar token e dados do usuário
      localStorage.setItem('token', mockResponse.token);
      localStorage.setItem('user', JSON.stringify(mockResponse.user));
      
      return mockResponse;
    } catch (error) {
      throw new Error('Falha na autenticação. Verifique suas credenciais.');
    }
  },
  
  // Logout
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  // Obter usuário atual
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  }
};

// Serviço de clientes
export const clientService = {
  // Listar todos os clientes
  getAll: async (): Promise<Client[]> => {
    try {
      // Para demonstração, retornamos dados simulados
      // Em produção, isso seria: const response = await api.get('/clients');
      
      const mockClients: Client[] = [
        {
          id: 1,
          name: 'Indústria ABC',
          contact_name: 'João Silva',
          email: 'joao@industriaabc.com',
          phone: '(11) 98765-4321',
          address: 'Av. Industrial, 1000, São Paulo - SP'
        },
        {
          id: 2,
          name: 'Metalúrgica XYZ',
          contact_name: 'Maria Oliveira',
          email: 'maria@metalxyz.com',
          phone: '(21) 97654-3210',
          address: 'Rua das Caldeiras, 500, Rio de Janeiro - RJ'
        },
        {
          id: 3,
          name: 'Petroquímica Sul',
          contact_name: 'Carlos Santos',
          email: 'carlos@petrosul.com',
          phone: '(51) 96543-2109',
          address: 'Rodovia BR 101, Km 200, Porto Alegre - RS'
        }
      ];
      
      return mockClients;
    } catch (error) {
      throw new Error('Erro ao buscar clientes');
    }
  },
  
  // Obter cliente por ID
  getById: async (id: number): Promise<Client> => {
    try {
      // Para demonstração, simulamos a busca
      // Em produção, isso seria: const response = await api.get(`/clients/${id}`);
      
      const mockClients: Client[] = [
        {
          id: 1,
          name: 'Indústria ABC',
          contact_name: 'João Silva',
          email: 'joao@industriaabc.com',
          phone: '(11) 98765-4321',
          address: 'Av. Industrial, 1000, São Paulo - SP'
        },
        {
          id: 2,
          name: 'Metalúrgica XYZ',
          contact_name: 'Maria Oliveira',
          email: 'maria@metalxyz.com',
          phone: '(21) 97654-3210',
          address: 'Rua das Caldeiras, 500, Rio de Janeiro - RJ'
        },
        {
          id: 3,
          name: 'Petroquímica Sul',
          contact_name: 'Carlos Santos',
          email: 'carlos@petrosul.com',
          phone: '(51) 96543-2109',
          address: 'Rodovia BR 101, Km 200, Porto Alegre - RS'
        }
      ];
      
      const client = mockClients.find(c => c.id === id);
      
      if (!client) {
        throw new Error('Cliente não encontrado');
      }
      
      return client;
    } catch (error) {
      throw new Error('Erro ao buscar cliente');
    }
  },
  
  // Criar novo cliente
  create: async (clientData: Omit<Client, 'id'>): Promise<Client> => {
    try {
      // Para demonstração, simulamos a criação
      // Em produção, isso seria: const response = await api.post('/clients', clientData);
      
      const newClient: Client = {
        id: Date.now(), // Simulando um ID único
        ...clientData
      };
      
      return newClient;
    } catch (error) {
      throw new Error('Erro ao criar cliente');
    }
  },
  
  // Atualizar cliente existente
  update: async (id: number, clientData: Partial<Client>): Promise<Client> => {
    try {
      // Para demonstração, simulamos a atualização
      // Em produção, isso seria: const response = await api.put(`/clients/${id}`, clientData);
      
      const updatedClient: Client = {
        id,
        name: '',
        contact_name: '',
        email: '',
        phone: '',
        address: '',
        ...clientData
      };
      
      return updatedClient;
    } catch (error) {
      throw new Error('Erro ao atualizar cliente');
    }
  },
  
  // Excluir cliente
  delete: async (_id: number): Promise<{success: boolean}> => {
    try {
      // Para demonstração, simulamos a exclusão
      // Em produção, isso seria: await api.delete(`/clients/${_id}`);
      
      return { success: true };
    } catch (error) {
      throw new Error('Erro ao excluir cliente');
    }
  }
};

// Serviço de equipamentos
export const equipmentService = {
  // Listar todos os equipamentos
  getAll: async (clientId: number | null = null): Promise<Equipment[]> => {
    try {
      // Para demonstração, retornamos dados simulados
      // Em produção, isso seria: 
      // const url = clientId ? `/equipments?client_id=${clientId}` : '/equipments';
      // const response = await api.get(url);
      
      const mockEquipments: Equipment[] = [
        {
          id: 1,
          name: 'Vaso de Pressão VP-001',
          tag: 'VP-001',
          type: 'Vaso de Pressão',
          client_id: 1,
          manufacturer: 'Fabricante A',
          serial_number: 'SN12345',
          year_of_manufacture: '2018',
          capacity: '5000 L',
          working_pressure: '10 bar',
          temperature: '80°C'
        },
        {
          id: 2,
          name: 'Caldeira CAL-002',
          tag: 'CAL-002',
          type: 'Caldeira',
          client_id: 1,
          manufacturer: 'Fabricante B',
          serial_number: 'SN67890',
          year_of_manufacture: '2019',
          capacity: '2000 kg/h',
          working_pressure: '15 bar',
          temperature: '180°C'
        },
        {
          id: 3,
          name: 'Tubulação TUB-003',
          tag: 'TUB-003',
          type: 'Tubulação',
          client_id: 2,
          manufacturer: 'Fabricante C',
          serial_number: 'SN24680',
          year_of_manufacture: '2020',
          capacity: 'N/A',
          working_pressure: '20 bar',
          temperature: '120°C'
        },
        {
          id: 4,
          name: 'Vaso de Pressão VP-004',
          tag: 'VP-004',
          type: 'Vaso de Pressão',
          client_id: 3,
          manufacturer: 'Fabricante A',
          serial_number: 'SN13579',
          year_of_manufacture: '2021',
          capacity: '8000 L',
          working_pressure: '12 bar',
          temperature: '90°C'
        }
      ];
      
      // Filtrar por cliente se necessário
      const equipments = clientId 
        ? mockEquipments.filter(e => e.client_id === clientId)
        : mockEquipments;
      
      return equipments;
    } catch (error) {
      throw new Error('Erro ao buscar equipamentos');
    }
  },
  
  // Obter equipamento por ID
  getById: async (id: number): Promise<Equipment> => {
    try {
      // Para demonstração, simulamos a busca
      // Em produção, isso seria: const response = await api.get(`/equipments/${id}`);
      
      const mockEquipments: Equipment[] = [
        {
          id: 1,
          name: 'Vaso de Pressão VP-001',
          tag: 'VP-001',
          type: 'Vaso de Pressão',
          client_id: 1,
          manufacturer: 'Fabricante A',
          serial_number: 'SN12345',
          year_of_manufacture: '2018',
          capacity: '5000 L',
          working_pressure: '10 bar',
          temperature: '80°C'
        },
        {
          id: 2,
          name: 'Caldeira CAL-002',
          tag: 'CAL-002',
          type: 'Caldeira',
          client_id: 1,
          manufacturer: 'Fabricante B',
          serial_number: 'SN67890',
          year_of_manufacture: '2019',
          capacity: '2000 kg/h',
          working_pressure: '15 bar',
          temperature: '180°C'
        },
        {
          id: 3,
          name: 'Tubulação TUB-003',
          tag: 'TUB-003',
          type: 'Tubulação',
          client_id: 2,
          manufacturer: 'Fabricante C',
          serial_number: 'SN24680',
          year_of_manufacture: '2020',
          capacity: 'N/A',
          working_pressure: '20 bar',
          temperature: '120°C'
        },
        {
          id: 4,
          name: 'Vaso de Pressão VP-004',
          tag: 'VP-004',
          type: 'Vaso de Pressão',
          client_id: 3,
          manufacturer: 'Fabricante A',
          serial_number: 'SN13579',
          year_of_manufacture: '2021',
          capacity: '8000 L',
          working_pressure: '12 bar',
          temperature: '90°C'
        }
      ];
      
      const equipment = mockEquipments.find(e => e.id === id);
      
      if (!equipment) {
        throw new Error('Equipamento não encontrado');
      }
      
      return equipment;
    } catch (error) {
      throw new Error('Erro ao buscar equipamento');
    }
  },
  
  // Criar novo equipamento
  create: async (equipmentData: Omit<Equipment, 'id'>): Promise<Equipment> => {
    try {
      // Para demonstração, simulamos a criação
      // Em produção, isso seria: const response = await api.post('/equipments', equipmentData);
      
      const newEquipment: Equipment = {
        id: Date.now(), // Simulando um ID único
        ...equipmentData
      };
      
      return newEquipment;
    } catch (error) {
      throw new Error('Erro ao criar equipamento');
    }
  },
  
  // Atualizar equipamento existente
  update: async (id: number, equipmentData: Partial<Equipment>): Promise<Equipment> => {
    try {
      // Para demonstração, simulamos a atualização
      // Em produção, isso seria: const response = await api.put(`/equipments/${id}`, equipmentData);
      
      const updatedEquipment: Equipment = {
        id,
        name: '',
        tag: '',
        type: '',
        client_id: 0,
        manufacturer: '',
        serial_number: '',
        year_of_manufacture: '',
        capacity: '',
        working_pressure: '',
        temperature: '',
        ...equipmentData
      };
      
      return updatedEquipment;
    } catch (error) {
      throw new Error('Erro ao atualizar equipamento');
    }
  },
  
  // Excluir equipamento
  delete: async (_id: number): Promise<{success: boolean}> => {
    try {
      // Para demonstração, simulamos a exclusão
      // Em produção, isso seria: await api.delete(`/equipments/${_id}`);
      
      return { success: true };
    } catch (error) {
      throw new Error('Erro ao excluir equipamento');
    }
  }
};

// Serviço de ordens de serviço
export const serviceOrderService = {
  // Listar todas as ordens de serviço
  getAll: async (filters: {client_id?: number, status?: string} = {}): Promise<ServiceOrder[]> => {
    try {
      // Para demonstração, retornamos dados simulados
      // Em produção, isso seria: const response = await api.get('/service-orders', { params: filters });
      
      const mockServiceOrders: ServiceOrder[] = [
        {
          id: 1,
          number: 'OS-2025-001',
          client_id: 1,
          client_name: 'Indústria ABC',
          description: 'Inspeção anual de vasos de pressão',
          status: 'pending',
          created_at: '2025-05-15',
          scheduled_date: '2025-06-10',
          equipments: [1, 2]
        },
        {
          id: 2,
          number: 'OS-2025-002',
          client_id: 2,
          client_name: 'Metalúrgica XYZ',
          description: 'Inspeção de tubulação',
          status: 'in_progress',
          created_at: '2025-05-20',
          scheduled_date: '2025-06-05',
          equipments: [3]
        },
        {
          id: 3,
          number: 'OS-2025-003',
          client_id: 3,
          client_name: 'Petroquímica Sul',
          description: 'Inspeção periódica de vaso de pressão',
          status: 'completed',
          created_at: '2025-05-10',
          scheduled_date: '2025-05-25',
          completed_date: '2025-05-25',
          equipments: [4]
        }
      ];
      
      // Aplicar filtros se necessário
      let filteredOrders = [...mockServiceOrders];
      
      if (filters.client_id) {
        filteredOrders = filteredOrders.filter(o => o.client_id === filters.client_id);
      }
      
      if (filters.status) {
        filteredOrders = filteredOrders.filter(o => o.status === filters.status);
      }
      
      return filteredOrders;
    } catch (error) {
      throw new Error('Erro ao buscar ordens de serviço');
    }
  },
  
  // Obter ordem de serviço por ID
  getById: async (id: number): Promise<ServiceOrder> => {
    try {
      // Para demonstração, simulamos a busca
      // Em produção, isso seria: const response = await api.get(`/service-orders/${id}`);
      
      const mockServiceOrders: ServiceOrder[] = [
        {
          id: 1,
          number: 'OS-2025-001',
          client_id: 1,
          client_name: 'Indústria ABC',
          description: 'Inspeção anual de vasos de pressão',
          status: 'pending',
          created_at: '2025-05-15',
          scheduled_date: '2025-06-10',
          equipments: [1, 2]
        },
        {
          id: 2,
          number: 'OS-2025-002',
          client_id: 2,
          client_name: 'Metalúrgica XYZ',
          description: 'Inspeção de tubulação',
          status: 'in_progress',
          created_at: '2025-05-20',
          scheduled_date: '2025-06-05',
          equipments: [3]
        },
        {
          id: 3,
          number: 'OS-2025-003',
          client_id: 3,
          client_name: 'Petroquímica Sul',
          description: 'Inspeção periódica de vaso de pressão',
          status: 'completed',
          created_at: '2025-05-10',
          scheduled_date: '2025-05-25',
          completed_date: '2025-05-25',
          equipments: [4]
        }
      ];
      
      const serviceOrder = mockServiceOrders.find(o => o.id === id);
      
      if (!serviceOrder) {
        throw new Error('Ordem de serviço não encontrada');
      }
      
      return serviceOrder;
    } catch (error) {
      throw new Error('Erro ao buscar ordem de serviço');
    }
  },
  
  // Criar nova ordem de serviço
  create: async (orderData: Omit<ServiceOrder, 'id' | 'number' | 'created_at' | 'status'>): Promise<ServiceOrder> => {
    try {
      // Para demonstração, simulamos a criação
      // Em produção, isso seria: const response = await api.post('/service-orders', orderData);
      
      const newOrder: ServiceOrder = {
        id: Date.now(), // Simulando um ID único
        number: `OS-2025-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        created_at: new Date().toISOString().split('T')[0],
        status: 'pending',
        ...orderData
      };
      
      return newOrder;
    } catch (error) {
      throw new Error('Erro ao criar ordem de serviço');
    }
  },
  
  // Atualizar ordem de serviço existente
  update: async (id: number, orderData: Partial<ServiceOrder>): Promise<ServiceOrder> => {
    try {
      // Para demonstração, simulamos a atualização
      // Em produção, isso seria: const response = await api.put(`/service-orders/${id}`, orderData);
      
      const updatedOrder: ServiceOrder = {
        id,
        number: '',
        client_id: 0,
        client_name: '',
        description: '',
        status: 'pending',
        created_at: '',
        scheduled_date: '',
        equipments: [],
        ...orderData
      };
      
      return updatedOrder;
    } catch (error) {
      throw new Error('Erro ao atualizar ordem de serviço');
    }
  },
  
  // Excluir ordem de serviço
  delete: async (_id: number): Promise<{success: boolean}> => {
    try {
      // Para demonstração, simulamos a exclusão
      // Em produção, isso seria: await api.delete(`/service-orders/${_id}`);
      
      return { success: true };
    } catch (error) {
      throw new Error('Erro ao excluir ordem de serviço');
    }
  }
};

// Serviço de inspeções
export const inspectionService = {
  // Listar todas as inspeções
  getAll: async (filters: {service_order_id?: number, equipment_id?: number, status?: string} = {}): Promise<Inspection[]> => {
    try {
      // Para demonstração, retornamos dados simulados
      // Em produção, isso seria: const response = await api.get('/inspections', { params: filters });
      
      const mockInspections: Inspection[] = [
        {
          id: 1,
          service_order_id: 1,
          equipment_id: 1,
          equipment_name: 'Vaso de Pressão VP-001',
          inspector_id: 1,
          inspector_name: 'Administrador',
          status: 'completed',
          inspection_date: '2025-06-10',
          general_condition: 'Bom',
          observations: 'Equipamento em boas condições gerais',
          conclusion: 'Aprovado para operação',
          photos: [
            { id: 1, url: '/assets/images/mock-photo-1.jpg', caption: 'Vista geral do equipamento' },
            { id: 2, url: '/assets/images/mock-photo-2.jpg', caption: 'Detalhe da válvula de segurança' }
          ]
        },
        {
          id: 2,
          service_order_id: 1,
          equipment_id: 2,
          equipment_name: 'Caldeira CAL-002',
          inspector_id: 1,
          inspector_name: 'Administrador',
          status: 'in_progress',
          inspection_date: '2025-06-10',
          general_condition: '',
          observations: 'Inspeção em andamento',
          conclusion: '',
          photos: []
        },
        {
          id: 3,
          service_order_id: 2,
          equipment_id: 3,
          equipment_name: 'Tubulação TUB-003',
          inspector_id: 1,
          inspector_name: 'Administrador',
          status: 'completed',
          inspection_date: '2025-06-05',
          general_condition: 'Regular',
          observations: 'Identificados pontos de corrosão',
          conclusion: 'Aprovado com restrições',
          photos: [
            { id: 3, url: '/assets/images/mock-photo-3.jpg', caption: 'Ponto de corrosão identificado' }
          ]
        }
      ];
      
      // Aplicar filtros se necessário
      let filteredInspections = [...mockInspections];
      
      if (filters.service_order_id) {
        filteredInspections = filteredInspections.filter(i => i.service_order_id === filters.service_order_id);
      }
      
      if (filters.equipment_id) {
        filteredInspections = filteredInspections.filter(i => i.equipment_id === filters.equipment_id);
      }
      
      if (filters.status) {
        filteredInspections = filteredInspections.filter(i => i.status === filters.status);
      }
      
      return filteredInspections;
    } catch (error) {
      throw new Error('Erro ao buscar inspeções');
    }
  },
  
  // Obter inspeção por ID
  getById: async (id: number): Promise<Inspection> => {
    try {
      // Para demonstração, simulamos a busca
      // Em produção, isso seria: const response = await api.get(`/inspections/${id}`);
      
      const mockInspections: Inspection[] = [
        {
          id: 1,
          service_order_id: 1,
          equipment_id: 1,
          equipment_name: 'Vaso de Pressão VP-001',
          inspector_id: 1,
          inspector_name: 'Administrador',
          status: 'completed',
          inspection_date: '2025-06-10',
          general_condition: 'Bom',
          observations: 'Equipamento em boas condições gerais',
          conclusion: 'Aprovado para operação',
          photos: [
            { id: 1, url: '/assets/images/mock-photo-1.jpg', caption: 'Vista geral do equipamento' },
            { id: 2, url: '/assets/images/mock-photo-2.jpg', caption: 'Detalhe da válvula de segurança' }
          ]
        },
        {
          id: 2,
          service_order_id: 1,
          equipment_id: 2,
          equipment_name: 'Caldeira CAL-002',
          inspector_id: 1,
          inspector_name: 'Administrador',
          status: 'in_progress',
          inspection_date: '2025-06-10',
          general_condition: '',
          observations: 'Inspeção em andamento',
          conclusion: '',
          photos: []
        },
        {
          id: 3,
          service_order_id: 2,
          equipment_id: 3,
          equipment_name: 'Tubulação TUB-003',
          inspector_id: 1,
          inspector_name: 'Administrador',
          status: 'completed',
          inspection_date: '2025-06-05',
          general_condition: 'Regular',
          observations: 'Identificados pontos de corrosão',
          conclusion: 'Aprovado com restrições',
          photos: [
            { id: 3, url: '/assets/images/mock-photo-3.jpg', caption: 'Ponto de corrosão identificado' }
          ]
        }
      ];
      
      const inspection = mockInspections.find(i => i.id === id);
      
      if (!inspection) {
        throw new Error('Inspeção não encontrada');
      }
      
      return inspection;
    } catch (error) {
      throw new Error('Erro ao buscar inspeção');
    }
  },
  
  // Criar nova inspeção
  create: async (inspectionData: Omit<Inspection, 'id' | 'inspector_id' | 'inspector_name' | 'status' | 'inspection_date' | 'photos'>): Promise<Inspection> => {
    try {
      // Para demonstração, simulamos a criação
      // Em produção, isso seria: const response = await api.post('/inspections', inspectionData);
      
      const newInspection: Inspection = {
        id: Date.now(), // Simulando um ID único
        inspector_id: 1, // Usuário atual
        inspector_name: 'Administrador',
        status: 'in_progress',
        inspection_date: new Date().toISOString().split('T')[0],
        photos: [],
        ...inspectionData
      };
      
      return newInspection;
    } catch (error) {
      throw new Error('Erro ao criar inspeção');
    }
  },
  
  // Atualizar inspeção existente
  update: async (id: number, inspectionData: Partial<Inspection>): Promise<Inspection> => {
    try {
      // Para demonstração, simulamos a atualização
      // Em produção, isso seria: const response = await api.put(`/inspections/${id}`, inspectionData);
      
      const updatedInspection: Inspection = {
        id,
        service_order_id: 0,
        equipment_id: 0,
        equipment_name: '',
        inspector_id: 0,
        inspector_name: '',
        status: 'in_progress',
        inspection_date: '',
        general_condition: '',
        observations: '',
        conclusion: '',
        photos: [],
        ...inspectionData
      };
      
      return updatedInspection;
    } catch (error) {
      throw new Error('Erro ao atualizar inspeção');
    }
  },
  
  // Finalizar inspeção
  complete: async (id: number, finalData: {general_condition: string, observations: string, conclusion: string}): Promise<Inspection> => {
    try {
      // Para demonstração, simulamos a finalização
      // Em produção, isso seria: const response = await api.put(`/inspections/${id}/complete`, finalData);
      
      const completedInspection: Inspection = {
        id,
        service_order_id: 0,
        equipment_id: 0,
        equipment_name: '',
        inspector_id: 0,
        inspector_name: '',
        status: 'completed',
        inspection_date: '',
        photos: [],
        ...finalData
        // Nota: os campos general_condition, observations e conclusion 
        // serão preenchidos pelo spread de finalData
      };
      
      return completedInspection;
    } catch (error) {
      throw new Error('Erro ao finalizar inspeção');
    }
  },
  
  // Upload de foto
  uploadPhoto: async (_inspectionId: number, photoFile: File, caption: string): Promise<InspectionPhoto> => {
    try {
      // Para demonstração, simulamos o upload
      // Em produção, isso seria:
      // const formData = new FormData();
      // formData.append('photo', photoFile);
      // formData.append('caption', caption);
      // const response = await api.post(`/inspections/${inspectionId}/photos`, formData);
      
      const newPhoto: InspectionPhoto = {
        id: Date.now(),
        url: URL.createObjectURL(photoFile), // Cria URL temporária para visualização
        caption: caption
      };
      
      return newPhoto;
    } catch (error) {
      throw new Error('Erro ao fazer upload de foto');
    }
  },
  
  // Excluir foto
  deletePhoto: async (_inspectionId: number, _photoId: number): Promise<{success: boolean}> => {
    try {
      // Para demonstração, simulamos a exclusão
      // Em produção, isso seria: await api.delete(`/inspections/${_inspectionId}/photos/${_photoId}`);
      
      return { success: true };
    } catch (error) {
      throw new Error('Erro ao excluir foto');
    }
  },
  
  // Gerar relatório
  generateReport: async (_inspectionId: number): Promise<Report> => {
    try {
      // Para demonstração, simulamos a geração do relatório
      // Em produção, isso seria: const response = await api.get(`/inspections/${_inspectionId}/report`);
      
      // Simular um atraso para mostrar o processo de geração
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        url: '/assets/reports/mock-report.docx',
        filename: 'relatorio-inspecao.docx'
      };
    } catch (error) {
      throw new Error('Erro ao gerar relatório');
    }
  }
};

// Serviço de sincronização
export const syncService = {
  // Verificar status da sincronização
  getStatus: async (): Promise<SyncStatus> => {
    try {
      // Para demonstração, retornamos dados simulados
      // Em produção, isso seria: const response = await api.get('/sync/status');
      
      return {
        last_sync: '2025-06-03 15:30:45',
        pending_items: 0,
        sync_in_progress: false
      };
    } catch (error) {
      throw new Error('Erro ao verificar status da sincronização');
    }
  },
  
  // Iniciar sincronização manual
  startSync: async (): Promise<{success: boolean, message: string, sync_time: string}> => {
    try {
      // Para demonstração, simulamos o início da sincronização
      // Em produção, isso seria: const response = await api.post('/sync/start');
      
      // Simular um atraso para mostrar o processo de sincronização
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      return {
        success: true,
        message: 'Sincronização concluída com sucesso',
        sync_time: new Date().toISOString()
      };
    } catch (error) {
      throw new Error('Erro ao iniciar sincronização');
    }
  }
};

export default api;
