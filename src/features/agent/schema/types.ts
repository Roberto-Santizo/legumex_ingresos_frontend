import z from "zod";
import { paginationSchema } from "@/shared/schemas/paginateSchemas";

export const createAgentSchema = z.object({
    name: z.string(),
})

export const responseAgentSchema = z.object({
    id: z.number(),
    name: z.string(),
})

export const getAgentByIdSchema = z.object({
    id: z.number(),
    name: z.string(),
})

export const getAgentSchema = paginationSchema(responseAgentSchema);

export type CreateAgentFormData = z.infer<typeof createAgentSchema>;
export type GetAgentResponse = z.infer<typeof getAgentSchema>;