'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { userService } from '@/services/user.service';
import { useNotification } from "@/contexts/NotificationContext";
import { getCurrentUser } from "@/utils/session";


const normalizeRole = (s) => (s || '').toString().trim().toLowerCase();

const ROLES_ALL = [
  { value: 'admin', label: 'Admin' },
  { value: 'supervisor', label: 'Supervisor' },
  { value: 'recaudador', label: 'Recaudador' },
  { value: 'tesorero', label: 'Tesorero' },
  { value: 'cajero', label: 'Cajero' },
];
export default function NewUserPage() {
  const router = useRouter();
  const { showNotification } = useNotification();

  const [isAdmin, setIsAdmin] = useState(() => {
    const u = getCurrentUser();
    return normalizeRole(u?.role) === 'admin';
  });

  const ROLES = useMemo(() => {
    return isAdmin ? ROLES_ALL : ROLES_ALL.filter(r => r.value !== 'admin');
  }, [isAdmin]);


  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: ''
  });

  useEffect(() => {
    const u = getCurrentUser();
    setIsAdmin(normalizeRole(u?.role) === 'admin');
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await userService.create({ ...form, role: normalizeRole(form.role) });
      showNotification({
        type: "success",
        title: "Usuario creado",
        message: "El usuario se ha creado exitosamente",
        duration: 5000
      });
      router.push('/dashboard/users');
    } catch (err) {
      showNotification({
        type: "error",
        title: "Error",
        message: err?.message || 'Error al crear el usuario',
        duration: 5000
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Nuevo Usuario</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Nombre:</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Ej: Juan Perez"
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
            placeholder="Ej: usuario@ejemplo.com"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Contraseña:</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="••••••••"
          />
          <p className="text-sm text-gray-500 mt-1">Mínimo 6 caracteres</p>
        </div>

        {/* Rol (hardcodeado) */}
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
            className="bg-red-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-red-800 transition"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-800 transition"
          >
            Crear Usuario
          </button>
        </div>
      </form>
    </div>
  );
}
