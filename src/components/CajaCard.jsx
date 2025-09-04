"use client";
import { BanknotesIcon, CreditCardIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function CajaCard({ caja, onOpen }) {
    const {
        numero_caja,
        nombre,
        ubicacion,
        estado_caja,
        estado_apertura,
        efectivo = 0,
        tarjeta = 0,
        total = 0,
        retiros = 0,
        monto_inicial = 0,
        transacciones = 0,
    } = caja || {};

    const isOpen = (estado_apertura || "").toLowerCase() === "abierta";
    const nombre_usuario = caja?.apertura?.usuario?.nombre ?? "";

    return (
        <div
            className={[
                "rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden h-fit",
                isOpen ? "border-t-4 border-blue-500 bg-white" : "border-t-4 border-red-400 bg-white",
            ].join(" ")}
            title={isOpen ? "Caja Abierta" : "Caja Cerrada"}
        >
            <div className="p-4 sm:p-5 flex flex-col">
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                           ({numero_caja}) {nombre || `Caja ${numero_caja}`} · {nombre_usuario}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 truncate">
                            {ubicacion || "Sin ubicación"} · {estado_caja || "—"}
                        </p>
                        <p className="text-sm sm:text-base text-gray-600 truncate">
                            Monto inicial · {Number(monto_inicial || 0).toLocaleString("es-CL")}
                        </p>
                    </div>

                    <span
                        className={[
                            "px-2 py-1 rounded text-white text-[11px] sm:text-xs font-semibold self-start sm:self-auto shrink-0 whitespace-nowrap",
                            isOpen ? "bg-blue-500" : "bg-red-400",
                        ].join(" ")}
                    >
                        {estado_apertura || "—"}
                    </span>
                </div>

                {/* Total */}
                <div className="flex-1 flex items-center justify-center my-4 sm:my-5">
                    <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight whitespace-nowrap">
                        ${Number(total || 0).toLocaleString("es-CL")}
                    </p>
                </div>

                {/* Footer */}
                <div className="mt-2 flex flex-col gap-4 sm:gap-3">
                    <div className="grid grid-cols-4 gap-3 text-gray-700">
                        <Metric
                            icon={<BanknotesIcon className="h-4 w-4 sm:h-5 sm:w-5" />}
                            label="Efectivo"
                            value={`$${Number(efectivo || 0).toLocaleString("es-CL")}`}
                        />
                        <Metric
                            icon={<CreditCardIcon className="h-4 w-4 sm:h-5 sm:w-5" />}
                            label="Tarjeta"
                            value={`$${Number(tarjeta || 0).toLocaleString("es-CL")}`}
                        />
                        <Metric label="Transacciones" value={Number(transacciones || 0)} />
                        <Metric
                            label="Retiro"
                            value={`$${Number(retiros || 0).toLocaleString("es-CL")}`}
                        />
                    </div>

                    {/* Botón que abre modal */}
                    <div className="flex sm:justify-end">
                        <button
                            type="button"
                            onClick={() => onOpen?.(caja)}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                        >
                            Detalles
                            <ChevronRightIcon className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Metric({ icon, label, value }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-lg bg-white sm:bg-transparent p-2 sm:p-0 shadow-sm sm:shadow-none">
            <div className="flex items-center gap-1.5 text-sm sm:text-[15px] text-gray-600 whitespace-nowrap">
                {icon || null}
                <span>{label}</span>
            </div>
            <strong className="text-gray-900 text-sm sm:text-base whitespace-nowrap">{value}</strong>
        </div>
    );
}
