// Definição de tipos para o aplicativo

// Tipo para usuário
export interface User {
  id: number;
  name: string;
  username: string;
  role: string;
}

// Tipo para cliente
export interface Client {
  id: number;
  name: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
}

// Tipo para equipamento
export interface Equipment {
  id: number;
  name: string;
  tag: string;
  type: string;
  client_id: number;
  manufacturer: string;
  serial_number: string;
  year_of_manufacture: string;
  capacity: string;
  working_pressure: string;
  temperature: string;
}

// Tipo para ordem de serviço
export interface ServiceOrder {
  id: number;
  number: string;
  client_id: number;
  client_name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
  scheduled_date: string;
  completed_date?: string;
  equipments: number[];
}

// Tipo para foto de inspeção
export interface InspectionPhoto {
  id: number;
  url: string;
  caption: string;
}

// Tipo para inspeção
export interface Inspection {
  id: number;
  service_order_id: number;
  equipment_id: number;
  equipment_name: string;
  inspector_id: number;
  inspector_name: string;
  status: 'in_progress' | 'completed';
  inspection_date: string;
  general_condition: string;
  observations: string;
  conclusion: string;
  photos: InspectionPhoto[];
}

// Tipo para relatório
export interface Report {
  url: string;
  filename: string;
}

// Tipo para status de sincronização
export interface SyncStatus {
  last_sync: string;
  pending_items: number;
  sync_in_progress: boolean;
}
