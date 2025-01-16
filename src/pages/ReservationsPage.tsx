import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";

import { Reservation, Resource, User } from "../types";
import { reservationAPI, resourceAPI, userAPI } from "../services/api";

import ReservationForm from "../components/ReservationForm";
import ConfirmModal from "../components/ConfirmModal";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [resources, setResources] = useState<Record<string, Resource>>({});
  const [users, setUsers] = useState<Record<string, User>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Create modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentReservation, setCurrentReservation] =
    useState<Reservation | null>(null);

  // Confirm delete modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] =
    useState<Reservation | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  // Load initial data
  const loadData = async () => {
    try {
      const [reservationsData, resourcesData, usersData] = await Promise.all([
        reservationAPI.getAll(),
        resourceAPI.getAll(),
        userAPI.getAll(),
      ]);

      setReservations(reservationsData);
      setResources(Object.fromEntries(resourcesData.map((r) => [r.id, r])));
      setUsers(Object.fromEntries(usersData.map((u) => [u.id, u])));
    } catch (error) {
      toast.error("Error al cargar las reservas");
    } finally {
      setIsLoading(false);
    }
  };

  // Create
  const handleCreateReservation = async (data: Omit<Reservation, "id">) => {
    try {
      await reservationAPI.create(data);
      toast.success("Reserva creada exitosamente");
      loadData();
    } catch (error) {
      toast.error("Error al crear la reserva");
    }
  };

  // Edit
  const handleEditReservation = async (data: Omit<Reservation, "id">) => {
    if (!currentReservation) return;
    try {
      await reservationAPI.update(currentReservation.id, data);
      toast.success("Reserva actualizada exitosamente");
      loadData();
    } catch (error) {
      toast.error("Error al actualizar la reserva");
    } finally {
      setCurrentReservation(null);
    }
  };

  // Delete triggers the confirm modal
  const handleDeleteClick = (reservation: Reservation) => {
    setReservationToDelete(reservation);
    setIsConfirmModalOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!reservationToDelete) return;
    try {
      await reservationAPI.delete(reservationToDelete.id);
      toast.success("Reserva eliminada exitosamente");
      loadData();
    } catch (error) {
      toast.error("Error al eliminar la reserva");
    } finally {
      setReservationToDelete(null);
      setIsConfirmModalOpen(false);
    }
  };

  // Utility for status display
  const getStatusColor = (status: Reservation["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: Reservation["status"]) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "approved":
        return "Aprobada";
      case "rejected":
        return "Rechazada";
      case "completed":
        return "Completada";
      default:
        return status;
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
      {/* Header */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Reservas</h1>
          <p className="mt-2 text-sm text-gray-700">
            Lista de reservas de recursos del conjunto residencial
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva reserva
          </button>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Recurso
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Usuario
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Fecha
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Horario
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Estado
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {reservations.map((reservation) => (
                    <tr key={reservation.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {resources[reservation.resourceId]?.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {users[reservation.userId]?.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {format(new Date(reservation.date), "dd/MM/yyyy")}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {reservation.startTime} - {reservation.endTime}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            reservation.status
                          )}`}
                        >
                          {getStatusText(reservation.status)}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex justify-end space-x-2">
                          {/* EDIT button */}
                          <button
                            className="text-gray-400 hover:text-gray-500"
                            onClick={() => {
                              setCurrentReservation(reservation);
                              setIsEditModalOpen(true);
                            }}
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>

                          {/* DELETE button */}
                          <button
                            className="text-gray-400 hover:text-red-500"
                            onClick={() => handleDeleteClick(reservation)}
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

      {/* Create Reservation Modal */}
      <ReservationForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateReservation}
      />

      {/* Edit Reservation Modal */}
      {currentReservation && (
        <ReservationForm
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setCurrentReservation(null);
          }}
          onSubmit={handleEditReservation}
          initialData={{
            resourceId: currentReservation.resourceId,
            userId: currentReservation.userId,
            date: currentReservation.date,
            startTime: currentReservation.startTime,
            endTime: currentReservation.endTime,
            status: currentReservation.status,
          }}
        />
      )}

      {/* Confirm Delete Modal */}
      {reservationToDelete && (
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={confirmDelete}
          title="Confirmar eliminación"
          message={`¿Estás seguro de eliminar la reserva del recurso "${
            resources[reservationToDelete.resourceId]?.name
          }"? Esta acción no se puede deshacer.`}
        />
      )}
    </div>
  );
}
