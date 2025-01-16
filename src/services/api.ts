import { User, Resource, InventoryItem, Reservation } from '../types';

const STORAGE_KEYS = {
  USERS: 'vista_buena_users',
  RESOURCES: 'vista_buena_resources',
  INVENTORY: 'vista_buena_inventory',
  RESERVATIONS: 'vista_buena_reservations'
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generic CRUD operations
const getItems = async <T>(key: string): Promise<T[]> => {
  await delay(300);
  const items = localStorage.getItem(key);
  return items ? JSON.parse(items) : [];
};

const saveItems = async <T>(key: string, items: T[]): Promise<void> => {
  await delay(300);
  localStorage.setItem(key, JSON.stringify(items));
};

// Users API
export const userAPI = {
  getAll: () => getItems<User>(STORAGE_KEYS.USERS),
  create: async (user: Omit<User, 'id'>) => {
    const users = await getItems<User>(STORAGE_KEYS.USERS);
    const newUser = { ...user, id: crypto.randomUUID() };
    await saveItems(STORAGE_KEYS.USERS, [...users, newUser]);
    return newUser;
  },
  update: async (id: string, updates: Partial<User>) => {
    const users = await getItems<User>(STORAGE_KEYS.USERS);
    const updatedUsers = users.map(user => 
      user.id === id ? { ...user, ...updates } : user
    );
    await saveItems(STORAGE_KEYS.USERS, updatedUsers);
  },
  delete: async (id: string) => {
    const users = await getItems<User>(STORAGE_KEYS.USERS);
    await saveItems(STORAGE_KEYS.USERS, users.filter(user => user.id !== id));
  }
};

// Resources API
export const resourceAPI = {
  getAll: () => getItems<Resource>(STORAGE_KEYS.RESOURCES),
  create: async (resource: Omit<Resource, 'id'>) => {
    const resources = await getItems<Resource>(STORAGE_KEYS.RESOURCES);
    const newResource = { ...resource, id: crypto.randomUUID() };
    await saveItems(STORAGE_KEYS.RESOURCES, [...resources, newResource]);
    return newResource;
  },
  update: async (id: string, updates: Partial<Resource>) => {
    const resources = await getItems<Resource>(STORAGE_KEYS.RESOURCES);
    const updatedResources = resources.map(resource => 
      resource.id === id ? { ...resource, ...updates } : resource
    );
    await saveItems(STORAGE_KEYS.RESOURCES, updatedResources);
  },
  delete: async (id: string) => {
    const resources = await getItems<Resource>(STORAGE_KEYS.RESOURCES);
    await saveItems(STORAGE_KEYS.RESOURCES, resources.filter(resource => resource.id !== id));
  }
};

// Inventory API
export const inventoryAPI = {
  getAll: () => getItems<InventoryItem>(STORAGE_KEYS.INVENTORY),
  create: async (item: Omit<InventoryItem, 'id'>) => {
    const items = await getItems<InventoryItem>(STORAGE_KEYS.INVENTORY);
    const newItem = { ...item, id: crypto.randomUUID() };
    await saveItems(STORAGE_KEYS.INVENTORY, [...items, newItem]);
    return newItem;
  },
  update: async (id: string, updates: Partial<InventoryItem>) => {
    const items = await getItems<InventoryItem>(STORAGE_KEYS.INVENTORY);
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    await saveItems(STORAGE_KEYS.INVENTORY, updatedItems);
  },
  delete: async (id: string) => {
    const items = await getItems<InventoryItem>(STORAGE_KEYS.INVENTORY);
    await saveItems(STORAGE_KEYS.INVENTORY, items.filter(item => item.id !== id));
  }
};

// Reservations API
export const reservationAPI = {
  getAll: () => getItems<Reservation>(STORAGE_KEYS.RESERVATIONS),
  create: async (reservation: Omit<Reservation, 'id'>) => {
    const reservations = await getItems<Reservation>(STORAGE_KEYS.RESERVATIONS);
    const newReservation = { ...reservation, id: crypto.randomUUID() };
    await saveItems(STORAGE_KEYS.RESERVATIONS, [...reservations, newReservation]);
    return newReservation;
  },
  update: async (id: string, updates: Partial<Reservation>) => {
    const reservations = await getItems<Reservation>(STORAGE_KEYS.RESERVATIONS);
    const updatedReservations = reservations.map(reservation => 
      reservation.id === id ? { ...reservation, ...updates } : reservation
    );
    await saveItems(STORAGE_KEYS.RESERVATIONS, updatedReservations);
  },
  delete: async (id: string) => {
    const reservations = await getItems<Reservation>(STORAGE_KEYS.RESERVATIONS);
    await saveItems(STORAGE_KEYS.RESERVATIONS, reservations.filter(reservation => reservation.id !== id));
  }
};