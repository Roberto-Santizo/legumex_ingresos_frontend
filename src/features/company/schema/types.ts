import { paginationSchema } from "@/shared/schemas/paginateSchemas"
import z from "zod"

export const createCompany = z.object({
    name: z.string()
})

export const resposeCompany = z.object({
    id: z.number(),
    name: z.string()
})

export const companyForSelectSchema = z.object({
    id: z.number(),
    name: z.string(),
})

export const getCompanyByIdSchema = z.object({
    id: z.number(),
    name: z.string()
})

export const getCompanyResponse = paginationSchema(resposeCompany)
export type CreateCompanyFormData = z.infer<typeof createCompany>
export type GetCompanyResponse = z.infer<typeof resposeCompany>