'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { userService } from '@/services/user.service';
import { FormSkeleton2 } from '@/components/skeletons';
import { useNotification } from "@/contexts/NotificationContext";

const ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'supervisor', label: 'Supervisor' },
  { value: 'recaudador', label: 'Recaudador' },
  { value: 'tesorero', label: 'Tesorero' },
  { value: 'cajero', label: 'Cajero' },
];

const normalizeRole = (s) => (s || '').toString().trim().toLowerCase();

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const { showNotification } = useNotification();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await userService.getById(id);
        const normalizedRole = normalizeRole(user.role);
        const roleExists = ROLES.some(r => r.value === normalizedRole);

        setForm({
          id: user.id,
          username: user.username || '',
          email: user.email || '',
          role: roleExists ? normalizedRole : ROLES[0].value,
          password: '', // nunca prellenar password
        });
      } catch (err) {
        showNotification({
          type: "error",
          title: "Error",
          message: err?.message || 'Error al cargar usuario',
          duration: 5000
        });
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id, showNotification]);

  const handleChange = (e) => {
    if (!form) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form) return;

    const payload = {
      username: form.username,
      email: form.email,
      role: normalizeRole(form.role),
    };
    if (form.password && form.password.trim().length > 0) {
      payload.password = form.password.trim();
    }

    try {
      await userService.update(id, payload);
      showNotification({
        type: "success",
        title: "Usuario actualizado",
        message: "Los cambios se han guardado correctamente",
        duration: 5000
      });
      router.push('/dashboard/users');
    } catch (err) {
      showNotification({
        type: "error",
        title: "Error al guardar",
        message: err?.message || 'Error al actualizar usuario',
        duration: 5000
      });
    }
  };

  if (loading) return <FormSkeleton2 />;
  if (!form) return <p className="text-gray-600 p-4">Usuario no encontrado</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Editar Usuario {form.username}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Username:</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Email:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Password (opcional) */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Contraseña (dejar en blanco para no cambiar):</label>
          <input
            type="password"
            name="password"
            value={form.password || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="••••••••"
            minLength={6}
          />
          <p className="text-sm text-gray-500 mt-1">Mínimo 6 caracteres si la cambias</p>
        </div>

        {/* Rol (hardcode) */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Rol:</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            {ROLES.map(r => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Acciones */}
        <div className="flex justify-center space-x-10 mt-6">
          <Link
            href="/dashboard/users"
            className="bg-red-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-red-800 transition"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-800 transition"
          >
            Actualizar Usuario
          </button>
        </div>
      </form>
    </div>
  );
}
