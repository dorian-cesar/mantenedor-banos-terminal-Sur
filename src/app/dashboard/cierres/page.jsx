'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { TableSkeleton } from '@/components/skeletons';
import ExportCSVButton from "@/components/ExportCSVButton";
import { PencilSquareIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

import { cierreService } from '@/services/cierre.service';
import { helperService } from '@/services/helper.service';

import { formatFecha, formatNumber, todayChile } from '@/utils/helper';
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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2 items-center">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Aperturas y Cierres</h1>
          <button className='p-2 bg-blue-500 text-white rounded-full hover:bg-blue-800 transition flex items-center justify-center'
            onClick={() => fetchCierres()}>
            <ArrowPathIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="flex space-x-2">
          <ExportCSVButton
            filename={isHoy ? "aperturas_cierres_hoy.csv" : "aperturas_cierres.csv"}
            filters={exportFilters}
            service={cierreService}
          />
          {/* <Link
            href={"/dashboard/cierres/new"}
            className="px-4 py-2 bg-green-600 text-white text-lg font-medium rounded hover:bg-green-800 transition"
          >
            Nueva Apertura
          </Link> */}
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
      <div className="mb-4 flex flex-wrap gap-4">
        <div className="flex flex-col">
          <label htmlFor="search" className="text-sm font-medium text-gray-700">Buscar</label>
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
          <label htmlFor="id_usuario_apertura" className="text-sm font-medium text-gray-700">Usuario Apertura</label>
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
          <label htmlFor="id_usuario_cierre" className="text-sm font-medium text-gray-700">Usuario Cierre</label>
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
          <label htmlFor="numero_caja" className="text-sm font-medium text-gray-700">Caja</label>
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

        <div className="flex flex-col">
          <label htmlFor="estado" className="text-sm font-medium text-gray-700">Estado</label>
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
          <label htmlFor="fecha_inicio" className="text-sm font-medium text-gray-700">Apertura</label>
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
          <label htmlFor="fecha_fin" className="text-sm font-medium text-gray-700">Cierre</label>
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

      {loading && <TableSkeleton rows={10} cols={10} />}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Caja</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Usuario Apertura</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Fecha</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Hora Apertura</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Hora Cierre</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Monto Inicial</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Total Efectivo</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Total Tarjeta</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Total Venta</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Total General</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Estado</th>
              {/* <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Acciones</th> */}
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
                <tr key={c.id} className="hover:bg-gray-200">
                  <td className="px-4 py-2">{c.id}</td>
                  <td className="px-4 py-2">{c.nombre_caja}</td>

                  {/* Usuario Apertura */}
                  <td className="px-4 py-2">
                    <span className="font-semibold text-gray-800">
                      {c.nombre_usuario_apertura || "-"}
                    </span>
                  </td>

                  {/* Fecha Apertura */}
                  <td className="px-4 py-2">
                    {c.fecha_apertura ? formatFecha(c.fecha_apertura) : "-"}
                  </td>

                  {/* Hora Apertura */}
                  <td className="px-4 py-2">
                    {c.hora_apertura || "-"}
                  </td>

                  {/* Hora Cierre */}
                  <td className="px-4 py-2">
                    {c.hora_cierre || "-"}
                  </td>

                  <td className="px-4 py-2">{`$${formatNumber(c.monto_inicial)}`}</td>
                  <td className="px-4 py-2">{`$${formatNumber(Number(c.total_efectivo_mov ?? c.total_efectivo ?? 0))}`}</td>
                  <td className="px-4 py-2">{`$${formatNumber(Number(c.total_tarjeta_mov ?? c.total_tarjeta ?? 0))}`}</td>
                  <td className="px-4 py-2">{`$${formatNumber(Number(c.total_general_mov ?? c.total_general ?? 0))}`}</td>
                  <td className="px-4 py-2">
                    {`$${formatNumber(
                      (Number(c.total_general_mov ?? c.total_general ?? 0) || 0) + (Number(c.monto_inicial) || 0)
                    )}`}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-white text-xs font-semibold
                          ${c.estado === 'abierta' ? 'bg-blue-500' : 'bg-red-500'}`}
                    >
                      {c.estado}
                    </span>
                  </td>
                  {/* Acciones (mantener comentado) */}
                  {/* <td className="px-4 py-2 space-x-2 flex">
                      <Link href={`/dashboard/cierres/${c.id}`} className="h-7 w-7 bg-blue-500 text-white rounded hover:bg-blue-800 transition flex items-center justify-center">
                        <PencilSquareIcon className="h-5 w-5 inline" />
                      </Link>
                      <button onClick={() => handleDelete(c.id)} className="h-7 w-7 bg-red-500 text-white rounded hover:bg-red-800 transition flex items-center justify-center">
                        <TrashIcon className="h-5 w-5 inline" />
                      </button>
                    </td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Paginación */}
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
    </div>
  );
}
