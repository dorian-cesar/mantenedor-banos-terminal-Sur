"use client";
import { useState } from "react";
import Link from 'next/link';
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
    NewspaperIcon
} from '@heroicons/react/24/outline';

function Sidebar() {
    const [open, setOpen] = useState(true);
    const pathname = usePathname();

    const getLinkClasses = (path, exact = false) =>
        `flex items-center p-3 rounded-lg transition-all duration-300 group ${!open ? "justify-center" : ""} ${exact
            ? pathname === path
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "hover:bg-blue-100 hover:text-blue-700"
            : pathname.startsWith(path)
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "hover:bg-blue-100 hover:text-blue-700"
        }`;

    return (
        <aside className={`${open ? "w-64" : "w-20"} min-h-screen bg-gradient-to-b from-blue-50 to-white border-r border-gray-200 flex flex-col p-4 transition-all duration-300`}>
            <div className={`flex items-center mb-8 ${open ? "justify-between" : "justify-center"}`}>
                {open && <h2 className="text-2xl font-bold text-blue-800">Navegación</h2>}
                <button
                    onClick={() => setOpen(!open)}
                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
                >
                    {open ? <ChevronLeftIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
                </button>
            </div>

            <nav className="flex-1">
                <ul className="space-y-2">
                    <li>
                        <Link href="/dashboard" className={getLinkClasses("/dashboard", true)}>
                            <HomeIcon className={`h-5 w-5 text-blue-500 ${open ? "mr-3" : ""}`} />
                            {open && <span>Inicio</span>}
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard/users" className={getLinkClasses("/dashboard/users")}>
                            <UsersIcon className={`h-5 w-5 text-blue-500 ${open ? "mr-3" : ""}`} />
                            {open && <span>Usuarios</span>}
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard/cajas" className={getLinkClasses("/dashboard/cajas")}>
                            <ComputerDesktopIcon className={`h-5 w-5 text-blue-500 ${open ? "mr-3" : ""}`} />
                            {open && <span>Cajas</span>}
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard/servicios" className={getLinkClasses("/dashboard/servicios")}>
                            <WrenchScrewdriverIcon className={`h-5 w-5 text-blue-500 ${open ? "mr-3" : ""}`} />
                            {open && <span>Servicios</span>}
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard/movimientos" className={getLinkClasses("/dashboard/movimientos")}>
                            <ArrowsRightLeftIcon className={`h-5 w-5 text-blue-500 ${open ? "mr-3" : ""}`} />
                            {open && <span>Movimientos</span>}
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard/cierres" className={getLinkClasses("/dashboard/cierres")}>
                            <LockOpenIcon className={`h-5 w-5 text-blue-500 ${open ? "mr-3" : ""}`} />
                            {open && <span>Aperturas y Cierres</span>}
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard/folios" className={getLinkClasses("/dashboard/folios")}>
                            <NewspaperIcon className={`h-5 w-5 text-blue-500 ${open ? "mr-3" : ""}`} />
                            {open && <span>Solicitar Folios</span>}
                        </Link>
                    </li>
                </ul>
            </nav>

            <div className={`mt-auto pt-4 border-t border-gray-200 ${!open && "text-center"}`}>
                {open ? (
                    <p className="text-sm text-gray-500">Versión 1.0.3</p>
                ) : (
                    <p className="text-xs text-gray-500">v1.0.3</p>
                )}
            </div>
        </aside>
    );
}

export default Sidebar;
