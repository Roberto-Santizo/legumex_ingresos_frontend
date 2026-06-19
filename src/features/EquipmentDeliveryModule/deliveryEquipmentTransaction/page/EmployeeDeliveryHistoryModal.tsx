import { useQuery } from "@tanstack/react-query"
import { X, PackageOpen } from "lucide-react"
import { Spinner } from "@/shared/components/Spinner"
import { getEmployeeDeliveryHistoryAPI } from "../api/DeliveryEquipmentTransactionAPI"
import type { EmployeeBenefited } from "../../employeeBenefited/schema/types"
import type { DeliveryHistoryItem } from "../schema/types"

type Props = {
    employee: EmployeeBenefited
    onClose: () => void
}

const DELIVERY_TYPE_LABELS: Record<DeliveryHistoryItem['delivery_equipment_type'], string> = {
    DELIVERED: 'Entrega',
    CHANGE: 'Cambio',
}

const CONDITION_LABELS: Record<'NEW' | 'USED', string> = {
    NEW: 'Nuevo',
    USED: 'Usado',
}

function groupByBatch(items: DeliveryHistoryItem[]) {
    const batches = new Map<number, DeliveryHistoryItem[]>()
    for (const item of items) {
        const batchItems = batches.get(item.delivery_batch_id) ?? []
        batchItems.push(item)
        batches.set(item.delivery_batch_id, batchItems)
    }
    return Array.from(batches.entries()).map(([batchId, batchItems]) => ({ batchId, batchItems }))
}

export default function EmployeeDeliveryHistoryModal({ employee, onClose }: Props) {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["deliveryHistory", employee.employee_benefited_id],
        queryFn: () => getEmployeeDeliveryHistoryAPI(employee.employee_benefited_id),
    })

    const batches = groupByBatch(data ?? [])

    return (
        <div
            className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-2 sm:p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b shrink-0">
                    <div className="min-w-0">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-800">Historial de entregas</h2>
                        <p className="text-sm text-gray-500 truncate">{employee.employee_name}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 px-4 sm:px-6 py-4 sm:py-5">
                    {isLoading ? (
                        <div className="flex justify-center py-10"><Spinner /></div>
                    ) : isError ? (
                        <p className="text-sm text-red-500 py-4">Error al cargar el historial.</p>
                    ) : batches.length > 0 ? (
                        <div className="space-y-4">
                            {batches.map(({ batchId, batchItems }) => (
                                <div key={batchId} className="rounded-xl border border-gray-200 p-4 space-y-3">
                                    <div className="flex flex-wrap items-center justify-between gap-1 text-sm text-gray-500">
                                        <span className="font-medium text-gray-700">
                                            {new Date(batchItems[0].delivery_date).toLocaleDateString('es-GT')}
                                        </span>
                                        {batchItems[0].delivered_by_name && (
                                            <span>Entregado por: {batchItems[0].delivered_by_name}</span>
                                        )}
                                    </div>
                                    <ul className="space-y-2">
                                        {batchItems.map((item) => (
                                            <li key={item.delivery_equipment_transaction_id} className="flex items-start gap-2 text-sm">
                                                <PackageOpen size={16} className="text-slate-400 mt-0.5 shrink-0" />
                                                <div>
                                                    <p className="font-medium text-gray-800">
                                                        {item.equipment_name ?? "Equipo no disponible"}
                                                        {item.equipment_condition && (
                                                            <span className="text-gray-500"> · {CONDITION_LABELS[item.equipment_condition]}</span>
                                                        )}
                                                    </p>
                                                    <p className="text-gray-500">
                                                        {DELIVERY_TYPE_LABELS[item.delivery_equipment_type]}
                                                        {item.delivery_equipment_type === 'CHANGE' && (
                                                            <span> · {item.is_paid ? 'Pagado' : 'No pagado'}</span>
                                                        )}
                                                    </p>
                                                    {item.delivery_notes && (
                                                        <p className="text-gray-400 italic">{item.delivery_notes}</p>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center py-10 text-gray-500">Este empleado aún no tiene entregas registradas.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
