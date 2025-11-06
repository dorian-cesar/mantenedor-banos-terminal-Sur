import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";

export const metadata = {
    title: 'Mantenedor Baños',
    description: 'Gestión de baños',
};

export default function DashboardLayout({ children }) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
  
        {/* Contenido principal */}
        <div className="flex flex-col flex-1 min-w-0">
          <Navbar />
          <main className="flex-1 p-6 overflow-y-auto min-w-0">{children}</main>
        </div>
      </div>
    );
  }
