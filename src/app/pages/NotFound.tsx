import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Error Code */}
        <div className="text-center mb-8">
          <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 mb-4 animate-pulse">
            404
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-amber-500 to-orange-600 mx-auto rounded-full"></div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border-2 border-slate-200">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-amber-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Página No Encontrada
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Lo sentimos, la página que buscas no existe o ha sido movida.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <a
              href="/"
              className="group flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-amber-500/30 hover:scale-105"
            >
              <Home className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Ir al Inicio
            </a>
            
            <button
              onClick={() => window.history.back()}
              className="group flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-8 py-3.5 rounded-xl transition-all duration-300 border-2 border-slate-300 hover:border-amber-500"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Volver Atrás
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm font-medium">
            ¿Necesitas ayuda? Contacta a soporte comunicate con el departamento de IT
          </p>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-amber-400 rounded-full opacity-60 animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-orange-400 rounded-full opacity-60 animate-ping" style={{animationDelay: '700ms'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-amber-500 rounded-full opacity-60 animate-ping" style={{animationDelay: '1400ms'}}></div>
      </div>
    </div>
  );
}