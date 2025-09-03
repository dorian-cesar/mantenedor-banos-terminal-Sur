'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { cajaService } from '@/services/caja.service';
import { TableSkeleton } from '@/components/skeletons';
import ExportCSVButton from "@/components/ExportCSVButton";
import { PencilSquareIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2 items-center">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Cajas</h1>
          <button className='p-2 bg-blue-500 text-white rounded-full hover:bg-blue-800 transition flex items-center justify-center'
          onClick={() => fetchCajas()}>
            <ArrowPathIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="flex space-x-2">
          <ExportCSVButton
            filename="cajas.csv"
            filters={{ search }}
            service={cajaService}
          />
          <Link href="/dashboard/cajas/new" className="px-4 py-2 bg-green-600 text-white text-lg font-medium rounded-lg hover:bg-green-800 transition">
            Nueva Caja
          </Link>
        </div>

      </div>

      <input type="text" placeholder="Buscar por numero o nombre..." value={search} onChange={(e) => setSearch(e.target.value)} className="mb-4 w-full max-w-sm rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />

      {loading && <TableSkeleton rows={3} cols={6} />}

      {!loading && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {/* <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th> */}
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Número</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nombre</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Ubicación</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Estado</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Estado Apertura</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {cajas.map((caja) => (
                <tr key={caja.id} className="hover:bg-gray-200">
                  {/* <td className="px-4 py-2">{caja.id}</td> */}
                  <td className="px-4 py-2">{caja.numero_caja}</td>
                  <td className="px-4 py-2">{caja.nombre}</td>
                  <td className="px-4 py-2">{caja.ubicacion}</td>

                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-white text-xs font-semibold
                        ${caja.estado_caja === 'activa' ? 'bg-green-500' : 'bg-gray-400'}`}
                    >
                      {caja.estado_caja}
                    </span>
                  </td>

                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-white text-xs font-semibold
                        ${caja.estado_apertura === 'abierta' ? 'bg-blue-500' : 'bg-red-500'}`}
                    >
                      {caja.estado_apertura}
                    </span>
                  </td>

                  <td className="px-4 py-2 space-x-2 flex">
                    <Link
                      href={`/dashboard/cajas/${caja.id}`}
                      className="h-7 w-7 bg-blue-500 text-white rounded hover:bg-blue-800 transition flex items-center justify-center"
                    >
                      <PencilSquareIcon className="h-5 w-5 inline" />
                    </Link>
                    <button
                      onClick={() => handleDelete(caja.id)}
                      className="h-7 w-7 bg-red-500 text-white rounded hover:bg-red-800 transition flex items-center justify-center"
                    >
                      <TrashIcon className="h-5 w-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

          <div className="mt-4 flex items-center justify-center space-x-4">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-400 disabled:opacity-50"
            >
              Anterior
            </button>
            <span>
              Página {page} de {Math.ceil(total / pageSize)}
            </span>
            <button
              disabled={page * pageSize >= total}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-400 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
