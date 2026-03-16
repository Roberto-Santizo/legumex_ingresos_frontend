import Navegation from "@/app/layouts/Navegation";

interface SidebarProps {
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, mobileMenuOpen, setMobileMenuOpen }: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 
        bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
        border-r border-slate-700 transition-all duration-300 
        z-40 hidden lg:block shadow-xl ${
          sidebarOpen ? "w-64" : "w-0"
        } overflow-hidden`}
      >
        <nav className="p-4 space-y-1">
          <Navegation />
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 bg-slate-700 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <aside className="absolute top-0 left-0 bottom-0 w-72 bg-slate-800 shadow-2xl animate-in slide-in-from-left duration-300">
            <nav className="p-4 space-y-1">
              <Navegation />
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}