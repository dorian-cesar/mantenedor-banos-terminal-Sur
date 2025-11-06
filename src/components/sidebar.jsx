"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  UsersIcon,
  ComputerDesktopIcon,
  WrenchScrewdriverIcon,
  ArrowsRightLeftIcon,
  LockOpenIcon,
  Bars3Icon,
  ChevronLeftIcon,
  NewspaperIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { getCurrentUser } from "@/utils/session";

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(true); // desktop collapsed state
  const [mobileOpen, setMobileOpen] = useState(false); // mobile drawer
  const [isAllowed, setIsAllowed] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const u = getCurrentUser();
    const role = u?.role?.toLowerCase() ?? "";
    setIsAllowed(role === "admin" || role === "tesorero");
  }, []);

  // Close mobile drawer with Escape or clicking outside
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    const onClick = (e) => {
      if (!mobileOpen) return;
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("touchstart", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("touchstart", onClick);
    };
  }, [mobileOpen]);

  const getLinkClasses = (path, exact = false) =>
    `flex items-center p-3 rounded-lg transition-all duration-300 group ${
      !open ? "justify-center" : ""
    } ${
      exact
        ? pathname === path
          ? "bg-blue-100 text-blue-700 font-semibold"
          : "hover:bg-blue-100 hover:text-blue-700"
        : pathname.startsWith(path)
        ? "bg-blue-100 text-blue-700 font-semibold"
        : "hover:bg-blue-100 hover:text-blue-700"
    }`;

  // Función para cerrar el drawer móvil al hacer clic en un enlace
  const handleMobileLinkClick = () => {
    setMobileOpen(false);
  };

  const sidebarContent = (isMobile = false) => (
    <aside
      className={`${isMobile ? "w-64" : open ? "w-64" : "w-20"} min-h-screen bg-gradient-to-b from-blue-50 to-white border-r border-gray-200 flex flex-col p-4 transition-all duration-300`}
    >
      <div className={`flex items-center mb-8 ${isMobile || open ? "justify-between" : "justify-center"}`}>
        {(isMobile || open) && <h2 className="text-2xl font-bold text-blue-800">Navegación</h2>}
        
        {/* Solo mostrar botón de colapsar en desktop */}
        {!isMobile && (
          <button
            aria-label={open ? "Cerrar sidebar" : "Abrir sidebar"}
            onClick={() => setOpen((s) => !s)}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
          >
            {open ? <ChevronLeftIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
          </button>
        )}
        
        {/* En móvil, mostrar botón de cerrar */}
        {isMobile && (
          <button
            aria-label="Cerrar menú"
            onClick={() => setMobileOpen(false)}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link 
              href="/dashboard" 
              className={getLinkClasses("/dashboard", true)}
              onClick={isMobile ? handleMobileLinkClick : undefined}
            >
              <HomeIcon className={`h-5 w-5 text-blue-500 ${(isMobile || open) ? "mr-3" : ""}`} />
              {(isMobile || open) && <span>Inicio</span>}
            </Link>
          </li>

          <li>
            <Link 
              href="/dashboard/users" 
              className={getLinkClasses("/dashboard/users")}
              onClick={isMobile ? handleMobileLinkClick : undefined}
            >
              <UsersIcon className={`h-5 w-5 text-blue-500 ${(isMobile || open) ? "mr-3" : ""}`} />
              {(isMobile || open) && <span>Usuarios</span>}
            </Link>
          </li>

          <li>
            <Link 
              href="/dashboard/cajas" 
              className={getLinkClasses("/dashboard/cajas")}
              onClick={isMobile ? handleMobileLinkClick : undefined}
            >
              <ComputerDesktopIcon className={`h-5 w-5 text-blue-500 ${(isMobile || open) ? "mr-3" : ""}`} />
              {(isMobile || open) && <span>Cajas</span>}
            </Link>
          </li>

          <li>
            <Link 
              href="/dashboard/servicios" 
              className={getLinkClasses("/dashboard/servicios")}
              onClick={isMobile ? handleMobileLinkClick : undefined}
            >
              <WrenchScrewdriverIcon className={`h-5 w-5 text-blue-500 ${(isMobile || open) ? "mr-3" : ""}`} />
              {(isMobile || open) && <span>Servicios</span>}
            </Link>
          </li>

          <li>
            <Link 
              href="/dashboard/movimientos" 
              className={getLinkClasses("/dashboard/movimientos")}
              onClick={isMobile ? handleMobileLinkClick : undefined}
            >
              <ArrowsRightLeftIcon className={`h-5 w-5 text-blue-500 ${(isMobile || open) ? "mr-3" : ""}`} />
              {(isMobile || open) && <span>Movimientos</span>}
            </Link>
          </li>

          <li>
            <Link 
              href="/dashboard/cierres" 
              className={getLinkClasses("/dashboard/cierres")}
              onClick={isMobile ? handleMobileLinkClick : undefined}
            >
              <LockOpenIcon className={`h-5 w-5 text-blue-500 ${(isMobile || open) ? "mr-3" : ""}`} />
              {(isMobile || open) && <span>Aperturas y Cierres</span>}
            </Link>
          </li>

          {isAllowed && (
            <li>
              <Link 
                href="/dashboard/folios" 
                className={getLinkClasses("/dashboard/folios")}
                onClick={isMobile ? handleMobileLinkClick : undefined}
              >
                <NewspaperIcon className={`h-5 w-5 text-blue-500 ${(isMobile || open) ? "mr-3" : ""}`} />
                {(isMobile || open) && <span>Solicitar Folios</span>}
              </Link>
            </li>
          )}
        </ul>
      </nav>

      <div className={`mt-auto pt-4 border-t border-gray-200 ${!(isMobile || open) && "text-center"}`}>
        {isMobile || open ? (
          <p className="text-sm text-gray-500">Versión 1.0.3</p>
        ) : (
          <p className="text-xs text-gray-500">v1.0.3</p>
        )}
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile hamburger - visible solo en móvil */}
      <div className={`${mobileOpen ? "hidden" : ""} md:hidden fixed top-20 left-4 z-40`}>
        <button
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setMobileOpen((s) => !s)}
          className="p-2 rounded-full shadow bg-blue-500 text-white hover:bg-blue-300 transition"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>

      {/* Desktop: visible desde md hacia arriba */}
      <div className="hidden md:block">
        {sidebarContent(false)}
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed inset-0 z-30 pointer-events-none transition-all duration-300 ${
          mobileOpen ? "" : "opacity-0"
        }`}
      >
        {/* overlay */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0"
          }`}
          aria-hidden={!mobileOpen}
          onClick={() => setMobileOpen(false)}
        />

        {/* sliding panel */}
        <div
          ref={containerRef}
          className={`absolute left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-blue-50 to-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 pointer-events-auto ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {sidebarContent(true)}
        </div>
      </div>
    </>
  );
}