import { z } from "zod"

export const createVisitSchema = z.object({
    visitor_id: z.number().min(1, "El visitante es obligatorio"),
    date: z.string(),
    department_id: z.number().min(1, "El departamento es obligatorio"),
    responsible_person: z.string(),
    destination: z.string(),
})

export const checkInSchema = z.object({
    visitor_person_id: z.number().min(1, "Debe seleccionar la persona que llegó"),
    entry_time: z.string(),
    badge_number: z.string(),
    agent_id: z.number().min(1, "El agente es obligatorio"),
    companions: z.array(z.object({
        visitor_person_id: z.number(),
        badge_number: z.string(),
    })).optional(),
})

export const checkOutSchema = z.object({
    exit_time: z.string().min(1, "La hora de salida es obligatoria"),
})

const visitorPersonSchema = z.object({
    id: z.number(),
    name: z.string(),
    document_number: z.string(),
    document_photo: z.string().nullable().optional(),
    license_number: z.string().nullable().optional(),
    license_photo: z.string().nullable().optional(),
})

export const visitResponseSchema = z.object({
    id: z.number(),
    date: z.string().nullable().optional(),
    entry_time: z.string().nullable().optional(),
    exit_time: z.string().nullable().optional(),
    visit_status_id: z.number().nullable().optional(),
    visitor_id: z.number().nullable().optional(),
    visitor_person_id: z.number().nullable().optional(),
    department_id: z.number().nullable().optional(),
    destination: z.string().nullable().optional(),
    responsible_person: z.string().nullable().optional(),
    badge_number: z.string().nullable().optional(),
    agent_id: z.number().nullable().optional(),
    visit_status: z.object({ id: z.number(), name: z.string() }).nullable().optional(),
    visitor: z.object({ id: z.number(), name: z.string() }).nullable().optional(),
    visitor_person: visitorPersonSchema.nullable().optional(),
    department: z.object({ id: z.number(), name: z.string() }).nullable().optional(),
    agent: z.object({ id: z.number(), name: z.string() }).nullable().optional(),
    visit_companions: z.array(z.object({
        id: z.number(),
        visitor_person_id: z.number(),
        badge_number: z.string().nullable().optional(),
        visitor_person: z.object({ id: z.number(), name: z.string(), document_number: z.string() }).nullable().optional(),
    })).nullable().optional(),
})

export type CreateVisitFormData = z.infer<typeof createVisitSchema>
export type CheckInFormData = z.infer<typeof checkInSchema>
export type CheckOutFormData = z.infer<typeof checkOutSchema>
export type VisitResponse = z.infer<typeof visitResponseSchema>
