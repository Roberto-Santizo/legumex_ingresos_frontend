import { useState } from "react"
import { X, Camera, User } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import UploadImages from "@/shared/components/uploadImages/UploadImages"
import { uploadEmployeeFinalPhotoAPI } from "../api/DeliveryEquipmentTransactionAPI"
import { STATUS_LABELS, STATUS_COLORS } from "../../employeeBenefited/schema/constants"
import type { EmployeeBenefited } from "../../employeeBenefited/schema/types"

type Props = {
    employee: EmployeeBenefited
    onClose: () => void
}

export default function FinalPhotoModal({ employee, onClose }: Props) {
    const queryClient = useQueryClient()
    const [photo, setPhoto] = useState<string | null>(null)
    const [openCamera, setOpenCamera] = useState(false)

    const { mutate, isPending } = useMutation({
        mutationFn: uploadEmployeeFinalPhotoAPI,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employeeBenefited'] })
            toast.success('Foto guardada correctamente')
            onClose()
        },
        onError: (error: Error) => {
            toast.error(error.message ?? 'Error al guardar la foto')
        },
    })

    const handleSubmit = () => {
        if (!photo) {
            toast.error('Captura una foto antes de guardar')
            return
        }
        mutate({ employee_benefited_id: employee.employee_benefited_id, photo_base64: photo })
    }

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
                    <h2 className="text-lg font-semibold text-gray-800">Foto Final de Entrega</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

                    {/* Employee Card */}
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="w-14 h-14 rounded-xl bg-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                            {employee.photo_url ? (
                                <img src={employee.photo_url} alt={employee.employee_name} className="w-full h-full object-cover" />
                            ) : (
                                <User size={24} className="text-slate-400" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{employee.employee_name}</p>
                            <div className="flex flex-wrap gap-x-3 mt-0.5 text-xs text-gray-500">
                                {employee.employee_code && <span>Código: {employee.employee_code}</span>}
                                {employee.department_name && <span>{employee.department_name}</span>}
                            </div>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${STATUS_COLORS[employee.status]}`}>
                            {STATUS_LABELS[employee.status]}
                        </span>
                    </div>

                    {/* Photo Section */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-700">Fotografía de entrega</h3>

                        <div className="w-full h-56 rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                            {photo ? (
                                <img src={photo} alt="Foto de entrega" className="w-full h-full object-cover rounded-xl" />
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-slate-400">
                                    <Camera size={40} />
                                    <span className="text-sm">Sin foto</span>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setOpenCamera(true)}
                            className="w-full py-2.5 border-2 border-blue-500 text-blue-600 text-sm font-medium rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <Camera size={16} />
                            {photo ? 'Cambiar foto' : 'Tomar / Subir foto'}
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t shrink-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isPending || !photo}
                        className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    >
                        {isPending ? 'Guardando...' : 'Guardar foto'}
                    </button>
                </div>
            </div>

            {openCamera && (
                <UploadImages
                    onClose={() => setOpenCamera(false)}
                    onSave={(img) => {
                        setPhoto(img)
                        setOpenCamera(false)
                    }}
                />
            )}
        </div>
    )
}
