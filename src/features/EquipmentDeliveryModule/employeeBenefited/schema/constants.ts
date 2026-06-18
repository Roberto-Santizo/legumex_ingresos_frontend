export const EMPLOYEE_BENEFITED_STATUS = {
    DELIVER_EQUIPMENT: 'DELIVER_EQUIPMENT',
    FINAL_PHOTO:         'FINAL_PHOTO',
    COMPLETED:           'COMPLETED',
} as const

export type EmployeeBenefitedStatus = typeof EMPLOYEE_BENEFITED_STATUS[keyof typeof EMPLOYEE_BENEFITED_STATUS]

export const STATUS_LABELS: Record<EmployeeBenefitedStatus, string> = {
    DELIVER_EQUIPMENT: 'Entrega de equipo',
    FINAL_PHOTO:         'Foto final',
    COMPLETED:           'Completado',
}

export const STATUS_COLORS: Record<EmployeeBenefitedStatus, string> = {
    DELIVER_EQUIPMENT: 'bg-amber-100 text-amber-700',
    FINAL_PHOTO:         'bg-purple-100 text-purple-700',
    COMPLETED:           'bg-green-100 text-green-700',
}

  