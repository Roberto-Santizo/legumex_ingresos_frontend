import { z } from "zod"

export const dashboardSummarySchema = z.object({
    date:                   z.string(),
    total_visits_today:     z.number(),
    total_check_ins_today:  z.number(),
    currently_in_plant:     z.number(),
    total_companions_today: z.number(),
    pending_today:          z.number(),
    completed_today:        z.number(),
    cancelled_today:        z.number(),
})

export const inPlantPersonSchema = z.object({
    id:              z.number().optional().nullable(),
    name:            z.string().optional().nullable(),
    document_number: z.string().optional().nullable(),
})

export const inPlantCompanionSchema = z.object({
    id:              z.number().optional().nullable(),
    name:            z.string().optional().nullable(),
    document_number: z.string().optional().nullable(),
    badge_number:    z.string().optional().nullable(),
})

export const inPlantVisitSchema = z.object({
    visit_id:     z.number(),
    date:         z.string(),
    entry_time:   z.string().optional().nullable(),
    exit_time:    z.string().optional().nullable(),
    badge_number: z.string().optional().nullable(),
    status:       z.string().optional().nullable(),
    company:      z.string().optional().nullable(),
    department:   z.string().optional().nullable(),
    agent:        z.string().optional().nullable(),
    main_visitor: inPlantPersonSchema,
    companions:   z.array(inPlantCompanionSchema),
    total_people: z.number(),
})

export const inPlantAtResponseSchema = z.object({
    date:          z.string(),
    from:          z.string(),
    to:            z.string(),
    total_visits:  z.number(),
    total_people:  z.number(),
    visits:        z.array(inPlantVisitSchema),
})

export const companyVisitSummarySchema = z.object({
    company_id:    z.number(),
    company_name:  z.string(),
    total_visits:  z.number(),
    total_people:  z.number(),
    last_visit:    z.string(),
})

export const visitsByCompanyResponseSchema = z.object({
    from:             z.string(),
    to:               z.string(),
    total_companies:  z.number(),
    total_visits:     z.number(),
    companies:        z.array(companyVisitSummarySchema),
})

export type DashboardSummary        = z.infer<typeof dashboardSummarySchema>
export type InPlantAtResponse       = z.infer<typeof inPlantAtResponseSchema>
export type InPlantVisit            = z.infer<typeof inPlantVisitSchema>
export type VisitsByCompanyResponse = z.infer<typeof visitsByCompanyResponseSchema>
export type CompanyVisitSummary     = z.infer<typeof companyVisitSummarySchema>