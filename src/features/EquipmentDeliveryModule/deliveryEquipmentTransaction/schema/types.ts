import z from 'zod'

export const createTransactionItemSchema = z.object({
    equipment_id: z.number().min(1, 'Selecciona un equipo'),
    equipment_condition: z.enum(['NEW', 'USED']),
    delivery_equipment_type: z.enum(['DELIVERED', 'CHANGE']),
    is_paid: z.boolean(),
    delivery_notes: z.string().optional(),
})

export const uploadFinalPhotoSchema = z.object({
    employee_benefited_id: z.number(),
    photo_base64: z.string().min(1, 'La foto es requerida'),
})

export const createTransactionPayloadSchema = z.object({
    employee_benefited_id: z.number(),
    items: z.array(createTransactionItemSchema).min(1),
})

export type CreateTransactionItem = z.infer<typeof createTransactionItemSchema>
export type UploadFinalPhotoPayload = z.infer<typeof uploadFinalPhotoSchema>
export type CreateTransactionPayload = z.infer<typeof createTransactionPayloadSchema>
