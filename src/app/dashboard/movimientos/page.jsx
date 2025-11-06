'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { TableSkeleton } from '@/components/skeletons';
import { PencilSquareIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { movimientoService } from '@/services/movimiento.service';
import ExportCSVButton from "@/components/ExportCSVButton";
import { helperService } from '@/services/helper.service';
import { formatFecha, formatNumber, todayChile } from '@/utils/helper';
import { useNotification } from "@/contexts/NotificationContext";
import { getCurrentUser } from "@/utils/session";

const TABS = { HOY: 'hoy', HISTORICO: 'historico' };

export default function MovimientosPage() {
  const [activeTab, setActiveTab] = useState(TABS.HOY);
  const isHoy = activeTab === TABS.HOY;
  const [filtersReady, setFiltersReady] = useState(false);

  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const { showNotification } = useNotification();

  const [canEdit, setCanEdit] = useState(false);

  const [metadata, setMetadata] = useState({
    usuarios: [],
    servicios: [],
    cajas: [],
    mediosPago: []
  });

  const [filtros, setFiltros] = useState({
    id_usuario: '',
    numero_caja: '',
    id_servicio: '',
    medio_pago: '',
    fecha_inicio: '',
    fecha_fin: '',
    id_aperturas_cierres: ''
  });

  useEffect(() => {
    const u = getCurrentUser();
    setCanEdit(!!u && Number(u.id) === 1);
  }, []);

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

  const fetchMovimientos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await movimientoService.list({
        page,
        pageSize,
        search,
        ...filtros
      });
      setMovimientos(res.data);
      setTotal(res.total);
    } catch (err) {
      setError(err.message || 'Error al cargar movimientos');
      showNotification({
        type: "error",
        title: "Error",
        message: 'No se pudieron cargar los movimientos',
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
    fetchMovimientos();
  }, [page, search, filtros]);

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este movimiento? Esta acción no se puede deshacer.')) {
      showNotification({
        type: "info",
        title: "Cancelado",
        message: "La eliminación fue cancelada",
        duration: 5000
      });
      return;
    }
    try {
      await movimientoService.delete(id);
      fetchMovimientos();
      showNotification({
        type: "success",
        title: "Movimiento eliminado",
        message: "El movimiento se ha eliminado correctamente",
        duration: 5000
      });
    } catch (err) {
      setError(err.message || 'Error al eliminar movimiento');
      showNotification({
        type: "error",
        title: "Error al eliminar",
        message: err.message || 'Error al eliminar movimiento',
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gestión de Movimientos</h1>
          <button
            type="button"
            aria-label="Actualizar movimientos"
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-800 transition inline-flex items-center justify-center"
            onClick={() => fetchMovimientos()}
          >
            <ArrowPathIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex gap-2">
            <ExportCSVButton
              filename={isHoy ? "movimientos_hoy.csv" : "movimientos.csv"}
              filters={exportFilters}
              service={movimientoService}
            />
            {/* {canEdit && (
              <Link
                href="/dashboard/movimientos/new"
                className="px-4 py-2 bg-green-600 text-white text-sm sm:text-lg font-medium rounded-lg hover:bg-green-800 transition inline-flex items-center justify-center"
              >
                Nuevo Movimiento
              </Link>
            )} */}
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
              placeholder="Buscar por código..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="id_aperturas_cierres" className="text-sm font-medium text-gray-700 mb-1">ID Apertura</label>
            <input
              id="id_aperturas_cierres"
              name="id_aperturas_cierres"
              type="number"
              min="1"
              placeholder="Filtrar por ID de apertura"
              value={filtros.id_aperturas_cierres}
              onChange={handleFiltroChange}
              className="px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="id_usuario" className="text-sm font-medium text-gray-700 mb-1">Usuario</label>
            <select
              id="id_usuario"
              name="id_usuario"
              value={filtros.id_usuario}
              onChange={handleFiltroChange}
              className="px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">Todos los usuarios</option>
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
              <option value="">Todas las cajas</option>
              {metadata.cajas.map(c => <option key={c.numero_caja} value={c.numero_caja}>{c.nombre}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label htmlFor="id_servicio" className="text-sm font-medium text-gray-700 mb-1">Servicio</label>
            <select
              id="id_servicio"
              name="id_servicio"
              value={filtros.id_servicio}
              onChange={handleFiltroChange}
              className="px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">Todos los servicios</option>
              {metadata.servicios.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="medio_pago" className="text-sm font-medium text-gray-700 mb-1">Medio de Pago</label>
            <select
              id="medio_pago"
              name="medio_pago"
              value={filtros.medio_pago}
              onChange={handleFiltroChange}
              className="px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">Todos los medios</option>
              {metadata.mediosPago.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="fecha_inicio" className="text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
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
            <label htmlFor="fecha_fin" className="text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
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
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID Apertura</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Usuario</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Servicio</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Caja</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Monto</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Medio Pago</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Fecha</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Hora</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Código</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {movimientos.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                      {isHoy ? 'No hay movimientos para hoy.' : 'No se encontraron movimientos.'}
                    </td>
                  </tr>
                ) : (
                  movimientos.map(m => (
                    <tr key={m.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{m.id}</td>
                      <td className="px-4 py-3">{m.id_aperturas_cierres}</td>
                      <td className="px-4 py-3">{m.nombre_usuario}</td>
                      <td className="px-4 py-3">{m.nombre_servicio}</td>
                      <td className="px-4 py-3">{m.nombre_caja}</td>
                      <td className="px-4 py-3">{`$${formatNumber(m.monto)}`}</td>
                      <td className="px-4 py-3">{m.medio_pago}</td>
                      <td className="px-4 py-3">{formatFecha(m.fecha)}</td>
                      <td className="px-4 py-3">{m.hora}</td>
                      <td className="px-4 py-3">{m.codigo}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARD LIST - visible on small screens */}
          <div className="block md:hidden space-y-3">
            {movimientos.length === 0 ? (
              <div className="text-center text-gray-500 py-6">
                {isHoy ? 'No hay movimientos para hoy.' : 'No se encontraron movimientos.'}
              </div>
            ) : (
              movimientos.map(m => (
                <div
                  key={m.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-800">
                      Movimiento #{m.id}
                    </h3>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                      ${formatNumber(m.monto)}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Usuario:</span>
                      <span className="font-medium">{m.nombre_usuario}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Servicio:</span>
                      <span className="font-medium">{m.nombre_servicio}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Caja:</span>
                      <span className="font-medium">{m.nombre_caja}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Medio Pago:</span>
                      <span className="font-medium">{m.medio_pago}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fecha:</span>
                      <span className="font-medium">{formatFecha(m.fecha)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hora:</span>
                      <span className="font-medium">{m.hora}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Código:</span>
                      <span className="font-medium">{m.codigo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ID Apertura:</span>
                      <span className="font-medium">{m.id_aperturas_cierres}</span>
                    </div>
                  </div>

                  {/* {canEdit && (
                    <div className="mt-3 flex justify-end gap-2">
                      <Link
                        href={`/dashboard/movimientos/${m.id}`}
                        className="h-8 w-8 bg-blue-500 text-white rounded hover:bg-blue-800 transition flex items-center justify-center"
                        aria-label={`Editar movimiento ${m.id}`}
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(m.id)}
                        className="h-8 w-8 bg-red-500 text-white rounded hover:bg-red-800 transition flex items-center justify-center"
                        aria-label={`Eliminar movimiento ${m.id}`}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )} */}
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