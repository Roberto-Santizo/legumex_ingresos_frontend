import { NavLink } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface NavLinkComponentProps {
  url: string;
  text: string;
  children: React.ReactNode; // el icono
}

export default function NavLinkComponent({ url, text, children }: NavLinkComponentProps) {
  return (
    <NavLink
      to={url}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative overflow-hidden ${
          isActive
            ? "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-900 shadow-sm"
            : "text-white hover:bg-slate-50"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 to-orange-600 rounded-r-full"></div>
          )}
          <span
            className={`w-5 h-5 flex items-center justify-center transition-colors ${
              isActive ? "text-amber-600" : "text-white group-hover:text-amber-600"
            }`}
          >
            {children}
          </span>
          <span className="font-medium text-sm">{text}</span>
          {isActive && <ChevronRight className="w-4 h-4 ml-auto text-amber-600" />}
        </>
      )}
    </NavLink>
  );
}
