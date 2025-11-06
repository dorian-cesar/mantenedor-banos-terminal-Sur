'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { cajaService } from '@/services/caja.service';
import { TableSkeleton } from '@/components/skeletons';
import ExportCSVButton from "@/components/ExportCSVButton";
import { PencilSquareIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { getCurrentUser } from "@/utils/session";
import { useNotification } from "@/contexts/NotificationContext";

export default function CajasPage() {
  const [cajas, setCajas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const { showNotification } = useNotification();
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchCajas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await cajaService.list({ page, pageSize, search });
      setCajas(res.data);
      setTotal(res.total);
    } catch (err) {
      setError(err.message || 'Error al cargar cajas');
      showNotification({
        type: "error",
        title: "Error",
        message: 'Error al cargar cajas',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCajas();
  }, [page, search]);

  useEffect(() => {
    const u = getCurrentUser();
    const role = u?.role?.toLowerCase() ?? '';
    setIsAdmin(role === 'admin');
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta caja? Esta acción no se puede deshacer.')) {
      showNotification({
        type: "info",
        title: "Cancelado",
        message: "La eliminación fue cancelada",
        duration: 5000
      });
      return;
    }
    try {
      await cajaService.delete(id);
      fetchCajas();
      showNotification({
        type: "success",
        title: "Caja eliminada",
        message: "La caja se ha eliminado correctamente",
        duration: 5000
      });
    } catch (err) {
      alert(err.message || 'Error al eliminar la caja');
      showNotification({
        type: "error",
        title: "Error al eliminar",
        message: err.message || 'Error al eliminar caja',
        duration: 5000
      });
    }
  };

  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const disableNext = page >= pageCount;

  return (
    <div className="">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gestión de Cajas</h1>
          <button
            type="button"
            aria-label="Actualizar cajas"
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-800 transition inline-flex items-center justify-center"
            onClick={() => fetchCajas()}
            title="Actualizar"
          >
            <ArrowPathIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex gap-2">
            <ExportCSVButton filename="cajas.csv" filters={{ search }} service={cajaService} />
            {isAdmin && (
              <Link
                href="/dashboard/cajas/new"
                className="px-4 py-2 bg-green-600 text-white text-sm sm:text-lg font-medium rounded-lg hover:bg-green-800 transition inline-flex items-center justify-center"
              >
                Nueva Caja
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por número o nombre..."
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
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Número</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nombre</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Ubicación</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Estado Apertura</th>
                  {isAdmin && <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Acciones</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {cajas.map((caja) => (
                  <tr key={caja.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{caja.numero_caja}</td>
                    <td className="px-4 py-3">{caja.nombre}</td>
                    <td className="px-4 py-3">{caja.ubicacion}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-white text-xs font-semibold ${
                          caja.estado_apertura === "abierta" ? "bg-blue-500" : "bg-red-500"
                        }`}
                      >
                        {caja.estado_apertura}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3 space-x-2 flex">
                        <Link
                          href={`/dashboard/cajas/${caja.id}`}
                          className="h-8 w-8 bg-blue-500 text-white rounded hover:bg-blue-800 transition flex items-center justify-center"
                          aria-label={`Editar caja ${caja.numero_caja}`}
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(caja.id)}
                          className="h-8 w-8 bg-red-500 text-white rounded hover:bg-red-800 transition flex items-center justify-center"
                          aria-label={`Eliminar caja ${caja.numero_caja}`}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARD LIST - visible on small screens (igual que usuarios) */}
          <div className="block md:hidden space-y-3">
            {cajas.length === 0 ? (
              <div className="text-center text-gray-500 py-6">No hay cajas para mostrar</div>
            ) : (
              cajas.map((caja) => (
                <div
                  key={caja.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex items-start justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-800 truncate">
                        Caja {caja.numero_caja} - {caja.nombre}
                      </h3>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          caja.estado_apertura === 'abierta' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {caja.estado_apertura}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 truncate">{caja.ubicacion}</p>
                    <p className="mt-2 text-xs text-gray-600">
                      Número: {caja.numero_caja}
                    </p>
                  </div>

                  {isAdmin && (
                    <div className="ml-3 flex-shrink-0 flex flex-col items-center gap-2">
                      <Link
                        href={`/dashboard/cajas/${caja.id}`}
                        className="h-9 w-9 bg-blue-500 text-white rounded-md hover:bg-blue-800 transition flex items-center justify-center"
                        aria-label={`Editar caja ${caja.numero_caja}`}
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(caja.id)}
                        className="h-9 w-9 bg-red-500 text-white rounded-md hover:bg-red-800 transition flex items-center justify-center"
                        aria-label={`Eliminar caja ${caja.numero_caja}`}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
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

