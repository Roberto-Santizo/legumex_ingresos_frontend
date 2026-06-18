import { z } from "zod"

export const equipmentDashboardSummarySchema = z.object({
    date:                z.string(),
    total_employees:     z.number(),
    pending_delivery:    z.number(),
    pending_final_photo: z.number(),
    completed:           z.number(),
    deliveries_today:    z.number(),
    changes_today:       z.number(),
})

export const equipmentDeliverySummarySchema = z.object({
    equipment_id:    z.number(),
    equipment_name:  z.string(),
    total_delivered: z.number(),
    total_changed:   z.number(),
    total:           z.number(),
})

export const deliveriesByEquipmentResponseSchema = z.object({
    from:             z.string(),
    to:               z.string(),
    total_deliveries: z.number(),
    equipment:        z.array(equipmentDeliverySummarySchema),
})

export const pendingEmployeeSchema = z.object({
    employee_benefited_id: z.number(),
    employee_name:         z.string(),
    employee_code:         z.string().nullable(),
    employee_position:     z.string().nullable(),
    department_name:       z.string().nullable(),
    status:                z.enum(["DELIVER_EQUIPMENT", "FINAL_PHOTO", "COMPLETED"]),
    last_delivery_date:    z.string().nullable(),
})

export const pendingEmployeesResponseSchema = z.object({
    total:     z.number(),
    employees: z.array(pendingEmployeeSchema),
})

export type EquipmentDashboardSummary       = z.infer<typeof equipmentDashboardSummarySchema>
export type EquipmentDeliverySummary        = z.infer<typeof equipmentDeliverySummarySchema>
export type DeliveriesByEquipmentResponse   = z.infer<typeof deliveriesByEquipmentResponseSchema>
export type PendingEmployee                 = z.infer<typeof pendingEmployeeSchema>
export type PendingEmployeesResponse        = z.infer<typeof pendingEmployeesResponseSchema>
