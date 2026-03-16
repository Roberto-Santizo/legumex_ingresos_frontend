import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaginationComponent({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 7;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages < 1) return null;

  return (
    <div className="m-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200">
        {/* Información de página */}
        <div className="flex items-center gap-2 text-sm order-2 sm:order-1">
          <span className="text-gray-500 font-medium">Página</span>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-200/60">
            <span className="font-bold text-cyan-700">{currentPage}</span>
            <span className="text-cyan-400 font-medium">de</span>
            <span className="font-bold text-blue-700">{totalPages}</span>
          </div>
        </div>

        {/* Controles de navegación */}
        <div className="flex items-center gap-2 order-1 sm:order-2">
          {/* Botón Anterior */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 hover:border-cyan-400 hover:text-cyan-600 hover:shadow-md disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-700 disabled:hover:shadow-none transition-all duration-200"
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          {/* Números de Página */}
          <div className="flex items-center gap-1.5">
            {getPageNumbers().map((page, index) => (
              page === '...' ? (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-400 font-bold select-none">
                  •••
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => onPageChange(page as number)}
                  className={`min-w-[42px] h-[42px] rounded-xl text-sm font-bold transition-all duration-200 ${
                    currentPage === page
                      ? "bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/40 scale-105 border-2 border-cyan-400"
                      : "bg-white text-gray-700 border-2 border-gray-200 hover:border-cyan-400 hover:text-cyan-600 hover:shadow-md hover:scale-105"
                  }`}
                >
                  {page}
                </button>
              )
            ))}
          </div>

          {/* Botón Siguiente */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 hover:border-cyan-400 hover:text-cyan-600 hover:shadow-md disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-700 disabled:hover:shadow-none transition-all duration-200"
          >
            <span className="hidden sm:inline">Siguiente</span>
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}