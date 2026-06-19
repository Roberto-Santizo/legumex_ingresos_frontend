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

export const deliveryHistoryItemSchema = z.object({
    delivery_equipment_transaction_id: z.number(),
    delivery_batch_id: z.number(),
    delivery_date: z.string(),
    delivery_equipment_type: z.enum(['DELIVERED', 'CHANGE']),
    is_paid: z.boolean().nullable(),
    delivery_notes: z.string().nullable(),
    delivery_photo_url: z.string().nullable(),
    equipment_name: z.string().nullable(),
    equipment_condition: z.enum(['NEW', 'USED']).nullable(),
    delivered_by_name: z.string().nullable(),
})

export const deliveryHistoryListSchema = z.array(deliveryHistoryItemSchema)

export type CreateTransactionItem = z.infer<typeof createTransactionItemSchema>
export type UploadFinalPhotoPayload = z.infer<typeof uploadFinalPhotoSchema>
export type CreateTransactionPayload = z.infer<typeof createTransactionPayloadSchema>
export type DeliveryHistoryItem = z.infer<typeof deliveryHistoryItemSchema>
