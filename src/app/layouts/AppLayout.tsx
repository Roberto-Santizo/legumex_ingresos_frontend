import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./HeaderLayout";
import Sidebar from "./SidebarLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

      <main className="pt-16 lg:ml-64 p-6">
        <Outlet />
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
