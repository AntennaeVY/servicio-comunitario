import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Resource } from '../types';
import { resourceAPI } from '../services/api';
import toast from 'react-hot-toast';
import ResourceForm from '../components/ResourceForm';

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const data = await resourceAPI.getAll();
      setResources(data);
    } catch (error) {
      toast.error('Error al cargar los recursos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateResource = async (data: Omit<Resource, 'id'>) => {
    try {
      await resourceAPI.create(data);
      toast.success('Recurso creado exitosamente');
      loadResources();
    } catch (error) {
      toast.error('Error al crear el recurso');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Recursos</h1>
          <p className="mt-2 text-sm text-gray-700">
            Lista de recursos disponibles en el conjunto residencial
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar recurso
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="relative bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={resource.image}
              alt={resource.name}
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900">{resource.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{resource.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  resource.available
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {resource.available ? 'Disponible' : 'No disponible'}
                </span>
                <div className="flex space-x-2">
                  <button
                    className="p-1 text-gray-400 hover:text-gray-500"
                    onClick={() => {}}
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    className="p-1 text-gray-400 hover:text-red-500"
                    onClick={() => {}}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ResourceForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateResource}
      />
    </div>
  );
}