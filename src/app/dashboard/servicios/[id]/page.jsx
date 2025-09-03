'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { serviceService } from '@/services/service.service';
import { FormSkeleton7 } from '@/components/skeletons';
import { formatNumber } from '@/utils/helper';
import { useNotification } from "@/contexts/NotificationContext";

export default function EditServicePage() {
    const router = useRouter();
    const { id } = useParams();
    const [tipos, setTipos] = useState([]);
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { showNotification } = useNotification();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [service, tiposList] = await Promise.all([
                    serviceService.getById(id),
                    serviceService.listTipos()
                ]);
                setForm({
                    ...service,
                    precio: formatNumber(service.precio)
                });
                setTipos(tiposList);

            } catch (err) {
                setError(err.message || 'Error al cargar servicio');
                showNotification({
                    type: "error",
                    title: "Error",
                    message: 'Error al cargar servicio',
                    duration: 5000
                });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!confirm('¿Guardar cambios? Al marcar el estado como "inactivo", el registro se ocultará de la tabla.')) {
            showNotification({
                type: "info",
                title: "Cancelado",
                message: "No se ha guardado",
                duration: 3000
            });
            return;
        }

        try {
            await serviceService.update(id, form);
            showNotification({
                type: "success",
                title: "Servicio actualizado",
                message: "Los cambios se han guardado correctamente",
                duration: 5000
            });
            router.push('/dashboard/servicios');
        } catch (err) {
            setError(err.message || 'Error al actualizar servicio');
            showNotification({
                type: "error",
                title: "Error al guardar",
                message: err.message || 'Error al actualizar servicio',
                duration: 3000
            });
        }
    };

    const handleDelete = async () => {
        if (!confirm('¿Estás seguro de eliminar este servicio? Esta acción no se puede deshacer.')) {
            showNotification({
                type: "info",
                title: "Cancelado",
                message: "La eliminación fue cancelada",
                duration: 3000
            });
            return;
        }

        try {
            await serviceService.delete(id);
            showNotification({
                type: "success",
                title: "Servicio eliminado",
                message: "El servicio se ha eliminado correctamente",
                duration: 5000
            });
            router.push('/dashboard/servicios');
        } catch (err) {
            setError(err.message || 'Error al eliminar servicio');
            showNotification({
                type: "error",
                title: "Error al eliminar",
                message: err.message || 'Error al eliminar servicio',
                duration: 5000
            });
        }
    };

    if (loading) return <FormSkeleton7 />;
    if (!form) return <p className="text-gray-600 p-4">Servicio no encontrado</p>;

    return (
        <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Editar Servicio: {form.nombre}</h1>
                <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                    Eliminar Servicio
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Nombre:</label>
                    <input
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Tipo:</label>
                        <select
                            name="tipo"
                            value={form.tipo}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 capitalize"
                        >
                            {tipos.map((t) => (
                                <option key={t} value={t} className="capitalize">
                                    {t.toLowerCase()}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Precio ($):</label>
                        <input
                            type="number"
                            step="1"
                            name="precio"
                            value={form.precio}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Descripción:</label>
                    <textarea
                        name="descripcion"
                        value={form.descripcion || ''}
                        onChange={handleChange}
                        rows={4}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Estado:</label>
                    <select
                        name="estado"
                        value={form.estado}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 capitalize"
                    >
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                    </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <Link
                        href="/dashboard/servicios"
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                    >
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    );
}