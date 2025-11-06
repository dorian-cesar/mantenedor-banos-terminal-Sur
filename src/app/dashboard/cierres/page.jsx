'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { TableSkeleton } from '@/components/skeletons';
import ExportCSVButton from "@/components/ExportCSVButton";
import { PencilSquareIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

import { cierreService } from '@/services/cierre.service';
import { helperService } from '@/services/helper.service';

import { formatFecha, formatNumber, todayChile } from '@/utils/helper';
import { getCurrentUser } from '@/utils/session';
import { useNotification } from "@/contexts/NotificationContext";

const TABS = { HOY: 'hoy', HISTORICO: 'historico' };

export default function CierresPage() {
  const [activeTab, setActiveTab] = useState(TABS.HOY);
  const isHoy = activeTab === TABS.HOY;
  const [filtersReady, setFiltersReady] = useState(false);

  const [cierres, setCierres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);

  const [isSuperUser, setIsSuperUser] = useState(() => {
    const u = getCurrentUser();
    return u?.id === 1;
  });


  const [metadata, setMetadata] = useState({ usuarios: [], cajas: [], mediosPago: [] });
  const [filtros, setFiltros] = useState({
    id_usuario_apertura: '',
    id_usuario_cierre: '',
    numero_caja: '',
    estado: '',
    fecha_inicio: '',
    fecha_fin: ''
  });
  const { showNotification } = useNotification();

  useEffect(() => {
    setPage(1);
    if (isHoy) {
      const hoy = todayChile();
      setFiltros(prev => ({ ...prev, fecha_inicio: hoy, fecha_fin: hoy }));
    } else {
      setFiltros(prev => ({ ...prev, fecha_inicio: '', fecha_fin: '' }));
    }
    setFiltersReady(true);
  }, [isHoy]);

  const fetchCierres = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await cierreService.list({ page, pageSize, search, ...filtros });
      setCierres(res.data);
      setTotal(res.total);
    } catch (err) {
      setError(err.message || 'Error al cargar registros');
      showNotification({
        type: "error",
        title: "Error",
        message: 'No se pudieron cargar los registros',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const res = await helperService.getMetadata();
        setMetadata(res);
      } catch {
        console.warn('Error al cargar metadata de filtros');
        showNotification({
          type: "error",
          title: "Error",
          message: 'No se pudieron cargar los filtros',
          duration: 5000
        });
      }
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    if (!filtersReady) return;
    fetchCierres();
  }, [page, search, filtros]);

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este registro? Esta acción no se puede deshacer.')) {
      showNotification({
        type: "info",
        title: "Cancelado",
        message: "La eliminación fue cancelada",
        duration: 5000
      });
      return;
    }
    try {
      await cierreService.delete(id);
      fetchCierres();
      showNotification({
        type: "success",
        title: "Registro eliminado",
        message: "El registro se ha eliminado correctamente",
        duration: 5000
      });
    } catch (err) {
      alert(err.message || 'Error al eliminar registro');
      showNotification({
        type: "error",
        title: "Error al eliminar",
        message: err.message || 'Error al eliminar registro',
        duration: 5000
      });
    }
  };

  const handleFiltroChange = (e) => setFiltros({ ...filtros, [e.target.name]: e.target.value });
  const exportFilters = useMemo(() => ({ search, ...filtros }), [search, filtros]);

  // Paginación
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const disableNext = page >= pageCount;

  return (
    <div className="">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gestión de Aperturas y Cierres</h1>
          <button
            type="button"
            aria-label="Actualizar registros"
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-800 transition inline-flex items-center justify-center"
            onClick={() => fetchCierres()}
          >
            <ArrowPathIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex gap-2">
            <ExportCSVButton
              filename={isHoy ? "aperturas_cierres_hoy.csv" : "aperturas_cierres.csv"}
              filters={exportFilters}
              service={cierreService}
            />
            {/* <Link
              href={"/dashboard/cierres/new"}
              className="px-4 py-2 bg-green-600 text-white text-sm sm:text-lg font-medium rounded-lg hover:bg-green-800 transition inline-flex items-center justify-center"
            >
              Nueva Apertura
            </Link> */}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 border-b border-gray-200">
        <nav className="flex -mb-px space-x-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab(TABS.HOY)}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 text-sm font-medium ${isHoy
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Hoy ({todayChile()})
          </button>
          <button
            onClick={() => setActiveTab(TABS.HISTORICO)}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 text-sm font-medium ${!isHoy
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Histórico (todos los filtros)
          </button>
        </nav>
      </div>

      {/* Filtros */}
      <div className="mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="flex flex-col">
            <label htmlFor="search" className="text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <input
              id="search"
              type="text"
              placeholder="Buscar por usuario o caja..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="id_usuario_apertura" className="text-sm font-medium text-gray-700 mb-1">Usuario Apertura</label>
            <select
              id="id_usuario_apertura"
              name="id_usuario_apertura"
              value={filtros.id_usuario_apertura}
              onChange={handleFiltroChange}
              className="px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">Todos</option>
              {metadata.usuarios.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="id_usuario_cierre" className="text-sm font-medium text-gray-700 mb-1">Usuario Cierre</label>
            <select
              id="id_usuario_cierre"
              name="id_usuario_cierre"
              value={filtros.id_usuario_cierre}
              onChange={handleFiltroChange}
              className="px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">Todos</option>
              {metadata.usuarios.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="numero_caja" className="text-sm font-medium text-gray-700 mb-1">Caja</label>
            <select
              id="numero_caja"
              name="numero_caja"
              value={filtros.numero_caja}
              onChange={handleFiltroChange}
              className="px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">Todas</option>
              {metadata.cajas.map(c => <option key={c.numero_caja} value={c.numero_caja}>{c.nombre}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label htmlFor="estado" className="text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              id="estado"
              name="estado"
              value={filtros.estado}
              onChange={handleFiltroChange}
              className="px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">Todos</option>
              <option value="abierta">Abierta</option>
              <option value="cerrada">Cerrada</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="fecha_inicio" className="text-sm font-medium text-gray-700 mb-1">Apertura</label>
            <input
              id="fecha_inicio"
              type="date"
              name="fecha_inicio"
              value={filtros.fecha_inicio}
              onChange={handleFiltroChange}
              disabled={isHoy}
              className={`px-3 py-2 border rounded ${isHoy ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'border-gray-300'}`}
              title={isHoy ? 'Fijado a hoy en la pestaña "Hoy"' : ''}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="fecha_fin" className="text-sm font-medium text-gray-700 mb-1">Cierre</label>
            <input
              id="fecha_fin"
              type="date"
              name="fecha_fin"
              value={filtros.fecha_fin}
              onChange={handleFiltroChange}
              disabled={isHoy}
              className={`px-3 py-2 border rounded ${isHoy ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'border-gray-300'}`}
              title={isHoy ? 'Fijado a hoy en la pestaña "Hoy"' : ''}
            />
          </div>
        </div>
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
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Caja</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Usuario Apertura</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Fecha Apertura</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Hora Apertura</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Fecha Cierre</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Hora Cierre</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Monto Inicial</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Total Efectivo</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Total Tarjeta</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Total Venta</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Total General</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Estado</th>
                  {isSuperUser && (<th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Acciones</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {cierres.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="px-4 py-8 text-center text-gray-500">
                      {isHoy ? 'No hay registros para hoy.' : 'No se encontraron registros.'}
                    </td>
                  </tr>
                ) : (
                  cierres.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{c.id}</td>
                      <td className="px-4 py-3">{c.nombre_caja}</td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-gray-800">
                          {c.nombre_usuario_apertura || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {c.fecha_apertura ? formatFecha(c.fecha_apertura) : "-"}
                      </td>
                      <td className="px-4 py-3">
                        {c.hora_apertura || "-"}
                      </td>
                      <td className="px-4 py-3">
                        {c.fecha_cierre ? formatFecha(c.fecha_cierre) : "-"}
                      </td>
                      <td className="px-4 py-3">
                        {c.hora_cierre || "-"}
                      </td>
                      <td className="px-4 py-3">{`$${formatNumber(c.monto_inicial)}`}</td>
                      <td className="px-4 py-3">{`$${formatNumber(Number(c.total_efectivo_mov ?? c.total_efectivo ?? 0))}`}</td>
                      <td className="px-4 py-3">{`$${formatNumber(Number(c.total_tarjeta_mov ?? c.total_tarjeta ?? 0))}`}</td>
                      <td className="px-4 py-3">{`$${formatNumber(Number(c.total_general_mov ?? c.total_general ?? 0))}`}</td>
                      <td className="px-4 py-3">
                        {`$${formatNumber(
                          (Number(c.total_general_mov ?? c.total_general ?? 0) || 0) + (Number(c.monto_inicial) || 0)
                        )}`}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-white text-xs font-semibold
                            ${c.estado === 'abierta' ? 'bg-blue-500' : 'bg-red-500'}`}
                        >
                          {c.estado}
                        </span>
                      </td>
                      {isSuperUser && (
                        <td className="px-4 py-3 space-x-2 flex">
                          <Link
                            href={`/dashboard/cierres/${c.id}`}
                            className="h-8 w-8 bg-blue-500 text-white rounded hover:bg-blue-800 transition flex items-center justify-center"
                            aria-label={`Editar apertura ${c.id}`}
                          >
                            <PencilSquareIcon className="h-5 w-5" />
                          </Link>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARD LIST - visible on small screens */}
          <div className="block md:hidden space-y-3">
            {cierres.length === 0 ? (
              <div className="text-center text-gray-500 py-6">
                {isHoy ? 'No hay registros para hoy.' : 'No se encontraron registros.'}
              </div>
            ) : (
              cierres.map(c => (
                <div
                  key={c.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-800">
                      #{c.id} - {c.nombre_caja}
                    </h3>
                    <div className='flex items-center gap-4'>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${c.estado === 'abierta'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {c.estado}
                      </span>
                      {isSuperUser && (
                        <Link
                          href={`/dashboard/cierres/${c.id}`}
                          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-800 transition flex items-center justify-center"
                          aria-label={`Editar apertura ${c.id}`}
                        >
                          <PencilSquareIcon className="h-6 w-6" />
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Usuario Apertura:</span>
                      <span className="font-medium text-right">{c.nombre_usuario_apertura || "-"}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-xs text-gray-500">Apertura:</span>
                        <div className="font-medium">
                          {c.fecha_apertura ? formatFecha(c.fecha_apertura) : "-"}
                        </div>
                        <div className="text-xs text-gray-500">{c.hora_apertura || ""}</div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Cierre:</span>
                        <div className="font-medium">
                          {c.fecha_cierre ? formatFecha(c.fecha_cierre) : "-"}
                        </div>
                        <div className="text-xs text-gray-500">{c.hora_cierre || ""}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                      <div>
                        <span className="text-xs text-gray-500">Monto Inicial:</span>
                        <div className="font-medium">${formatNumber(c.monto_inicial)}</div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Total Venta:</span>
                        <div className="font-medium">${formatNumber(Number(c.total_general_mov ?? c.total_general ?? 0))}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-xs text-gray-500">Efectivo:</span>
                        <div className="font-medium">${formatNumber(Number(c.total_efectivo_mov ?? c.total_efectivo ?? 0))}</div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Tarjeta:</span>
                        <div className="font-medium">${formatNumber(Number(c.total_tarjeta_mov ?? c.total_tarjeta ?? 0))}</div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-800">Total General:</span>
                        <span className="text-lg font-bold text-green-600">
                          ${formatNumber(
                            (Number(c.total_general_mov ?? c.total_general ?? 0) || 0) + (Number(c.monto_inicial) || 0)
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
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