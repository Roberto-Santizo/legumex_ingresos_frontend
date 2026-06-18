import { Link } from "react-router-dom";
import { Spinner } from "@/shared/components/Spinner";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Eye, X, Search } from "lucide-react";
import { TableContainer, TableHeader, Table, TableHead, TableBody, TableRow, Th, Td, TableEmpty, TableActions } from "@/shared/components/ui/StyledTable";
import PaginationComponent from "@/shared/components/PaginationComponent";
import { getVisitorAPI, getVisitorByIdAPI } from "../api/VisitorsAPI";

type PhotoType = "document_photo_front" | "document_photo_back" | "license_photo"
type PhotoTarget = { personId: number; photoType: PhotoType }

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
                        <img
                            src={url}
                            alt="Vista previa"
                            className="w-full h-auto rounded max-h-[75vh] object-contain"
                        />
                    )}
                    {!isLoading && !url && (
                        <p className="text-center text-slate-400 py-8">Sin foto disponible</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function TableVisitor() {
    const [currentPage, setCurrentPage] = useState(1)
    const [photoTarget, setPhotoTarget] = useState<PhotoTarget | null>(null)
    const [inputs, setInputs] = useState({ name: "", document_number: "" })
    const [debouncedFilters, setDebouncedFilters] = useState({ name: "", document_number: "" })

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedFilters(inputs)
            setCurrentPage(1)
        }, 400)
        return () => clearTimeout(timer)
    }, [inputs.name, inputs.document_number])

    const { data, isLoading, isError } = useQuery({
        queryKey: ["visitors", currentPage, debouncedFilters],
        queryFn: () => getVisitorAPI({
            page: currentPage,
            name: debouncedFilters.name || undefined,
            document_number: debouncedFilters.document_number || undefined,
        }),
        placeholderData: (previousData) => previousData,
    })

    if (isLoading) return <Spinner fullScreen />
    if (isError) return <p>Error al cargar los datos</p>

    const visitors = data?.response || []
    const totalPages = data?.lastPage || 1

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
            {photoTarget && (
                <PhotoPreviewModal target={photoTarget} onClose={() => setPhotoTarget(null)} />
            )}
            <div className="max-w-6xl w-full">
                <TableContainer>
                    <TableHeader title="Lista de visitantes (Proveedores, Clientes)">
                        <Link to="/people/create" className="btn-primary whitespace-nowrap">
                            Crear Visitante
                        </Link>
                    </TableHeader>

                    <div className="flex flex-col sm:flex-row gap-3 mb-2">
                        <div className="relative flex-1 mt-2 ml-2">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <input
                                type="text"
                                value={inputs.name}
                                onChange={(e) => setInputs((prev) => ({ ...prev, name: e.target.value }))}
                                placeholder="Buscar por nombre..."
                                className="w-full pl-9 pr-9 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                            {inputs.name && (
                                <button
                                    onClick={() => setInputs((prev) => ({ ...prev, name: "" }))}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        <div className="relative flex-1 mt-2 mr-2">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <input
                                type="text"
                                value={inputs.document_number}
                                onChange={(e) => setInputs((prev) => ({ ...prev, document_number: e.target.value }))}
                                placeholder="Buscar por DPI..."
                                className="w-full pl-9 pr-9 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                            {inputs.document_number && (
                                <button
                                    onClick={() => setInputs((prev) => ({ ...prev, document_number: "" }))}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    {visitors.length > 0 ? (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <Th>ID</Th>
                                    <Th>Nombre del Visitante</Th>
                                    <Th>Empresa</Th>
                                    <Th>Número de DPI</Th>
                                    <Th>Número de Licencia</Th>
                                    <Th align="center">DPI (F/P) | Licencia</Th>
                                    <Th align="center">Acciones</Th>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {visitors.map((visitor) => (
                                    <TableRow key={visitor.id}>
                                        <Td>{visitor.id}</Td>
                                        <Td>{visitor.name}</Td>
                                        <Td>{visitor.company?.name ?? "—"}</Td>
                                        <Td>{visitor.document_number}</Td>
                                        <Td>{visitor.license_number ?? "—"}</Td>
                                        <Td align="center">
                                            <div className="flex items-center justify-center gap-2">
                                                {visitor.has_document_photo_front && (
                                                    <button
                                                        onClick={() => setPhotoTarget({ personId: visitor.id, photoType: "document_photo_front" })}
                                                        className="btn-icon btn-icon-primary"
                                                        title="Ver DPI Frontal"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                )}
                                                {visitor.has_document_photo_back && (
                                                    <button
                                                        onClick={() => setPhotoTarget({ personId: visitor.id, photoType: "document_photo_back" })}
                                                        className="btn-icon btn-icon-primary"
                                                        title="Ver DPI Posterior"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                )}
                                                {visitor.has_license_photo && (
                                                    <button
                                                        onClick={() => setPhotoTarget({ personId: visitor.id, photoType: "license_photo" })}
                                                        className="btn-icon btn-icon-primary"
                                                        title="Ver Licencia"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                )}
                                                {!visitor.has_document_photo_front && !visitor.has_document_photo_back && !visitor.has_license_photo && (
                                                    <span className="text-slate-400 text-xs">Sin fotos</span>
                                                )}
                                            </div>
                                        </Td>
                                        <Td align="center">
                                            <TableActions>
                                                <Link
                                                    to={`/people/${visitor.id}/edit`}
                                                    className="btn-icon btn-icon-primary"
                                                    title="Editar"
                                                >
                                                    <Pencil size={16} />
                                                </Link>
                                            </TableActions>
                                        </Td>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <TableEmpty message="No hay visitantes registrados." />
                    )}

                    <PaginationComponent
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </TableContainer>
            </div>
        </div>
    )
}
