'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { TableSkeleton } from '@/components/skeletons';
import ExportCSVButton from "@/components/ExportCSVButton";
import { PencilSquareIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { userService } from '@/services/user.service';
import { getCurrentUser } from '@/utils/session';
import { useNotification } from "@/contexts/NotificationContext";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const { showNotification } = useNotification();

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await userService.list({ page, pageSize, search });
      setUsers(res.data);
      setTotal(res.total);
    } catch (err) {
      setError(err.message || 'Error al cargar usuarios');
      showNotification({
        type: "error",
        title: "Error",
        message: 'Error al cargar usuarios',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      showNotification({
        type: "info",
        title: "Cancelado",
        message: "La eliminación fue cancelada",
        duration: 5000
      });
      return;
    }
    try {
      await userService.delete(id);
      fetchUsers();
      showNotification({
        type: "success",
        title: "Usuario eliminado",
        message: "El usuario se ha eliminado correctamente",
        duration: 5000
      });
    } catch (err) {
      setError(err.message || 'Error al eliminar usuario');
      showNotification({
        type: "error",
        title: "Error al eliminar",
        message: err.message || 'Error al eliminar usuario',
        duration: 5000
      });
    }
  };

  const currentUser = getCurrentUser();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2 items-center">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
          <button className='p-2 bg-blue-500 text-white rounded-full hover:bg-blue-800 transition flex items-center justify-center'
            onClick={() => fetchUsers()}>
            <ArrowPathIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="flex space-x-2">
          <ExportCSVButton
            filename="usuarios.csv"
            filters={{ search }}
            service={userService}
          />

          <Link
            href="/dashboard/users/new"
            className="px-4 py-2 bg-green-600 text-white text-lg font-medium rounded-lg hover:bg-green-800 transition"
          >
            Nuevo Usuario
          </Link>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div>
        <input
          type="text"
          placeholder="Buscar por username, email o rol..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 w-full max-w-sm rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {loading && <TableSkeleton rows={5} cols={5} />}

      {!loading && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Username</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Rol</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {users.filter(u => Number(u.id) !== 1).map((u) => (
                  <tr key={u.id} className="hover:bg-gray-200">
                    <td className="px-4 py-2">{u.id}</td>
                    <td className="px-4 py-2">{u.username}</td>
                    <td className="px-4 py-2">{u.email}</td>
                    <td className="px-4 py-2 capitalize">{u.role}</td>
                    <td className="px-4 py-2 space-x-2 flex">
                      {u.id !== currentUser.id && (
                        <Link
                          href={`/dashboard/users/${u.id}`}
                          className="h-7 w-7 bg-blue-500 text-white rounded hover:bg-blue-800 transition flex items-center justify-center"
                        >
                          <PencilSquareIcon className="h-5 w-5 inline" />
                        </Link>
                      )}
                      {u.id !== currentUser.id && (
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="h-7 w-7 bg-red-500 text-white rounded hover:bg-red-800 transition flex items-center justify-center"
                        >
                          <TrashIcon className="h-5 w-5 inline" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {/* Paginación */}
          <div className="mt-4 flex items-center justify-center space-x-4">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-400 disabled:opacity-50 transition"
            >
              Anterior
            </button>
            <span className="text-gray-700">
              Página {page} de {Math.ceil(total / pageSize)}
            </span>
            <button
              disabled={page * pageSize >= total}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-400 disabled:opacity-50 transition"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

    </div>
  );
}