"use client";
import Link from "next/link";
import { UserIcon, PowerIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { clearSession } from "@/utils/session"

export default function Navbar() {
    const router = useRouter();
    const [nombre, setNombre] = useState("");
    const [role, setRole] = useState("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const mobileMenuRef = useRef(null);
    const mobileButtonRef = useRef(null);
    const profileRef = useRef(null);
    const profileButtonRef = useRef(null);

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            const parsedUser = JSON.parse(user);
            setNombre(parsedUser.username);
            setRole(parsedUser.role);
        }
    }, []);

    // Cerrar menú móvil al hacer clic en un enlace
    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const handleLogout = () => {
        clearSession();
        router.replace("/login");
        router.refresh();
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);
    };

    // Cerrar menús al hacer clic fuera (más robusto usando refs)
    useEffect(() => {
        const handleClickOutside = (event) => {
            const target = event.target;
            // mobile menu
            if (isMobileMenuOpen) {
                if (
                    mobileMenuRef.current &&
                    !mobileMenuRef.current.contains(target) &&
                    mobileButtonRef.current &&
                    !mobileButtonRef.current.contains(target)
                ) {
                    setIsMobileMenuOpen(false);
                }
            }
            // profile menu
            if (isProfileOpen) {
                if (
                    profileRef.current &&
                    !profileRef.current.contains(target) &&
                    profileButtonRef.current &&
                    !profileButtonRef.current.contains(target)
                ) {
                    setIsProfileOpen(false);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [isMobileMenuOpen, isProfileOpen]);

    return (
        <nav className="flex items-center justify-between bg-gray-800 text-white p-4 lg:p-6 relative">
            {/* Logo */}
            <Link
                href={"/dashboard"}
                className="text-white hover:text-gray-300 transition"
                onClick={closeMobileMenu}
            >
                <h1 className="text-xl lg:text-3xl font-bold">Mantenedor de Baños</h1>
            </Link>

            {/* Menú Desktop */}
            <div className="hidden md:flex items-center space-x-4">
                <div className="relative group" ref={profileRef}>
                    <button
                        ref={profileButtonRef}
                        aria-haspopup="true"
                        aria-expanded={isProfileOpen}
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-600 transition"
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                    >
                        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold text-sm lg:text-lg">
                            <UserIcon className="h-4 w-4 lg:h-6 lg:w-6 text-white" />
                        </div>
                        <span className="font-medium text-sm lg:text-lg">{nombre}</span>
                    </button>

                    <div
                        className={`absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg transition-all duration-200 origin-top-right z-40 ${isProfileOpen ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'}`}
                    >
                        <Link
                            href="/dashboard/perfil"
                            className="flex items-center px-4 py-2 hover:bg-gray-100 transition rounded-t-lg"
                            onClick={() => setIsProfileOpen(false)}
                        >
                            Ver perfil
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full text-left px-4 py-2 hover:bg-red-100 transition rounded-b-lg"
                        >
                            Cerrar sesión
                            <PowerIcon className="h-5 w-5 ml-2 text-gray-700" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Botón Menú Móvil */}
            <button
                ref={mobileButtonRef}
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
                className="md:hidden p-2 rounded-lg hover:bg-gray-700 transition"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? (
                    ""
                ) : (
                    <Bars3Icon className="h-6 w-6" />
                )}
            </button>

            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 z-20"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}

            <div
                id="mobile-menu"
                ref={mobileMenuRef}
                className={`md:hidden absolute top-full left-0 w-full bg-gray-800 border-t border-gray-700 shadow-lg transition-all duration-200 mobile-menu ${isMobileMenuOpen ? 'opacity-100 visible max-h-96' : 'opacity-0 invisible max-h-0' } overflow-hidden z-30`}
            >
                <div className="p-4 space-y-4">
                    {/* Información del usuario */}
                    <div className="flex items-center space-x-3 px-3 py-2 border-b border-gray-700 pb-4">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold">
                            <UserIcon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <span className="font-medium block">{nombre}</span>
                            <span className="text-gray-300 text-sm">{role || "usuario"}</span>
                        </div>
                    </div>

                    {/* Enlaces móviles */}
                    <Link
                        href="/dashboard/perfil"
                        className="flex items-center px-4 py-3 hover:bg-gray-700 transition rounded-lg"
                        onClick={closeMobileMenu}
                    >
                        <UserIcon className="h-5 w-5 mr-3" />
                        Ver perfil
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-3 hover:bg-red-900 transition rounded-lg text-red-200"
                    >
                        <PowerIcon className="h-5 w-5 mr-3" />
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </nav>
    );
}
