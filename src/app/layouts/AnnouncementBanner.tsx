import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

export default function AnnouncementBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="mb-1 rounded-xl overflow-hidden shadow-lg border border-red-700">
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0 w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm leading-tight">
              Aviso importante — Duplicidad de informacion
            </p>
            <p className="text-red-100 text-xs mt-0.5 leading-snug">
              Hemos detectado <span className="font-semibold text-white">empresas duplicadas</span>.
              Si no recuerda o no está seguro si la empresa ya fue creada, utilice el{" "}
              <span className="font-semibold text-white">filtro</span> para verificar si ya existe en el{" "}
              <span className="font-semibold text-white">sistema</span> antes de registrarla nuevamente.
            </p>
          </div>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="shrink-0 w-7 h-7 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          aria-label="Cerrar aviso"
        >
          <X className="w-3.5 h-3.5 text-white" />
        </button>
      </div>
    </div>
  );
}
