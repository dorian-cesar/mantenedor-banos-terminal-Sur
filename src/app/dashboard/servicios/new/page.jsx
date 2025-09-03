'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { serviceService } from '@/services/service.service';
import { FormSkeleton6 } from '@/components/skeletons';
import { useNotification } from "@/contexts/NotificationContext";

export default function NewServicePage() {
    const router = useRouter();
    const [tipos, setTipos] = useState([]);
    const [form, setForm] = useState({
        nombre: '',
        tipo: '',
        precio: '',
        descripcion: '',
        estado: 'activo'
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showNotification } = useNotification();

    useEffect(() => {
        const fetchTipos = async () => {
            try {
                const res = await serviceService.listTipos();
                setTipos(res);
                if (res.length) setForm(f => ({ ...f, tipo: res[0] }));
            } catch (err) {
                setError('Error al cargar tipos de servicio');
                showNotification({
                    type: "error",
                    title: "Error",
                    message: 'No se pudieron cargar los tipos de servicio',
                    duration: 5000
                });
            } finally {
                setLoading(false);
            }
        };
        fetchTipos();
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await serviceService.create(form);
            showNotification({
                type: "success",
                title: "Servicio creado",
                message: "El servicio se ha creado exitosamente",
                duration: 5000
            });
            router.push('/dashboard/servicios');
        } catch (err) {
            setError(err.message || 'Error al crear servicio');
            showNotification({
                type: "error",
                title: "Error",
                message: err.message || 'Error al crear el servicio',
                duration: 5000
            });
        }
    };

    if (loading) return <FormSkeleton6 />;

    return (
        <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Nuevo Servicio</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Nombre:</label>
                    <input
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Ej: Baño Premium"
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
                            placeholder="Ej: 15000"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Descripción:</label>
                    <textarea
                        name="descripcion"
                        value={form.descripcion}
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
                        disabled
                    >
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                    </select>
                </div>

                <div className="flex justify-center space-x-10 mt-6">
                    <Link
                        href="/dashboard/servicios"
                        className="bg-red-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-red-800 transition"
                    >
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-800 transition"
                    >
                        Crear Servicio
                    </button>
                </div>
            </form>
        </div>
    );
}