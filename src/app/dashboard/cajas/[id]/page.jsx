'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { cajaService } from '@/services/caja.service';
import { FormSkeleton } from '@/components/skeletons';
import { useNotification } from "@/contexts/NotificationContext";

export default function EditCajaPage() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchCaja = async () => {
      try {
        const data = await cajaService.getById(id);
        setForm(data);
      } catch (err) {
        setError(err.message || 'Error al cargar la caja');
        showNotification({
          type: "error",
          title: "Error",
          message: 'Error al cargar caja',
          duration: 5000
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCaja();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await cajaService.update(id, form);
      showNotification({
        type: "success",
        title: "Caja actualizada",
        message: "Los cambios se han guardado correctamente",
        duration: 5000
      });
      router.push('/dashboard/cajas');
    } catch (err) {
      setError(err.message || 'Error al actualizar la caja');
      showNotification({
        type: "error",
        title: "Error al guardar",
        message: err.message || 'Error al actualizar caja',
        duration: 5000
      });
    }
  };

  if (loading) return <FormSkeleton />;
  if (!form) return <p className="text-gray-600 p-3">Caja no encontrada</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Editar Caja {form.nombre}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Número:</label>
          <input
            name="numero_caja"
            value={form.numero_caja}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

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

        <div>
          <label className="block text-gray-700 font-medium mb-1">Ubicación:</label>
          <input
            name="ubicacion"
            value={form.ubicacion || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="flex text-gray-700 font-medium mb-1 items-center">
            Estado:
            <span className="block text-sm text-gray-500 font-normal ml-2">
              (para cerrar una caja se hace desde "Aperturas y Cierres")
            </span>
          </label>
          <select
            name="estado"
            value={form.estado}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="activa">Activa</option>
            <option value="inactiva">Inactiva</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Descripción:</label>
          <textarea
            name="descripcion"
            value={form.descripcion || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={4}
          />
        </div>

        <div className="flex justify-center space-x-10 mt-6">
          <Link href="/dashboard/cajas" className="bg-red-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-red-800 transition">Cancelar</Link>
          <button type="submit" className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-800 transition">
            Actualizar
          </button>
        </div>
      </form>
    </div>
  );
}
