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
  const [canEdit, setCanEdit] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { showNotification } = useNotification();

  const formatActive = (val) => {
    // cubre boolean, number, y strings como "1"/"0"/"true"/"false"
    if (val === true || val === 'true') return 'Activo';
    if (val === false || val === 'false') return 'Inactivo';
    const num = Number(val);
    if (!Number.isNaN(num)) return num === 1 ? 'Activo' : 'Inactivo';
    // por defecto, si viene undefined/null -> Inactivo (puedes cambiarlo)
    return 'Inactivo';
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await userService.list({ page, pageSize, search });
      setUsers(res.data);
      setTotal(res.total);  // <-- usa el total del backend
    } catch (err) {
      setError(err.message || 'Error al cargar usuarios');
      showNotification({ type: "error", title: "Error", message: 'Error al cargar usuarios', duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]); // eslint-disable-line react-hooks/exhaustive-deps

  // Resetear a página 1 cuando cambie el search (evita páginas vacías)
  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    const u = getCurrentUser();
    setCurrentUser(u);
    const role = u?.role?.toLowerCase() ?? '';
    setIsAdmin(role === 'admin');
    setCanEdit(role === 'admin' || role === 'tesorero');
  }, []);

  // Paginación 100% basada en backend
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const disableNext = page >= pageCount;

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      showNotification({ type: "info", title: "Cancelado", message: "La eliminación fue cancelada", duration: 5000 });
      return;
    }
    try {
      await userService.delete(id);
      fetchUsers();
      showNotification({ type: "success", title: "Usuario eliminado", message: "El usuario se ha eliminado correctamente", duration: 5000 });
    } catch (err) {
      setError(err.message || 'Error al eliminar usuario');
      showNotification({ type: "error", title: "Error al eliminar", message: err.message || 'Error al eliminar usuario', duration: 5000 });
    }
  };

  return (
    <div className="">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
          <button
            type="button"
            aria-label="Actualizar usuarios"
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-800 transition inline-flex items-center justify-center"
            onClick={fetchUsers}
            title="Actualizar"
          >
            <ArrowPathIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex gap-2">
            <ExportCSVButton filename="usuarios.csv" filters={{ search }} service={userService} />
            {canEdit && (
              <Link
                href="/dashboard/users/new"
                className="px-4 py-2 bg-green-600 text-white text-sm sm:text-lg font-medium rounded-lg hover:bg-green-800 transition inline-flex items-center justify-center"
              >
                Nuevo Usuario
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* búsqueda */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por username, email o rol..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {loading && (
        <p>Cargando...</p>
      )}

      {!loading && (
        <>
          {/* TABLE VIEW - visible md+ (keeps original table for larger screens) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Username</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Rol</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Estado</th>
                  {canEdit && <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Acciones</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className={`px-4 py-2 capitalize ${formatActive(u.is_active) === "Activo" ? "bg-gray-100" : "bg-gray-50"}`}
                  >
                    <td className="px-4 py-2">{u.id}</td>
                    <td className="px-4 py-2">{u.username}</td>
                    <td className="px-4 py-2">{u.email}</td>
                    <td className="px-4 py-2 capitalize">{u.role}</td>
                    <td className="px-4 py-2 capitalize">{formatActive(u.is_active)}</td>
                    {canEdit && (
                      <td className="px-4 py-2 space-x-2 flex">
                        {u.id !== currentUser?.id && (
                          <Link
                            href={`/dashboard/users/${u.id}`}
                            className="h-8 w-8 bg-blue-500 text-white rounded hover:bg-blue-800 transition flex items-center justify-center"
                            title="Editar"
                          >
                            <PencilSquareIcon className="h-5 w-5" />
                          </Link>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARD LIST - visible on small screens */}
          <div className="block md:hidden space-y-3">
            {users.length === 0 ? (
              <div className="text-center text-gray-500 py-6">No hay usuarios para mostrar</div>
            ) : (
              users.map((u) => (
                <div
                  key={u.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex items-start justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-800 truncate">{u.username}</h3>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${formatActive(u.is_active) === "Activo" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}
                      >
                        {formatActive(u.is_active)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 truncate">{u.email}</p>
                    <p className="mt-2 text-xs text-gray-600 capitalize">Rol: {u.role}</p>
                  </div>

                  {canEdit && (
                    <div className="ml-3 flex-shrink-0 flex flex-col items-center gap-2">
                      {u.id !== currentUser?.id && (
                        <Link
                          href={`/dashboard/users/${u.id}`}
                          className="h-9 w-9 bg-blue-500 text-white rounded-md hover:bg-blue-800 transition flex items-center justify-center"
                          title="Editar"
                          aria-label={`Editar usuario ${u.username}`}
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                        </Link>
                      )}
                      {/* opcional: botón eliminar (comentado en tu ejemplo) */}
                      {/* {u.id !== currentUser?.id && (
                        <button
                          type="button"
                          onClick={() => handleDelete(u.id)}
                          className="h-9 w-9 bg-red-500 text-white rounded-md hover:bg-red-800 transition flex items-center justify-center"
                          title="Eliminar"
                          aria-label={`Eliminar usuario ${u.username}`}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )} */}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Paginación */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition"
              >
                Anterior
              </button>
              <span className="text-gray-700">
                Página {page} de {pageCount}
              </span>
              <button
                type="button"
                disabled={disableNext}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition"
              >
                Siguiente
              </button>
            </div>

            {/* en pantallas pequeñas mostramos el control de paginado centrado (ya ocurre) */}
          </div>
        </>
      )}
    </div>
  );

}
