import { NavLink } from "react-router-dom";
import { CalendarDays, ToolCase } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const TABS = [
  {
    to: "/report",
    permission: "visitsReports:view",
    title: "Dashboard",
    subtitle: "Control de acceso a planta",
    icon: CalendarDays,
  },
  {
    to: "/equipment-dashboard",
    permission: "equipmentReports:view",
    title: "Dashboard",
    subtitle: "Control de acceso de entrega de equipo",
    icon: ToolCase,
  },
];

export default function DashboardTabs() {
  const { permissions } = useAuth();
  const tabs = TABS.filter((tab) => permissions.includes(tab.permission));

  return (
    <div className="flex items-center gap-10 flex-wrap">
      {tabs.map(({ to, title, subtitle, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-2 py-1 transition-colors ${
              isActive ? "" : "opacity-50 hover:opacity-80"
            }`
          }
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
            <Icon size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
            <p className="text-sm text-slate-500">{subtitle}</p>
          </div>
        </NavLink>
      ))}
    </div>
  );
}
