'use client';
import { useEffect, useState } from 'react';
import { helperService } from '@/services/helper.service';
import { boletaService } from '@/services/boleta.service';
import { useNotification } from "@/contexts/NotificationContext";
import { DashboardSkeleton, DashboardSkeleton1, DashboardSkeleton2 } from '@/components/skeletons';
import { CardResumen } from "@/components/Card";
import CajaCard from '@/components/CajaCard';
import DetallesCajaModal from '@/components/DetallesCajaModal';
import {
  UsersIcon, ComputerDesktopIcon, WrenchScrewdriverIcon, ArrowsRightLeftIcon, ArrowPathIcon, ArrowUturnLeftIcon, ExclamationCircleIcon, CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { getCurrentUser } from "@/utils/session";
import { formatFecha } from "@/utils/helper";

export default function DashboardPage() {
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [loadingFolios, setLoadingFolios] = useState(true);
  const [loadingCajas, setLoadingCajas] = useState(true);

  const [meta, setMeta] = useState(null);
  const [FoliosPage, setFolio] = useState(null);
  const [resumenCajas, setResumenCajas] = useState(null);

  const [open, setOpen] = useState(false);
  const [selectedCaja, setSelectedCaja] = useState(null);

  const { showNotification } = useNotification();

  const [isAllowed, setisAllowed] = useState(false);

  useEffect(() => {
    const u = getCurrentUser();
    const role = u?.role?.toLowerCase() ?? '';
    setisAllowed(role === 'admin' || role === 'tesorero');
  }, []);

  const fetchMeta = async () => {
    setLoadingMeta(true);
    try {
      const metaResp = await helperService.getResumen();
      setMeta(metaResp || {});
    } catch (err) {
      setMeta({});
      showNotification({ type: "error", title: "Error", message: "No se pudo cargar el resumen", duration: 5000 });
    } finally {
      setLoadingMeta(false);
    }
  };

  const fetchBoletas = async () => {
    setLoadingFolios(true);
    try {
      const boletaResp = await boletaService.getRestantes();
      setFolio(boletaResp || {});
    } catch (err) {
      setFolio({});
      showNotification({ type: "error", title: "Error", message: "No se pudo cargar el resumen de folios", duration: 5000 });
    } finally {
      setLoadingFolios(false);
    }
  };

  const fetchCajas = async () => {
    setLoadingCajas(true);
    try {
      const cajasResp = await helperService.getCajas();
      setResumenCajas(cajasResp || { cajas: [], totales: { efectivo: 0, tarjeta: 0, total: 0, transacciones: 0, retiros: 0 } });
    } catch (err) {
      setResumenCajas({ cajas: [], totales: { efectivo: 0, tarjeta: 0, total: 0, transacciones: 0, retiros: 0 } });
      showNotification({ type: "error", title: "Error", message: "No se pudo cargar las cajas", duration: 5000 });
    } finally {
      setLoadingCajas(false);
    }
  };

  useEffect(() => {
    fetchMeta();
    fetchCajas();
    fetchBoletas();
  }, []);

  function fetchTodo() {
    fetchMeta();
    fetchBoletas();
  }

  const handleOpenDetalles = (caja) => { setSelectedCaja(caja); setOpen(true); };
  const handleClose = () => { setOpen(false); setSelectedCaja(null); };

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold text-gray-800">Resumen General</h1>
        <button
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-800 transition"
          onClick={fetchTodo}
          title="Actualizar resumen"
        >
          <ArrowPathIcon className="h-6 w-6" />
        </button>
      </div>

      {loadingMeta ? (
        <DashboardSkeleton1 />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <CardResumen titulo="Usuarios" valor={meta?.totalUsuarios ?? 0} Icon={UsersIcon} color="blue" />
          <CardResumen titulo="Movimientos" valor={meta?.totalMovimientos ?? 0} Icon={ArrowsRightLeftIcon} color="blue" />
          <CardResumen titulo="Servicios" valor={meta?.totalServicios ?? 0} Icon={WrenchScrewdriverIcon} color="blue" />
          <CardResumen titulo="Cajas" valor={meta?.totalCajas ?? 0} Icon={ComputerDesktopIcon} color="blue" />
        </div>
      )}

      {isAllowed && (
        loadingFolios ? (
          <DashboardSkeleton1 />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <CardResumen
              titulo="Último Folio"
              valor={FoliosPage?.ultimoFolio ?? 0}
              Icon={ArrowUturnLeftIcon}
              color="yellow"
            />
            <CardResumen
              titulo="Folios Restantes"
              valor={FoliosPage?.totalFoliosRestantes ?? 0}
              Icon={ExclamationCircleIcon}
              color="yellow"
            />
            <CardResumen
              titulo="Última Obtención de Folios"
              valor={
                formatFecha(FoliosPage?.resolucionCAF?.FechaResolucion)
              }
              Icon={CalendarDaysIcon}
              color="yellow"
            />
          </div>
        )
      )}



      <div className="flex items-center gap-2">
        <h2 className="text-3xl font-bold text-gray-800">Resumen Diario</h2>
        <button
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-800 transition"
          onClick={fetchCajas}
          title="Actualizar cajas"
        >
          <ArrowPathIcon className="h-6 w-6" />
        </button>
      </div>
      {loadingCajas ? (
        <DashboardSkeleton2 />
      ) : (
        <>
          {/* Totales del día */}
          <div className="bg-white rounded-2xl shadow p-5">
            <h3 className="text-xl font-semibold mb-2">Totales del día (todas las cajas)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
              <Stat label="Efectivo" value={`$${Number(resumenCajas?.totales?.efectivo ?? 0).toLocaleString('es-CL')}`} />
              <Stat label="Tarjeta" value={`$${Number(resumenCajas?.totales?.tarjeta ?? 0).toLocaleString('es-CL')}`} />
              <Stat label="Total" value={`$${Number(resumenCajas?.totales?.total ?? 0).toLocaleString('es-CL')}`} />
              <Stat label="Retiro" value={`$${Number(resumenCajas?.totales?.retiros ?? 0).toLocaleString('es-CL')}`} />
              <Stat label="Transacciones" value={Number(resumenCajas?.totales?.transacciones ?? 0).toLocaleString('es-CL')} />
              <Stat
                label="Transacciones Baño"
                value={resumenCajas?.totales?.desglose_servicios?.find(s => s.tipo === 'BAÑO')?.cantidad ?? 0}
              />
              <Stat
                label="Transacciones Ducha"
                value={resumenCajas?.totales?.desglose_servicios?.find(s => s.tipo === 'DUCHA')?.cantidad ?? 0}
              />
            </div>
          </div>

          {/* Tarjetas por caja */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
            {(resumenCajas?.cajas || []).map((caja) => (
              <CajaCard key={caja.id ?? caja.numero_caja} caja={caja} onOpen={handleOpenDetalles} />
            ))}
          </div>
        </>
      )
      }

      {/* Modal */}
      <DetallesCajaModal open={open} onClose={handleClose} caja={selectedCaja} />
    </div >
  );
}

function Stat({ label, value }) {
  return (
    <div className="border rounded-xl p-4">
      <p className="text-lg text-gray-600">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
