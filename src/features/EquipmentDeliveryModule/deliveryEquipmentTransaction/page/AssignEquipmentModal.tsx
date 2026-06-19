import { useState } from "react"
import { X, Plus, Trash2, User } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import Select from "react-select"
import { Spinner } from "@/shared/components/Spinner"
import { searchableSelectStyles } from "@/shared/components/ui/searchableSelectStyles"
import { getEquipmentWithFiltersAPI } from "../../equipment/api/EquipmentAPI"
import { createEquipmentTransactionAPI } from "../api/DeliveryEquipmentTransactionAPI"
import { STATUS_LABELS, STATUS_COLORS } from "../../employeeBenefited/schema/constants"
import type { EmployeeBenefited } from "../../employeeBenefited/schema/types"
import type { CreateTransactionItem } from "../schema/types"

type Props = {
    employee: EmployeeBenefited
    onClose: () => void
}

const emptyItem = (): CreateTransactionItem => ({
    equipment_id: 0,
    equipment_condition: 'NEW',
    delivery_equipment_type: 'DELIVERED',
    is_paid: false,
    delivery_notes: '',
})

export default function AssignEquipmentModal({ employee, onClose }: Props) {
    const queryClient = useQueryClient()
    const [items, setItems] = useState<CreateTransactionItem[]>([emptyItem()])

    const { data: equipmentData, isLoading: loadingEquipment } = useQuery({
        queryKey: ['equipments-select'],
        queryFn: () => getEquipmentWithFiltersAPI({ page: 1 }),
    })

    const equipmentOptions = (equipmentData?.response ?? []).map(equipmentItem => ({
        value: equipmentItem.equipment_id,
        label: equipmentItem.equipment_name,
    }))

    const { mutate, isPending } = useMutation({
        mutationFn: createEquipmentTransactionAPI,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employeeBenefited'] })
            toast.success('Equipo asignado correctamente')
            onClose()
        },
        onError: (error: Error) => {
            toast.error(error.message ?? 'Error al asignar equipo')
        },
    })

    const addItem = () => setItems(currentItems => [...currentItems, emptyItem()])

    const removeItem = (index: number) =>
        setItems(currentItems => currentItems.filter((_unusedItem, itemIndex) => itemIndex !== index))

    const updateItem = <FieldKey extends keyof CreateTransactionItem>(
        index: number,
        key: FieldKey,
        value: CreateTransactionItem[FieldKey]
    ) => {
        setItems(currentItems =>
            currentItems.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item))
        )
    }

    const handleSubmit = () => {
        const hasInvalidItem = items.some(item => !item.equipment_id)
        if (hasInvalidItem) {
            toast.error('Selecciona un equipo en cada fila')
            return
        }
        mutate({
            employee_benefited_id: employee.employee_benefited_id,
            items: items.map(item => ({
                ...item,
                delivery_notes: item.delivery_notes || undefined,
            })),
        })
    }

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-2 sm:p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b shrink-0">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-800">Asignar Material de Trabajo</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 px-4 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5">

                    {/* Employee Card */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-200 text-center sm:text-left">
                        <div className="w-20 h-20 sm:w-36 sm:h-36 rounded-xl bg-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                            {employee.photo_url ? (
                                <img
                                    src={employee.photo_url}
                                    alt={employee.employee_name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-10 h-10 sm:w-14 sm:h-14 text-slate-400" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0 w-full">
                            <p className="text-base font-semibold text-gray-900 truncate">
                                {employee.employee_name}
                            </p>
                            <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-0.5 mt-1 text-sm text-gray-500">
                                {employee.employee_code && (
                                    <span>Código: {employee.employee_code}</span>
                                )}
                                {employee.employee_position && (
                                    <span>{employee.employee_position}</span>
                                )}
                                {employee.department_name && (
                                    <span>{employee.department_name}</span>
                                )}
                            </div>
                        </div>
                        <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${STATUS_COLORS[employee.status]}`}
                        >
                            {STATUS_LABELS[employee.status]}
                        </span>
                    </div>

                    {/* Equipment Section */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">
                            Equipos a asignar
                        </h3>

                        {loadingEquipment ? (
                            <div className="flex justify-center py-6">
                                <Spinner />
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="p-3 border border-gray-200 rounded-xl bg-gray-50 space-y-2"
                                    >
                                        {/* Fila 1: equipo + condición + eliminar */}
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <div className="flex-1">
                                                <Select
                                                    options={equipmentOptions}
                                                    placeholder="Buscar equipo..."
                                                    isSearchable
                                                    isClearable
                                                    noOptionsMessage={() => "No se encontraron equipos"}
                                                    value={equipmentOptions.find(option => option.value === item.equipment_id) || null}
                                                    onChange={(selected) =>
                                                        updateItem(index, 'equipment_id', selected?.value ?? 0)
                                                    }
                                                    styles={searchableSelectStyles}
                                                />
                                            </div>

                                            <div className="flex gap-2">
                                                <select
                                                    value={item.equipment_condition}
                                                    onChange={(event) =>
                                                        updateItem(index, 'equipment_condition', event.target.value as 'NEW' | 'USED')
                                                    }
                                                    className="flex-1 sm:w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                >
                                                    <option value="NEW">Nuevo</option>
                                                    <option value="USED">Usado</option>
                                                </select>

                                                {items.length > 1 && (
                                                    <button
                                                        onClick={() => removeItem(index)}
                                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Fila 2: tipo de entrega + is_paid condicional */}
                                        <div className="flex flex-wrap items-center gap-3">
                                            <select
                                                value={item.delivery_equipment_type}
                                                onChange={(event) => {
                                                    const deliveryType = event.target.value as 'DELIVERED' | 'CHANGE'
                                                    updateItem(index, 'delivery_equipment_type', deliveryType)
                                                    if (deliveryType === 'DELIVERED') {
                                                        updateItem(index, 'is_paid', false)
                                                    }
                                                }}
                                                className="w-full sm:w-36 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            >
                                                <option value="DELIVERED">Entrega</option>
                                                <option value="CHANGE">Cambio</option>
                                            </select>

                                            {item.delivery_equipment_type === 'CHANGE' && (
                                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                                    <input
                                                        type="checkbox"
                                                        checked={item.is_paid}
                                                        onChange={(event) =>
                                                            updateItem(index, 'is_paid', event.target.checked)
                                                        }
                                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-600 font-medium">Pagado</span>
                                                </label>
                                            )}
                                        </div>

                                        {/* Fila 3: notas */}
                                        <input
                                            type="text"
                                            value={item.delivery_notes ?? ''}
                                            onChange={(event) =>
                                                updateItem(index, 'delivery_notes', event.target.value)
                                            }
                                            placeholder="Notas adicionales (opcional)"
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={addItem}
                            className="mt-3 flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                            <Plus size={15} />
                            Agregar equipo
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t shrink-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    >
                        {isPending ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </div>
        </div>
    )
}
