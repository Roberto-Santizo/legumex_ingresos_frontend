import z from 'zod'
import { paginationSchema } from "@/shared/schemas/paginateSchemas"

const departmentSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
})

export const externalEmployeeSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    position: z.string(),
    deparment: departmentSchema,
})

export const externalEmployeeListSchema = z.array(externalEmployeeSchema)

export type ExternalEmployee = z.infer<typeof externalEmployeeSchema>

export const employeeBenefitedSchema = z.object({
    employee_benefited_id: z.number(),
    external_id: z.string(),
    employee_name: z.string(),
    employee_code: z.string().nullable(),
    employee_position: z.string().nullable(),
    department_name: z.string().nullable(),
    photo_url: z.string().nullable(),
    status: z.enum(['DELIVER_EQUIPMENT', 'FINAL_PHOTO', 'COMPLETED']),
})

export const employeeBenefitedListSchema = paginationSchema(employeeBenefitedSchema)

export type EmployeeBenefited = z.infer<typeof employeeBenefitedSchema>
 