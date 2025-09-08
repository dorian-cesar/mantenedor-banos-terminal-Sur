"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { saveSession, isTokenExpired, getCurrentUser } from "@/utils/session";
import { useNotification } from "@/contexts/NotificationContext";
import { LockClosedIcon, EnvelopeIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Modal from '@/components/ui/modal';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { showNotification } = useNotification();

    const ALLOWED_ROLES = ["admin", "supervisor", "recaudador", "tesorero"];
    const isAllowed = (role) => ALLOWED_ROLES.includes((role || "").toLowerCase());

    useEffect(() => {
        const user = getCurrentUser();
        if (user && !isTokenExpired()) {
            if (isAllowed(user.role)) {
                showNotification({
                    type: "success",
                    title: "Sesión Activa",
                    message: "Se redirigirá al dashboard",
                    duration: 3000
                });
                setLoading(true);
                router.replace("/dashboard");
            } else {
                showNotification({
                    type: "warning",
                    title: "Acceso restringido",
                    message: "No tienes permisos para acceder al dashboard",
                    duration: 5000
                });
            }
        }
    }, []);

    const isValidEmail = (email) => {
        // Expresión regular básica para validar email
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValidEmail(email)) {
            showNotification({
                type: "warning",
                title: "Correo inválido",
                message: "Por favor ingresa un correo electrónico válido.",
                duration: 4000
            });
            return;
        }

        /*
        if (password.length < 6) {
            showNotification({
                type: "warning",
                title: "Contraseña inválida",
                message: "La contraseña debe tener al menos 6 caracteres.",
                duration: 4000
            });
            return;
        }

        */

        setLoading(true);

        try {
            const data = await authService.login({ email, password });
            saveSession(data.token, data.user);

            showNotification({
                type: "success",
                title: "Login exitoso",
                message: `Bienvenido ${data.user.username}`,
                duration: 5000
            });
            router.replace('/dashboard');
            
        } catch (err) {
            let errorMessage = "Error al iniciar sesión";

            try {
                const parsedError = JSON.parse(err.message);
                errorMessage = parsedError.error || err.message;
            } catch {
                errorMessage = err.message || "Ocurrió un error inesperado";
            }

            showNotification({
                type: "error",
                title: "Error de autenticación",
                message: errorMessage,
                duration: 5000
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-800 mb-2">Bienvenido</h1>
                    <p className="text-gray-600">Ingresa tus credenciales para acceder al sistema</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-8 rounded-xl shadow-lg border border-gray-200"
                    noValidate
                >
                    <div className="space-y-5">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Correo electrónico
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="tu@correo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Contraseña
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        {/* Submit */}
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
                                        Redirigiendo...
                                    </div>
                                ) : (
                                    "Iniciar sesión"
                                )}
                            </button>
                        </div>

                    </div>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    <p>
                        ¿Problemas para ingresar?{" "}
                        <Link href="/forgot" className="text-blue-600 hover:text-blue-800">
                            Restablece tu Contraseña
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
