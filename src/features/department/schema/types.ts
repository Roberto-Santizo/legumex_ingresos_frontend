import { paginationSchema } from "@/shared/schemas/paginateSchemas"
import z from "zod"

export const createDepartmentSchema = z.object({
    name: z.string(),
    code: z.string()
})

export const responseDepartmentSchema = z.object({
    id: z.number(),
    name: z.string(),
    code: z.string()
})

export const departmentSelectSchema = z.object({
    id: z.number(),
    name: z.string(),
})

export const getDepartmentByIdSchema = z.object({
    id: z.number(),
    name: z.string(),
    code: z.string()
})

export const getDepartamentResponse = paginationSchema(responseDepartmentSchema)
export type CreateDepartmentFormData = z.infer<typeof createDepartmentSchema>
export type GetUserResponse = z.infer<typeof getDepartamentResponse>
export type Department = z.infer<typeof departmentSelectSchema>