'use client';
import { useEffect, useState } from 'react';
import { helperService } from '@/services/helper.service';
import { useNotification } from "@/contexts/NotificationContext";
import { DashboardSkeleton } from '@/components/skeletons';
import { CardResumen } from "@/components/Card";
import CajaCard from '@/components/CajaCard';
import DetallesCajaModal from '@/components/modal';
import {
  UsersIcon, ComputerDesktopIcon, WrenchScrewdriverIcon, ArrowsRightLeftIcon, ArrowPathIcon
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const [resumenCajas, setResumenCajas] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();
  const [open, setOpen] = useState(false);
  const [selectedCaja, setSelectedCaja] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [metaResp, cajasResp] = await Promise.all([
        helperService.getResumen(),
        helperService.getCajas()
      ]);
      setMeta(metaResp || {});
      setResumenCajas(cajasResp || { cajas: [], totales: { efectivo: 0, tarjeta: 0, total: 0, transacciones: 0 } });
    } catch (err) {
      showNotification({ type: "error", title: "Error", message: "No se pudo cargar el resumen", duration: 5000 });
      setResumenCajas({ cajas: [], totales: { efectivo: 0, tarjeta: 0, total: 0, transacciones: 0 } });
      setMeta({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenDetalles = (caja) => {
    setSelectedCaja(caja);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedCaja(null);
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="p-6 space-y-8">
      <div className="flex space-x-2 items-center">
        <h1 className="text-3xl font-bold text-gray-800">Resumen</h1>
        <button
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-800 transition flex items-center justify-center"
          onClick={fetchData}
        >
          <ArrowPathIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Cards de contadores */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <CardResumen titulo="Usuarios" valor={meta?.totalUsuarios ?? 0} Icon={UsersIcon} color="blue" />
        <CardResumen titulo="Movimientos" valor={meta?.totalMovimientos ?? 0} Icon={ArrowsRightLeftIcon} color="blue" />
        <CardResumen titulo="Servicios" valor={meta?.totalServicios ?? 0} Icon={WrenchScrewdriverIcon} color="blue" />
        <CardResumen titulo="Cajas" valor={meta?.totalCajas ?? 0} Icon={ComputerDesktopIcon} color="blue" />
      </div>

      {/* Totales del día */}
      <div className="bg-white rounded-2xl shadow p-5">
        <h3 className="text-xl font-semibold mb-2">Totales del día (todas las cajas)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          <Stat label="Efectivo" value={`$${Number(resumenCajas?.totales?.efectivo || 0).toLocaleString('es-CL')}`} />
          <Stat label="Tarjeta" value={`$${Number(resumenCajas?.totales?.tarjeta || 0).toLocaleString('es-CL')}`} />
          <Stat label="Total" value={`$${Number(resumenCajas?.totales?.total || 0).toLocaleString('es-CL')}`} />
          <Stat label="Retiro" value={`$${Number(resumenCajas?.totales?.retiros || 0).toLocaleString('es-CL')}`} />
          <Stat label="Transacciones" value={Number(resumenCajas?.totales?.transacciones || 0).toLocaleString('es-CL')} />
        </div>
      </div>

      {/* Tarjetas por caja */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
        {(resumenCajas?.cajas || []).map((caja) => (
          <CajaCard
            key={caja.id}
            caja={caja}
            onOpen={handleOpenDetalles}
          />
        ))}
      </div>

      {/* Modal de detalles */}
      <DetallesCajaModal open={open} onClose={handleClose} caja={selectedCaja} />
    </div>
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
