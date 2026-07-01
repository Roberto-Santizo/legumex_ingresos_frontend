import z from "zod"
import { paginationSchema } from "@/shared/schemas/paginateSchemas"

export const createEquipmentSchema = z.object({
    equipment_name: z.string(),
    equipment_description: z.string(),
    created_by: z.string(),
})

export const getAllEquipmentSchema = z.object({
    equipment_id: z.number(),
    equipment_name: z.string(),
    equipment_description: z.string(),
    created_by: z.string(),
})

export const getEquipmentByIdSchema = z.object({
    equipment_id: z.number(),
    equipment_name: z.string(),
    equipment_description: z.string(),
})

export const getAllEquipmentListSchema = z.array(getAllEquipmentSchema)

export const getAllEquipmentPaginatedSchema = paginationSchema(getAllEquipmentSchema)

export type CreateEquipmentFormData = z.infer<typeof createEquipmentSchema>
export type GetEquipmentData = z.infer<typeof getAllEquipmentSchema>
export type GetAllEquipmentListData = z.infer<typeof getAllEquipmentListSchema>
export type GetEquipmentByIdData = z.infer<typeof getEquipmentByIdSchema>