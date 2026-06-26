import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { TableContainer, TableHeader, Table, TableHead, TableBody, TableRow, Th, Td, TableEmpty, TableActions } from "@/shared/components/ui/StyledTable"
import { Pencil, Eye, X, Trash2, Search } from "lucide-react"
import { toast } from "react-toastify"
import { getVisitsAPI, deleteVisitAPI } from "@/features/visits/api/VisitAPI"
import { getVisitorByIdAPI } from "@/features/visitors/api/VisitorsAPI"
import PaginationComponent from "@/shared/components/PaginationComponent"
import { useAuth } from "@/hooks/useAuth"

const STATUS_BADGE: Record<string, string> = {
    PROGRAMADA: "badge-warning",
    "EN PLANTA": "badge-success",
    FINALIZADA: "badge-info",
    CANCELADA: "badge-error",
}

function StatusBadge({ name }: { name?: string }) {
    if (!name) return <span className="text-slate-400">—</span>
    return <span className={STATUS_BADGE[name] ?? "badge-info"}>{name}</span>
}

type PhotoTarget = { personId: number; photoType: "document_photo_front" | "license_photo" }

function PhotoPreviewModal({ target, onClose }: { target: PhotoTarget; onClose: () => void }) {
    const { data, isLoading } = useQuery({
        queryKey: ["visitor-photo", target.personId, target.photoType],
        queryFn: () => getVisitorByIdAPI(target.personId),
    })

    const url = data?.[target.photoType] ?? null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={onClose}
        >
            <div
                className="relative bg-white rounded-lg shadow-xl w-full max-w-lg p-4"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                    title="Cerrar"
                >
                    <X size={20} />
                </button>
                <div className="mt-4">
                    {isLoading && <p className="text-center text-slate-500 py-8">Cargando foto...</p>}
                    {!isLoading && url && (
                        <img src={url} alt="Vista previa" className="w-full h-auto rounded max-h-[75vh] object-contain" />
                    )}
                    {!isLoading && !url && (
                        <p className="text-center text-slate-400 py-8">Sin foto disponible</p>
                    )}
                </div>
            </div>
        </div>
    )
}

// Inline delete confirmation modal — shown when user clicks the trash button
function ConfirmDeleteModal({ visitId, onClose }: { visitId: number; onClose: () => void }) {
    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationFn: () => deleteVisitAPI(visitId),
        onError: (error) => { toast.error(error.message); onClose() },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["visits"] })
            toast.success(data.message)
            onClose()
        },
    })

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={onClose}
        >
            <div
                className="relative bg-white rounded-lg shadow-xl w-full max-w-sm p-6 space-y-4"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-base font-semibold text-slate-800">Eliminar visita #{visitId}</h2>
                <p className="text-sm text-slate-600">
                    ¿Estás seguro? Esta acción no se puede deshacer.
                </p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        disabled={isPending}
                        className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => mutate()}
                        disabled={isPending}
                        className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isPending ? "Eliminando..." : "Sí, eliminar"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function TableVisits() {
    const { permissions } = useAuth()
    const canDelete = permissions.includes("visits:delete")

    const [currentPage, setCurrentPage] = useState(1)
    const [photoTarget, setPhotoTarget] = useState<PhotoTarget | null>(null)
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

    // const today = new Date().toISOString().split("T")[0]
    const today = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Guatemala",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(new Date())

    const [selectedDate, setSelectedDate] = useState(today)
    const [inputs, setInputs] = useState({ name: "", document_number: "", company_name: "" })
    const [debouncedFilters, setDebouncedFilters] = useState({ name: "", document_number: "", company_name: "" })

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedFilters(inputs)
            setCurrentPage(1)
        }, 400)
        return () => clearTimeout(timer)
    }, [inputs])

    const { data, isLoading, isError } = useQuery({
        queryKey: ["visits", selectedDate, currentPage, debouncedFilters],
        queryFn: () => getVisitsAPI(currentPage, {
            date: selectedDate,
            name: debouncedFilters.name || undefined,
            document_number: debouncedFilters.document_number || undefined,
            company_name: debouncedFilters.company_name || undefined
        }),
        placeholderData: (previousData) => previousData,
    })

    if (isLoading) return <p className="p-8 text-center text-slate-500">Cargando visitas...</p>
    if (isError) return <p className="p-8 text-center text-red-500">Error al cargar las visitas.</p>

    const list = data?.visits ?? []
    const totalPages = data?.lastPage ?? 1

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
            {photoTarget && (
                <PhotoPreviewModal target={photoTarget} onClose={() => setPhotoTarget(null)} />
            )}
            {confirmDeleteId !== null && (
                <ConfirmDeleteModal
                    visitId={confirmDeleteId}
                    onClose={() => setConfirmDeleteId(null)}
                />
            )}
            <div className="max-w-7xl w-full">
                <TableContainer>
                    <TableHeader
                        title="Listado de visitas"
                        linkTo="/visits/create"
                        linkText="Crear Visita"
                    />

                    <div className="px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 border-b border-slate-200">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-semibold text-slate-600 whitespace-nowrap">Fecha:</label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={e => { setSelectedDate(e.target.value); setCurrentPage(1) }}
                                className="form-input form-input-normal text-sm py-1 flex-1 sm:w-48 sm:flex-initial"
                            />
                            {selectedDate !== today && (
                                <button
                                    onClick={() => setSelectedDate(today)}
                                    className="text-xs text-amber-600 hover:underline whitespace-nowrap"
                                >
                                    Hoy
                                </button>
                            )}
                        </div>

                        <div className="relative w-full sm:w-auto">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <input
                                type="text"
                                value={inputs.name}
                                onChange={e => setInputs(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Buscar por nombre..."
                                className="pl-8 pr-7 py-1.5 sm:py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-full sm:w-48"
                            />
                            {inputs.name && (
                                <button
                                    onClick={() => setInputs(prev => ({ ...prev, name: "" }))}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X size={13} />
                                </button>
                            )}
                        </div>

                        <div className="relative w-full sm:w-auto">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <input
                                type="text"
                                value={inputs.document_number}
                                onChange={e => setInputs(prev => ({ ...prev, document_number: e.target.value }))}
                                placeholder="Buscar por DPI..."
                                className="pl-8 pr-7 py-1.5 sm:py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-full sm:w-44"
                            />
                            {inputs.document_number && (
                                <button
                                    onClick={() => setInputs(prev => ({ ...prev, document_number: "" }))}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X size={13} />
                                </button>
                            )}
                        </div>
                        <div className="relative w-full sm:w-auto">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <input
                                type="text"
                                value={inputs.company_name}
                                onChange={e => setInputs(prev => ({ ...prev, company_name: e.target.value }))}
                                placeholder="Buscar por empresa..."
                                className="pl-8 pr-7 py-1.5 sm:py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-full sm:w-44"
                            />
                            {inputs.company_name && (
                                <button
                                    onClick={() => setInputs(prev => ({ ...prev, company_name: "" }))}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X size={13} />
                                </button>
                            )}
                        </div>
                    </div>

                    {list.length > 0 ? (
                        <>
                            {/* Tarjetas para móvil */}
                            <div className="sm:hidden space-y-3 px-4 py-3">
                                {list.map(visit => (
                                    <div
                                        key={visit.id}
                                        className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-2"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <p className="font-medium text-gray-800 truncate">{visit.company?.name ?? "—"}</p>
                                                {visit.company_person && (
                                                    <p className="text-xs text-slate-400 truncate">{visit.company_person.name}</p>
                                                )}
                                            </div>
                                            <span className="shrink-0">
                                                <StatusBadge name={visit.visit_status?.name} />
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm text-slate-600">
                                            <p><span className="text-slate-400">ID:</span> {visit.id}</p>
                                            <p>
                                                <span className="text-slate-400">Fecha:</span>{" "}
                                                {visit.date ? visit.date.split("T")[0].split("-").reverse().join("/") : "—"}
                                            </p>
                                            <p className="col-span-2"><span className="text-slate-400">Departamento:</span> {visit.department?.name ?? "—"}</p>
                                            <p className="col-span-2"><span className="text-slate-400">Destino:</span> {visit.destination}</p>
                                            <p className="col-span-2"><span className="text-slate-400">Responsable:</span> {visit.responsible_person ?? "—"}</p>
                                            <p><span className="text-slate-400">Placas:</span> {visit.license_plate ?? "—"}</p>
                                            <p><span className="text-slate-400">Entrada:</span> {visit.entry_time ?? "—"}</p>
                                            <p><span className="text-slate-400">Salida:</span> {visit.exit_time ?? "—"}</p>
                                        </div>

                                        {visit.visit_companions && visit.visit_companions.length > 0 && (
                                            <div className="pt-2 border-t border-gray-100">
                                                <p className="text-xs font-semibold text-slate-500 mb-1">Acompañantes</p>
                                                <ul className="text-sm space-y-1">
                                                    {visit.visit_companions.map((c, i) => (
                                                        <li key={c.id ?? i} className="text-slate-600">
                                                            <span className="font-medium">{c.company_person?.name ?? "—"}</span>
                                                            <span className="text-slate-400 ml-1">DPI: {c.company_person?.document_number ?? "—"}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                                            {visit.company_person?.has_document_photo_front && (
                                                <button
                                                    onClick={() => setPhotoTarget({ personId: visit.company_person!.id, photoType: "document_photo_front" })}
                                                    className="btn-icon btn-icon-primary"
                                                    title="Ver DPI"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                            )}
                                            {visit.company_person?.has_license_photo && (
                                                <button
                                                    onClick={() => setPhotoTarget({ personId: visit.company_person!.id, photoType: "license_photo" })}
                                                    className="btn-icon btn-icon-primary"
                                                    title="Ver Licencia"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                            )}
                                            <Link
                                                to={`/visit/${visit.id}/edit`}
                                                className="btn-icon btn-icon-primary"
                                                title="Editar"
                                            >
                                                <Pencil size={16} />
                                            </Link>
                                            {canDelete && visit.visit_status?.name === "PROGRAMADA" && (
                                                <button
                                                    onClick={() => setConfirmDeleteId(visit.id)}
                                                    className="btn-icon btn-icon-danger"
                                                    title="Eliminar visita"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Tabla para tablet y escritorio */}
                            <div className="hidden sm:block overflow-x-auto">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <Th>ID</Th>
                                            <Th>Fecha de la visita</Th>
                                            <Th>Visitante</Th>
                                            <Th align="center">DPI / Licencia</Th>
                                            <Th>Acompañantes</Th>
                                            <Th>Placas de Vehículo</Th>
                                            <Th>Departamento</Th>
                                            <Th>Área de Destino</Th>
                                            <Th>Responsable</Th>
                                            <Th align="center">H. Entrada</Th>
                                            <Th align="center">H. Salida</Th>
                                            <Th align="center">Estado</Th>
                                            <Th align="center">Acciones</Th>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {list.map(visit => (
                                            <TableRow key={visit.id}>
                                                <Td>{visit.id}</Td>
                                                <Td>
                                                    {visit.date
                                                        ? visit.date.split("T")[0].split("-").reverse().join("/")
                                                        : "—"}
                                                </Td>
                                                <Td>
                                                    <div className="text-sm">
                                                        <p className="font-medium">{visit.company?.name ?? "—"}</p>
                                                        {visit.company_person && (
                                                            <p className="text-slate-400">{visit.company_person.name}</p>
                                                        )}
                                                    </div>
                                                </Td>
                                                <Td align="center">
                                                    {visit.company_person ? (
                                                        <div className="flex items-center justify-center gap-2">
                                                            {visit.company_person.has_document_photo_front && (
                                                                <button
                                                                    onClick={() => setPhotoTarget({ personId: visit.company_person!.id, photoType: "document_photo_front" })}
                                                                    className="btn-icon btn-icon-primary"
                                                                    title="Ver DPI"
                                                                >
                                                                    <Eye size={16} />
                                                                </button>
                                                            )}
                                                            {visit.company_person.has_license_photo && (
                                                                <button
                                                                    onClick={() => setPhotoTarget({ personId: visit.company_person!.id, photoType: "license_photo" })}
                                                                    className="btn-icon btn-icon-primary"
                                                                    title="Ver Licencia"
                                                                >
                                                                    <Eye size={16} />
                                                                </button>
                                                            )}
                                                            {!visit.company_person.has_document_photo_front && !visit.company_person.has_license_photo && (
                                                                <span className="text-slate-400 text-xs">Sin fotos</span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">—</span>
                                                    )}
                                                </Td>

                                                <Td>
                                                    {visit.visit_companions && visit.visit_companions.length > 0 ? (
                                                        <ul className="text-sm space-y-1">
                                                            {visit.visit_companions.map((c, i) => (
                                                                <li key={c.id ?? i} className="text-slate-600">
                                                                    <span className="font-medium">{c.company_person?.name ?? "—"}</span>
                                                                    <span className="text-slate-400 ml-1">DPI: {c.company_person?.document_number ?? "—"}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <span className="text-slate-400 text-sm">—</span>
                                                    )}
                                                </Td>
                                                <Td>{visit.license_plate ?? "—"}</Td>
                                                <Td>{visit.department?.name ?? "—"}</Td>
                                                <Td>{visit.destination}</Td>
                                                <Td>{visit.responsible_person ?? "—"}</Td>
                                                <Td align="center">{visit.entry_time ?? "—"}</Td>
                                                <Td align="center">{visit.exit_time ?? "—"}</Td>
                                                <Td align="center">
                                                    <StatusBadge name={visit.visit_status?.name} />
                                                </Td>
                                                <Td align="center">
                                                    <TableActions>
                                                        <Link
                                                            to={`/visit/${visit.id}/edit`}
                                                            className="btn-icon btn-icon-primary"
                                                            title="Editar"
                                                        >
                                                            <Pencil size={16} />
                                                        </Link>
                                                        {/* Delete button — only for PROGRAMADA visits and users with visits:delete permission */}
                                                        {canDelete && visit.visit_status?.name === "PROGRAMADA" && (
                                                            <button
                                                                onClick={() => setConfirmDeleteId(visit.id)}
                                                                className="btn-icon btn-icon-danger"
                                                                title="Eliminar visita"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        )}
                                                    </TableActions>
                                                </Td>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </>
                    ) : (
                        <TableEmpty message="No hay visitas registradas para esta fecha" />
                    )}

                    <PaginationComponent
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </TableContainer>
            </div>
        </div>
    )
}
