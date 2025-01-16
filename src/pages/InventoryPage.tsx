import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

import { InventoryItem } from "../types";
import { inventoryAPI } from "../services/api";

import InventoryForm from "../components/InventoryForm";
import ConfirmModal from "../components/ConfirmModal";

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Create modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null);

  // Confirm delete modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await inventoryAPI.getAll();
      setItems(data);
    } catch (error) {
      toast.error("Error al cargar el inventario");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateItem = async (data: Omit<InventoryItem, "id">) => {
    try {
      await inventoryAPI.create(data);
      toast.success("Artículo creado exitosamente");
      loadItems();
    } catch (error) {
      toast.error("Error al crear el artículo");
    }
  };

  const handleEditItem = async (data: Omit<InventoryItem, "id">) => {
    if (!currentItem) return;
    try {
      await inventoryAPI.update(currentItem.id, data);
      toast.success("Artículo actualizado exitosamente");
      loadItems();
    } catch (error) {
      toast.error("Error al actualizar el artículo");
    } finally {
      setCurrentItem(null);
    }
  };

  const handleDeleteClick = (item: InventoryItem) => {
    setItemToDelete(item);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await inventoryAPI.delete(itemToDelete.id);
      toast.success("Artículo eliminado exitosamente");
      loadItems();
    } catch (error) {
      toast.error("Error al eliminar el artículo");
    } finally {
      setItemToDelete(null);
      setIsConfirmModalOpen(false);
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
          <h1 className="text-2xl font-semibold text-gray-900">Inventario</h1>
          <p className="mt-2 text-sm text-gray-700">
            Lista de artículos y suministros del conjunto residencial
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar artículo
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Nombre
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Categoría
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Cantidad
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Unidad
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Última actualización
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {item.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {item.category}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {item.unit}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {format(new Date(item.lastUpdated), "dd/MM/yyyy HH:mm")}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex justify-end space-x-2">
                          <button
                            className="text-gray-400 hover:text-gray-500"
                            onClick={() => {
                              setCurrentItem(item);
                              setIsEditModalOpen(true);
                            }}
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button
                            className="text-gray-400 hover:text-red-500"
                            onClick={() => handleDeleteClick(item)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Create Inventory Modal */}
      <InventoryForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateItem}
      />

      {/* Edit Inventory Modal */}
      {currentItem && (
        <InventoryForm
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setCurrentItem(null);
          }}
          onSubmit={handleEditItem}
          initialData={{
            name: currentItem.name,
            category: currentItem.category,
            quantity: currentItem.quantity,
            unit: currentItem.unit,
            lastUpdated: currentItem.lastUpdated,
          }}
        />
      )}

      {/* Confirm Delete Modal */}
      {itemToDelete && (
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={confirmDelete}
          title="Confirmar eliminación"
          message={`¿Estás seguro de eliminar el artículo "${itemToDelete.name}"? Esta acción no se puede deshacer.`}
        />
      )}
    </div>
  );
}
