import React, { useState } from 'react';
import { Search, X, Filter, Package} from 'lucide-react';

type CompanyFilterFormProps = {
  onApply: (filters: {
    name?: string;
  }) => void;
  onClear: () => void;
};

const CompanyFilterForm = ({onApply, onClear}: CompanyFilterFormProps) =>{
    const [filters, setFilters] = useState({
        name: "",
    });
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const {name, value} = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }))
    };
    const handleClear = () => {
        setFilters({ name: '' });
        onClear();
    };

    const handleSubmit = () => {
        onApply({
            name: filters.name || undefined,
        })
    }
    
    return (
        <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
            {/* Header Card */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 mb-6 shadow-xl">
            <div className="flex items-center gap-4">
                <div className="bg-orange-500 p-3 rounded-xl shadow-lg">
                <Filter className="text-white" size={28} strokeWidth={2.5} />
                </div>
                <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                    Filtros de Búsqueda
                </h1>
                <p className="text-blue-100 text-sm">
                    Encuentra tu empresa de manera rápida y eficiente
                </p>
                </div>
            </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="p-8">
                <div className="grid gap-6">
                <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                        <Package size={14} className="text-white" />
                    </div>
                    Nombre de la Empresa
                    </label>
                    <input
                    type="text"
                    name="name"
                    value={filters.name}
                    onChange={handleChange}
                    placeholder="Ej: Tech Solutions"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none"
                    />
                </div>
                </div>
            </div>

            <div className="bg-gray-50 px-8 py-6 flex gap-4 border-t border-gray-200">
                <button
                onClick={handleSubmit}
                className="flex-1 flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg"
                >
                <Search size={20} />
                Aplicar Filtros
                </button>

                <button
                onClick={handleClear}
                className="flex items-center gap-3 bg-white border-2 border-gray-300 text-gray-700 font-bold px-8 py-3 rounded-xl"
                >
                <X size={22} />
                Limpiar
                </button>
            </div>
            </div>

            <div className="mt-6 bg-blue-50 border-l-4 border-blue-600 rounded-r-xl p-5 shadow-md">
            </div>
        </div>
        </div>
  );
}

export default CompanyFilterForm;