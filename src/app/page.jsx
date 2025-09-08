"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isTokenExpired, getCurrentUser } from "@/utils/session";
import { useNotification } from "@/contexts/NotificationContext";

export default function HomePage() {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
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

  const handleLogin = () => {
    setLoading(true);
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-300 p-4">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-5xl font-bold text-blue-800 mb-4 animate-fade-in">
          Bienvenido al Mantenedor de Baños
        </h1>
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`px-8 py-3 mx-auto block rounded-lg shadow-md transition-all duration-300 transform 
    ${loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:scale-105 text-white font-medium"}
  `}
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
            "Iniciar Sesión"
          )}
        </button>

        <div className="mt-12 flex justify-center space-x-4">
          <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
          <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
          <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
