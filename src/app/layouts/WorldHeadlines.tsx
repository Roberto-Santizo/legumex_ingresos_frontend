// Marquee del Mundial 2026: nombres de selecciones en movimiento + label + frase cálida.
// Sin APIs ni estado, solo animación CSS. Drop-in para el header.

const TEAMS = [
  "México",
  "Canadá",
  "Estados Unidos",
  "Argentina",
  "Brasil",
  "Francia",
  "España",
  "Alemania",
  "Portugal",
  "Países Bajos",
  "Bélgica",
  "Croacia",
  "Inglaterra",
  "Uruguay",
  "Colombia",
  "Ecuador",
  "Japón",
  "Corea del Sur",
  "Marruecos",
  "Senegal",
  "Arabia Saudita",
  "Australia",
  "Suiza",
  "Dinamarca",
  "Serbia",
  "Polonia",
  "Nigeria",
  "Costa de Marfil",
  "Ghana",
  "Camerún",
  "Egipto",
  "Túnez",
  "Argelia",
  "Irán",
  "Paraguay",
  "Chile",
  "Costa Rica",
  "Panamá",
];


const FRASE = "Guate no fue, pero igual gritamos los goles 📣⚽";

export default function MundialMarquee() {
  const loop = [...TEAMS, ...TEAMS]; // duplicado para un loop sin cortes

  return (
    <div className="flex items-center gap-3 mt-0.5 max-w-full">
      <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-amber-400 whitespace-nowrap bg-amber-400/10 border border-amber-400/30 rounded-full px-2.5 py-0.5">
        ⚽ Mundial 2026
      </span>

      <div
        className="relative overflow-hidden w-40 sm:w-60 md:w-90 lg:w-120 xl:w-150 bg-slate-800/40 border border-slate-700/50 rounded-full px-3 py-1"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          maskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        }}
      >
        <div className="flex items-center gap-5 w-max animate-[mundialMarquee_45s_linear_infinite] hover:[animation-play-state:paused]">
          {loop.map((team, i) => (
            <span
              key={i}
              className="flex items-center gap-2 leading-none select-none whitespace-nowrap"
            >
              <span className="text-xs sm:text-sm font-semibold text-slate-300">
                {team}
              </span>
              <span className="text-slate-600">•</span>
            </span>
          ))}
        </div>
      </div>

      <span className="hidden lg:inline text- italic text-slate-500 whitespace-nowrap">
        {FRASE}
      </span>

      <style>{`
        @keyframes mundialMarquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
