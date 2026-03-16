import { z } from "zod";
import { paginationSchema } from "@/shared/schemas/paginateSchemas";


//rol 
export const rolSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const createUserSchema = z.object({
  name: z.string(),
  username: z.string(),
  password: z.string(),
  role_id: z.number(),
  department_id: z.number(),
});

export const responseUserSchema = z.object({
    id: z.number(),
    name: z.string(),
    username: z.string(),
    password: z.string(),
    role_id: z.number(),
    role:z.object({
      name: z.string()
    }),
    
    department_id: z.number(),
    department: z.object({
      name: z.string()
    })
})

export const getUserByIdSchema = z.object({
    id: z.number(),
    name: z.string(),
    username: z.string(),
    password: z.string(),
    role_id: z.number(),
    department_id: z.number(),
})

export const updateUserPasswordSchema = z.object({
    id: z.number(),
    name: z.string(),
    username: z.string(),
    password: z.string(),
    role_id: z.number(),
    department_id: z.number(),
})

export const getUserSchema = paginationSchema(responseUserSchema);
export type GetUsersResponse = z.infer<typeof getUserSchema>;
export type CreateUserFormData = z.infer<typeof createUserSchema>;