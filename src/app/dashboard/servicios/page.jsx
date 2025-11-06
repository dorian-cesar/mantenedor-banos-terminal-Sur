'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { serviceService } from '@/services/service.service';
import { TableSkeleton } from '@/components/skeletons';
import ExportCSVButton from "@/components/ExportCSVButton";
import { PencilSquareIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { formatNumber } from '@/utils/helper';
import { getCurrentUser } from "@/utils/session";
import { useNotification } from "@/contexts/NotificationContext";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const { showNotification } = useNotification();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSupervisor, setIsSupervisor] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await serviceService.list({ page, pageSize, search });
      setServices(res.data);
      setTotal(res.total);
    } catch (err) {
      setError(err.message || 'Error al cargar los servicios');
      showNotification({
        type: "error",
        title: "Error",
        message: 'No se pudieron cargar los servicios',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [page, search]);

  useEffect(() => {
    const u = getCurrentUser();
    const role = u?.role?.toLowerCase() ?? '';
    setIsAdmin(role === 'admin');
    setIsSupervisor(role === 'tesorero' || role === 'admin');
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este servicio? Esta acción no se puede deshacer.')) {
      showNotification({
        type: "info",
        title: "Cancelado",
        message: "La eliminación fue cancelada",
        duration: 5000
      });
      return;
    }

    try {
      await serviceService.delete(id);
      fetchServices();
      showNotification({
        type: "success",
        title: "Servicio eliminado",
        message: "El servicio se ha eliminado correctamente",
        duration: 5000
      });

    } catch (err) {
      setError(err.message || 'Error al eliminar servicio');
      showNotification({
        type: "error",
        title: "Error al eliminar",
        message: err.message || 'Error al eliminar servicio',
        duration: 5000
      });
    }
  };

  // Paginación
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const disableNext = page >= pageCount;

  return (
    <div className="">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gestión de Servicios</h1>
          <button
            type="button"
            aria-label="Actualizar servicios"
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-800 transition inline-flex items-center justify-center"
            onClick={() => fetchServices()}
          >
            <ArrowPathIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex gap-2">
            <ExportCSVButton
              filename="servicios.csv"
              filters={{ search }}
              service={serviceService}
            />
            {isAdmin && (
              <Link
                href="/dashboard/servicios/new"
                className="px-4 py-2 bg-green-600 text-white text-sm sm:text-lg font-medium rounded-lg hover:bg-green-800 transition inline-flex items-center justify-center"
              >
                Nuevo Servicio
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre o tipo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {loading && (
        <p>Cargando...</p>
      )}

      {!loading && (
        <>
          {/* TABLE VIEW - visible md+ */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nombre</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Tipo</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Precio</th>
                  {isSupervisor && (
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Acciones</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {services.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{s.nombre}</td>
                    <td className="px-4 py-3 capitalize">{s.tipo.toLowerCase()}</td>
                    <td className="px-4 py-3">${formatNumber(s.precio)}</td>
                    {isSupervisor && (
                      <td className="px-4 py-3 space-x-2 flex">
                        <Link
                          href={`/dashboard/servicios/${s.id}`}
                          className="h-8 w-8 bg-blue-500 text-white rounded hover:bg-blue-800 transition flex items-center justify-center"
                          aria-label={`Editar servicio ${s.nombre}`}
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                        </Link>
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => handleDelete(s.id)}
                            className="h-8 w-8 bg-red-500 text-white rounded hover:bg-red-800 transition flex items-center justify-center"
                            aria-label={`Eliminar servicio ${s.nombre}`}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARD LIST - visible on small screens */}
          <div className="block md:hidden space-y-3">
            {services.length === 0 ? (
              <div className="text-center text-gray-500 py-6">No hay servicios para mostrar</div>
            ) : (
              services.map((s) => (
                <div
                  key={s.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex items-start justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-800 truncate">
                        {s.nombre}
                      </h3>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${s.estado?.toLowerCase() === 'activo'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                          }`}
                      >
                        {s.tipo.toLowerCase()}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 truncate">
                      Precio: ${formatNumber(s.precio)}
                    </p>
                    <p className="mt-2 text-xs text-gray-600 capitalize">
                      Tipo: {s.tipo.toLowerCase()}
                    </p>
                  </div>

                  {isSupervisor && (
                    <div className="ml-3 flex-shrink-0 flex flex-col items-center gap-2">
                      <Link
                        href={`/dashboard/servicios/${s.id}`}
                        className="h-9 w-9 bg-blue-500 text-white rounded-md hover:bg-blue-800 transition flex items-center justify-center"
                        aria-label={`Editar servicio ${s.nombre}`}
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </Link>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => handleDelete(s.id)}
                          className="h-9 w-9 bg-red-500 text-white rounded-md hover:bg-red-800 transition flex items-center justify-center"
                          aria-label={`Eliminar servicio ${s.nombre}`}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Paginación */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition"
              >
                Anterior
              </button>
              <span className="text-gray-700">
                Página {page} de {pageCount}
              </span>
              <button
                type="button"
                disabled={disableNext}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition"
              >
                Siguiente
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}