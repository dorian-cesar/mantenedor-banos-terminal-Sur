"use client";
import { boletaService } from "@/services/boleta.service";
import { useState } from "react";
import { useNotification } from "@/contexts/NotificationContext";
import { createPortal } from "react-dom";

export default function FoliosPage() {
    const [cantidad, setCantidad] = useState("");
    const [loading, setLoading] = useState(false);
    const { showNotification } = useNotification();

    const isValidNumber = (v) => {
        if (v === "" || v === null || v === undefined) return false;
        const n = Number(v);
        return Number.isFinite(n) && n > 0 && Number.isInteger(n);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValidNumber(cantidad)) {
            showNotification({
                type: "warning",
                title: "Cantidad inválida",
                message: "Ingresa un número entero mayor a 0.",
                duration: 4000,
            });
            return;
        }

        setLoading(true);
        try {
            const payload = { cantidad: Number(cantidad) };
            await boletaService.solicitar(payload);

            //probar spinner
            // await new Promise((resolve) => setTimeout(resolve, 60000));

            showNotification({
                type: "success",
                title: "Folios solicitados",
                message: "Los folios se han solicitado correctamente.",
                duration: 5000,
            });
            setCantidad("");
        } catch (err) {
            const apiMsg =
                err?.response?.data?.error ||
                err?.response?.data?.message ||
                (() => {
                    try {
                        return JSON.parse(err?.message)?.error;
                    } catch {
                        return err?.message;
                    }
                })() ||
                "Ocurrió un error inesperado";

            showNotification({
                type: "error",
                title: "No se han solicitado",
                message: apiMsg,
                duration: 5000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-full flex items-center justify-center relative">
            {/* Overlay mientras carga */}
            {loading && <LoadingOverlay />}
            {/* Formulario */}
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-800 mb-2">
                        Solicitar Folios
                    </h1>
                    <p className="text-gray-600">
                        Ingresa la cantidad de folios que deseas solicitar.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-8 rounded-xl shadow-lg border border-gray-200"
                    noValidate
                >
                    <div className="space-y-5">
                        <div>
                            <label
                                htmlFor="cantidad"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Ingresa la cantidad
                            </label>
                            <div className="relative">
                                <input
                                    id="cantidad"
                                    type="number"
                                    inputMode="numeric"
                                    min={1}
                                    step={1}
                                    placeholder="0"
                                    value={cantidad}
                                    onChange={(e) => setCantidad(e.target.value)}
                                    className="pl-3 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all flex items-center justify-center ${loading
                                    ? "bg-blue-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
                                    }`}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <svg
                                            className="animate-spin h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                            ></path>
                                        </svg>
                                        Enviando...
                                    </div>
                                ) : (
                                    "Enviar"
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

function LoadingOverlay() {
    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white px-6 py-4 rounded-lg shadow-lg text-center space-y-3 max-w-sm">
                <svg
                    className="animate-spin h-8 w-8 text-blue-600 mx-auto"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                </svg>
                <p className="text-gray-700 font-medium">
                    Estamos solicitando los folios...
                </p>
                <p className="text-xs text-gray-500">
                    Este proceso suele demorar entre 20 y 80 segundos. Por favor no cierres
                    ni actualices la página.
                </p>
            </div>
        </div>,
        document.body
    );
}