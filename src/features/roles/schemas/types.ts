import { paginationSchema } from "@/shared/schemas/paginateSchemas";
import { z } from "zod";

//rol
export const createRolSchema = z.object({
  name: z.string(),
});
export const rolResponseApiSchema = z.object({
    id: z.number(),
    name: z.string(),
});

export const updateRolSchema = z.object({
    id: z.number(),
    name: z.string(),
})

export const rolSelectSchema = z.object({
    id: z.number(),
    name: z.string(),
})

export const roleResponseByIdSchema = z.object({
    id: z.number(),
    name: z.string(),
})


export const getRoleSchema = paginationSchema(rolResponseApiSchema);
export type RoleApiResponse = z.infer<typeof getRoleSchema>;
export type Role = z.infer<typeof rolSelectSchema>;
export type CreateRolFormData = z.infer<typeof createRolSchema>;
export type UpdateRolFormData = z.infer<typeof updateRolSchema>;