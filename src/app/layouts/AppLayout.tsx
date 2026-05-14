import { useState } from "react";
// import { Outlet } from "react-router-dom";
import Header from "./HeaderLayout";
import Sidebar from "./SidebarLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { AlertTriangle, X } from "lucide-react";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // const [bannerVisible, setBannerVisible] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <Sidebar
        sidebarOpen={sidebarOpen}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
// This is a warning banner that informs users about any important information regarding the application.
      <main className="pt-16 lg:ml-64 p-6">
        {/* {bannerVisible && (
          <div className="mb-6 rounded-xl overflow-hidden shadow-lg border border-red-700">
            <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 px-4 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="shrink-0 w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                 
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm leading-tight">
                    Aviso importante — Compatibilidad con Chrome <span className="font-bold">Mensaje dejado por(IT)</span>
                  </p>
                  <p className="text-red-100 text-xs mt-0.5 leading-snug">
                    Chrome actualizo sus politicas y puede generar errores al editar datos. Si presenta problemas, use{" "}
                    <span className="font-semibold text-white">Edge, Firefox u otro navegador</span>.{" "}
                    Estamos trabajando para solucionarlo.
                  </p>
                </div> 
              </div>
              <button
                onClick={() => setBannerVisible(false)}
                className="shrink-0 w-7 h-7 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                aria-label="Cerrar aviso"
              >
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        )}
        <Outlet /> */}
      </main>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        pauseOnHover={false}
        pauseOnFocusLoss={false}
      />
    </div>
  );
}
