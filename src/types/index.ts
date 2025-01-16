export interface User {
  id: string;
  name: string;
  email: string;
  role: 'resident' | 'maintenance' | 'admin';
  apartment: string;
}

export interface Resource {
  id: string;
  name: string;
  type: 'salon' | 'gym' | 'pool' | 'court';
  capacity: number;
  description: string;
  available: boolean;
  image: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  lastUpdated: string;
}

export interface Reservation {
  id: string;
  resourceId: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
}