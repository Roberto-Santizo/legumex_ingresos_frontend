import { useId, useRef } from "react"
import { CalendarDays, Search, SlidersHorizontal, X } from "lucide-react"

export type VisitSearchFilters = { name: string; document_number: string; company_name: string }

type Props = {
    filters: VisitSearchFilters
    date: string
    today: string
    onChange: (field: keyof VisitSearchFilters, value: string) => void
    onDateChange: (date: string) => void
    onSearch: () => void
    onClear: () => void
}

function SearchField({ label, placeholder, value, numeric, onChange }: {
    label: string
    placeholder: string
    value: string
    numeric?: boolean
    onChange: (value: string) => void
}) {
    const id = useId()
    const inputRef = useRef<HTMLInputElement>(null)

    return (
        <div className="space-y-1.5 min-w-0">
            <label htmlFor={id} className="text-sm font-semibold text-slate-700">{label}</label>
            <div className="relative">
                <Search size={17} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                    ref={inputRef}
                    id={id}
                    type="text"
                    inputMode={numeric ? "numeric" : "text"}
                    autoComplete="off"
                    value={value}
                    onChange={event => onChange(event.target.value)}
                    onKeyDown={event => {
                        if (event.key === "Escape") {
                            event.preventDefault()
                            onChange("")
                        }
                    }}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
                />
                {value && (
                    <button
                        type="button"
                        onClick={() => { onChange(""); inputRef.current?.focus() }}
                        aria-label={`Limpiar ${label.toLowerCase()}`}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-blue-500"
                    >
                        <X size={15} aria-hidden="true" />
                    </button>
                )}
            </div>
        </div>
    )
}

export default function VisitFilters({ filters, date, today, onChange, onDateChange, onSearch, onClear }: Props) {
    const dateId = useId()
    const hasFilters = Object.values(filters).some(Boolean) || date !== today

    return (
        <form
            role="search"
            aria-label="Filtrar visitas"
            onSubmit={event => { event.preventDefault(); onSearch() }}
            className="px-4 sm:px-6 py-5 space-y-4 border-b border-slate-200 bg-slate-50/70"
        >
            <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <SlidersHorizontal size={17} aria-hidden="true" /> Buscar visitas
                </p>
                <p className="mt-1 text-sm text-slate-500">Escribe parte del nombre, DPI o empresa. Puedes combinar los filtros.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <SearchField label="Nombre del visitante" placeholder="Buscar por nombre..." value={filters.name} onChange={value => onChange("name", value)} />
                <SearchField label="DPI" placeholder="Buscar por DPI..." numeric value={filters.document_number} onChange={value => onChange("document_number", value)} />
                <SearchField label="Empresa" placeholder="Buscar por empresa..." value={filters.company_name} onChange={value => onChange("company_name", value)} />
                <div className="space-y-1.5">
                    <label htmlFor={dateId} className="text-sm font-semibold text-slate-700">Fecha de la visita</label>
                    <div className="relative">
                        <CalendarDays size={17} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                            id={dateId}
                            type="date"
                            value={date}
                            onChange={event => onDateChange(event.target.value)}
                            className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
                {date !== today && (
                    <button type="button" onClick={() => onDateChange(today)} className="sm:mr-auto text-sm font-medium text-blue-600 hover:underline">Volver a hoy</button>
                )}
                <div className="flex items-center gap-2">
                    <button type="button" onClick={onClear} disabled={!hasFilters} className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed">
                        Limpiar filtros
                    </button>
                    <button type="submit" className="btn-primary flex-1 sm:flex-none justify-center gap-2">
                        <Search size={16} aria-hidden="true" /> Buscar
                    </button>
                </div>
            </div>
        </form>
    )
}
