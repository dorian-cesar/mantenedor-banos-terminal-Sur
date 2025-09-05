'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, clearSession, saveSession } from "@/utils/session";
import { userService } from "@/services/user.service";
import { useNotification } from "@/contexts/NotificationContext";
import { FormSkeleton2 } from "@/components/skeletons";
import { EnvelopeIcon, ShieldCheckIcon, PencilSquareIcon, CheckIcon, XMarkIcon, PowerIcon, UserIcon } from '@heroicons/react/24/outline';

const normalizeRole = (s) => (s || '').toString().trim().toLowerCase();

export default function ProfilePage() {
    const router = useRouter();
    const { showNotification } = useNotification();

    const [user, setUser] = useState(null);
    const [form, setForm] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = getCurrentUser();
        setUser(currentUser);

        const fetchData = async () => {
            try {
                const userData = await userService.getById(currentUser.id);
                setForm({
                    ...userData,
                    role: normalizeRole(userData.role),
                });
            } catch (err) {
                showNotification({
                    type: "error",
                    title: "Error",
                    message: "No se pudo cargar la información del usuario",
                    duration: 5000,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [showNotification]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const getInitials = (username) => username ? username.substring(0, 1).toUpperCase() : "US";
    const getRoleColor = (role) => {
        const colors = {
            admin: "bg-red-100 text-red-800 font-semibold",
            cajero: "bg-blue-100 text-blue-800 font-semibold",
            recaudador: "bg-purple-100 text-purple-800 font-semibold",
            supervisor: "bg-green-100 text-green-800 font-semibold",
            tesorero: "bg-yellow-100 text-yellow-800 font-semibold"
        };
        return colors[role?.toLowerCase()] || "bg-gray-100 text-gray-800 font-semibold";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form) return;

        if (!form.username || form.username.trim().length < 3) {
            showNotification({ type: "warning", title: "Error", message: "Nombre de usuario mínimo 3 caracteres", duration: 4000 });
            return;
        }
        if (!isValidEmail(form.email)) {
            showNotification({ type: "warning", title: "Error", message: "Correo inválido", duration: 4000 });
            return;
        }
        if (form.password && form.password.length < 6) {
            showNotification({ type: "warning", title: "Error", message: "Contraseña mínimo 6 caracteres", duration: 4000 });
            return;
        }
        if (!confirm('¿Estás seguro de los cambios que realizarás? Esta acción no se puede deshacer.')) {
            showNotification({ type: "info", title: "Cancelado", message: "La edición fue cancelada", duration: 5000 });
            return;
        }

        // 👇 clave: si no quieres mostrar select, manda SIEMPRE el rol actual
        // (o, si es admin y permites cambiarlo en otra vista, podrías usar form.role)
        const roleToSend = normalizeRole(user.role);

        const payload = {
            username: form.username,
            email: form.email,
            role: roleToSend,
            ...(form.password?.trim() ? { password: form.password.trim() } : {}),
        };

        try {
            await userService.update(user.id, payload);
            const token = localStorage.getItem("token");
            const updatedUser = { ...user, ...payload };
            delete updatedUser.password;
            saveSession(token, updatedUser);
      
            setUser(updatedUser);
            setForm(updatedUser);
            setIsEditing(false);

            showNotification({ type: "success", title: "Actualizado", message: "Perfil actualizado correctamente", duration: 5000 });
            router.refresh();
        } catch (err) {
            showNotification({ type: "error", title: "Error", message: err.message || "Error al actualizar", duration: 5000 });
        }
    };

    if (loading) return <FormSkeleton2 />;
    if (!form) return <p className="text-gray-600 p-4">Usuario no encontrado</p>;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Card de cabecera */}
            <div className="relative shadow-lg rounded-xl overflow-hidden">
                <div className="h-20 bg-blue-800"></div>
                <div className="relative py-6 flex flex-col sm:flex-row items-start sm:items-end gap-4 px-6 bg-white">
                    <div
                        className={`w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg flex items-center justify-center text-white font-bold text-5xl bg-gray-500`}
                    >
                        {getInitials(form.username)}
                    </div>


                    <div className="flex-1 sm:ml-4 mt-4 sm:mt-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-4xl font-bold text-black">{form.username}</h1>
                                <p className="text-gray-600 flex items-center gap-2 mt-1"><EnvelopeIcon className="w-4 h-4" /> {form.email}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <ShieldCheckIcon className="w-4 h-4 text-gray-500" />
                                    <span className={`px-2 py-1 rounded-xl ${getRoleColor(form.role)}`}>{form.role?.toLowerCase()}</span>
                                </div>
                            </div>
                            <button
                                className={`flex items-center gap-2 px-4 py-2 rounded ${isEditing ? 'bg-gray-100 text-gray-800 border-2 border-gray-800' : 'bg-gray-800 text-white'}`}
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                {isEditing ? <><XMarkIcon className="w-4 h-4" /> Cancelar</> : <><PencilSquareIcon className="w-4 h-4" /> Editar Perfil</>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            {/* Formulario */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 shadow-lg rounded-xl bg-white p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <UserIcon className="w-8 h-8" />
                        <p className="text-2xl font-bold">Información Personal</p>
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1" htmlFor="username">Nombre de Usuario</label>
                                    <input id="username" name="username" value={form.username} onChange={handleChange} required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1" htmlFor="email">Correo Electrónico</label>
                                    <input id="email" type="email" name="email" value={form.email} onChange={handleChange} required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1" htmlFor="password">Nueva Contraseña</label>
                                <input id="password" type="password" name="password" value={form.password || ""} onChange={handleChange} placeholder="Dejar en blanco para no cambiar" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                                <p className="text-sm text-gray-500 mt-1">Mínimo 6 caracteres</p>
                            </div>

                            {/* 🔒 Select oculto: NO se muestra, pero el rol igual viaja en el payload */}
                            {/* Si prefieres, puedes dejar un input hidden para claridad: */}
                            {/* <input type="hidden" name="role" value={form.role} /> */}

                            <div className="flex gap-3 pt-4">
                                <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded flex items-center gap-2">
                                    <CheckIcon className="w-4 h-4" /> Guardar Cambios
                                </button>
                                <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-100 px-4 py-2 rounded border-2 border-gray-800 flex items-center gap-2">
                                    <XMarkIcon className="w-4 h-4" /> Cancelar
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 block">Nombre de Usuario</label>
                                    <p className="text-gray-900 font-medium">{form.username}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 block">Correo Electrónico</label>
                                    <p className="text-gray-900">{form.email}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="text-sm font-medium text-gray-500 block">Rol del Sistema</label>
                                <span className={`inline-block px-4 py-2 rounded-xl ${getRoleColor(form.role)}`}>
                                    {form.role?.toLowerCase()}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="shadow-lg rounded-xl bg-white p-6 space-y-3 self-start">
                    <h3 className="text-lg font-semibold mb-2">Acciones</h3>
                    <button onClick={() => router.back()} className="w-full text-left px-3 py-2 rounded hover:bg-gray-300">Volver</button>
                    <button
                        onClick={() => { clearSession(); router.replace("/login"); router.refresh(); }}
                        className="w-full text-left px-3 py-2 rounded bg-red-500 text-white font-bold hover:bg-red-700 flex items-center"
                    >
                        Cerrar Sesión <PowerIcon className="h-5 w-5 ml-2" />
                    </button>
                </div>
            </div>
        </div>
    );
}
