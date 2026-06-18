import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { ToolCase, Users, CheckCircle, Clock, Package, RefreshCw, FileDown } from "lucide-react"
import { getEquipmentDashboardSummaryAPI, getDeliveriesByEquipmentAPI, getPendingEmployeesAPI } from "../api/DeliveryEquipmentReportAPI"
import { ExcelEquipmentReportAPI } from "../api/ExcelEquipmentReport"
import { STATUS_LABELS, STATUS_COLORS } from "../../employeeBenefited/schema/constants"
import type { PendingEmployee } from "../schema/types"
import DashboardTabs from "@/shared/components/DashboardTabs"

const TODAY = new Date().toISOString().split("T")[0]

// ── KPI Card ──────────────────────────────────────────────────────────────────
type KpiCardProps = {
    label:      string
    value:      number
    icon:       React.ReactNode
    colorClass: string
}

function KpiCard({ label, value, icon, colorClass }: KpiCardProps) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                {icon}
            </div>
            <div>
                <p className="text-2xl font-bold text-slate-800">{value}</p>
                <p className="text-xs text-slate-500 font-medium leading-tight">{label}</p>
            </div>
        </div>
    )
}

function SectionHeader({ title }: { title: string }) {
    return (
        <div className="table-header rounded-xl mb-4 px-5 py-3">
            <h2 className="table-title text-base">{title}</h2>
        </div>
    )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function DeliveryEquipmentDashboardView() {
    const [summaryDate,       setSummaryDate]       = useState(TODAY)
    const [chartFrom,         setChartFrom]         = useState(TODAY.slice(0, 7) + "-01")
    const [chartTo,           setChartTo]           = useState(TODAY)
    const [pendingSearch,     setPendingSearch]      = useState("")
    const [downloadingExcel,  setDownloadingExcel]  = useState(false)

    async function handleDownloadExcel() {
        setDownloadingExcel(true)
        try {
            const blob = await ExcelEquipmentReportAPI({ from: chartFrom, to: chartTo })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `reporte_equipos_${chartFrom}_${chartTo}.xlsx`
            a.click()
            URL.revokeObjectURL(url)
        } finally {
            setDownloadingExcel(false)
        }
    }

    const { data: summary, isLoading: loadingSummary } = useQuery({
        queryKey: ["equipment-dashboard-summary", summaryDate],
        queryFn:  () => getEquipmentDashboardSummaryAPI(summaryDate),
    })

    const { data: byEquipment, isLoading: loadingByEquipment } = useQuery({
        queryKey: ["equipment-by-equipment", chartFrom, chartTo],
        queryFn:  () => getDeliveriesByEquipmentAPI({ from: chartFrom, to: chartTo }),
    })

    const { data: pendingData, isLoading: loadingPending } = useQuery({
        queryKey: ["equipment-pending-employees"],
        queryFn:  getPendingEmployeesAPI,
    })

    const filteredPending = (pendingData?.employees ?? []).filter((emp: PendingEmployee) => {
        const term = pendingSearch.toLowerCase()
        return (
            emp.employee_name.toLowerCase().includes(term) ||
            (emp.department_name ?? "").toLowerCase().includes(term) ||
            (emp.employee_position ?? "").toLowerCase().includes(term)
        )
    })

    return (
        <div className="min-h-screen bg-[#f8fafc] p-6 space-y-8">

            {/* ── Page title ─────────────────────────────────────────── */}
            <DashboardTabs />

            {/* ── KPI Section ────────────────────────────────────────── */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <SectionHeader title="Resumen del día" />
                    <input
                        type="date"
                        value={summaryDate}
                        onChange={(e) => setSummaryDate(e.target.value)}
                        className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {loadingSummary ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-slate-200 h-24 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <KpiCard label="Total empleados beneficiados" value={summary?.total_employees     ?? 0} icon={<Users       size={22} className="text-white" />} colorClass="bg-gradient-to-br from-blue-500 to-blue-700" />
                        <KpiCard label="Pendientes de entrega"         value={summary?.pending_delivery    ?? 0} icon={<Package     size={22} className="text-white" />} colorClass="bg-gradient-to-br from-amber-400 to-amber-500" />
                        <KpiCard label="Pendientes de foto final"      value={summary?.pending_final_photo ?? 0} icon={<Clock       size={22} className="text-white" />} colorClass="bg-gradient-to-br from-violet-400 to-violet-600" />
                        <KpiCard label="Proceso completado"            value={summary?.completed           ?? 0} icon={<CheckCircle size={22} className="text-white" />} colorClass="bg-gradient-to-br from-emerald-400 to-emerald-600" />
                        <KpiCard label="Entregas registradas hoy"      value={summary?.deliveries_today    ?? 0} icon={<ToolCase    size={22} className="text-white" />} colorClass="bg-gradient-to-br from-teal-400 to-teal-600" />
                        <KpiCard label="Cambios de equipo hoy"         value={summary?.changes_today       ?? 0} icon={<RefreshCw   size={22} className="text-white" />} colorClass="bg-gradient-to-br from-orange-400 to-orange-500" />
                    </div>
                )}
            </section>

            {/* ── Charts + Pending grid ───────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Bar chart: equipment delivery counts */}
                <section className="bg-white rounded-2xl border border-slate-200 shadow-md p-5">
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <SectionHeader title="Equipos más entregados" />
                        <div className="flex gap-2 flex-wrap">
                            <input
                                type="date"
                                value={chartFrom}
                                onChange={(e) => setChartFrom(e.target.value)}
                                className="border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <span className="text-slate-400 self-center text-xs">—</span>
                            <input
                                type="date"
                                value={chartTo}
                                onChange={(e) => setChartTo(e.target.value)}
                                className="border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <button
                                onClick={handleDownloadExcel}
                                disabled={downloadingExcel}
                                className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <FileDown size={14} />
                                {downloadingExcel ? "Descargando..." : "Excel"}
                            </button>
                        </div>
                    </div>

                    {loadingByEquipment ? (
                        <div className="h-64 animate-pulse bg-slate-100 rounded-xl" />
                    ) : (byEquipment?.equipment?.length ?? 0) === 0 ? (
                        <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
                            Sin datos para el rango seleccionado
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={byEquipment?.equipment} margin={{ top: 4, right: 8, left: -10, bottom: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="equipment_name"
                                    tick={{ fontSize: 11, fill: "#64748b" }}
                                    angle={-35}
                                    textAnchor="end"
                                    interval={0}
                                />
                                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: "0.75rem", border: "1px solid #e2e8f0", fontSize: "0.8rem" }}
                                />
                                <Legend wrapperStyle={{ fontSize: "0.75rem", paddingTop: "1rem" }} />
                                <Bar dataKey="total_delivered" name="Entregas"       radius={[4, 4, 0, 0]} fill="#3b82f6" />
                                <Bar dataKey="total_changed"   name="Cambios"        radius={[4, 4, 0, 0]} fill="#f59e0b" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}

                    {(byEquipment?.equipment?.length ?? 0) > 0 && (
                        <div className="mt-3 flex justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
                            <span>{byEquipment?.equipment.length} tipo(s) de equipo</span>
                            <span>{byEquipment?.total_deliveries} transacciones totales</span>
                        </div>
                    )}
                </section>

                {/* Pending employees grid */}
                <section className="bg-white rounded-2xl border border-slate-200 shadow-md p-5">
                    <div className="flex items-center justify-between mb-4">
                        <SectionHeader title="Empleados pendientes" />
                    </div>

                    <input
                        type="text"
                        placeholder="Buscar por nombre, departamento o puesto..."
                        value={pendingSearch}
                        onChange={(e) => setPendingSearch(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-700 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    {loadingPending ? (
                        <div className="space-y-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-14 animate-pulse bg-slate-100 rounded-xl" />
                            ))}
                        </div>
                    ) : filteredPending.length === 0 ? (
                        <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
                            {pendingSearch ? "Sin resultados para la búsqueda" : "Todos los empleados han completado el proceso"}
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                            {filteredPending.map((emp: PendingEmployee) => (
                                <div
                                    key={emp.employee_benefited_id}
                                    className="border border-slate-200 rounded-xl p-3 hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">{emp.employee_name}</p>
                                            <p className="text-xs text-slate-500">
                                                {emp.employee_position ?? "—"} · {emp.department_name ?? "—"}
                                            </p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[emp.status]}`}>
                                                {STATUS_LABELS[emp.status]}
                                            </span>
                                            {emp.last_delivery_date && (
                                                <p className="text-xs text-slate-400 mt-1">
                                                    {new Date(emp.last_delivery_date).toLocaleDateString("es-GT")}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {(pendingData?.total ?? 0) > 0 && (
                        <div className="mt-3 flex justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
                            <span>{pendingData?.total} empleados pendientes</span>
                        </div>
                    )}
                </section>
            </div>

            {/* ── Delivery detail table ───────────────────────────────── */}
            {(byEquipment?.equipment?.length ?? 0) > 0 && (
                <section>
                    <SectionHeader title="Detalle por equipo" />
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Equipo</th>
                                    <th className="table-cell-center">Entregas</th>
                                    <th className="table-cell-center">Cambios</th>
                                    <th className="table-cell-center">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {byEquipment?.equipment.map((item, index) => (
                                    <tr key={item.equipment_id}>
                                        <td className="text-slate-400 text-xs">{index + 1}</td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                                                    <ToolCase size={14} className="text-white" />
                                                </div>
                                                <span className="font-medium text-slate-800">{item.equipment_name}</span>
                                            </div>
                                        </td>
                                        <td className="table-cell-center">
                                            <span className="badge badge-info">{item.total_delivered}</span>
                                        </td>
                                        <td className="table-cell-center">
                                            <span className="badge badge-warning">{item.total_changed}</span>
                                        </td>
                                        <td className="table-cell-center font-semibold text-slate-700">{item.total}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </div>
    )
}
