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

/** Helpers locales */
const toNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
};
const fmtCLP = (v) => `$${toNumber(v).toLocaleString("es-CL")}`;
const fmt = (v, fallback = "—") => (v ? v : fallback);

export default function DetallesCajaModal({ open, onClose, caja }) {
    if (!caja) return null;

    const nombreUsuario = caja?.apertura?.usuario?.nombre ?? "—";
    const emailUsuario = caja?.apertura?.usuario?.email ?? null;

    const fechaApertura = caja?.apertura?.fecha
        ? new Date(caja.apertura.fecha).toLocaleDateString("es-CL")
        : "—";
    const horaApertura = caja?.apertura?.hora ?? "—";

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
                        <Info label="Fecha apertura" value={fechaApertura} />
                        <Info label="Hora apertura" value={horaApertura} />
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
                        label="Total del día"
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
                    <div className="mt-3 w-full h-3 rounded-full bg-gray-100 overflow-hidden">
                        <div
                            className="h-3 bg-emerald-500"
                            style={{ width: `${pctEfectivo}%` }}
                            title={`Efectivo ${pctEfectivo}%`}
                        />
                        <div
                            className="h-3 bg-indigo-500 -mt-3"
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
                    <Info label="Primera transacción" value={fmt(caja.primera_transaccion)} />
                    <Info label="Última transacción" value={fmt(caja.ultima_transaccion)} />
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

/* -------------------------
   Modal interno (con Portal)
-------------------------- */
function Modal({ open, onClose, title, children }) {
    const dialogRef = useRef(null);
    const closeBtnRef = useRef(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    // Cerrar con ESC
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === "Escape" && onClose?.();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    // Enfocar botón y bloquear scroll del body
    useEffect(() => {
        if (!open) return;
        const t = setTimeout(() => closeBtnRef.current?.focus(), 0);
        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { clearTimeout(t); document.body.style.overflow = original; };
    }, [open]);

    if (!open || !mounted) return null;

    const overlay = (
        <div
            ref={dialogRef}
            onMouseDown={(e) => { if (e.target === dialogRef.current) onClose?.(); }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
            aria-modal="true"
            role="dialog"
            aria-labelledby="modal-title"
        >
            <div className="m-4 sm:m-6 w-full max-w-2xl bg-white shadow-xl ring-1 ring-black/5 rounded-2xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
                    <h2 id="modal-title" className="text-lg font-semibold text-gray-900">{title}</h2>
                    <button
                        ref={closeBtnRef}
                        onClick={onClose}
                        className="rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        aria-label="Cerrar modal"
                    >
                        ✕
                    </button>
                </div>
                {/* Body */}
                <div className="px-5 py-4 max-h-[70vh] overflow-auto">
                    {children}
                </div>
                {/* Footer */}
                <div className="flex justify-end gap-2 px-5 py-4 border-t shrink-0">
                    <button
                        onClick={onClose}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(overlay, document.body);
}

/* -------------------------
   Subcomponentes
-------------------------- */
function Info({ label, value }) {
    return (
        <div>
            <div className="text-base font-medium text-gray-500">{label}</div>
            <div className="mt-0.5 text-gray-900 font-semibold">{typeof value === "string" || typeof value === "number" ? value : value}</div>
        </div>
    );
}

function Kpi({ icon, label, value, hint, subtle = false, tone = "default" }) {
    const toneClasses = {
        default: "border bg-white",
        warning: "border bg-amber-100",
        success: "border bg-emerald-100",
    };
    return (
        <div className={`rounded-xl px-3 py-3 ${toneClasses[tone]}`}>
            <div className="flex items-center gap-2 text-gray-600">
                {icon || null}
                <span className="text-xs">{label}</span>
            </div>
            <div className={`mt-1 text-base font-semibold ${subtle ? "text-gray-700" : "text-gray-900"}`}>{value}</div>
            {hint && <div className="mt-0.5 text-xs text-gray-500">{hint}</div>}
        </div>
    );
}

function EstadoPill({ value, type }) {
    // type: "apertura" | "caja"
    const v = (value || "").toLowerCase();
    let text = v || "—";
    let cls = "bg-gray-100 text-gray-700";
    if (type === "apertura") {
        if (v === "abierta") cls = "bg-blue-500 text-white";
        if (v === "cerrada") cls = "bg-red-500 text-white";
    } else if (type === "caja") {
        if (v === "activa") cls = "bg-green-500 text-white";
        if (v === "inactiva") cls = "bg-gray-200 text-white";
    }
    return (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-sm font-medium ${cls}`}>
            {type === "apertura" ? "Apertura:" : "Caja:"} {text}
        </span>
    );
}
