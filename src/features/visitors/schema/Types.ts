import { paginationSchema } from "@/shared/schemas/paginateSchemas"
import {z} from "zod"

export const createVisitorSchema = z.object({
    visitor_id: z.number(),
    name: z.string(),
    document_number: z.string(),
    document_photo: z.string(),
    license_number: z.string(),
    license_photo: z.string(),
})

export const responseVisitorSchema = z.object({
    id: z.number(),
    visitor_id: z.number(),
    name: z.string(),
    document_number: z.string(),
    document_photo: z.string(),
    license_number: z.string(),
    license_photo: z.string(),
    visitor: z.object({
        name: z.string()
    }).nullable(),
})

export const getVisitorByIdSchema = z.object({
    id: z.number(),
    visitor_id: z.number(),
    name: z.string(),
    document_number: z.string(),
    document_photo: z.string(),
    license_number: z.string(),
    license_photo: z.string(),
})

export const getVisitor = paginationSchema(responseVisitorSchema)
export type CreateVisitorFormData = z.infer<typeof createVisitorSchema>
export type ResponseVisitorSchema = z.infer<typeof getVisitor>