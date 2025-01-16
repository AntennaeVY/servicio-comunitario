import React, { useState, useEffect } from "react";
import { Reservation, Resource, User } from "../types";
import Modal from "./Modal";
import { resourceAPI, userAPI } from "../services/api";

interface ReservationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Reservation, "id">) => Promise<void>;
  initialData?: Omit<Reservation, "id">; // Optional for editing
}

export default function ReservationForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: ReservationFormProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    resourceId: "",
    userId: "",
    date: "",
    startTime: "",
    endTime: "",
    status: "pending" as Reservation["status"],
  });

  // Load resources and users only when modal opens
  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  // Populate form if editing, or reset if creating new
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        resourceId: "",
        userId: "",
        date: "",
        startTime: "",
        endTime: "",
        status: "pending",
      });
    }
  }, [initialData, isOpen]);

  const loadData = async () => {
    try {
      const [resourcesData, usersData] = await Promise.all([
        resourceAPI.getAll(),
        userAPI.getAll(),
      ]);
      setResources(resourcesData);
      setUsers(usersData);
    } catch (error) {
      console.error("Error loading resources or users:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Editar reserva" : "Nueva reserva"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Resource */}
        <div>
          <label
            htmlFor="resourceId"
            className="block text-sm font-medium text-gray-700"
          >
            Recurso
          </label>
          <select
            id="resourceId"
            value={formData.resourceId}
            onChange={(e) =>
              setFormData({ ...formData, resourceId: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          >
            <option value="">Seleccionar recurso</option>
            {resources.map((resource) => (
              <option key={resource.id} value={resource.id}>
                {resource.name}
              </option>
            ))}
          </select>
        </div>

        {/* User */}
        <div>
          <label
            htmlFor="userId"
            className="block text-sm font-medium text-gray-700"
          >
            Usuario
          </label>
          <select
            id="userId"
            value={formData.userId}
            onChange={(e) =>
              setFormData({ ...formData, userId: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          >
            <option value="">Seleccionar usuario</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} - {user.apartment}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Fecha
          </label>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        {/* Start and End Times */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="startTime"
              className="block text-sm font-medium text-gray-700"
            >
              Hora inicio
            </label>
            <input
              type="time"
              id="startTime"
              value={formData.startTime}
              onChange={(e) =>
                setFormData({ ...formData, startTime: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="endTime"
              className="block text-sm font-medium text-gray-700"
            >
              Hora fin
            </label>
            <input
              type="time"
              id="endTime"
              value={formData.endTime}
              onChange={(e) =>
                setFormData({ ...formData, endTime: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Estado
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as Reservation["status"],
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          >
            <option value="pending">Pendiente</option>
            <option value="approved">Aprobada</option>
            <option value="rejected">Rechazada</option>
            <option value="completed">Completada</option>
          </select>
        </div>

        {/* Action buttons */}
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="submit"
            className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
          >
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  );
}
