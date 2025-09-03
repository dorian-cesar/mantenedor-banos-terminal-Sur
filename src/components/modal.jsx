"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BanknotesIcon, CreditCardIcon } from "@heroicons/react/24/outline";

export default function DetallesCajaModal({ open, onClose, caja }) {
    if (!caja) return null;

    const nombreUsuario = caja?.apertura?.usuario?.nombre ?? "—";
    const fechaApertura = caja?.apertura?.fecha
        ? new Date(caja.apertura.fecha).toLocaleDateString("es-CL")
        : "—";
    const horaApertura = caja?.apertura?.hora ?? "—";

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={`Detalles · ${caja.nombre || `Caja ${caja.numero_caja}`}`}
        >
            <div className="space-y-4 text-sm text-gray-700">
                <div className="grid grid-cols-2 gap-3">
                    <Info label="N° Caja" value={caja.numero_caja} />
                    <Info label="Estado caja" value={caja.estado_caja} />
                    <Info label="Ubicación" value={caja.ubicacion || "—"} />
                    <Info label="Estado apertura" value={caja.estado_apertura} />
                    <Info label="Cajero (apertura)" value={nombreUsuario} />
                    <Info label="Fecha apertura" value={fechaApertura} />
                    <Info label="Hora apertura" value={horaApertura} />
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <Kpi
                        icon={<BanknotesIcon className="h-5 w-5" />}
                        label="Efectivo"
                        value={`$${Number(caja.efectivo || 0).toLocaleString("es-CL")}`}
                    />
                    <Kpi
                        icon={<CreditCardIcon className="h-5 w-5" />}
                        label="Tarjeta"
                        value={`$${Number(caja.tarjeta || 0).toLocaleString("es-CL")}`}
                    />
                    <Kpi
                        label="Total"
                        value={`$${Number(caja.total || 0).toLocaleString("es-CL")}`}
                    />
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <Info label="Transacciones" value={Number(caja.transacciones || 0)} />
                    <Info
                        label="Primera transacción"
                        value={caja.primera_transaccion ?? "—"}
                    />
                    <Info
                        label="Última transacción"
                        value={caja.ultima_transaccion ?? "—"}
                    />
                </div>

                {caja.descripcion ? (
                    <div>
                        <div className="text-xs font-medium text-gray-500 mb-1">
                            Descripción
                        </div>
                        <p className="rounded-lg border bg-gray-50 px-3 py-2 text-gray-800">
                            {caja.descripcion}
                        </p>
                    </div>
                ) : null}
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
            <div className="m-4 sm:m-6 w-full max-w-lg bg-white shadow-xl ring-1 ring-black/5 rounded-2xl flex flex-col">
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
                {/* Body (scroll interno) */}
                <div className="px-5 py-4">
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

    // 👇 ESTE return va DENTRO de Modal
    return createPortal(overlay, document.body);
}

/* -------------------------
   Helpers
-------------------------- */
function Info({ label, value }) {
    return (
        <div>
            <div className="text-xs font-medium text-gray-500">{label}</div>
            <div className="mt-0.5 text-gray-900">{String(value)}</div>
        </div>
    );
}

function Kpi({ icon, label, value }) {
    return (
        <div className="rounded-xl border bg-white px-3 py-3">
            <div className="flex items-center gap-2 text-gray-600">
                {icon || null}
                <span className="text-xs">{label}</span>
            </div>
            <div className="mt-1 text-base font-semibold text-gray-900">{value}</div>
        </div>
    );
}
