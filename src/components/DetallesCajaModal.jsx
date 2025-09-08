"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import {
    BanknotesIcon,
    CreditCardIcon,
    ArrowTrendingUpIcon,
    CurrencyDollarIcon,
    ClockIcon,
    UserIcon,
    InformationCircleIcon,
} from "@heroicons/react/24/outline";
import Modal from '@/components/ui/modal';
import { Info } from '@/components/ui/info';
import { Kpi } from '@/components/ui/kpi';
import { EstadoPill } from '@/components/ui/estadoPill';
import { formatFecha, toNumber, fmtCLP, fmt } from "@/utils/helper";


export default function DetallesCajaModal({ open, onClose, caja }) {
    if (!caja) return null;
    const nombreUsuario = caja?.apertura?.usuario?.nombre ?? "—";
    const emailUsuario = caja?.apertura?.usuario?.email ?? null;

    const fechaApertura = caja?.apertura?.fecha
        ? new Date(caja.apertura.fecha).toLocaleDateString("es-CL")
        : "—";
    const horaApertura = caja?.apertura?.hora ?? "—";

    const fechaCierre = caja?.cierre?.fecha
        ? new Date(caja.cierre.fecha).toLocaleDateString("es-CL")
        : "—";
    const horaCierre = caja?.cierre?.hora ?? "—";

    // Cálculos
    const efectivo = toNumber(caja.efectivo);
    const tarjeta = toNumber(caja.tarjeta);
    const ingresos = toNumber(caja.total);
    const retiros = toNumber(caja.retiros);
    const montoInicial = toNumber(caja.monto_inicial);
    const transacciones = toNumber(caja.transacciones);
    const total = ingresos + montoInicial;
    const neto = total + retiros;

    const { pctEfectivo, pctTarjeta } = useMemo(() => {
        const sum = efectivo + tarjeta;
        if (sum <= 0) return { pctEfectivo: 0, pctTarjeta: 0 };
        return {
            pctEfectivo: Math.round((efectivo / sum) * 100),
            pctTarjeta: Math.round((tarjeta / sum) * 100),
        };
    }, [efectivo, tarjeta]);

    const estadoApertura = (caja.estado_apertura || "").toLowerCase(); // abierta | cerrada
    const estadoCaja = (caja.estado_caja || "").toLowerCase(); // activa | inactiva

    const isClosed = (caja.estado_apertura || "").toLowerCase() === "cerrada";

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={
                <>
                    Detalles · {caja.nombre || `Caja ${caja.numero_caja}`}
                    <span className="ml-3 inline-flex items-center gap-3 align-middle">
                        <EstadoPill value={estadoApertura} type="apertura" />
                        <EstadoPill value={estadoCaja} type="caja" />
                    </span>
                </>
            }
        >
            <div className="space-y-5 text-sm text-gray-700">
                {/* Identificación */}
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Info label="N° Caja" value={caja.numero_caja} />
                    <Info label="Ubicación" value={fmt(caja.ubicacion)} />
                    <Info label="Estado caja" value={fmt(caja.estado_caja)} />
                    <Info label="Estado apertura" value={fmt(caja.estado_apertura)} />
                </section>

                {/* Apertura */}
                <section className="rounded-xl border bg-gray-50 px-4 py-3">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <UserIcon className="h-5 w-5" />
                        <span className="text-base font-medium">Datos de apertura</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Info label="Cajero (apertura)" value={nombreUsuario} />
                        {isClosed ? (
                            <>
                                <Info label="Fecha cierre" value={fechaCierre} />
                                <Info label="Hora cierre" value={horaCierre} />
                            </>
                        ) : (
                            <>
                                <Info label="Fecha apertura" value={fechaApertura} />
                                <Info label="Hora apertura" value={horaApertura} />
                            </>
                        )}
                    </div>
                    {emailUsuario && (
                        <div className="mt-2 text-gray-600 flex gap-1">
                            <span className="font-medium">Email: </span>
                            <p className="text-black font-semibold">
                                {emailUsuario}
                            </p>
                        </div>
                    )}
                </section>

                {/* KPIs principales */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <Kpi
                        icon={<CurrencyDollarIcon className="h-5 w-5" />}
                        label="Monto inicial"
                        value={fmtCLP(montoInicial)}
                    />
                    <Kpi
                        icon={<BanknotesIcon className="h-5 w-5" />}
                        label="Efectivo"
                        value={fmtCLP(efectivo)}
                    />
                    <Kpi
                        icon={<CreditCardIcon className="h-5 w-5" />}
                        label="Tarjeta"
                        value={fmtCLP(tarjeta)}
                    />
                    <Kpi
                        icon={<ArrowTrendingUpIcon className="h-5 w-5" />}
                        label="Total actual"
                        value={fmtCLP(total)}
                    />
                </section>

                {/* Retiros / Neto / Promedio / Transacciones */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <Kpi
                        label="Retiros"
                        value={fmtCLP(retiros)}
                        subtle={retiros === 0}
                        tone={retiros < 0 ? "warning" : "default"}
                    />
                    <Kpi
                        label="Neto (Total - Retiros)"
                        value={fmtCLP(neto)}
                    />
                    <Kpi
                        label="Transacciones"
                        value={transacciones.toLocaleString("es-CL")}
                    />
                </section>

                {/* Desglose visual Efectivo vs Tarjeta */}
                <section className="rounded-xl border p-4">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-700">Desglose de pago</div>
                        <div className="text-xs text-gray-500">
                            {pctEfectivo + pctTarjeta > 0 ? (
                                <>
                                    Efectivo: <b>{pctEfectivo}%</b> · Tarjeta: <b>{pctTarjeta}%</b>
                                </>
                            ) : (
                                "Sin ventas"
                            )}
                        </div>
                    </div>
                    <div className="mt-3 w-full h-3 rounded-full bg-gray-100 overflow-hidden flex">
                        <div
                            className="h-3 bg-emerald-500 transition-all duration-300"
                            style={{ width: `${pctEfectivo}%` }}
                            title={`Efectivo ${pctEfectivo}%`}
                        />
                        <div
                            className="h-3 bg-indigo-500 transition-all duration-300"
                            style={{ width: `${pctTarjeta}%` }}
                            title={`Tarjeta ${pctTarjeta}%`}
                        />
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                            Efectivo: {fmtCLP(efectivo)}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="inline-block h-2 w-2 rounded-full bg-indigo-500" />
                            Tarjeta: {fmtCLP(tarjeta)}
                        </div>
                    </div>
                </section>

                {/* Rango de transacciones */}
                <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Info
                        label="Primera transacción"
                        value={
                            caja.fecha_primera_transaccion
                                ? `${formatFecha(caja.fecha_primera_transaccion)} ${fmt(caja.primera_transaccion)}`
                                : "—"
                        }
                    />
                    <Info
                        label="Última transacción"
                        value={
                            caja.fecha_ultima_transaccion
                                ? `${formatFecha(caja.fecha_ultima_transaccion)} ${fmt(caja.ultima_transaccion)}`
                                : "—"
                        }
                    />

                    <Info
                        label="Estado"
                        value={
                            <span className="inline-flex items-center gap-1">
                                <ClockIcon className="h-4 w-4 text-gray-500" />
                                {(estadoApertura === "abierta" ? "Operando" : "Cerrada")}
                            </span>
                        }
                    />
                </section>

                {/* Descripción */}
                {caja.descripcion ? (
                    <section>
                        <div className="text-xs font-medium text-gray-500 mb-1">Descripción</div>
                        <p className="rounded-lg border bg-gray-50 px-3 py-2 text-gray-800">
                            {caja.descripcion}
                        </p>
                    </section>
                ) : (
                    <section className="rounded-lg border border-dashed px-3 py-2 text-xs text-gray-500 flex items-center gap-2">
                        <InformationCircleIcon className="h-4 w-4" />
                        Sin descripción
                    </section>
                )}
            </div>
        </Modal>
    );
}